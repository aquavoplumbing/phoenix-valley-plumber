import fs from "node:fs";
import path from "node:path";
import { serviceContentSchema, type ServiceContent } from "./service-schema";
import { getServiceBySlug } from "./routes";
import { getSiteConfigResult } from "./config";

export interface ServiceDataResult {
  data: ServiceContent | null;
  raw?: unknown;
  errors: string[];
  isValid: boolean;
}

const SERVICES_DIR = path.join(process.cwd(), "data", "services");

export function getServiceFilePath(slug: string): string {
  return path.join(SERVICES_DIR, `${slug}.json`);
}

export function listServiceContentSlugs(): string[] {
  if (!fs.existsSync(SERVICES_DIR)) return [];
  return fs
    .readdirSync(SERVICES_DIR)
    .filter((file) => file.endsWith(".json"))
    .map((file) => file.replace(/\.json$/, ""));
}

export function getServiceContent(slug: string): ServiceDataResult | null {
  const filePath = getServiceFilePath(slug);
  if (!fs.existsSync(filePath)) {
    return null;
  }

  let parsedJson: unknown;
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    parsedJson = JSON.parse(raw);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      data: null,
      errors: [`Invalid JSON in data/services/${slug}.json: ${message}`],
      isValid: false,
    };
  }

  const result = serviceContentSchema.safeParse(parsedJson);
  const errors: string[] = [];

  if (!result.success) {
    for (const issue of result.error.issues) {
      errors.push(`${issue.path.join(".") || "root"}: ${issue.message}`);
    }
  } else {
    if (result.data.slug !== slug) {
      errors.push(`slug "${result.data.slug}" does not match filename "${slug}.json"`);
    }
    if (!getServiceBySlug(slug)) {
      errors.push(`slug "${slug}" does not exist in data/services.json route registry`);
    }
  }

  const status =
    typeof parsedJson === "object" &&
    parsedJson !== null &&
    "status" in parsedJson
      ? (parsedJson as { status?: unknown }).status
      : undefined;

  if (errors.length > 0 && status === "published" && process.env.NODE_ENV === "production") {
    throw new Error(
      `[Service Content Validation Failed] Published file data/services/${slug}.json has errors:\n` +
        errors.map((e) => `  - ${e}`).join("\n")
    );
  }

  if (!result.success || errors.length > 0) {
    return {
      data: result.success ? result.data : null,
      raw: parsedJson,
      errors,
      isValid: false,
    };
  }

  return {
    data: result.data,
    errors: [],
    isValid: true,
  };
}

export function getAllServiceContent(): Array<{ slug: string; result: ServiceDataResult }> {
  return listServiceContentSlugs().map((slug) => ({
    slug,
    result: getServiceContent(slug) ?? {
      data: null,
      errors: ["File not found"],
      isValid: false,
    },
  }));
}

export function getPublishedServices(): ServiceContent[] {
  const published: ServiceContent[] = [];
  const { config: site } = getSiteConfigResult();
  for (const slug of listServiceContentSlugs()) {
    if (slug === "commercial-plumbing" && !site.claims.commercial) {
      continue;
    }
    const res = getServiceContent(slug);
    if (res?.data && res.isValid && res.data.status === "published") {
      published.push(res.data);
    }
  }
  return published;
}

