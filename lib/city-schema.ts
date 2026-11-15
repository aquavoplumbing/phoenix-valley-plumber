import { z } from "zod";

export const CITY_CLAIM_FLAGS = [
  "sameDayService",
  "freeEstimates",
  "upfrontPricing",
  "warranty",
  "yearsInBusiness",
  "bondedInsured",
  "is24x7",
  "financing",
] as const;

export type CityClaimFlag = (typeof CITY_CLAIM_FLAGS)[number];

const imageSchema = z.object({
  src: z.string().min(1),
  alt: z.string().min(1),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

export const cityContentSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  state: z.literal("AZ"),
  tier: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  status: z.enum(["draft", "published"]),
  lastVerified: z.string().min(1),
  seo: z.object({
    primaryKeyword: z.string().min(1),
    secondaryKeywords: z.array(z.string().min(1)).min(2).max(10),
    title: z.string().min(1).max(65), // soft max in schema, exact 60 in lint
    metaDescription: z.string().min(1).max(165), // soft max in schema, exact 155 in lint
    h1: z.string().min(1),
  }),
  intro: z.object({
    answerFirst: z.string().min(1),
  }),
  coverage: z.object({
    servedFrom: z.string().optional(),
    zips: z.array(z.string().regex(/^\d{5}$/)).min(3),
    neighborhoods: z.array(z.string().min(1)).min(5),
    boundariesNote: z.string().optional(),
    sourceUrl: z.string().url(),
    retrievedOn: z.string().min(1),
  }),
  water: z
    .object({
      utility: z.string().min(1),
      sourceUrl: z.string().url(),
      reportYear: z.number().int().nullable(),
      zones: z
        .array(
          z.object({
            label: z.string().min(1),
            gpgMin: z.number().nonnegative(),
            gpgMax: z.number().nonnegative(),
            sourceNote: z.string().optional(),
          })
        )
        .min(1),
      note: z.string().optional(),
    })
    .optional(),
  housing: z
    .object({
      summary: z.string().min(1),
      eras: z
        .array(
          z.object({
            label: z.string().min(1),
            builtRange: z.string().min(1),
            whatWeSee: z.string().min(1),
            sourceUrl: z.string().url(),
          })
        )
        .min(2)
        .max(6),
      medianYearBuilt: z
        .object({
          value: z.number().int().positive(),
          source: z.string().min(1),
          asOf: z.string().min(1),
        })
        .optional(),
    })
    .optional(),
  localServices: z
    .array(
      z.object({
        serviceSlug: z.string().min(1),
        cityAngle: z.string().min(1),
      })
    )
    .min(4),
  permits: z
    .object({
      officeName: z.string().min(1),
      url: z.string().url(),
      verifiedNote: z
        .object({
          text: z.string().min(1),
          sourceUrl: z.string().url(),
        })
        .optional(),
    })
    .optional(),
  utilities: z
    .object({
      water: z.object({ name: z.string().min(1), url: z.string().url() }).optional(),
      gas: z
        .object({
          name: z.string().min(1),
          url: z.string().url(),
          leakLine: z
            .object({
              number: z.string().min(1),
              sourceUrl: z.string().url(),
            })
            .optional(),
        })
        .optional(),
      electric: z.object({ name: z.string().min(1), url: z.string().url() }).optional(),
    })
    .optional(),
  jobs: z
    .array(
      z.object({
        title: z.string().min(1),
        neighborhood: z.string().min(1),
        month: z.string().min(1),
        serviceSlug: z.string().min(1),
        summary: z.string().min(1),
        photo: imageSchema.optional(),
      })
    )
    .optional(),
  faqs: z
    .array(
      z.object({
        q: z.string().min(1),
        a: z.string().min(1),
      })
    )
    .min(3),
  nearby: z.array(z.string().min(1)).min(2),
  claimsUsed: z.array(z.enum(CITY_CLAIM_FLAGS)),
  updatedAt: z.string().min(1),
});

export type CityContent = z.infer<typeof cityContentSchema>;
