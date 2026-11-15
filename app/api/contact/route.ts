import { NextRequest, NextResponse } from "next/server";
import { contactFormSchema, normalizeUsPhone, type ContactFormData } from "@/lib/contact-schema";
import { getSiteConfigResult } from "@/lib/config";

// In-memory IP rate limiter: 5 submissions per hour per IP
interface RateLimitRecord {
  timestamps: number[];
}
const rateLimitMap = new Map<string, RateLimitRecord>();
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS_PER_WINDOW = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip) ?? { timestamps: [] };
  // Prune timestamps older than 1 hour
  record.timestamps = record.timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (record.timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }
  record.timestamps.push(now);
  rateLimitMap.set(ip, record);
  return false;
}

export async function POST(req: NextRequest) {
  // Determine client IP
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded ? (forwarded.split(",")[0]?.trim() || "127.0.0.1") : "127.0.0.1";

  const isFormPost = req.headers.get("content-type")?.includes("application/x-www-form-urlencoded") ||
                     req.headers.get("content-type")?.includes("multipart/form-data");

  // Check Rate Limit
  if (isRateLimited(ip)) {
    if (isFormPost) {
      return NextResponse.redirect(new URL("/contact/?error=rate_limited", req.url), 303);
    }
    return NextResponse.json(
      {
        success: false,
        message: "Too many requests. Please call us directly for immediate assistance.",
      },
      { status: 429 }
    );
  }

  // Parse payload (JSON or FormData)
  let rawData: Record<string, unknown> = {};
  if (isFormPost) {
    const formData = await req.formData();
    for (const [key, value] of formData.entries()) {
      if (key === "isEmergency" || key === "consent") {
        rawData[key] = value === "true" || value === "on" || value === "1";
      } else if (key === "timestamp") {
        rawData[key] = Number(value) || 0;
      } else {
        rawData[key] = typeof value === "string" ? value.trim() : value;
      }
    }
  } else {
    try {
      rawData = await req.json();
    } catch {
      return NextResponse.json({ success: false, message: "Invalid JSON format" }, { status: 400 });
    }
  }

  // Anti-Spam Check 1: Honeypot trap
  const honeypot = String(rawData.hp_company ?? "").trim();
  if (honeypot) {
    // Silently accept without processing
    if (isFormPost) {
      return NextResponse.redirect(new URL("/contact/thank-you/?success=1", req.url), 303);
    }
    return NextResponse.json({ success: true, message: "Message received" }, { status: 200 });
  }

  // Anti-Spam Check 2: Time trap (reject submissions under 3000ms)
  const timestamp = Number(rawData.timestamp) || 0;
  const now = Date.now();
  if (timestamp > 0 && now - timestamp < 3000) {
    if (isFormPost) {
      return NextResponse.redirect(new URL("/contact/?error=speed_trap", req.url), 303);
    }
    return NextResponse.json(
      { success: false, message: "Submission completed too fast. Please verify and try again." },
      { status: 400 }
    );
  }

  // Anti-Spam Check 3: Optional Cloudflare Turnstile verification
  const turnstileSecret = process.env.TURNSTILE_SECRET;
  const turnstileToken = rawData["cf-turnstile-response"] as string | undefined;
  if (turnstileSecret && turnstileToken) {
    try {
      const turnstileRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${encodeURIComponent(turnstileSecret)}&response=${encodeURIComponent(turnstileToken)}&remoteip=${encodeURIComponent(ip)}`,
      });
      const turnstileData = await turnstileRes.json();
      if (!turnstileData.success) {
        if (isFormPost) {
          return NextResponse.redirect(new URL("/contact/?error=turnstile_failed", req.url), 303);
        }
        return NextResponse.json({ success: false, message: "Verification failed. Please try again." }, { status: 400 });
      }
    } catch {
      // Continue if Turnstile check fails due to network
    }
  }

  // Schema Validation
  const parseResult = contactFormSchema.safeParse(rawData);
  if (!parseResult.success) {
    const formattedErrors: Record<string, string> = {};
    for (const issue of parseResult.error.issues) {
      const field = issue.path[0] as string;
      if (!formattedErrors[field]) {
        formattedErrors[field] = issue.message;
      }
    }

    if (isFormPost) {
      return NextResponse.redirect(new URL("/contact/?error=validation_failed", req.url), 303);
    }
    return NextResponse.json(
      {
        success: false,
        message: "Please correct the errors in the form.",
        errors: formattedErrors,
      },
      { status: 400 }
    );
  }

  const validData: ContactFormData = parseResult.data;
  const normalizedPhone = normalizeUsPhone(validData.phone) || validData.phone;
  const { config: site } = getSiteConfigResult();

  // Construct Sanitized Lead Dispatch Payload
  const leadPayload = {
    brand: site.brand,
    submittedAt: new Date().toISOString(),
    name: validData.name,
    phone: normalizedPhone,
    email: validData.email || null,
    service: validData.service,
    cityOrZip: validData.cityOrZip,
    message: validData.message || null,
    isEmergency: validData.isEmergency,
    consentRecorded: {
      granted: true,
      timestamp: new Date().toISOString(),
      textVersion: validData.consentText || "Standard consent disclosure",
    },
    clientIp: ip.startsWith("127.") ? "local" : ip.replace(/\.\d+$/, ".xxx"), // Mask last octet for privacy
  };

  // Dispatch to Webhook (if configured)
  const webhookUrl = process.env.LEAD_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadPayload),
      });
    } catch (err) {
      // Log generic notification without leaking PII
      console.error("[contact-api] Lead webhook delivery failed:", err instanceof Error ? err.message : "Unknown error");
    }
  }

  // Dispatch via Resend Email (if configured)
  const resendApiKey = process.env.RESEND_API_KEY;
  const destinationEmail = site.contactEmail || process.env.CONTACT_DESTINATION_EMAIL;
  if (resendApiKey && destinationEmail) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `Plumbing Leads <dispatch@${site.domain}>`,
          to: [destinationEmail],
          subject: `${validData.isEmergency ? "🚨 URGENT: " : ""}New Lead: ${validData.service} (${validData.cityOrZip})`,
          text: `Name: ${validData.name}\nPhone: ${normalizedPhone}\nEmail: ${validData.email || "N/A"}\nService: ${validData.service}\nLocation: ${validData.cityOrZip}\nEmergency: ${validData.isEmergency ? "YES" : "No"}\n\nMessage:\n${validData.message || "None"}\n\nConsent: ${leadPayload.consentRecorded.textVersion}\nTimestamp: ${leadPayload.submittedAt}`,
        }),
      });
    } catch (err) {
      console.error("[contact-api] Email delivery failed:", err instanceof Error ? err.message : "Unknown error");
    }
  }

  // Return success
  if (isFormPost) {
    return NextResponse.redirect(new URL("/contact/thank-you/?success=1", req.url), 303);
  }

  return NextResponse.json({
    success: true,
    message: "Thank you. Your message has been received.",
  });
}
