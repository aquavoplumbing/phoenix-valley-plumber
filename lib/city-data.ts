import fs from "node:fs";
import path from "node:path";
import { cityContentSchema, type CityContent } from "./city-schema";
import reviewsData from "@/data/reviews.json";

export interface CityValidationResult {
  isValid: boolean;
  data?: CityContent;
  errors: string[];
  raw?: unknown;
}

export interface GateEvaluation {
  passesGate: boolean;
  reasons: string[];
  evidenceCategoriesCount: number;
  presentCategories: string[];
  missingCategories: string[];
}

export function getCityRouteSlug(slugOrCity: string | { slug: string }): string {
  const s = typeof slugOrCity === "string" ? slugOrCity : slugOrCity.slug;
  const clean = s.replace(/-az$/i, "");
  return `${clean}-az`;
}

export function getCityUrl(slugOrCity: string | { slug: string }): string {
  return `/locations/${getCityRouteSlug(slugOrCity)}/`;
}

export function evaluateCityGate(c: CityContent): GateEvaluation {
  const reasons: string[] = [];
  const present: string[] = [];
  const missing: string[] = [];

  // 1. Coverage complete and sourced
  const hasCoverage = Boolean(
    c.coverage &&
      c.coverage.zips &&
      c.coverage.zips.length >= 3 &&
      c.coverage.neighborhoods &&
      c.coverage.neighborhoods.length >= 5 &&
      c.coverage.sourceUrl &&
      c.coverage.retrievedOn
  );
  if (!hasCoverage) {
    reasons.push("Coverage incomplete or missing sourceUrl/retrievedOn");
  }

  // 2. 8 Evidence Categories:
  // a) water
  if (c.water && c.water.utility && c.water.sourceUrl && c.water.zones && c.water.zones.length > 0) {
    present.push("water");
  } else {
    missing.push("water");
  }

  // b) housing
  if (c.housing && c.housing.summary && c.housing.eras && c.housing.eras.length >= 2) {
    present.push("housing");
  } else {
    missing.push("housing");
  }

  // c) permits
  if (c.permits && c.permits.officeName && c.permits.url) {
    present.push("permits");
  } else {
    missing.push("permits");
  }

  // d) utilities
  if (c.utilities && (c.utilities.water || c.utilities.gas || c.utilities.electric)) {
    present.push("utilities");
  } else {
    missing.push("utilities");
  }

  // e) jobs
  if (c.jobs && c.jobs.length > 0) {
    present.push("jobs");
  } else {
    missing.push("jobs");
  }

  // f) matching real city-tagged reviews
  const allReviews = Array.isArray(reviewsData) ? reviewsData : [];
  const matchingReviews = allReviews.filter(
    (r: { city?: string }) => r.city && r.city.toLowerCase() === c.name.toLowerCase()
  );
  if (matchingReviews.length > 0) {
    present.push("cityTaggedReviews");
  } else {
    missing.push("cityTaggedReviews");
  }

  // g) localServices with 6 or more unique angles
  if (c.localServices && c.localServices.length >= 6) {
    present.push("localServices");
  } else {
    missing.push("localServices");
  }

  // h) partner-supplied servedFrom / response info
  if (c.coverage && c.coverage.servedFrom && c.coverage.servedFrom.trim()) {
    present.push("servedFrom");
  } else {
    missing.push("servedFrom");
  }

  // Check at least 4 of 8 categories
  if (present.length < 4) {
    reasons.push(`Has only ${present.length}/8 evidence categories (minimum 4 required)`);
  }

  // 3. At least one of water or housing is present
  if (!present.includes("water") && !present.includes("housing")) {
    reasons.push("Must have at least one of 'water' or 'housing'");
  }

  return {
    passesGate: reasons.length === 0,
    reasons,
    evidenceCategoriesCount: present.length,
    presentCategories: present,
    missingCategories: missing,
  };
}

const cityCache = new Map<string, CityValidationResult>();

export function getCityContent(slug: string): CityValidationResult {
  const cleanSlug = slug.replace(/-az$/i, "");
  if (cityCache.has(cleanSlug)) {
    return cityCache.get(cleanSlug)!;
  }

  const filePath = path.join(process.cwd(), "data", "cities", `${cleanSlug}.json`);
  if (!fs.existsSync(filePath)) {
    return {
      isValid: false,
      errors: [`File not found: data/cities/${cleanSlug}.json`],
    };
  }

  try {
    const raw = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const parsed = cityContentSchema.safeParse(raw);
    if (!parsed.success) {
      const result: CityValidationResult = {
        isValid: false,
        raw,
        errors: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`),
      };
      cityCache.set(cleanSlug, result);
      return result;
    }

    const result: CityValidationResult = {
      isValid: true,
      data: parsed.data,
      errors: [],
      raw,
    };
    cityCache.set(cleanSlug, result);
    return result;
  } catch (err) {
    return {
      isValid: false,
      errors: [err instanceof Error ? err.message : "Unknown JSON parse error"],
    };
  }
}

export function getAllCityContent(): Array<{ slug: string; result: CityValidationResult }> {
  const dir = path.join(process.cwd(), "data", "cities");
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
  return files.map((file) => {
    const slug = file.replace(/\.json$/, "");
    return {
      slug,
      result: getCityContent(slug),
    };
  });
}

export function getPublishedCities(): CityContent[] {
  const all = getAllCityContent();
  return all
    .filter((entry) => {
      if (!entry.result.isValid || !entry.result.data) return false;
      const c = entry.result.data;
      if (c.status !== "published") return false;
      const gate = evaluateCityGate(c);
      return gate.passesGate;
    })
    .map((entry) => entry.result.data!);
}
