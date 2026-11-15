import { z } from "zod";

// Helper to normalize US phone to E.164 (+1XXXXXXXXXX)
export function normalizeUsPhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) {
    return `+1${digits}`;
  }
  if (digits.length === 11 && digits.startsWith("1")) {
    return `+${digits}`;
  }
  return null;
}

// Regex to detect URLs or links
const URL_REGEX = /(?:https?:\/\/|www\.)[^\s]+|[a-zA-Z0-9-]+\.(?:com|org|net|io|co|info|biz|ru|cn|xyz|online|top|site)\b/i;
// Regex to detect HTML tags
const HTML_TAG_REGEX = /<[a-z][\s\S]*>/i;

export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name must be 80 characters or fewer")
    .refine((val) => !HTML_TAG_REGEX.test(val), "HTML tags are not allowed"),
  phone: z
    .string()
    .trim()
    .min(10, "Please enter a valid 10-digit US phone number")
    .refine((val) => normalizeUsPhone(val) !== null, "Please enter a valid US phone number with area code"),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")),
  service: z
    .string()
    .trim()
    .min(1, "Please select what you need help with"),
  cityOrZip: z
    .string()
    .trim()
    .min(2, "Please enter your city or 5-digit ZIP code")
    .max(50, "City or ZIP code is too long")
    .refine((val) => !HTML_TAG_REGEX.test(val), "HTML tags are not allowed"),
  message: z
    .string()
    .trim()
    .max(600, "Message must be 600 characters or fewer")
    .refine((val) => !URL_REGEX.test(val), "Links or URLs are not allowed in messages")
    .refine((val) => !HTML_TAG_REGEX.test(val), "HTML tags are not allowed")
    .optional()
    .or(z.literal("")),
  isEmergency: z.boolean().default(false),
  consent: z.boolean().refine((val) => val === true, "You must agree to contact terms before submitting"),
  consentText: z.string().optional().default(""),
  timestamp: z.number().optional().default(0),
  hp_company: z.string().optional().default(""),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export interface ContactSubmissionResult {
  success: boolean;
  message?: string;
  errors?: Partial<Record<keyof ContactFormData, string>>;
}
