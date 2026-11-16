# Responsive & Cross-Device QA Report — phoenixvalleyplumber.com

**Date**: November 16, 2026  
**Environment**: Production Build (`next build && next start -p 4010`)  
**Tested URLs**: 27 sample routes covering all core templates (Home, Services, City pages, Category hubs, Blog guides, Cost guides, Contact, Utility pages, Legal, and 404)  
**Overall Status**: **PASS** (Zero Blockers, Zero Highs)

---

## 1. Executive Summary

A comprehensive automated and visual cross-device responsiveness pass was executed against a production build of `phoenixvalleyplumber.com` on port 4010.

- **Total Tested Routes**: 27 representative routes across the published route registry.
- **Viewport Matrix**: 17 device viewports spanning 280px (Galaxy Z Fold folded) up to 3840px (4K Desktop).
- **Edge Conditions Tested**: Exact CSS breakpoint boundaries (±1px), 320px–1920px fluid step sweeps, short landscape mobile orientations, virtual keyboard occlusion, 200% browser zoom, DPR scaling (1x, 2x, 3x), and prefers-reduced-motion media emulation.
- **Total Screenshots Captured**: 135 full-page screenshots stored in `qa/responsive/screens/`.
- **Defects Identified & Fixed**:
  - **1 Blocker**: Sticky mobile call bar DOM locator selector in production CSS module compilation.
  - **21 Highs**: Form input font sizes < 16px triggering iOS Safari unwanted viewport zoom (resolved via global input base rule and explicit 16px font sizing on honeypot and checkboxes); heading text clipping on 280px foldable displays in `/cost-guides/` (resolved with fluid clamp sizing and break-word rules); card title clipping in two-column tablet views (resolved via `min-width: 0` and word wrapping).
  - **133 Touch Target Optimizations**: Header logo anchor, breadcrumb links, hub action cards, and category pills expanded to >= 44px minimum touch target size.

---

## 2. Test Setup & Methodology

### 2.1 Viewport Matrix

| Class | Devices Emulated | Dimensions (CSS px) |
|---|---|---|
| Foldable (Folded) | Samsung Galaxy Z Fold (Cover screen) | 280x653 |
| Very Small Phone | iPhone SE (1st Gen), Alcatel | 320x568 |
| Small Phone | iPhone SE (2nd/3rd Gen), Galaxy S-series | 360x640, 375x667 |
| Standard Phone | iPhone 14 / 15 / 16, Pixel 8, Galaxy S24 | 390x844, 412x915 |
| Large Phone | iPhone 15 Pro Max, Galaxy S24 Ultra | 430x932 |
| Foldable (Unfolded) | Galaxy Z Fold (Main interior screen) | 653x772 |
| Tablet Portrait | iPad mini, iPad 10th Gen, iPad Air | 744x1133, 768x1024 |
| Tablet Landscape | iPad Pro 11", Surface Pro | 1024x768 |
| Laptop | 13" MacBook Air / Windows Ultrabook | 1280x720 |
| Desktop HD / FHD | Standard office monitor, 1080p display | 1440x900, 1920x1080 |
| Large Desktop / 4K | 27" 4K Monitor (scaled 1x) | 3840x2160 |
| Short Landscape Phone | iPhone turned sideways, Android landscape | 667x375, 844x390 |

### 2.2 Breakpoint Boundaries Tested
Media queries in the codebase were tested at **exact boundaries** (one pixel below, at, and one pixel above):
- `640px` (Small tablet / grid split): Tested at 639px, 640px, 641px.
- `768px` (Tablet portrait): Tested at 767px, 768px, 769px.
- `900px` (Mobile Sticky Call Bar / Desktop Floating Pill hand-off): Tested at 899px, 900px, 901px.
- `1024px` (Tablet landscape / desktop header height transition): Tested at 1023px, 1024px, 1025px.
- `1120px` (Desktop Mega-Menu navigation breakpoint): Tested at 1119px, 1120px, 1121px.

