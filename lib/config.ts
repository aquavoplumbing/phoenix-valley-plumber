import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import { isPlaceholderValue } from "./is-placeholder";

export { isPlaceholderValue };

const dayHoursSchema = z.tuple([z.string(), z.string()]).nullable();

export const siteConfigSchema = z.object({
  brand: z.string(),
  domain: z.string(),
  ownerName: z.string().optional().default(""),
  licensee: z.object({
    legalName: z.string(),
    rocNumber: z.string(),
    classification: z.string().optional().default("ROC Class CR-37 (Commercial & Residential Plumbing)"),
    status: z.string().optional().default("Active"),
    bonded: z.boolean(),
    insured: z.boolean(),
  }),
  phone: z.object({
    display: z.string(),
    e164: z.string(),
    spanishDisplay: z.string().optional().default(""),
    spanishE164: z.string().optional().default(""),
  }),
  hours: z.object({
    timezone: z.string(),
    is24x7: z.boolean(),
    schedule: z.object({
      mon: dayHoursSchema,
      tue: dayHoursSchema,
      wed: dayHoursSchema,
      thu: dayHoursSchema,
      fri: dayHoursSchema,
      sat: dayHoursSchema,
      sun: dayHoursSchema,
    }),
    emergencyAfterHours: z.boolean(),
  }),
  claims: z.object({
    sameDayService: z.boolean(),
    freeEstimates: z.boolean(),
    upfrontPricing: z.boolean(),
    warranty: z.string(),
    yearsInBusiness: z.number().nullable(),
    seniorMilitaryDiscount: z.boolean(),
    financing: z.boolean(),
    commercial: z.boolean().optional().default(false),
    callRecording: z.boolean().optional().default(false),
    consentBanner: z.boolean().optional().default(false),
    leadWebhook: z.boolean().optional().default(false),
    callTracking: z.boolean().optional().default(false),
    liveAnswer: z.boolean().optional().default(false),
    expectationNotice: z.boolean().optional().default(false),
    licenseCheckedOn: z.string().optional().default(""),
    proof: z.record(z.string(), z.string()).optional().default({}),
  }),
  address: z.object({
    public: z.boolean(),
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zip: z.string(),
  }),
  serviceAreas: z.array(z.string()).min(1),
  extraAreas: z.array(z.string()).optional().default([]),
  social: z.object({
    googleBusinessProfile: z.string(),
    facebook: z.string(),
    yelp: z.string(),
  }),
  rating: z.object({
    value: z.number().nullable(),
    count: z.number().nullable(),
    source: z.string(),
  }),
  analytics: z.object({
    ga4: z.string(),
  }),
  contactEmail: z.string().optional().default(""),
  responseTime: z.string().optional().default(""),
  sms: z.boolean().optional().default(false),
  operatingModel: z.enum(["direct", "partner"]).default("partner"),
  marketingOperatorName: z.string().optional().default("Valley Plumbing Dispatch Network"),
  useThankYouPage: z.boolean().optional().default(false),
  tty: z.string().optional().default(""),
  licenseClassification: z.string().optional().default("ROC Class CR-37 (Commercial & Residential Plumbing)"),
  legalEntity: z.string().optional().default("Valley Plumbing Dispatch Network"),
  lastUpdated: z.string().optional().default("2025-01-15"),
  reviews: z
    .object({
      verified: z
        .array(
          z.object({
            id: z.string().optional(),
            reviewerName: z.string(),
            city: z.string(),
            service: z.string(),
            date: z.string(),
            rating: z.number(),
            body: z.string(),
            verifiedSource: z.string().optional(),
          })
        )
        .optional()
        .default([]),
    })
    .optional()
    .default({ verified: [] }),
  gallery: z
    .object({
      items: z
        .array(
          z.object({
            id: z.string(),
            title: z.string(),
            service: z.string(),
            city: z.string(),
            beforeImage: z.string().optional(),
            afterImage: z.string().optional(),
            caption: z.string(),
            consentOn: z.string().optional(),
          })
        )
        .optional()
        .default([]),
    })
    .optional()
    .default({ items: [] }),
  financing: z
    .object({
      lenderName: z.string().optional().default(""),
      lenderUrl: z.string().optional().default(""),
      termsSummary: z.string().optional().default(""),
      eligibilityNote: z.string().optional().default(""),
      disclosureText: z.string().optional().default(""),
      applyUrl: z.string().optional().default(""),
      lastVerifiedOn: z.string().optional().default(""),
    })
    .optional(),
  team: z
    .array(
      z.object({
        name: z.string(),
        role: z.string(),
        bio: z.string(),
        rocNumber: z.string().optional(),
        photo: z.string().optional(),
        consentOn: z.string().optional(),
      })
    )
    .optional()
    .default([]),
});

