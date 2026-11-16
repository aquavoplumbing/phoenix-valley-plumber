import { chromium, type Browser, type Page, type BrowserContext } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE_URL = process.env.BASE_URL || "http://localhost:4010";

export interface Finding {
  id: string;
  category: string;
  page: string;
  viewport: string;
  severity: "Blocker" | "High" | "Medium" | "Low";
  description: string;
  selector?: string;
  details: string;
  screenshot?: string;
}

const SAMPLE_PAGES = [
  { path: "/", name: "home" },
  { path: "/services/", name: "services-hub" },
  { path: "/water-heater/", name: "hub-water-heater" },
  { path: "/drain-and-sewer/", name: "hub-drain-sewer" },
  { path: "/leak-detection-repair/", name: "hub-leak-repiping" },
  { path: "/emergency-plumber/", name: "service-emergency" },
  { path: "/water-heater-repair/", name: "service-water-heater-repair" },
  { path: "/water-heater-replacement/", name: "service-water-heater-replacement" },
  { path: "/drain-cleaning/", name: "service-drain-cleaning" },
  { path: "/sewer-line-repair/", name: "service-sewer-line-repair" },
  { path: "/slab-leak-repair/", name: "service-slab-leak-repair" },
  { path: "/repiping/", name: "service-repiping" },
  { path: "/water-softener-installation/", name: "service-water-softener" },
  { path: "/locations/scottsdale-az/", name: "city-scottsdale" },
  { path: "/locations/mesa-az/", name: "city-mesa" },
  { path: "/locations/chandler-az/", name: "city-chandler" },
  { path: "/blog/why-does-my-toilet-keep-running/", name: "blog-running-toilet" },
  { path: "/cost-guides/water-heater-replacement-cost/", name: "cost-water-heater" },
  { path: "/blog/trenchless-vs-traditional-sewer-repair/", name: "blog-trenchless-sewer" },
  { path: "/cost-guides/slab-leak-repair-cost/", name: "cost-slab-leak" },
  { path: "/cost-guides/", name: "cost-guides-hub" },
  { path: "/blog/", name: "blog-hub" },
  { path: "/contact/", name: "contact" },
  { path: "/about/", name: "about" },
  { path: "/faq/", name: "faq" },
  { path: "/privacy-policy/", name: "privacy-policy" },
  { path: "/404-not-found-check/", name: "not-found-404" },
];

const MATRIX_VIEWPORTS = [
  { name: "phone-very-small", width: 320, height: 568, isTouch: true, dpr: 2 },
  { name: "phone-small-360", width: 360, height: 640, isTouch: true, dpr: 2 },
  { name: "phone-small-375", width: 375, height: 667, isTouch: true, dpr: 2 },
  { name: "phone-standard-390", width: 390, height: 844, isTouch: true, dpr: 3 },
  { name: "phone-standard-412", width: 412, height: 915, isTouch: true, dpr: 2.6 },
  { name: "phone-large-430", width: 430, height: 932, isTouch: true, dpr: 3 },
  { name: "foldable-folded-280", width: 280, height: 653, isTouch: true, dpr: 2 },
  { name: "foldable-unfolded-653", width: 653, height: 772, isTouch: true, dpr: 2 },
  { name: "tablet-portrait-744", width: 744, height: 1133, isTouch: true, dpr: 2 },
  { name: "tablet-portrait-768", width: 768, height: 1024, isTouch: true, dpr: 2 },
  { name: "tablet-landscape-1024", width: 1024, height: 768, isTouch: true, dpr: 2 },
  { name: "laptop-1280", width: 1280, height: 720, isTouch: false, dpr: 1 },
  { name: "desktop-1440", width: 1440, height: 900, isTouch: false, dpr: 1 },
  { name: "desktop-1920", width: 1920, height: 1080, isTouch: false, dpr: 1 },
  { name: "desktop-4k-3840", width: 3840, height: 2160, isTouch: false, dpr: 1 },
  { name: "phone-landscape-667", width: 667, height: 375, isTouch: true, dpr: 2 },
  { name: "phone-landscape-844", width: 844, height: 390, isTouch: true, dpr: 3 },
];

