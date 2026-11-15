import fs from "node:fs";
import path from "node:path";
import http from "node:http";

interface SchemaReport {
  url: string;
  schemaTypes: string[];
  validCount: number;
  errors: string[];
}

function fetchPage(urlPath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:4010${urlPath}`, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve(data));
    }).on("error", reject);
  });
}

function validateSchema(type: string, obj: any, url: string, errors: string[]) {
  if (obj["@context"] !== "https://schema.org" && obj["@context"] !== "http://schema.org") {
    errors.push(`Invalid @context: ${obj["@context"]}`);
  }

  if (type === "BreadcrumbList") {
    if (!Array.isArray(obj.itemListElement) || obj.itemListElement.length === 0) {
      errors.push("BreadcrumbList missing itemListElement array");
    } else {
      for (const item of obj.itemListElement) {
        if (typeof item.position !== "number") errors.push(`Breadcrumb item missing numeric position`);
        if (!item.name) errors.push(`Breadcrumb item missing name`);
        if (!item.item && !item["@id"]) errors.push(`Breadcrumb item missing item URL/id`);
      }
    }
  }

  if (type === "Plumber" || type === "LocalBusiness" || type === "HomeAndConstructionBusiness") {
    if (!obj.name) errors.push(`${type} missing name`);
    if (!obj.telephone) errors.push(`${type} missing telephone`);
    if (!obj.address) errors.push(`${type} missing address`);
    if (obj.aggregateRating) {
      errors.push(`${type} contains unearned aggregateRating`);
    }
  }

  if (type === "Article" || type === "BlogPosting") {
    if (!obj.headline) errors.push(`${type} missing headline`);
    if (!obj.datePublished) errors.push(`${type} missing datePublished`);
    if (!obj.author) errors.push(`${type} missing author`);
    if (!obj.publisher) errors.push(`${type} missing publisher`);
  }

  if (type === "FAQPage") {
    if (!Array.isArray(obj.mainEntity) || obj.mainEntity.length === 0) {
      errors.push("FAQPage missing mainEntity array");
    } else {
      for (const q of obj.mainEntity) {
        if (!q.name) errors.push("FAQ question missing name");
        if (!q.acceptedAnswer || !q.acceptedAnswer.text) errors.push("FAQ question missing acceptedAnswer.text");
      }
    }
  }

  if (type === "Service") {
    if (!obj.name) errors.push("Service missing name");
    if (!obj.provider) errors.push("Service missing provider");
  }
}

async function runStructuredDataQA() {
  console.log("[QA-Schema] Validating JSON-LD across sample routes...");

  const sampleUrls: string[] = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "qa", "evidence", "sample-urls.json"), "utf8")
  ).filter((u: string) => !u.includes("does-not-exist"));

  const reports: SchemaReport[] = [];
  let totalSchemas = 0;
  let totalErrors = 0;

  for (const u of sampleUrls) {
    const html = await fetchPage(u);
    const scriptMatches = html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);

    const schemaTypes: string[] = [];
    const errors: string[] = [];
    let validCount = 0;

    for (const match of scriptMatches) {
      const jsonStr = match[1]?.trim() || "";
      try {
        const parsed = JSON.parse(jsonStr);
        totalSchemas++;
        validCount++;

        // Handle array of schemas or single schema
        const items = Array.isArray(parsed) ? parsed : [parsed];
        for (const item of items) {
          const type = item["@type"];
          if (type) {
            schemaTypes.push(type);
            validateSchema(type, item, u, errors);
          } else {
            errors.push("JSON-LD object missing @type");
          }
        }
      } catch (err: any) {
        errors.push(`JSON-LD Parse Error: ${err.message}`);
      }
    }

    if (schemaTypes.length === 0 && !u.includes("404")) {
      errors.push("No JSON-LD structured data found on page");
    }

    reports.push({
      url: u,
      schemaTypes,
      validCount,
      errors,
    });

    if (errors.length > 0) {
      totalErrors += errors.length;
      console.log(`[SCHEMA ISSUE] ${u}:`, errors.join("; "));
    }
  }

  const outPath = path.join(process.cwd(), "qa", "evidence", "structured-data-results.json");
  fs.writeFileSync(outPath, JSON.stringify({ reports, totalSchemas, totalErrors }, null, 2), "utf8");

  console.log(`[QA-Schema] Validated ${sampleUrls.length} pages, ${totalSchemas} JSON-LD schemas. Total errors: ${totalErrors}`);
}

runStructuredDataQA();