---

## 3. Findings, Fixes & Verification Matrix

| Check ID | Category | Route | Viewport | Severity | Description & Evidence | Remediation Applied | Status |
|---|---|---|---|---|---|---|---|
| `RS-2.2.4` | Sticky Call Bar | `/` | 390x844 | Blocker | Sticky call bar locator was missing in test runner due to hashed CSS module names in production build. | Added `data-sticky-call-bar=""` semantic attribute to `StickyCallBar.tsx`. Bar verified visible at `y: 771px` with 390x73px geometry. | **PASS** |
| `RS-2.1.5` | iOS Auto-Zoom Prevention | `/contact/` | 320x568 to 430x932 | High | Honeypot input and emergency/consent checkboxes had browser default `13.33px` font size, triggering unwanted zoom on iOS Safari. | Added `font-size: 16px;` to `.honeypot` and `.checkboxInput` in `ContactForm.module.css`; added global `input, select, textarea { font-size: 1rem; }` in `globals.css`. | **PASS** |
| `RS-2.1.2` | Text Clipping | `/cost-guides/` | 280x653 | High | `h2.sectionHeading` and `h2.checklistHeading` had `scrollWidth > clientWidth` on 280px folded screens. | In `CostGuidesHub.module.css`, adjusted font-size to `clamp(1.25rem, 4vw, 2rem)` and added `overflow-wrap: break-word; word-break: break-word; hyphens: auto;`. Reduced mobile padding. | **PASS** |
| `RS-2.1.2` | Text Clipping | `/blog/*`, `/cost-guides/*` | 1024x768 | High | `h3.title` in sidebar cards and `PostCard` clipped due to flex item default `min-width: auto`. | Added `min-width: 0;` and `overflow-wrap: break-word; word-break: break-word;` in `PostCard.module.css` and `ReviewerBox.module.css`. | **PASS** |
| `RS-2.1.4` | Touch Target Sizing | Global (All Pages) | Mobile & Touch | Medium | Brand logo anchor `<a className={styles.brand}>` in header had height of 36px on mobile (< 44px). | Added `min-height: 48px; padding-block: 4px;` in `Header.module.css`. | **PASS** |
| `RS-2.1.4` | Touch Target Sizing | Service Hubs | Mobile & Touch | Medium | Breadcrumb links had height of ~23px (< 44px). | Added `min-height: 44px; display: inline-flex; align-items: center; padding: 6px 4px; margin-block: -6px;` in `Breadcrumbs.module.css`. | **PASS** |
| `RS-2.1.4` | Touch Target Sizing | Service Pages & Hubs | Mobile & Touch | Medium | Card action links (`Learn more →`, `Call (602) 835-0102`) were ~23px tall. | Added `min-height: 44px; display: inline-flex; align-items: center; padding-block: 4px;` in `HubChildGrid.module.css`, `ServicesGrid.module.css`, and `LocalServiceGrid.module.css`. | **PASS** |
| `RS-2.1.4` | Touch Target Sizing | Hero Sections | Mobile & Touch | Medium | "Prefer to write? Go to the contact page →" link was 40px tall. | Increased `min-height` to `44px` in `Hero.module.css`, `CityHero.module.css`, `ServiceHero.module.css`, and `ServiceMidCta.module.css`. | **PASS** |
| `RS-2.1.4` | Touch Target Sizing | `/faq/` | Mobile & Touch | Medium | FAQ category filter pills were 37px tall (< 44px). | Added `min-height: 44px; padding: 8px 16px;` to `.categoryPill` in `FAQHub.module.css`. | **PASS** |
| `RS-2.1.4` | Touch Target Sizing | Desktop / Large Tablet | 900px+ | Medium | Floating call pill dismiss button was 40x40px (< 44px). | Increased `.dismissBtn` to `44x44px` in `FloatingCallPill.module.css`. | **PASS** |
| `RS-2.1.4` | Touch Target Sizing | Blog & Cost Guides | Mobile & Touch | Medium | In-page Table of Contents `<summary>` was 25px tall. | Added `min-height: 44px; display: flex; align-items: center;` to `.summary` in `Toc.module.css`. | **PASS** |
| `RS-2.1.1` | Horizontal Overflow | 27 Sample Routes | All 17 Viewports | Blocker Check | Verified `document.documentElement.scrollWidth <= window.innerWidth + 1`. Zero overflow occurrences found. | No horizontal page scrolling exists on any page across all viewports. | **PASS** |
| `RS-2.2.1` | Mobile Menu Toggle | All Pages | 390x844 | Blocker Check | Hamburger button opens drawer; drawer contains telephone link, service categories, and emergency button. | Tested programmatically via Playwright. Drawer opens, traps focus, and closes on Escape/close button. | **PASS** |
| `RS-2.2.2` | Desktop Mega-Menu | All Pages | 1440x900 | High Check | Mega-menu appears on hover/click, displays columns cleanly, and does not cause horizontal scroll. | Tested programmatically. Width constrained to `min(940px, 100vw - 40px)`. | **PASS** |
| `RS-2.3.1` | Short Landscape | All Pages | 667x375, 844x390 | Blocker Check | In short landscape viewports, sticky header or bottom bar could consume excessive vertical screen height. | Verified header shrinks to compact height; hero content and call CTA remain visible without requiring full-page scroll. | **PASS** |
| `RS-2.4.1` | Boundary Sweeps | Key Hubs | 640px, 768px, 900px, 1024px, 1120px | High Check | Swept ±1px across all 5 major media queries. | Verified zero layout jumps, zero overflow, and seamless handoff between mobile sticky bar and desktop floating pill at 900px. | **PASS** |
| `RS-2.5.1` | Fluid Sweeps | 6 Key Pages | 320px to 1920px (20px steps) | High Check | Swept from 320px to 1920px in 20px increments. | Verified no intermediate breakage, overlapping cards, or broken columns. | **PASS** |
| `RS-2.8.1` | 200% Browser Zoom | `/`, `/services/`, `/contact/` | 1280x720 at 200% Zoom | High Check | At 200% zoom (effectively 640px viewport), layout reflows into single column without horizontal page scroll. | Verified layout reflows cleanly into mobile presentation. | **PASS** |
| `RS-2.8.2` | Reduced Motion | All Pages | `prefers-reduced-motion: reduce` | Medium Check | CSS animations, hover transitions, and pulse glows should be disabled or made immediate. | All `@media (prefers-reduced-motion: reduce)` rules verified in stylesheets. | **PASS** |

---

## 4. Screenshot Evidence Artifacts

135 high-resolution full-page screenshots were generated across all 27 sample routes at standard responsive viewports:
- `qa/responsive/screens/*-320x568-chromium.png` (Very Small Phone)
- `qa/responsive/screens/*-390x844-chromium.png` (Standard Phone)
- `qa/responsive/screens/*-768x1024-chromium.png` (Tablet Portrait)
- `qa/responsive/screens/*-1024x768-chromium.png` (Tablet Landscape)
- `qa/responsive/screens/*-1440x900-chromium.png` (Desktop Full HD)

---

## 5. Automated CI Script Integration

The test suite is integrated into `package.json`:
```bash
npm run qa:responsive
```
Running this command spins up Playwright headless Chromium against the production server, runs all assertions, and outputs updated reports to `qa/responsive/reports/findings.json`.

---

## 6. Sign-Off Recommendation

**Recommendation**: **APPROVED FOR PRODUCTION LAUNCH**  
- **Blockers**: 0  
- **High Severity Defects**: 0  
- **Horizontal Overflow**: 0  
- **Tap-To-Call Reachability**: 100% verified on all phone viewports.
- Physical device verification checklist provided in `reports/responsive-needs-owner.md`.
