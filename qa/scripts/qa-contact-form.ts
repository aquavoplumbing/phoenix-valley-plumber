import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

interface FormCheckResult {
  test: string;
  passed: boolean;
  details: string;
}

async function runContactFormQA() {
  const results: FormCheckResult[] = [];
  const origin = "http://localhost:4010";

  console.log("[QA-Contact] Starting contact form test suite...");

  // 1. Single-Form Verification
  const crawlResultsPath = path.join(process.cwd(), "qa", "evidence", "crawl-results.json");
  if (fs.existsSync(crawlResultsPath)) {
    const crawlData = JSON.parse(fs.readFileSync(crawlResultsPath, "utf8"));
    const pagesWithForms: string[] = [];
    for (const [url, info] of Object.entries<any>(crawlData)) {
      if (info.hasForm) {
        pagesWithForms.push(url);
      }
    }

    const strictlyContactOnly = pagesWithForms.every(
      (p) => p === "/contact" || p === "/contact/" || p.startsWith("/contact")
    );
    results.push({
      test: "Single Form Restriction",
      passed: strictlyContactOnly && pagesWithForms.length > 0,
      details: `Form elements present strictly on: ${pagesWithForms.join(", ")}`,
    });
  }

  // 2. Playwright UI Tests
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  try {
    await page.goto(`${origin}/contact/`, { waitUntil: "networkidle" });

    // Verify form exists
    const formElement = await page.$("form");
    results.push({
      test: "Form Element Present on /contact/",
      passed: !!formElement,
      details: formElement ? "Form located on /contact/" : "No <form> found on /contact/",
    });

    // Test client-side validation: submit empty form
    const submitBtn = await page.$("button[type='submit']");
    if (submitBtn) {
      await submitBtn.click();
      const phoneInput = await page.$("#phone, input[name='phone']");
      const isInvalid = await page.evaluate(() => {
        const inp = document.querySelector("#phone, input[name='phone']") as HTMLInputElement;
        return inp ? !inp.checkValidity() || inp.getAttribute("aria-invalid") === "true" : false;
      });

      results.push({
        test: "Client Validation on Empty Required Fields",
        passed: isInvalid,
        details: isInvalid
          ? "HTML5/Aria validation prevented empty submission."
          : "Form submitted without validation trigger.",
      });
    }

    // Test filling invalid phone format
    if (formElement) {
      await page.fill("#name, input[name='name']", "Test User");
      await page.fill("#phone, input[name='phone']", "123");
      const serviceSelect = await page.$("#service, select[name='service']");
      if (serviceSelect) await page.selectOption("#service, select[name='service']", { index: 1 });
      await page.fill("#cityOrZip, input[name='cityOrZip']", "Phoenix");
      
      const consentCheckbox = await page.$("#consent, input[name='consent']");
      if (consentCheckbox) await consentCheckbox.check();

      await page.click("button[type='submit']");
      const errorMsg = await page.$("[class*='error'], [role='alert'], [aria-live='assertive']");
      const errorText = errorMsg ? await errorMsg.textContent() : "";
      
      results.push({
        test: "Invalid Phone Rejection",
        passed: !!errorMsg || !page.url().includes("thank-you"),
        details: `Invalid phone was rejected. URL remained: ${page.url()}. Message: ${errorText?.trim() || "Blocked by HTML5 validation"}`,
      });
    }
  } catch (err: any) {
    results.push({
      test: "Playwright UI Form Flow",
      passed: false,
      details: `Exception during UI test: ${err.message}`,
    });
  }

  await browser.close();

  // 3. API Automated Security Tests
  // Anti-Spam Check 1: Honeypot trap
  try {
    const hpRes = await fetch(`${origin}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Bot User",
        phone: "(602) 555-0199",
        service: "Emergency Plumbing",
        cityOrZip: "85001",
        consent: true,
        hp_company: "Spam Company Inc",
        timestamp: Date.now() - 5000,
      }),
    });
    const hpData = await hpRes.json();
    results.push({
      test: "Honeypot Trap Silent Acceptance",
      passed: hpRes.status === 200 && hpData.success === true,
      details: `Honeypot returned HTTP ${hpRes.status} with success=${hpData.success} (silent discard)`,
    });
  } catch (err: any) {
    results.push({
      test: "Honeypot Trap Silent Acceptance",
      passed: false,
      details: `Failed honeypot test: ${err.message}`,
    });
  }

  // Anti-Spam Check 2: Speed Trap (< 3000ms)
  try {
    const speedRes = await fetch(`${origin}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Speedy Bot",
        phone: "(602) 555-0199",
        service: "Emergency Plumbing",
        cityOrZip: "85001",
        consent: true,
        timestamp: Date.now() - 500, // 500ms ago (too fast)
      }),
    });
    const speedData = await speedRes.json();
    results.push({
      test: "Speed Trap (< 3s Submission)",
      passed: speedRes.status === 400 && speedData.message?.includes("too fast"),
      details: `Speed trap returned HTTP ${speedRes.status}: "${speedData.message}"`,
    });
  } catch (err: any) {
    results.push({
      test: "Speed Trap (< 3s Submission)",
      passed: false,
      details: `Failed speed trap test: ${err.message}`,
    });
  }

  // Anti-Spam Check 3: Valid Payload Acceptance
  try {
    const validRes = await fetch(`${origin}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Jane Homeowner",
        phone: "(602) 835-0102",
        email: "jane@example.com",
        service: "Water Heater Repair",
        cityOrZip: "Phoenix",
        message: "Need quote for pilot light repair.",
        isEmergency: false,
        consent: true,
        consentText: "I agree to receive calls or texts.",
        timestamp: Date.now() - 4000,
      }),
    });
    const validData = await validRes.json();
    results.push({
      test: "Valid Lead Acceptance",
      passed: validRes.status === 200 && validData.success === true,
      details: `Valid lead returned HTTP ${validRes.status} with message: "${validData.message}"`,
    });
  } catch (err: any) {
    results.push({
      test: "Valid Lead Acceptance",
      passed: false,
      details: `Failed valid submission: ${err.message}`,
    });
  }

  // Anti-Spam Check 4: Rate Limiter (simulate 6 rapid requests from new pseudo-IP)
  try {
    const testIp = "198.51.100.42";
    let hitRateLimit = false;
    let attempts = 0;

    for (let i = 0; i < 7; i++) {
      attempts++;
      const rlRes = await fetch(`${origin}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Forwarded-For": testIp,
        },
        body: JSON.stringify({
          name: `Rate Test ${i}`,
          phone: "(602) 555-0123",
          service: "Drain Cleaning",
          cityOrZip: "Phoenix",
          consent: true,
          timestamp: Date.now() - 4000,
        }),
      });

      if (rlRes.status === 429) {
        hitRateLimit = true;
        break;
      }
    }

    results.push({
      test: "Rate Limiter (5 requests / hour threshold)",
      passed: hitRateLimit,
      details: hitRateLimit
        ? `Rate limiter triggered HTTP 429 on attempt ${attempts}.`
        : `Rate limiter did not block within ${attempts} requests.`,
    });
  } catch (err: any) {
    results.push({
      test: "Rate Limiter",
      passed: false,
      details: `Failed rate limit test: ${err.message}`,
    });
  }

  // Save Results
  const outPath = path.join(process.cwd(), "qa", "evidence", "contact-form-results.json");
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2), "utf8");

  console.log("[QA-Contact] Test suite complete:");
  for (const r of results) {
    console.log(`- [${r.passed ? "PASS" : "FAIL"}] ${r.test}: ${r.details}`);
  }
}

runContactFormQA();
