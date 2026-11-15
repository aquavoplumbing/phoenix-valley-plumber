import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

interface PerformanceMetrics {
  url: string;
  domNodeCount: number;
  imageCount: number;
  allImagesHaveAlt: boolean;
  allImagesHaveDimensions: boolean;
  scriptCount: number;
  totalHtmlBytes: number;
}

async function runPerformanceQA() {
  console.log("[QA-Perf] Auditing DOM complexity, image optimization & resource footprints...");

  const sampleUrls: string[] = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "qa", "evidence", "sample-urls.json"), "utf8")
  ).filter((u: string) => !u.includes("does-not-exist") && !u.includes("404"));

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  const metrics: PerformanceMetrics[] = [];

  for (const u of sampleUrls) {
    try {
      const response = await page.goto(`http://localhost:4010${u}`, { waitUntil: "networkidle" });
      const html = await response?.text() || "";

      const pageStats = await page.evaluate(() => {
        const allNodes = document.querySelectorAll("*");
        const images = Array.from(document.querySelectorAll("img"));

        let hasAlt = true;
        let hasDimensions = true;

        for (const img of images) {
          if (img.getAttribute("alt") === null) hasAlt = false;
          if (!img.getAttribute("width") || !img.getAttribute("height")) {
            // Check if intrinsic dimensions or svg
            if (!img.naturalWidth && !img.width) hasDimensions = false;
          }
        }

        const scripts = document.querySelectorAll("script");

        return {
          domNodeCount: allNodes.length,
          imageCount: images.length,
          allImagesHaveAlt: hasAlt,
          allImagesHaveDimensions: hasDimensions,
          scriptCount: scripts.length,
        };
      });

      metrics.push({
        url: u,
        domNodeCount: pageStats.domNodeCount,
        imageCount: pageStats.imageCount,
        allImagesHaveAlt: pageStats.allImagesHaveAlt,
        allImagesHaveDimensions: pageStats.allImagesHaveDimensions,
        scriptCount: pageStats.scriptCount,
        totalHtmlBytes: Buffer.byteLength(html, "utf8"),
      });
    } catch (err: any) {
      console.error(`Error auditing performance for ${u}:`, err.message);
    }
  }

  await context.close();
  await browser.close();

  const outPath = path.join(process.cwd(), "qa", "evidence", "performance-cwv-results.json");
  fs.writeFileSync(outPath, JSON.stringify(metrics, null, 2), "utf8");

  console.log(`[QA-Perf] Audited ${metrics.length} representative pages.`);
  const highDom = metrics.filter((m) => m.domNodeCount > 1200);
  const missingAlt = metrics.filter((m) => !m.allImagesHaveAlt);
  console.log(`- Pages with DOM nodes > 1200: ${highDom.length}`);
  console.log(`- Pages with missing image alt attributes: ${missingAlt.length}`);
  const avgHtmlKb = Math.round(metrics.reduce((acc, m) => acc + m.totalHtmlBytes, 0) / metrics.length / 1024);
  console.log(`- Average prerendered HTML size: ${avgHtmlKb} KB`);
}

runPerformanceQA();
