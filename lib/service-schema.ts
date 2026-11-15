import { z } from "zod";

export const ICON_NAMES = [
  "siren",
  "flame",
  "flame-off",
  "heater",
  "bolt",
  "drain",
  "jet",
  "pipe",
  "camera",
  "droplet",
  "wrench",
  "toilet",
  "filter",
  "shield",
  "shield-check",
  "gauge",
  "volume",
  "leak",
  "root",
  "faucet",
  "clock",
  "tool",
  "thermometer",
  "house",
  "gas-meter",
] as const;

export type IconName = (typeof ICON_NAMES)[number];

export const CLAIM_FLAGS = [
  "sameDayService",
  "freeEstimates",
  "upfrontPricing",
  "warranty",
  "yearsInBusiness",
  "seniorMilitaryDiscount",
  "financing",
  "bondedInsured",
  "is24x7",
] as const;

export type ClaimFlag = (typeof CLAIM_FLAGS)[number];

const imageSchema = z.object({
  src: z.string().min(1),
  alt: z.string().min(1),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

const emergencySchema = z.object({
  heading: z.string().min(1),
  steps: z
    .array(
      z.object({
        title: z.string().min(1),
        text: z.string().min(1),
      })
    )
    .min(3)
    .max(4),
  gasWarning: z.boolean().optional(),
});

const symptomSchema = z.object({
  title: z.string().min(1),
  text: z.string().min(1),
  icon: z.enum(ICON_NAMES),
});

const methodSchema = z.object({
  title: z.string().min(1),
  whenItFits: z.string().min(1),
  text: z.string().min(1),
});

const comparisonSchema = z.object({
  title: z.string().min(1),
  caption: z.string().min(1),
  columns: z.array(z.string().min(1)).min(2).max(4),
  rows: z
    .array(
      z.object({
        label: z.string().min(1),
        cells: z.array(z.string().min(1)).min(2).max(4),
      })
    )
    .min(2),
});

const diySchema = z.object({
  canTry: z.array(z.string().min(1)).min(2),
  callWhen: z.array(z.string().min(1)).min(2),
});

const processStepSchema = z.object({
  title: z.string().min(1),
  text: z.string().min(1),
});

const phoenixFactSchema = z.object({
  text: z.string().min(1),
  sourceUrl: z
    .string()
    .url()
    .refine((u) => u.startsWith("https://"), {
      message: "sourceUrl must start with https://",
    }),
});

const phoenixAngleSchema = z.object({
  heading: z.string().min(1),
  paragraphs: z.array(z.string().min(1)).min(1),
  facts: z.array(phoenixFactSchema).optional(),
});

const costFactorsSchema = z.object({
  intro: z.string().min(1),
  factors: z
    .array(
      z.object({
        title: z.string().min(1),
        text: z.string().min(1),
      })
    )
    .min(4)
    .max(6),
  priceRange: z
    .object({
      low: z.number().nonnegative(),
      high: z.number().positive(),
      unit: z.string().min(1),
      sourceNote: z.string().min(1),
    })
    .optional(),
});

const faqSchema = z.object({
  q: z.string().min(1),
  a: z.string().min(1),
});

const howToChooseRowSchema = z.object({
  symptom: z.string().min(1),
  targetSlug: z.string().min(1),
  label: z.string().min(1),
  note: z.string().min(1),
});

const inBodyLinkSchema = z.object({
  slug: z.string().min(1),
  anchorText: z.string().min(1),
  sentence: z.string().min(1),
});

export const serviceContentSchema = z
  .object({
    slug: z.string().min(1),
    type: z.enum(["service", "hub"]),
    status: z.enum(["draft", "published"]),
    urgency: z.enum(["high", "medium", "low"]),
    updatedAt: z.string().optional(),
    seo: z.object({
      primaryKeyword: z.string().min(1),
      secondaryKeywords: z.array(z.string().min(1)).min(3).max(8),
      title: z.string().min(1),
      metaDescription: z.string().min(1),
      h1: z.string().min(1),
    }),
    intro: z.object({
      answerFirst: z.string().min(1),
      support: z.string().optional(),
    }),
    emergency: emergencySchema.optional(),
    symptoms: z.array(symptomSchema).min(6).max(8).optional(),
    methods: z.array(methodSchema).min(3).max(6).optional(),
    comparison: comparisonSchema.optional(),
    diy: diySchema.optional(),
    process: z.array(processStepSchema).min(3).max(4).optional(),
    howToChoose: z.array(howToChooseRowSchema).min(4).max(6).optional(),
    phoenixAngle: phoenixAngleSchema,
    costFactors: costFactorsSchema.optional(),
    faqs: z.array(faqSchema).min(6).max(10),
    related: z.object({
      hub: z.string().optional(),
      children: z.array(z.string()).optional(),
      siblings: z.array(z.string()).max(6),
      costGuide: z.string().optional(),
      guides: z.array(z.string()).optional(),
      inBodyLinks: z.array(inBodyLinkSchema).optional(),
    }),
    claimsUsed: z.array(z.enum(CLAIM_FLAGS)),
    reviewTag: z.string().optional(),
    images: z
      .object({
        hero: imageSchema.optional(),
        inline: z.array(imageSchema).optional(),
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.urgency === "high" && !data.emergency) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["emergency"],
        message: 'emergency block is required when urgency is "high"',
      });
    }

    const isGasPage =
      data.slug.includes("gas-line") ||
      data.slug.includes("gas-water-heater") ||
      data.seo.primaryKeyword.toLowerCase().includes("gas line");
    if (isGasPage && !data.emergency?.gasWarning) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["emergency", "gasWarning"],
        message: "gasWarning must be true on gas-line or gas-water-heater pages",
      });
    }

    if (data.type === "service") {
      if (!data.symptoms) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["symptoms"],
          message: "symptoms (6-8) is required for service pages",
        });
      }
      if (!data.methods) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["methods"],
          message: "methods (3-6) is required for service pages",
        });
      }
      if (!data.process) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["process"],
          message: "process (3-4) is required for service pages",
        });
      }
      if (!data.costFactors) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["costFactors"],
          message: "costFactors is required for service pages",
        });
      }
      if (data.related.siblings.length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["related", "siblings"],
          message: "related.siblings must contain 3-6 slugs for service pages",
        });
      }
    }

    if (data.type === "hub") {
      if (!data.related.children || data.related.children.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["related", "children"],
          message: "related.children is required for hub pages",
        });
      }
    }
  });

export type ServiceContent = z.infer<typeof serviceContentSchema>;
export type ServiceImage = z.infer<typeof imageSchema>;

