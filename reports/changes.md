# Pre-Launch QA — File Modification Log

All file changes made during the whole-site Pre-Launch Quality Assurance audit for `phoenixvalleyplumber.com`, organized by category with exact one-line justifications.

---

## 1. Technical SEO & Crawl Hygiene

- `app/blog/page.tsx`: Fixed double-brand suffix in metadata title to strictly maintain titles under 60 characters.
- `app/blog/category/[category]/page.tsx`: Fixed metadata title template suffixing for blog category archives.
- `app/editorial-policy/page.tsx`: Fixed metadata title template suffixing for editorial standards page.
- `app/faq/page.tsx`: Fixed metadata title template suffixing on primary FAQ hub.
- `app/cost-guides/page.tsx`: Fixed `StatusBadge` component prop interface mismatch (`hours` and `initialStatus`).
- `data/nav.json`: Updated Cost Guides navigation items to use canonical `/cost-guides/{slug}/` routes and point exclusively to published guides.
- `components/sections/EmergencyBlock.tsx`: Corrected broken shut-off link to point to authored post `/blog/how-to-shut-off-main-water-valve/`.

---

## 2. Truth Gating & Claims Compliance

- `app/terms/page.tsx`: Removed unearned "same-day" dispatch phrase in Section 3 to adhere strictly to `site.claims.sameDayService: false`.

---

## 3. Accessibility (WCAG 2.2 AA & Axe-Core Clean Pass)

- `components/sections/ServiceAreaMap.tsx`: Changed SVG element `role="img"` to `role="group"` with accessible label, eliminating nested interactive control conflicts with child SVG city links.
- `components/city/LocalServiceGrid.tsx`: Updated phone link `ariaLabel` to explicitly include visible phone number `Call (602) 835-0102`, resolving WCAG 2.5.3 (Label in Name) mismatch.
- `components/blog/PostTemplate.tsx`: Removed `"aria-label": "Permalink"` from `rehypeAutolinkHeadings` wrap option, ensuring heading anchors retain their true visible text as accessible names.
- `components/layout/UtilityBar.tsx`: Converted root `<div>` to `<aside aria-label="...">` landmark, ensuring 100% of body content is contained within assistive landmarks.
- `app/blog/BlogIndex.module.css`: Corrected `.featuredBadge` text color from white to `var(--navy-900)` on `#FF7A1A`, boosting contrast from 2.6:1 to 8.5:1.
- `components/contact/ContactHeroPanel.module.css`: Corrected `.primaryTag` color from undefined token `var(--navy-950)` to `var(--navy-900)` (> 8.5:1 contrast).
- `components/city/CityHubGrid.tsx`: Updated "Primary Hub" badge to `#9A3E00` on `#FFF3EB` (5.5:1 contrast).
- `components/city/ValleyLocator.module.css`: Adjusted `.badgeActive` text color to `#FFAE73` on dark cards (> 6.5:1 contrast).
- `components/city/EraTimeline.module.css`: Adjusted `.builtRange` pill badge color to `#9A3E00` on `#FFF3EB` (5.5:1 contrast).
- `components/city/CityEmergencyBlock.module.css`: Changed numbered step badges from white to `var(--navy-900)` (> 8.5:1 contrast).
- `components/service/SourceLink.tsx`: Added `variant="light"` support for high-contrast sky blue (`#7DD3FC`) links on dark cards (> 7.0:1 contrast).
- `components/city/CityEmergencyBlock.tsx`: Passed `variant="light"` to Southwest Gas leak protocol source link.
- `components/sections/Faq.module.css`: Added explicit `background-color: var(--white)` on `.ctaRow` and `.stillText` to eliminate transparent mobile background contrast miscalculations.

---

## 4. Responsive Layout & Horizontal Overflow Prevention

- `app/globals.css`: Updated `table.sr-only` to include `max-width: 1px; table-layout: fixed;` to prevent unconstrained HTML table width expansion.
- `components/city/HardnessBars.tsx`: Wrapped accessible data `<table>` in `<div className="sr-only">` to prevent table layout algorithm from expanding document `scrollWidth`.
- `components/city/CityHero.module.css`: Added `overflow: clip; contain: paint; isolation: isolate;` and hidden ambient `.rippleWrap` on viewports under 768px.
- `components/sections/FinalCta.module.css`: Added `overflow: clip; contain: paint; isolation: isolate;` and restricted `.waveWrap` width to 100% on mobile viewports (< 768px).
- `components/blog/PostTemplate.module.css`: Set `.layoutGrid` to `grid-template-columns: minmax(0, 1fr)` and `.articleCol` to `min-width: 0; max-width: 72ch;`, preventing grid cell overflow on 360px viewports.
- `components/blog/PostHeader.module.css`: Added `min-width: 0; overflow-wrap: break-word; word-break: break-word;` and reduced title clamp floor to `1.75rem` for 360px mobile viewports.

---

## 5. Security & Build Configuration

- `next.config.ts`: Added `poweredByHeader: false` to strip the `X-Powered-By: Next.js` header from all HTTP responses.
- `tsconfig.json`: Added `"qa"` to compiler `exclude` array to isolate test-runner automation scripts from production application type-checking.
