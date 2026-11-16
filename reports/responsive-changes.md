# Responsive & Cross-Device Changes Log

This document lists every file modified or created during the responsive and cross-device test-and-fix pass for [phoenixvalleyplumber.com](https://phoenixvalleyplumber.com). All changes preserve brand colors, design tokens, copy, and layout structure while resolving overflow, text clipping, iOS Safari zoom triggers, and touch target sizing.

---

## Summary of Modified Files

| File | Change Category | Rationale |
|---|---|---|
| `components/layout/StickyCallBar.tsx` | Accessibility & Semantics | Added `data-sticky-call-bar=""` attribute for reliable locator resolution and automated QA verification across dev and production builds. |
| `components/layout/Header.module.css` | Touch Targets | Added `min-height: 48px; padding-block: 4px;` to brand logo anchor (`.brand`) ensuring the header logo is at least 48px tall on mobile viewports. |
| `components/contact/ContactForm.module.css` | iOS Safari Zoom Prevention | Added `font-size: 16px;` to `.honeypot` input and `.checkboxInput` (emergency & consent checkboxes) to prevent iOS Safari auto-zoom on form focus. |
| `app/globals.css` | Form Controls & iOS Zoom | Added global base declaration `input, select, textarea, button { font-family: inherit; font-size: 1rem; }` to eliminate sub-16px input focus issues site-wide. |
| `app/cost-guides/CostGuidesHub.module.css` | Foldable Text Clipping & Touch Targets | Adjusted `.sectionHeading` and `.checklistHeading` to `font-size: clamp(1.25rem, 4vw, 2rem); overflow-wrap: break-word; word-break: break-word; hyphens: auto;` to prevent text clipping on 280px folded screens. Reduced mobile padding on `.checklistSection`. Added `min-height: 44px;` to `.relatedPill`. |
| `components/blog/PostCard.module.css` | Flex Min-Width, Text Wrapping & Touch Targets | Added `min-width: 0;` to `.content`, `overflow-wrap: break-word; word-break: break-word; min-width: 0;` to `.title`, and `min-height: 44px; padding-block: 4px;` to `.readMore` link. |
| `components/blog/ReviewerBox.module.css` | Sidebar Flex Overflow | Added `min-width: 0;` to `.info` and `overflow-wrap: break-word; word-break: break-word;` to `.title` to prevent overflow clipping in two-column tablet views. |
| `components/blog/AuthorBox.module.css` | Flex Overflow Prevention | Added `min-width: 0;` to `.info` to ensure author names and credentials wrap naturally on narrow viewports. |
| `components/blog/Toc.module.css` | Touch Target Sizing | Added `min-height: 44px;` to `.summary` for the mobile in-page table of contents accordion. |
| `components/blog/PostHeader.module.css` | Touch Target Sizing | Added `min-height: 40px; padding: 6px 14px;` to `.categoryChip` category badges. |
| `components/service/Breadcrumbs.module.css` | Touch Target Sizing | Added `display: inline-flex; align-items: center; min-height: 44px; padding: 6px 4px; margin-block: -6px;` to `.link` to meet WCAG 2.5.5 touch target size without shifting inline text layout. |
| `components/service/HubChildGrid.module.css` | Touch Target Sizing | Added `min-height: 44px; display: inline-flex; align-items: center; padding-block: 4px;` to `.learnLink` and `.callLink`. |
| `components/sections/ServicesGrid.module.css` | Touch Target Sizing | Added `min-height: 44px; display: inline-flex; align-items: center;` to `.learnMore` and `.microCall`. |
| `components/city/LocalServiceGrid.module.css` | Touch Target Sizing | Added `min-height: 44px; display: inline-flex; align-items: center; padding-block: 4px;` to `.learnMoreLink` and `.callDirect`. |
| `components/city/CityHero.module.css` | Touch Target Sizing | Added `min-height: 44px; display: inline-flex; align-items: center; padding-block: 4px;` to `.contactQuietLink`. |
| `components/sections/Hero.module.css` | Touch Target Sizing | Increased `.contactLink` `min-height` from `40px` to `44px`. |
| `components/service/ServiceHero.module.css` | Touch Target Sizing | Added `min-height: 44px; display: inline-flex; align-items: center; padding-block: 4px;` to `.contactLink`. |
| `components/service/ServiceMidCta.module.css` | Touch Target Sizing | Added `min-height: 44px; display: inline-flex; align-items: center; padding-block: 4px;` to `.contactLink`. |
| `app/faq/FAQHub.module.css` | Touch Target Sizing | Added `min-height: 44px; padding: 8px 16px;` to `.categoryPill`. |
| `app/NotFound.module.css` | Touch Target Sizing | Added `min-height: 44px; display: inline-flex; align-items: center; padding-block: 4px;` to `.quickLink`. |
| `components/layout/FloatingCallPill.module.css` | Touch Target Sizing | Increased `.dismissBtn` from `40x40px` to `44x44px`. |
| `package.json` | Automation Script | Added `"qa:responsive": "tsx qa/responsive/scripts/run-responsive-qa.ts"`. |
| `qa/responsive/scripts/run-responsive-qa.ts` | Test Automation | Created comprehensive end-to-end Playwright automation script testing 27 routes across 17 viewports, sweeps, and environmental conditions. |
