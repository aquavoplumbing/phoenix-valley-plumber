import { z } from "zod";

export const POST_TYPES = [
  "guide",
  "how-to",
  "cost-guide",
  "local-explainer",
  "checklist",
] as const;
export type PostType = (typeof POST_TYPES)[number];

export const POST_CATEGORIES = [
  "water-heaters",
  "drains-and-sewer",
  "leaks-and-pipes",
  "toilets-and-fixtures",
  "water-treatment",
  "emergency-and-safety",
  "phoenix-homes",
  "costs",
] as const;
export type PostCategory = (typeof POST_CATEGORIES)[number];

export const CATEGORY_LABELS: Record<PostCategory, string> = {
  "water-heaters": "Water Heaters",
  "drains-and-sewer": "Drains & Sewer",
  "leaks-and-pipes": "Leaks & Pipes",
  "toilets-and-fixtures": "Toilets & Fixtures",
  "water-treatment": "Water Treatment",
  "emergency-and-safety": "Emergency & Safety",
  "phoenix-homes": "Phoenix Homes",
  costs: "Costs & Guides",
};

export const CATEGORY_DESCRIPTIONS: Record<PostCategory, string> = {
  "water-heaters":
    "Expert troubleshooting, sizing, lifespan, and replacement advice for traditional and tankless water heaters in Phoenix's harsh hard water conditions.",
  "drains-and-sewer":
    "Practical diagnostics, cleaning methods, sewer line camera inspections, and trenchless repair options for Valley homes facing heavy desert root intrusion.",
  "leaks-and-pipes":
    "Identifying slab leaks under concrete foundations, locating hidden pipe pinholes, and choosing between copper, PEX, and whole-home repiping in Phoenix.",
  "toilets-and-fixtures":
    "Straightforward guides to diagnosing running toilets, repairing faulty flappers and fill valves, replacing old fixtures, and preventing bathroom leaks.",
  "water-treatment":
    "Understanding the hardness of Phoenix tap water by municipal zone, comparing softeners and filtration systems, and tackling calcified scale buildup.",
  "emergency-and-safety":
    "Immediate actions for plumbing emergencies in the Valley, from safely shutting off main valves to gas odor protocols and flood containment.",
  "phoenix-homes":
    "Plumbing advice tailored specifically to Phoenix residential architecture, slab foundations, expansive clay soils, monsoon storms, and historic home piping.",
  costs:
    "Transparent, sourced cost breakdowns and factor explanations for water heaters, softeners, sewer lines, slab repairs, and fixture installations.",
};

export const SOURCE_TYPES = [
  "government",
  "utility",
  "manufacturer",
  "standards",
  "research",
  "trade",
] as const;
export type SourceType = (typeof SOURCE_TYPES)[number];

export const IMAGE_KINDS = ["photo", "illustration", "diagram", "screenshot"] as const;
export type ImageKind = (typeof IMAGE_KINDS)[number];

export const CLAIM_FLAGS = [
  "sameDayService",
  "freeEstimates",
  "upfrontPricing",
  "warranty",
  "yearsInBusiness",
  "bondedInsured",
  "is24x7",
  "financing",
] as const;
export type ClaimFlag = (typeof CLAIM_FLAGS)[number];

export const imageRefSchema = z.object({
  src: z.string().min(1),
  alt: z.string().min(1).max(125),
  caption: z.string().min(1),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  kind: z.enum(IMAGE_KINDS),
  credit: z.string().optional(),
  jobRef: z.string().optional(),
});
export type ImageRef = z.infer<typeof imageRefSchema>;

export const sourceSchema = z.object({
  title: z.string().min(1),
  url: z.string().url(),
  publisher: z.string().min(1),
  retrievedOn: z.string().min(1),
  type: z.enum(SOURCE_TYPES),
});
export type Source = z.infer<typeof sourceSchema>;

