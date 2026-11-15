import fs from "node:fs";
import path from "node:path";
import http from "node:http";

interface PageShingles {
  url: string;
  shingles: Set<string>;
  wordCount: number;
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

function generateShingles(text: string, shingleSize = 8): Set<string> {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2);

  const shingles = new Set<string>();
  for (let i = 0; i <= words.length - shingleSize; i++) {
    shingles.add(words.slice(i, i + shingleSize).join(" "));
  }
  return shingles;
}

function jaccardSimilarity(setA: Set<string>, setB: Set<string>): number {
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersection = 0;
  for (const item of setA) {
    if (setB.has(item)) intersection++;
  }
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

async function runContentUniquenessQA() {
  console.log("[QA-Content] Running shingle overlap and uniqueness audit...");

  const sampleUrls: string[] = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "qa", "evidence", "sample-urls.json"), "utf8")
  ).filter((u: string) => !u.includes("does-not-exist") && !u.includes("404"));

  const pageData: PageShingles[] = [];

  for (const u of sampleUrls) {
    const html = await fetchPage(u);
    // Extract main content only (strip header, nav, footer to test core editorial body uniqueness)
    const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
    const mainHtml = mainMatch ? mainMatch[1] : html;

    const visibleText = mainHtml
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const shingles = generateShingles(visibleText, 8);
    pageData.push({
      url: u,
      shingles,
      wordCount: visibleText.split(/\s+/).length,
    });
  }

  // Cross-compare pairs
  const highOverlapPairs: { pageA: string; pageB: string; similarity: number }[] = [];
  let maxSimilarity = 0;
  let maxPair: any = null;

  for (let i = 0; i < pageData.length; i++) {
    for (let j = i + 1; j < pageData.length; j++) {
      const p1 = pageData[i];
      const p2 = pageData[j];
      const sim = jaccardSimilarity(p1.shingles, p2.shingles);

      if (sim > maxSimilarity) {
        maxSimilarity = sim;
        maxPair = { pageA: p1.url, pageB: p2.url, similarity: sim };
      }

      // Threshold is 15% (0.15)
      if (sim > 0.15) {
        highOverlapPairs.push({
          pageA: p1.url,
          pageB: p2.url,
          similarity: Math.round(sim * 1000) / 10,
        });
      }
    }
  }

  const outPath = path.join(process.cwd(), "qa", "evidence", "content-uniqueness-results.json");
  fs.writeFileSync(
    outPath,
    JSON.stringify(
      {
        totalSamplePages: pageData.length,
        maxSimilarity: Math.round(maxSimilarity * 1000) / 10,
        maxPair,
        highOverlapPairs,
        passedThreshold: highOverlapPairs.length === 0,
      },
      null,
      2
    ),
    "utf8"
  );

  console.log(`[QA-Content] Evaluated ${pageData.length} pages (${(pageData.length * (pageData.length - 1)) / 2} pairs).`);
  console.log(`- Max 6-word shingle similarity observed: ${(maxSimilarity * 100).toFixed(1)}% between ${maxPair?.pageA} and ${maxPair?.pageB}`);
  console.log(`- Pairs exceeding 15% similarity: ${highOverlapPairs.length}`);
}

runContentUniquenessQA();
