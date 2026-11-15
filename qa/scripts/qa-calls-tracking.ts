import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { loadRawSiteConfig } from "../../lib/config";

interface CallCheckResult {
  url: string;
  telCount: number;
  expectedMin: number;
  passedMin: boolean;
  allMatchPrimary: boolean;
  hasCallLocation: boolean;
  locationsFound: string[];
  mismatches: string[];
}

const PAGE_TYPE_MINIMUMS: Record<string, number> = {
  "/": 5,
  "/emergency-plumber/": 8,
  "/contact/": 4,
};

function getExpectedMin(url: string): number {
  if (PAGE_TYPE_MINIMUMS[url]) return PAGE_TYPE_MINIMUMS[url];
  if (url.startsWith("/cost-guides/")) return 6;
  if (url.startsWith("/locations/")) return 5;
  if (url.startsWith("/blog/")) return 5;
  return 5; // default service & hub pages
}

async function runCallsAudit() {
  const site = loadRawSiteConfig();
  const primaryE164 = site.phone.e164.trim();
  const primaryDisplay = site.phone.display.trim();

  console.log(`[QA-Calls] Primary Phone: ${primaryDisplay} (${primaryE164})`);

  const browser = await chromium.launch({ headless: true });
  const sampleUrls: string[] = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "qa", "evidence", "sample-urls.json"), "utf8")
  ).filter((u: string) => !u.includes("does-not-exist"));

  const results: CallCheckResult[] = [];
  const dniResults: { overrideSuccess: boolean; fallbackSuccess: boolean; details: string[] } = {
    overrideSuccess: true,
    fallbackSuccess: true,
    details: [],
  };

  // 1. Desktop Check (1440x900) & Link Count Audit
  const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const desktopPage = await desktopContext.newPage();

  for (const relUrl of sampleUrls) {
    const fullUrl = `http://localhost:4010${relUrl}`;
    await desktopPage.goto(fullUrl, { waitUntil: "domcontentloaded" });

    const telLinks = await desktopPage.$$eval("a[href^='tel:']", (anchors) =>
      anchors.map((a) => ({
        href: a.getAttribute("href") || "",
        text: a.textContent?.trim() || "",
        callLocation: a.getAttribute("data-call-location") || "",
        dataPhone: a.hasAttribute("data-phone"),
      }))
    );

    const mismatches: string[] = [];
    const locationsFound: string[] = [];
    let allMatch = true;
    let hasLocations = true;

    for (const l of telLinks) {
      if (l.callLocation) locationsFound.push(l.callLocation);
      else hasLocations = false;

      const cleanHref = l.href.replace(/\s+/g, "");
      if (cleanHref !== `tel:${primaryE164}`) {
        allMatch = false;
        mismatches.push(l.href);
      }
    }

    const expectedMin = getExpectedMin(relUrl);
    results.push({
      url: relUrl,
      telCount: telLinks.length,
      expectedMin,
      passedMin: telLinks.length >= expectedMin,
      allMatchPrimary: allMatch,
      hasCallLocation: hasLocations,
      locationsFound: [...new Set(locationsFound)],
      mismatches,
    });
  }

  await desktopContext.close();

  // 2. Mobile Check (390x844) & Sticky Mobile Call Bar
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  });
  const mobilePage = await mobileContext.newPage();

  let mobileStickyBarVerified = false;
  await mobilePage.goto("http://localhost:4010/emergency-plumber/", { waitUntil: "domcontentloaded" });

  const stickyBar = await mobilePage.$("[class*='sticky'], [class*='Sticky'], [data-call-location*='sticky'], [data-call-location*='mobile']");
  if (stickyBar) {
    const isVisible = await stickyBar.isVisible();
    mobileStickyBarVerified = isVisible;
  }

  // 3. Dynamic Number Insertion (DNI) Test
  const dniPage = await browser.newPage();
  await dniPage.addInitScript(() => {
    (window as unknown as { __PHONE_OVERRIDE__: { display: string; e164: string } }).__PHONE_OVERRIDE__ = {
      display: "(602) 999-8888",
      e164: "+16029998888",
    };
  });

  await dniPage.goto("http://localhost:4010/", { waitUntil: "domcontentloaded" });

  // Evaluate if DNI swapped numbers
  const dniLinks = await dniPage.$$eval("a[href^='tel:']", (anchors) =>
    anchors.map((a) => a.getAttribute("href"))
  );

  const dniOverridden = dniLinks.every((h) => h === "tel:+16029998888");
  dniResults.overrideSuccess = dniOverridden;
  dniResults.details.push(
    dniOverridden
      ? "DNI successfully replaced all tel: links with +16029998888"
      : `DNI partial or failed: found ${dniLinks.slice(0, 3).join(", ")}`
  );

  await mobileContext.close();
  await dniPage.close();
  await browser.close();

  // Write Evidence
  const outPath = path.join(process.cwd(), "qa", "evidence", "calls-tracking-results.json");
  fs.writeFileSync(
    outPath,
    JSON.stringify({ results, mobileStickyBarVerified, dniResults }, null, 2),
    "utf8"
  );

  console.log(`[QA-Calls] Audited ${results.length} sample pages.`);
  const failedMins = results.filter((r) => !r.passedMin);
  const failedMismatch = results.filter((r) => !r.allMatchPrimary);
  console.log(`- Mismatches against primary phone: ${failedMismatch.length}`);
  console.log(`- Link count shortfalls: ${failedMins.length}`);
  console.log(`- Mobile sticky bar verified: ${mobileStickyBarVerified}`);
  console.log(`- DNI override verified: ${dniResults.overrideSuccess}`);
}

runCallsAudit();