export const costRowSchema = z.object({
  item: z.string().min(1),
  low: z.number().nonnegative(),
  high: z.number().positive(),
  unit: z.string().min(1),
  includes: z.string().optional(),
  excludes: z.string().optional(),
});
export type CostRow = z.infer<typeof costRowSchema>;

export const costDataSchema = z.object({
  scope: z.enum(["national", "regional", "partner"]),
  rows: z.array(costRowSchema).min(1),
  sourceUrl: z.string().url().optional(),
  sourceName: z.string().optional(),
  asOf: z.string().min(1),
  disclaimer: z.string().min(1),
  factors: z
    .array(
      z.object({
        title: z.string().min(1),
        text: z.string().min(1),
      })
    )
    .min(3)
    .max(8),
});
export type CostData = z.infer<typeof costDataSchema>;

export const localFactSchema = z.object({
  text: z.string().min(1),
  sourceUrl: z.string().url(),
  asOf: z.string().min(1),
});
export type LocalFact = z.infer<typeof localFactSchema>;

export const changelogItemSchema = z.object({
  date: z.string().min(1),
  summary: z.string().min(1),
});
export type ChangelogItem = z.infer<typeof changelogItemSchema>;

export const authorSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  role: z.string().min(1),
  bio: z.string().min(20).max(600),
  credentials: z.array(z.string()).default([]),
  photo: z.string().min(1),
  sameAs: z.array(z.string().url()).default([]),
  consentOn: z.string().min(1),
});
export type Author = z.infer<typeof authorSchema>;

export const postSchema = z.object({
  slug: z.string().min(1),
  type: z.enum(POST_TYPES),
  status: z.enum(["draft", "published"]),
  seo: z.object({
    primaryKeyword: z.string().min(1),
    secondaryKeywords: z.array(z.string().min(1)).min(3).max(8),
    title: z.string().min(1).max(60),
    metaDescription: z.string().min(1).max(155),
    h1: z.string().min(1),
  }),
  category: z.enum(POST_CATEGORIES),
  tags: z.array(z.string()).default([]),
  quickAnswer: z.string().min(1),
  takeaways: z.array(z.string().min(1)).min(3).max(5),
  safetyLevel: z.enum(["none", "low", "high"]),
  authors: z.array(z.string()).default([]),
  reviewer: z
    .object({
      author: z.string().min(1),
      consentOn: z.string().min(1),
      reviewedOn: z.string().min(1),
      scope: z.string().min(1),
    })
    .optional(),
  production: z.object({
    aiAssisted: z.boolean(),
    humanReviewed: z.boolean(),
    factChecked: z.boolean(),
    note: z.string().optional(),
  }),
  datePublished: z.string().min(1),
  dateModified: z.string().optional(),
  changelog: z.array(changelogItemSchema).default([]),
  hero: imageRefSchema,
  images: z.array(imageRefSchema).default([]),
  relatedServices: z.array(z.string().min(1)).min(2).max(4),
  relatedCity: z.array(z.string().min(1)).optional(),
  relatedPosts: z.array(z.string().min(1)).min(2).max(4),
  sources: z.array(sourceSchema).min(2),
  faqs: z
    .array(
      z.object({
        q: z.string().min(1),
        a: z.string().min(1),
      })
    )
    .min(3)
    .max(6),
  costData: costDataSchema.optional(),
  localFacts: z.array(localFactSchema).optional(),
  fieldNote: z
    .object({
      quote: z.string().min(1),
      attributedTo: z.string().min(1),
      consentOn: z.string().min(1),
      context: z.string().optional(),
    })
    .optional(),
  claimsUsed: z.array(z.enum(CLAIM_FLAGS)).default([]),
  noindex: z.boolean().optional(),
});

export type Post = z.infer<typeof postSchema>;

export interface PostTocItem {
  id: string;
  title: string;
  level: 2 | 3;
}

export interface PostParsed {
  frontmatter: Post;
  content: string;
  readingTimeMinutes: number;
  wordCount: number;
  toc: PostTocItem[];
}