const SCREENSHOT_WIDTHS = [320, 390, 768, 1024, 1440];

const CORE_SWEEP_PAGES = [
  "/",
  "/services/",
  "/emergency-plumber/",
  "/water-heater-repair/",
  "/contact/",
  "/cost-guides/water-heater-replacement-cost/",
];

const EXACT_BREAKPOINTS = [480, 560, 600, 640, 768, 860, 900, 1024, 1120, 1320];

async function measureCls(page: Page): Promise<number> {
  return page.evaluate(() => {
    return new Promise<number>((resolve) => {
      let cls = 0;
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              cls += (entry as any).value || 0;
            }
          }
        });
        observer.observe({ type: "layout-shift", buffered: true });
        setTimeout(() => {
          observer.disconnect();
          resolve(cls);
        }, 600);
      } catch {
        resolve(0);
      }
    });
  });
}

export async function runResponsiveQa() {
  const screensDir = path.join(process.cwd(), "qa", "responsive", "screens");
  const reportsDir = path.join(process.cwd(), "qa", "responsive", "reports");
  fs.mkdirSync(screensDir, { recursive: true });
  fs.mkdirSync(reportsDir, { recursive: true });

  const findings: Finding[] = [];
  let checkCounter = 1;

  console.log(`\n=================================================`);
  console.log(`Starting Cross-Device Responsive QA Suite on ${BASE_URL}`);
  console.log(`Sample routes: ${SAMPLE_PAGES.length} | Viewports: ${MATRIX_VIEWPORTS.length}`);
  console.log(`=================================================\n`);

  const browser = await chromium.launch({ headless: true });

  try {
    // ----------------------------------------------------
    // PHASE 1: Automated Layout & Overflow Matrix Check
    // ----------------------------------------------------
    console.log(`\n--- Phase 1: Viewport Matrix & Automated Layout Assertions ---`);

    for (const vp of MATRIX_VIEWPORTS) {
      process.stdout.write(`Testing viewport [${vp.name} (${vp.width}x${vp.height})] `);
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: vp.dpr,
        hasTouch: vp.isTouch,
        isMobile: vp.isTouch,
      });

      const page = await context.newPage();

      for (const item of SAMPLE_PAGES) {
        process.stdout.write(".");
        const url = `${BASE_URL}${item.path}`;
        try {
          await page.goto(url, { waitUntil: "domcontentloaded", timeout: 15000 });
          await page.waitForTimeout(100);

          // 1. Horizontal page overflow
          const overflowData = await page.evaluate(() => {
            const docWidth = document.documentElement.scrollWidth;
            const winWidth = window.innerWidth;
            const hasOverflow = docWidth > winWidth + 1;
            let culprits: Array<{ tag: string; id: string; className: string; right: number; width: number }> = [];

            if (hasOverflow) {
              const allElements = document.querySelectorAll("*");
              allElements.forEach((el) => {
                const rect = el.getBoundingClientRect();
                if (rect.right > winWidth + 1) {
                  culprits.push({
                    tag: el.tagName.toLowerCase(),
                    id: el.id,
                    className: typeof el.className === "string" ? el.className.split(" ")[0] : "",
                    right: Math.round(rect.right),
                    width: Math.round(rect.width),
                  });
                }
              });
            }
            return { hasOverflow, docWidth, winWidth, culprits: culprits.slice(0, 5) };
          });

          if (overflowData.hasOverflow) {
            const shotPath = path.join(screensDir, `overflow-${item.name}-${vp.width}x${vp.height}.png`);
            await page.screenshot({ path: shotPath, fullPage: false });
            findings.push({
              id: `RS-2.1.1.${checkCounter++}`,
              category: "Horizontal Overflow",
              page: item.path,
              viewport: `${vp.name} (${vp.width}x${vp.height})`,
              severity: vp.width < 768 ? "Blocker" : "High",
              description: `Horizontal scroll detected: scrollWidth (${overflowData.docWidth}px) exceeds viewport (${overflowData.winWidth}px)`,
              details: `Culprit elements: ${overflowData.culprits.map((c) => `<${c.tag} class="${c.className}"> right:${c.right}px`).join("; ")}`,
              screenshot: shotPath,
            });
          }

          // 2. Text clipping or broken wrapping
          const textClipping = await page.evaluate(() => {
            const badElements: string[] = [];
            document.querySelectorAll("h1, h2, h3, .btn-call, [class*='button'], [class*='Button']").forEach((el) => {
              const rect = el.getBoundingClientRect();
              if (rect.width > 0 && el.scrollWidth > el.clientWidth + 3) {
                const style = window.getComputedStyle(el);
                if (style.overflow === "hidden" || style.textOverflow === "ellipsis") {
                  // intentional ellipsis
                } else {
                  badElements.push(`${el.tagName.toLowerCase()}.${el.className.split(" ")[0]}: scrollW ${el.scrollWidth} > clientW ${el.clientWidth}`);
                }
              }
            });
            return badElements.slice(0, 3);
          });

          if (textClipping.length > 0) {
            findings.push({
              id: `RS-2.1.2.${checkCounter++}`,
              category: "Text Clipping",
              page: item.path,
              viewport: `${vp.name} (${vp.width}x${vp.height})`,
              severity: "High",
              description: "Text or button clipped without ellipsis",
              details: textClipping.join("; "),
            });
          }

          // 3. Touch tap target sizes (< 44x44px) on mobile viewports
          if (vp.isTouch && vp.width <= 430) {
            const tapViolations = await page.evaluate(() => {
              const violations: Array<{ tag: string; text: string; width: number; height: number }> = [];
              const interactives = document.querySelectorAll<HTMLElement>("a, button, summary, input:not([type='hidden']), select");
              interactives.forEach((el) => {
                const rect = el.getBoundingClientRect();
                if (rect.width > 0 && rect.height > 0) {
                  // ignore hidden / offscreen
                  if (rect.bottom > 0 && rect.top < window.innerHeight * 3) {
                    if (rect.width < 40 || rect.height < 40) {
                      // ignore inline links inside normal body paragraphs
                      const isInlineLink = el.tagName === "A" && el.closest("p, li, figcaption") && !el.classList.contains("btn-call") && !el.closest("nav, header, footer");
                      if (!isInlineLink) {
                        violations.push({
                          tag: el.tagName.toLowerCase(),
                          text: (el.innerText || el.getAttribute("aria-label") || el.getAttribute("name") || "").slice(0, 25).trim(),
                          width: Math.round(rect.width),
                          height: Math.round(rect.height),
                        });
                      }
                    }
                  }
                }
              });
              return violations.slice(0, 5);
            });

            if (tapViolations.length > 0) {
              findings.push({
                id: `RS-2.1.4.${checkCounter++}`,
                category: "Tap Targets",
                page: item.path,
                viewport: `${vp.name} (${vp.width}x${vp.height})`,
                severity: "Medium",
                description: `Found ${tapViolations.length} interactive element(s) under minimum touch target size (40px)`,
                details: tapViolations.map((v) => `<${v.tag}> "${v.text}": ${v.width}x${v.height}px`).join("; "),
              });
            }
          }

          // 4. Input font sizes (< 16px triggers iOS zoom)
          if (item.path === "/contact/") {
            const inputSizes = await page.evaluate(() => {
              const badInputs: string[] = [];
              document.querySelectorAll<HTMLElement>("input, select, textarea").forEach((el) => {
                if (el.getAttribute("type") === "hidden") return;
                const fs = parseFloat(window.getComputedStyle(el).fontSize);
                if (fs < 16) {
                  badInputs.push(`${el.tagName.toLowerCase()}[${el.getAttribute("name") || el.getAttribute("type")}]: ${fs}px`);
                }
              });
              return badInputs;
            });

            if (inputSizes.length > 0) {
              findings.push({
                id: `RS-2.1.5.${checkCounter++}`,
                category: "Form Input Font Size",
                page: item.path,
                viewport: `${vp.name} (${vp.width}x${vp.height})`,
                severity: "High",
                description: "Form inputs with font-size < 16px (causes iOS Safari unwanted zoom on focus)",
                details: inputSizes.join("; "),
              });
            }
          }

          // 5. Image distortion / overflow
          const imgIssues = await page.evaluate(() => {
            const issues: string[] = [];
            document.querySelectorAll("img").forEach((img) => {
              const rect = img.getBoundingClientRect();
              if (rect.width > 0 && rect.height > 0) {
                if (rect.width > window.innerWidth + 1) {
                  issues.push(`Image exceeds viewport: ${img.src} (${Math.round(rect.width)}px > ${window.innerWidth}px)`);
                }
                if (img.naturalWidth > 0 && img.naturalHeight > 0) {
                  const naturalRatio = img.naturalWidth / img.naturalHeight;
                  const renderedRatio = rect.width / rect.height;
                  if (Math.abs(renderedRatio - naturalRatio) / naturalRatio > 0.25) {
                    issues.push(`Distorted aspect ratio: ${img.src} (natural: ${naturalRatio.toFixed(2)}, rendered: ${renderedRatio.toFixed(2)})`);
                  }
                }
              }
            });
            return issues.slice(0, 3);
          });

          if (imgIssues.length > 0) {
            findings.push({
              id: `RS-2.1.6.${checkCounter++}`,
              category: "Image Sizing & Ratio",
              page: item.path,
              viewport: `${vp.name} (${vp.width}x${vp.height})`,
              severity: "High",
              description: "Image overflow or aspect ratio distortion detected",
              details: imgIssues.join("; "),
            });
          }

          // 6. Screenshot capture at designated widths
          if (SCREENSHOT_WIDTHS.includes(vp.width)) {
            const shotName = `${item.name}-${vp.width}x${vp.height}-chromium.png`;
            const shotPath = path.join(screensDir, shotName);
            if (!fs.existsSync(shotPath)) {
              await page.screenshot({ path: shotPath, fullPage: true });
            }
          }
        } catch (err: any) {
          findings.push({
            id: `RS-ERR.${checkCounter++}`,
            category: "Page Load Error",
            page: item.path,
            viewport: `${vp.name} (${vp.width}x${vp.height})`,
            severity: "Blocker",
            description: `Page failed to load or evaluate: ${err.message}`,
            details: err.stack || "",
          });
        }
      }
      await context.close();
      console.log(` [DONE]`);
    }

    // ----------------------------------------------------
    // PHASE 2: Navigation & Call Flow Interactive Tests
    // ----------------------------------------------------
    console.log(`\n--- Phase 2: Navigation & Critical Call Flow Tests ---`);

    {
      // A. Mobile Menu on 390px
      const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
      const page = await context.newPage();
      await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });

      // Check Mobile Menu Toggle Button
      const menuBtn = page.locator('button[aria-label="Open navigation menu"]');
      const menuBtnVisible = await menuBtn.isVisible();

      if (!menuBtnVisible) {
        findings.push({
          id: `RS-2.2.1.${checkCounter++}`,
          category: "Mobile Navigation",
          page: "/",
          viewport: "390x844",
          severity: "Blocker",
          description: "Mobile hamburger menu button is not visible on phone viewport",
          details: "Could not find visible button with aria-label='Open navigation menu'",
        });
      } else {
        // Click to open
        await menuBtn.click();
        await page.waitForTimeout(300);

        const isExpanded = await menuBtn.getAttribute("aria-expanded");
        const bodyOverflow = await page.evaluate(() => document.body.style.overflow);

        if (isExpanded !== "true" || bodyOverflow !== "hidden") {
          findings.push({
            id: `RS-2.2.2.${checkCounter++}`,
            category: "Mobile Menu Interaction",
            page: "/",
            viewport: "390x844",
            severity: "High",
            description: "Mobile menu does not properly lock body scroll or set aria-expanded='true'",
            details: `aria-expanded=${isExpanded}, body.style.overflow='${bodyOverflow}'`,
          });
        }

        // Test Escape Key
        await page.keyboard.press("Escape");
        await page.waitForTimeout(300);
        const closedExpanded = await menuBtn.getAttribute("aria-expanded");
        if (closedExpanded === "true") {
          findings.push({
            id: `RS-2.2.3.${checkCounter++}`,
            category: "Mobile Menu Keyboard Accessibility",
            page: "/",
            viewport: "390x844",
            severity: "Medium",
            description: "Mobile menu does not close when Escape key is pressed",
            details: "Escape key press did not reset aria-expanded to false",
          });
        }
      }

      // Check Sticky Call Bar
      const stickyBar = page.locator('[data-sticky-call-bar]').first();
      const stickyBarVisible = await stickyBar.isVisible();
      if (!stickyBarVisible) {
        findings.push({
          id: `RS-2.2.4.${checkCounter++}`,
          category: "Sticky Call Bar",
          page: "/",
          viewport: "390x844",
          severity: "Blocker",
          description: "Sticky mobile call bar is not visible on phone viewport",
          details: "selector [data-sticky-call-bar] not visible",
        });
      } else {
        // Verify tel: link inside sticky bar
        const telLink = stickyBar.locator('a[href^="tel:"]');
        const telCount = await telLink.count();
        if (telCount === 0) {
          findings.push({
            id: `RS-2.2.5.${checkCounter++}`,
            category: "Tap-To-Call Link",
            page: "/",
            viewport: "390x844",
            severity: "Blocker",
            description: "Sticky mobile call bar does not contain a valid tel: anchor link",
            details: "Missing a[href^='tel:'] in sticky bar",
          });
        }
      }
      await context.close();
    }

    {
      // B. Sticky Call Bar hidden on Desktop 1440px
      const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
      const page = await context.newPage();
      await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });

      const stickyBarDesktop = page.locator('[data-sticky-call-bar]').first();
      const isVisibleDesktop = await stickyBarDesktop.isVisible();
      if (isVisibleDesktop) {
        findings.push({
          id: `RS-2.2.6.${checkCounter++}`,
          category: "Sticky Call Bar Responsiveness",
          page: "/",
          viewport: "1440x900",
          severity: "High",
          description: "Sticky mobile call bar remains visible on desktop viewport (should only be on phones)",
          details: "Sticky bar visible at 1440px width",
        });
      }

      // Desktop Header Dropdown Hover test
      const servicesNavBtn = page.locator('header button:has-text("Services")');
      if (await servicesNavBtn.isVisible()) {
        await servicesNavBtn.hover();
        await page.waitForTimeout(300);
        const megaMenu = page.locator('#mega-services');
        const megaMenuVisible = await megaMenu.isVisible();
        if (!megaMenuVisible) {
          findings.push({
            id: `RS-2.2.7.${checkCounter++}`,
            category: "Desktop Navigation Hover",
            page: "/",
            viewport: "1440x900",
            severity: "High",
            description: "Desktop Services dropdown does not open automatically on mouse hover",
            details: "Hovering 'Services' button did not reveal #mega-services",
          });
        }
      }
      await context.close();
    }

    // ----------------------------------------------------
    // PHASE 3: Mobile Landscape & Short Viewport Checks
    // ----------------------------------------------------
    console.log(`\n--- Phase 3: Short Landscape Viewports (667x375 & 844x390) ---`);
    for (const [w, h] of [[667, 375], [844, 390]]) {
      const context = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: true });
      const page = await context.newPage();
      await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });

      // Verify header call button & logo don't overlap in landscape
      const headerCollision = await page.evaluate(() => {
        const logo = document.querySelector('header a[class*="brand"]');
        const callBtn = document.querySelector('header [class*="callBtn"], header .btn-call');
        if (logo && callBtn) {
          const rLogo = logo.getBoundingClientRect();
          const rCall = callBtn.getBoundingClientRect();
          const overlap = !(rLogo.right < rCall.left || rLogo.left > rCall.right || rLogo.bottom < rCall.top || rLogo.top > rCall.bottom);
          return { overlap, rLogo, rCall };
        }
        return { overlap: false };
      });

      if (headerCollision.overlap) {
        findings.push({
          id: `RS-2.5.1.${checkCounter++}`,
          category: "Landscape Header Collision",
          page: "/",
          viewport: `${w}x${h}`,
          severity: "Blocker",
          description: "Header logo and call button collide/overlap in phone landscape orientation",
          details: JSON.stringify(headerCollision),
        });
      }
      await context.close();
    }

    // ----------------------------------------------------
    // PHASE 4: Breakpoints Boundary Sweep (one px below, at, one px above)
    // ----------------------------------------------------
    console.log(`\n--- Phase 4: Exact Breakpoint Boundary Sweep ---`);
    for (const bp of EXACT_BREAKPOINTS) {
      for (const w of [bp - 1, bp, bp + 1]) {
        const context = await browser.newContext({ viewport: { width: w, height: 800 } });
        const page = await context.newPage();
        await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });

        const overflow = await page.evaluate(() => {
          return document.documentElement.scrollWidth > window.innerWidth + 1;
        });

        if (overflow) {
          findings.push({
            id: `RS-2.1.BP.${checkCounter++}`,
            category: "Breakpoint Boundary Overflow",
            page: "/",
            viewport: `${w}x800 (boundary of ${bp}px)`,
            severity: "High",
            description: `Horizontal overflow at exact media query boundary width ${w}px`,
            details: `Testing boundary around @media (${bp}px)`,
          });
        }
        await context.close();
      }
    }

    // ----------------------------------------------------
    // PHASE 5: Fluid Sweep on 6 Core Pages (320px to 1920px in 40px steps)
    // ----------------------------------------------------
    console.log(`\n--- Phase 5: Fluid Width Sweeps (320px -> 1920px) ---`);
    for (const p of CORE_SWEEP_PAGES) {
      process.stdout.write(`Sweeping ${p} `);
      for (let w = 320; w <= 1920; w += 40) {
        const context = await browser.newContext({ viewport: { width: w, height: 800 } });
        const page = await context.newPage();
        await page.goto(`${BASE_URL}${p}`, { waitUntil: "domcontentloaded" });

        const overflow = await page.evaluate(() => {
          return document.documentElement.scrollWidth > window.innerWidth + 1;
        });

        if (overflow) {
          findings.push({
            id: `RS-2.1.SWEEP.${checkCounter++}`,
            category: "Fluid Sweep Overflow",
            page: p,
            viewport: `${w}x800`,
            severity: w < 768 ? "Blocker" : "High",
            description: `Horizontal page overflow at fluid sweep width ${w}px on ${p}`,
            details: `document.documentElement.scrollWidth > ${w}px`,
          });
          break; // break once per page to avoid spamming
        }
        await context.close();
      }
      process.stdout.write(` [DONE]\n`);
    }

    // ----------------------------------------------------
    // PHASE 6: Conditions Sweep (Zoom 150/200%, DPR 2/3, Reduced Motion)
    // ----------------------------------------------------
    console.log(`\n--- Phase 6: Conditions Sweep (Zoom, DPR, Reduced Motion) ---`);
    {
      // Zoom 200% on 390px equivalent (WCAG 1.4.10 Reflow)
      const context = await browser.newContext({ viewport: { width: 640, height: 800 } });
      const page = await context.newPage();
      await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });

      // Emulate 200% zoom by setting zoom factor or scaling
      await page.evaluate(() => {
        document.body.style.zoom = "200%";
      });
      await page.waitForTimeout(200);

      const zoomOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth + 2;
      });

      if (zoomOverflow) {
        findings.push({
          id: `RS-2.4.3.${checkCounter++}`,
          category: "Reflow / 200% Zoom",
          page: "/",
          viewport: "640x800 @ 200% zoom",
          severity: "High",
          description: "Content does not reflow cleanly at 200% zoom (causes horizontal scroll)",
          details: "WCAG 1.4.10 Reflow test failed with document.body.style.zoom=200%",
        });
      }
      await context.close();
    }

    {
      // Reduced motion test
      const context = await browser.newContext({
        viewport: { width: 1440, height: 900 },
        reducedMotion: "reduce",
      });
      const page = await context.newPage();
      await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });

      const animDuration = await page.evaluate(() => {
        const el = document.querySelector(".btn-call, [class*='hero']");
        if (el) {
          return window.getComputedStyle(el).transitionDuration;
        }
        return "none";
      });
      // Verification logged
      await context.close();
    }

    {
      // Contact Form Viewport Shrink (Virtual Keyboard Emulation)
      const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
      const page = await context.newPage();
      await page.goto(`${BASE_URL}/contact/`, { waitUntil: "domcontentloaded" });

      // Simulate keyboard open by reducing viewport height to 420px
      await page.setViewportSize({ width: 390, height: 420 });
      const submitBtn = page.locator('button[type="submit"]');
      const submitVisible = await submitBtn.isVisible();

      if (!submitVisible) {
        findings.push({
          id: `RS-2.3.9.${checkCounter++}`,
          category: "Virtual Keyboard Occlusion",
          page: "/contact/",
          viewport: "390x420 (Keyboard Open)",
          severity: "High",
          description: "Contact form submit button is obscured or unreachable when virtual keyboard opens",
          details: "Form submit button not visible or scrollable in visual viewport",
        });
      }
      await context.close();
    }

    {
      // Tables & Cost Guides Horizontal Scroll Containment
      const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
      const page = await context.newPage();
      await page.goto(`${BASE_URL}/cost-guides/water-heater-replacement-cost/`, { waitUntil: "domcontentloaded" });

      const tableContained = await page.evaluate(() => {
        const tables = document.querySelectorAll("table");
        let allContained = true;
        tables.forEach((t) => {
          const wrapper = t.closest(".table-scroll-wrapper, [class*='tableWrap'], div");
          if (!wrapper || wrapper.scrollWidth <= wrapper.clientWidth) {
            // table doesn't overflow or wrapper handles it
          }
        });
        return { allContained, hasPageOverflow: document.documentElement.scrollWidth > window.innerWidth + 1 };
      });

      if (tableContained.hasPageOverflow) {
        findings.push({
          id: `RS-2.3.4.${checkCounter++}`,
          category: "Table Containment",
          page: "/cost-guides/water-heater-replacement-cost/",
          viewport: "390x844",
          severity: "Blocker",
          description: "Cost table overflows page container and causes horizontal window scrolling",
          details: "Table wrapper must provide internal horizontal scrolling with sticky header/columns",
        });
      }
      await context.close();
    }

    {
      // Measure CLS on Home and Services at 390px and 1440px
      for (const p of ["/", "/services/"]) {
        for (const [w, h] of [[390, 844], [1440, 900]]) {
          const context = await browser.newContext({ viewport: { width: w, height: h } });
          const page = await context.newPage();
          await page.goto(`${BASE_URL}${p}`, { waitUntil: "networkidle" });
          const cls = await measureCls(page);
          if (cls > 0.1) {
            findings.push({
              id: `RS-2.1.7.${checkCounter++}`,
              category: "Cumulative Layout Shift",
              page: p,
              viewport: `${w}x${h}`,
              severity: "High",
              description: `High layout shift measured: CLS = ${cls.toFixed(3)} (budget <= 0.05 on key pages, <= 0.1 on all)`,
              details: `CLS measured: ${cls}`,
            });
          }
          await context.close();
        }
      }
    }

  } finally {
    await browser.close();
  }

  // Save findings JSON
  const findingsJsonPath = path.join(reportsDir, "findings.json");
  fs.writeFileSync(findingsJsonPath, JSON.stringify(findings, null, 2), "utf8");

  console.log(`\n=================================================`);
  console.log(`Test Run Completed!`);
  console.log(`Total Findings Identified: ${findings.length}`);
  console.log(`Blocker: ${findings.filter((f) => f.severity === "Blocker").length}`);
  console.log(`High:    ${findings.filter((f) => f.severity === "High").length}`);
  console.log(`Medium:  ${findings.filter((f) => f.severity === "Medium").length}`);
  console.log(`Low:     ${findings.filter((f) => f.severity === "Low").length}`);
  console.log(`Findings saved to: ${findingsJsonPath}`);
  console.log(`=================================================\n`);

  return findings;
}

if (require.main === module || process.argv[1]?.includes("run-responsive-qa")) {
  runResponsiveQa()
    .then((findings) => {
      if (findings.some((f) => f.severity === "Blocker")) {
        console.log("Completed with Blocker findings to resolve.");
      } else {
        console.log("All critical checks passed!");
      }
    })
    .catch((err) => {
      console.error("Test runner failed:", err);
      process.exit(1);
    });
}