export type SiteConfig = z.infer<typeof siteConfigSchema>;

export interface MissingField {
  path: string;
  reason: string;
  value?: string;
}

export interface SiteConfigResult {
  config: SiteConfig;
  missingFields: MissingField[];
  isValid: boolean;
}

export function findMissingRequiredFields(config: SiteConfig): MissingField[] {
  const missing: MissingField[] = [];

  const checkRequiredString = (fieldPath: string, value: string | undefined | null) => {
    if (isPlaceholderValue(value)) {
      missing.push({
        path: fieldPath,
        reason: value ? `Contains placeholder value (${value})` : "Value is empty",
        value: value ?? "",
      });
    }
  };

  checkRequiredString("brand", config.brand);
  checkRequiredString("domain", config.domain);
  checkRequiredString("licensee.legalName", config.licensee.legalName);
  checkRequiredString("licensee.rocNumber", config.licensee.rocNumber);
  checkRequiredString("phone.display", config.phone.display);
  checkRequiredString("phone.e164", config.phone.e164);

  if (!isPlaceholderValue(config.phone.e164) && !/^\+[1-9]\d{6,14}$/.test(config.phone.e164.trim())) {
    missing.push({
      path: "phone.e164",
      reason: `Must be valid E.164 format like +16025550199 (got "${config.phone.e164}")`,
      value: config.phone.e164,
    });
  }

  if (!isPlaceholderValue(config.licensee.rocNumber) && !/^[A-Za-z0-9-]{4,20}$/.test(config.licensee.rocNumber.trim())) {
    missing.push({
      path: "licensee.rocNumber",
      reason: `ROC number format looks invalid (got "${config.licensee.rocNumber}")`,
      value: config.licensee.rocNumber,
    });
  }

  if (config.address.public && isPlaceholderValue(config.address.street)) {
    missing.push({
      path: "address.street",
      reason: "address.public is true but address.street is missing",
      value: config.address.street,
    });
  }

  if (config.serviceAreas.length === 0) {
    missing.push({
      path: "serviceAreas",
      reason: "At least one service area city is required",
    });
  }

  return missing;
}

export function loadRawSiteConfig(): SiteConfig {
  const filePath = path.join(process.cwd(), "data", "site.json");
  const raw = fs.readFileSync(filePath, "utf8");
  const parsedJson: unknown = JSON.parse(raw);
  return siteConfigSchema.parse(parsedJson);
}

export function validateSiteConfig(options?: { strict?: boolean }): SiteConfigResult {
  const config = loadRawSiteConfig();
  const missingFields = findMissingRequiredFields(config);
  const strict = options?.strict ?? process.env.NODE_ENV === "production";

  if (strict && missingFields.length > 0) {
    const details = missingFields
      .map((field) => `  - ${field.path}: ${field.reason}`)
      .join("\n");
    throw new Error(
      `[site.json validation failed] Production build aborted because required partner fields in data/site.json are missing or still placeholders:\n${details}\n\nPopulate data/site.json with real partner data before running a production build.`
    );
  }

  return {
    config,
    missingFields,
    isValid: missingFields.length === 0,
  };
}

let cachedResult: SiteConfigResult | null = null;

export function getSiteConfigResult(): SiteConfigResult {
  if (process.env.NODE_ENV === "development") {
    // Always re-read in dev so edits to data/site.json appear immediately
    return validateSiteConfig({ strict: false });
  }
  if (!cachedResult) {
    const strict = process.env.STRICT_CONFIG === "true";
    cachedResult = validateSiteConfig({ strict });
    if (!strict && !cachedResult.isValid) {
      const details = cachedResult.missingFields
        .map((field) => `  - ${field.path}: ${field.reason}`)
        .join("\n");
      console.warn(
        `[site.json staging warning] Placeholder partner fields detected in data/site.json:\n${details}\nSet STRICT_CONFIG=true or run "npm run check" before live launch.`
      );
    }
  }
  return cachedResult;
}

export function getSiteConfig(): SiteConfig {
  return getSiteConfigResult().config;
}
