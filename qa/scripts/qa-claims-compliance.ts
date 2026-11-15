import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { loadRawSiteConfig } from "../../lib/config";

interface Finding {
  url: string;
  category: string;
  matchedText: string;
  context: string;
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

async function runClaimsQA() {
  const site = loadRawSiteConfig();
  console.log("[QA-Claims] Scanning site for claims compliance & truth verification...");

  const crawlPath = path.join(process.cwd(), "qa", "evidence", "crawl-results.json");
  const crawlData = JSON.parse(fs.readFileSync(crawlPath, "utf8"));
  const urls: string[] = Object.keys(crawlData);

  const findings: Finding[] = [];

  // Patterns that must NOT appear because site.json has them false/null
  const bannedChecks: { name: string; regex: RegExp; allowedFlag: boolean }[] = [
    { name: "24/7 Claim", regex: /\b(24\/7|twenty-four\s+seven|24\s+hours\s+a\s+day)\b/i, allowedFlag: site.hours.is24x7 },
    { name: "Same-Day Claim", regex: /\bsame[- ]day\b/i, allowedFlag: site.claims.sameDayService },
    { name: "Free Estimates Claim", regex: /\bfree\s+estimates?\b/i, allowedFlag: site.claims.freeEstimates },
    { name: "Upfront Pricing Claim", regex: /\bupfront\s+pricing\b/i, allowedFlag: site.claims.upfrontPricing },
    { name: "Financing Claim", regex: /\bfinancing\s+available\b|\bapply\s+for\s+financing\b/i, allowedFlag: site.claims.financing },
    { name: "Superlatives", regex: /\b(best\s+plumber|#1\s+plumber|cheapest\s+plumber|top-rated\s+plumber)\b/i, allowedFlag: false },
    { name: "Fabricated Experience", regex: /\b(family-owned|decades\s+of\s+experience|serving\s+the\s+valley\s+since\s+19\d\d)\b/i, allowedFlag: !!site.claims.yearsInBusiness },
    { name: "Star Glyphs", regex: /[★⭐⭐️]/, allowedFlag: false },
  ];

  for (const u of urls) {
    // Only check HTML pages (exclude feed.xml, sitemap.xml, robots.txt, 404s)
    if (u.endsWith(".xml") || u.endsWith(".txt") || u.includes("does-not-exist") || crawlData[u].status !== 200) {
      continue;
    }

    const html = await fetchPage(u);

    // Strip script and style tags to check visible content
    const visibleContent = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ");

    for (const check of bannedChecks) {
      if (!check.allowedFlag) {
        const match = visibleContent.match(check.regex);
        if (match) {
          const matchIndex = match.index || 0;
          const snippet = visibleContent.substring(Math.max(0, matchIndex - 40), Math.min(visibleContent.length, matchIndex + 60)).replace(/\s+/g, " ");
          findings.push({
            url: u,
            category: check.name,
            matchedText: match[0],
            context: snippet,
          });
        }
      }
    }

    // Check for fabricated aggregateRating or Review schema in JSON-LD
    if (html.includes('"aggregateRating"') || html.includes('"Review"') || html.includes('"reviewRating"')) {
      // If site.rating.value is null, schema must NOT include aggregateRating
      if (!site.rating.value) {
        findings.push({
          url: u,
          category: "Unearned AggregateRating Schema",
          matchedText: "aggregateRating / Review in JSON-LD",
          context: "Found review/rating schema while site.rating.value is null",
        });
      }
    }
  }

  // Check Homepage ROC Number outside footer
  const homeHtml = await fetchPage("/");
  const footerIndex = homeHtml.toLowerCase().indexOf("<footer");
  const homeBodyBeforeFooter = footerIndex > -1 ? homeHtml.substring(0, footerIndex) : homeHtml;
  const rocFoundAboveFooter = homeBodyBeforeFooter.includes(site.licensee.rocNumber);

  // Check Partner Operating Model Disclosure
  const aboutHtml = await fetchPage("/about/");
  const partnerDisclosed = aboutHtml.includes(site.marketingOperatorName) || aboutHtml.includes("partner") || aboutHtml.includes("dispatch");

  const results = {
    totalChecked: urls.length,
    violationsFound: findings.length,
    findings,
    rocAboveFooterOnHomepage: rocFoundAboveFooter,
    partnerDisclosureOnAbout: partnerDisclosed,
  };

  const outPath = path.join(process.cwd(), "qa", "evidence", "claims-compliance-results.json");
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2), "utf8");

  console.log(`[QA-Claims] Scanned ${urls.length} pages.`);
  console.log(`- Claims Violations: ${findings.length}`);
  if (findings.length > 0) {
    for (const f of findings.slice(0, 5)) {
      console.log(`  [VIOLATION] ${f.url} - ${f.category}: "${f.matchedText}" in "...${f.context}..."`);
    }
  }
  console.log(`- ROC #${site.licensee.rocNumber} above footer on homepage: ${rocFoundAboveFooter}`);
  console.log(`- Partner operating model disclosed on /about/: ${partnerDisclosed}`);
}

runClaimsQA();
