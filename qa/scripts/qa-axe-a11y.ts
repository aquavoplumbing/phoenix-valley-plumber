import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

interface A11yViolation {
  id: string;
  impact: string | null | undefined;
  description: string;
  helpUrl: string;
  nodes: number;
}

interface PageA11yReport {
  url: string;
  viewport: string;
  criticalCount: number;
  seriousCount: number;
  moderateCount: number;
  minorCount: number;
  violations: A11yViolation[];
}

async function runA11yQA() {
  console.log("[QA-A11y] Running axe-core accessibility checks on sample URLs...");

  const browser = await chromium.launch({ headless: true });
  const sampleUrls: string[] = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "qa", "evidence", "sample-urls.json"), "utf8")
  ).filter((u: string) => !u.includes("does-not-exist"));

  const reports: PageA11yReport[] = [];
  let totalCritical = 0;
  let totalSerious = 0;

  const viewports = [
    { name: "desktop", width: 1440, height: 900 },
    { name: "mobile", width: 390, height: 844 },
  ];

  for (const vp of viewports) {
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await context.newPage();

    for (const relUrl of sampleUrls) {
      try {
        await page.goto(`http://localhost:4010${relUrl}`, { waitUntil: "networkidle" });

        // Run axe scan
        const results = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
          .analyze();

        const critical = results.violations.filter((v) => v.impact === "critical");
        const serious = results.violations.filter((v) => v.impact === "serious");
        const moderate = results.violations.filter((v) => v.impact === "moderate");
        const minor = results.violations.filter((v) => v.impact === "minor");

        totalCritical += critical.length;
        totalSerious += serious.length;

        const simplifiedViolations: A11yViolation[] = results.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          description: v.description,
          helpUrl: v.helpUrl,
          nodes: v.nodes.length,
        }));

        reports.push({
          url: relUrl,
          viewport: vp.name,
          criticalCount: critical.length,
          seriousCount: serious.length,
          moderateCount: moderate.length,
          minorCount: minor.length,
          violations: simplifiedViolations,
        });

        if (critical.length > 0 || serious.length > 0) {
          console.log(`[A11Y ${vp.name.toUpperCase()} ISSUE] ${relUrl}: Critical=${critical.length}, Serious=${serious.length}`);
          for (const v of [...critical, ...serious]) {
            console.log(`  - [${v.impact}] ${v.id}: ${v.description} (${v.nodes.length} nodes)`);
          }
        }
      } catch (err: any) {
        console.error(`Failed to analyze ${relUrl} on ${vp.name}:`, err.message);
      }
    }

    await context.close();
  }

  // Test Skip-to-content link functionality
  const skipTestContext = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const skipPage = await skipTestContext.newPage();
  await skipPage.goto("http://localhost:4010/", { waitUntil: "domcontentloaded" });

  await skipPage.keyboard.press("Tab");
  const focusedTag = await skipPage.evaluate(() => document.activeElement?.tagName);
  const focusedHref = await skipPage.evaluate(() => document.activeElement?.getAttribute("href"));
  const skipLinkWorks = focusedHref === "#main-content";

  await skipTestContext.close();
  await browser.close();

  const outPath = path.join(process.cwd(), "qa", "evidence", "a11y-axe-results.json");
  fs.writeFileSync(
    outPath,
    JSON.stringify({ reports, totalCritical, totalSerious, skipLinkWorks }, null, 2),
    "utf8"
  );

  console.log(`[QA-A11y] Scanned ${sampleUrls.length * 2} page/viewport combinations.`);
  console.log(`- Total Critical Violations: ${totalCritical}`);
  console.log(`- Total Serious Violations: ${totalSerious}`);
  console.log(`- Skip to content link functional: ${skipLinkWorks}`);
}

runA11yQA();
