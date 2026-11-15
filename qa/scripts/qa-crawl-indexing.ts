import fs from "node:fs";
import path from "node:path";
import http from "node:http";

interface CrawlResult {
  url: string;
  status: number;
  title: string;
  titleLength: number;
  metaDesc: string;
  metaDescLength: number;
  h1Count: number;
  canonical: string;
  robotsMeta: string;
  internalLinks: string[];
  externalLinks: string[];
  hasForm: boolean;
  errors: string[];
}

function fetchUrl(targetUrl: string): Promise<{ status: number; headers: http.IncomingHttpHeaders; body: string }> {
  return new Promise((resolve, reject) => {
    http.get(targetUrl, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        resolve({ status: res.statusCode || 0, headers: res.headers, body });
      });
    }).on("error", reject);
  });
}

function extractInfo(url: string, status: number, body: string): CrawlResult {
  const errors: string[] = [];

  // Title
  const titleMatch = body.match(/<title[^>]*>([^<]+)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : "";
  const titleLength = title.length;
  if (!title && status === 200) errors.push("Missing <title>");
  else if (titleLength > 65 && status === 200) errors.push(`Title too long (${titleLength} chars): "${title}"`);

  // Meta Description
  const metaMatch = body.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i)
    || body.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["']/i);
  const metaDesc = metaMatch ? metaMatch[1].trim() : "";
  const metaDescLength = metaDesc.length;
  if (!metaDesc && status === 200 && !url.includes("404") && !url.includes("thank-you")) {
    errors.push("Missing meta description");
  } else if (metaDescLength > 165 && status === 200) {
    errors.push(`Meta description too long (${metaDescLength} chars)`);
  }

  // H1
  const h1Matches = body.match(/<h1[^>]*>[\s\S]*?<\/h1>/gi) || [];
  const h1Count = h1Matches.length;
  if (h1Count === 0 && status === 200) errors.push("Missing H1 heading");
  if (h1Count > 1 && status === 200) errors.push(`Multiple H1 headings (${h1Count})`);

  // Canonical
  const canonicalMatch = body.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i)
    || body.match(/<link[^>]*href=["']([^"']*)["'][^>]*rel=["']canonical["']/i);
  const canonical = canonicalMatch ? canonicalMatch[1].trim() : "";
  if (!canonical && status === 200 && !url.includes("404")) {
    errors.push("Missing canonical link");
  }

  // Robots meta
  const robotsMatch = body.match(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']*)["']/i);
  const robotsMeta = robotsMatch ? robotsMatch[1].trim() : "";

  // Form elements
  const hasForm = /<form\b|<input\b|<textarea\b|<select\b/i.test(body);
  if (hasForm && !url.includes("/contact/") && status === 200) {
    errors.push("Prohibited form elements found on non-contact page");
  }

  // Extract links
  const internalLinks: string[] = [];
  const externalLinks: string[] = [];
  const linkMatches = body.matchAll(/<a[^>]*href=["']([^"']*)["']/gi);

  for (const m of linkMatches) {
    const href = m[1].trim();
    if (!href || href.startsWith("#") || href.startsWith("tel:") || href.startsWith("mailto:") || href.startsWith("javascript:")) {
      continue;
    }
    if (href.startsWith("http://") || href.startsWith("https://")) {
      if (href.includes("phoenixvalleyplumber.com") || href.includes("localhost:4010")) {
        const u = new URL(href);
        internalLinks.push(u.pathname);
      } else {
        externalLinks.push(href);
      }
    } else if (href.startsWith("/")) {
      internalLinks.push(href.split("?")[0].split("#")[0]);
    }
  }

  return {
    url,
    status,
    title,
    titleLength,
    metaDesc,
    metaDescLength,
    h1Count,
    canonical,
    robotsMeta,
    internalLinks: [...new Set(internalLinks)],
    externalLinks: [...new Set(externalLinks)],
    hasForm,
    errors,
  };
}

async function runCrawl() {
  const origin = "http://localhost:4010";
  const visited = new Map<string, CrawlResult>();
  const queue: string[] = ["/"];

  console.log("[QA-Crawl] Starting crawl from http://localhost:4010/ ...");

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (visited.has(current)) continue;

    try {
      const res = await fetchUrl(`${origin}${current}`);
      const data = extractInfo(current, res.status, res.body);
      visited.set(current, data);

      for (const link of data.internalLinks) {
        if (!visited.has(link) && !queue.includes(link)) {
          queue.push(link);
        }
      }
    } catch (err) {
      console.error(`Failed to fetch ${current}:`, err);
    }
  }

  console.log(`[QA-Crawl] Crawled ${visited.size} internal pages.`);

  // Also check gated routes specifically
  const gatedRoutes = ["/reviews/", "/our-work/", "/financing/", "/commercial-plumbing/", "/this-route-should-404/"];
  for (const r of gatedRoutes) {
    if (!visited.has(r)) {
      const res = await fetchUrl(`${origin}${r}`);
      const data = extractInfo(r, res.status, res.body);
      visited.set(r, data);
    }
  }

  // Also check robots.txt and sitemap.xml
  const robotsRes = await fetchUrl(`${origin}/robots.txt`);
  const sitemapRes = await fetchUrl(`${origin}/sitemap.xml`);

  const results = Object.fromEntries(visited);
  const outDir = path.join(process.cwd(), "qa", "evidence");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  fs.writeFileSync(path.join(outDir, "crawl-results.json"), JSON.stringify(results, null, 2), "utf8");
  fs.writeFileSync(path.join(outDir, "robots.txt"), robotsRes.body, "utf8");
  fs.writeFileSync(path.join(outDir, "sitemap.xml"), sitemapRes.body, "utf8");

  // Summary analysis
  let totalErrors = 0;
  for (const [p, d] of visited.entries()) {
    if (d.errors.length > 0) {
      console.log(`Issues on ${p}:`, d.errors.join("; "));
      totalErrors += d.errors.length;
    }
  }

  console.log(`[QA-Crawl] Complete. Total issues found: ${totalErrors}. Evidence saved to qa/evidence/crawl-results.json.`);
}

runCrawl();

