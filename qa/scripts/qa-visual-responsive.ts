import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const VIEWPORTS = [
  { name: "360px", width: 360, height: 740 },
  { name: "390px-mobile", width: 390, height: 844 },
  { name: "768px-tablet", width: 768, height: 1024 },
  { name: "1024px-laptop", width: 1024, height: 768 },
  { name: "1280px-desktop", width: 1280, height: 800 },
  { name: "1536px-wide", width: 1536, height: 960 },
];

const PAGES_TO_SCREEN = [
  { path: "/", slug: "home" },
  { path: "/emergency-plumber/", slug: "emergency" },
  { path: "/locations/scottsdale-az/", slug: "city-scottsdale" },
  { path: "/cost-guides/water-heater-replacement-cost/", slug: "cost-guide" },
  { path: "/contact/", slug: "contact" },
  { path: "/this-page-does-not-exist/", slug: "404" },
];

async function runVisualResponsiveQA() {
  console.log("[QA-Visual] Capturing responsive screenshots and testing for horizontal overflow...");

  const screensDir = path.join(process.cwd(), "qa", "evidence", "screens");
  if (!fs.existsSync(screensDir)) {
    fs.mkdirSync(screensDir, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const overflowIssues: { url: string; viewport: string; scrollWidth: number; clientWidth: number }[] = [];
  const screenshotsCaptured: string[] = [];

  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();

    for (const target of PAGES_TO_SCREEN) {
      try {
        await page.goto(`http://localhost:4010${target.path}`, { waitUntil: "networkidle" });

        // Check for horizontal overflow
        const overflow = await page.evaluate(() => {
          const docEl = document.documentElement;
          const body = document.body;
          const scrollWidth = Math.max(docEl.scrollWidth, body.scrollWidth);
          const clientWidth = docEl.clientWidth;
          return {
            hasOverflow: scrollWidth > clientWidth + 2, // Allow 2px subpixel rounding tolerance
            scrollWidth,
            clientWidth,
          };
        });

        if (overflow.hasOverflow) {
          overflowIssues.push({
            url: target.path,
            viewport: vp.name,
            scrollWidth: overflow.scrollWidth,
            clientWidth: overflow.clientWidth,
          });
        }

        // Capture above-the-fold hero screenshot
        const fileName = `${target.slug}-${vp.name}.png`;
        const filePath = path.join(screensDir, fileName);
        await page.screenshot({ path: filePath, fullPage: false });
        screenshotsCaptured.push(fileName);
      } catch (err: any) {
        console.error(`Failed visual check for ${target.path} on ${vp.name}:`, err.message);
      }
    }

    await context.close();
  }

  await browser.close();

  const outPath = path.join(process.cwd(), "qa", "evidence", "visual-responsive-results.json");
  fs.writeFileSync(
    outPath,
    JSON.stringify({ overflowIssues, screenshotsCaptured, totalScreens: screenshotsCaptured.length }, null, 2),
    "utf8"
  );

  console.log(`[QA-Visual] Captured ${screenshotsCaptured.length} screenshots to qa/evidence/screens/.`);
  console.log(`- Horizontal overflow issues found: ${overflowIssues.length}`);
  if (overflowIssues.length > 0) {
    for (const issue of overflowIssues) {
      console.log(`  [OVERFLOW] ${issue.url} on ${issue.viewport}: scrollWidth=${issue.scrollWidth} vs clientWidth=${issue.clientWidth}`);
    }
  }
}

runVisualResponsiveQA();
