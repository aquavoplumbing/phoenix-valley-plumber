# Pre-Launch Quality Assurance Report — phoenixvalleyplumber.com

**Audit Date:** 2026-11-15  
**Target Host:** Production Build (`next build && next start -p 4010`)  
**Site:** `https://phoenixvalleyplumber.com`  
**Licensee:** Phoenix Valley Plumber (Arizona Registrar of Contractors ROC #348219)  
**Primary Phone:** (602) 835-0102 (`+16028350102`)  
**Operating Model:** Partner / Dispatch Network (`site.json.operatingModel: "partner"`)  

---

## 1. Executive Summary & Verdict

### Launch Recommendation: **CONDITIONAL GO** (Clear to Deploy to Staging / Production Host)

The whole-site Pre-Launch QA pass has been executed against an optimized production build of `phoenixvalleyplumber.com`. All 11 major QA categories (Calls & Tracking, Truth & Claims, Contact Form, Crawl & Indexing, Structured Data, Accessibility, Performance, Responsive Visuals, Content Uniqueness, Legal Compliance, and Security) have been rigorously audited with automated headless browser test runners and validated with evidence files.

- **Blocker Defects Found:** 0
- **Critical Accessibility Violations:** 0
- **Serious Accessibility Violations:** 0 (Axe-core scanned 56 page/viewport combinations)
- **Horizontal Overflow Issues:** 0 (Verified across 360px, 390px, 768px, 1024px, 1280px, 1536px)
- **Claims Violations:** 0 (100% compliant with truth gating in `data/site.json`)
- **Single-Form Allowlist:** 100% compliant (Form elements exist strictly on `/contact/`)
- **JSON-LD Schema Errors:** 0 across 115 schemas on 28 representative routes

The **CONDITIONAL** designation is solely dependent on owner business configurations documented in [`reports/needs-owner.md`](file:///d:/Phoenix-Valley-Plumber/reports/needs-owner.md) (e.g. confirming ROC name match on the state portal, inputting production GA4 Measurement ID, and CRM webhook destination). The codebase and built assets are 100% production-ready.

---

## 2. Master QA Check Table

| Check ID | Description | Severity | Result | Evidence File / Artifact | Fix Applied / Owner Action |
|---|---|---|---|---|---|
| **QA-2.1.1** | Phone Link Count Minimums (Home >=5, Emergency >=8, Guides >=6, City >=5) | High | **PASS** | `qa/evidence/calls-tracking-results.json` | 0 shortfalls across 28 representative archetypes. |
| **QA-2.1.2** | Plumber Phone Uniformity (`tel:+16028350102`) | Critical | **PASS** | `qa/evidence/calls-tracking-results.json` | Target `a[data-phone]`; 100% match primary E.164. Utility hotlines (Southwest Gas) isolated. |
| **QA-2.1.3** | Dynamic Number Insertion (DNI) Override | High | **PASS** | `qa/evidence/calls-tracking-results.json` | Verified `window.__PHONE_OVERRIDE__` updates all `a[data-phone]` href and text upon hydration. |
| **QA-2.1.4** | Mobile Sticky Call Bar Visibility & Interaction | Critical | **PASS** | `qa/evidence/calls-tracking-results.json` | Verified sticky bar visible on 390x844 viewport with valid dialer link. |
| **QA-2.1.5** | GA4 / DataLayer Telemetry (`phone_click`) & Zero PII | High | **PASS** | `qa/evidence/calls-tracking-results.json` | Verified click pushes `['event', 'phone_click', { call_location: 'header', ... }]` with zero PII. |
| **QA-2.2.1** | Banned Claims Scan (24/7, Same-Day, Free Estimates, Upfront Pricing) | Critical | **PASS** | `qa/evidence/claims-compliance-results.json` | Removed unearned "same-day" phrase from `app/terms/page.tsx`. Zero violations remaining. |
| **QA-2.2.2** | Superlative & Fabricated Experience Filter ("best", "#1", "family-owned") | High | **PASS** | `qa/evidence/claims-compliance-results.json` | 0 occurrences across 119 crawled HTML pages. |
| **QA-2.2.3** | Zero Fabricated Social Proof (No fake stars, reviews, aggregateRating) | Critical | **PASS** | `qa/evidence/claims-compliance-results.json` | Zero star glyphs (`★`), zero unearned `aggregateRating` or `Review` schemas. |
| **QA-2.2.4** | ROC Name & Number (#348219) Prominence Outside Footer | High | **PASS** | `qa/evidence/claims-compliance-results.json` | Confirmed visible in Homepage Hero eyebrow, UtilityBar, About, and Contact. |
| **QA-2.2.5** | Operating Model Disclosure (Partner / Dispatch Platform) | High | **PASS** | `qa/evidence/claims-compliance-results.json` | Confirmed disclosed in UtilityBar, About, Contact, Terms, and Privacy. |
| **QA-2.3.1** | Strict Single-Form Allowlist (Form elements ONLY on `/contact/`) | Critical | **PASS** | `qa/evidence/contact-form-results.json` | 115 crawled pages verified; `<form>` strictly confined to `/contact/`. |
| **QA-2.3.2** | Contact Form Required Field Validation | High | **PASS** | `qa/evidence/contact-form-results.json` | HTML5/Aria validation prevents empty submission. |
| **QA-2.3.3** | Invalid Phone Number Rejection | High | **PASS** | `qa/evidence/contact-form-results.json` | Rejects malformed strings (`123`); requires valid 10-digit US phone format. |
| **QA-2.3.4** | Honeypot Silent Trap (`hp_company`) | High | **PASS** | `qa/evidence/contact-form-results.json` | Returns HTTP 200 with success=true without processing or notifying spammer. |
| **QA-2.3.5** | Speed Trap (< 3000ms submission rejection) | High | **PASS** | `qa/evidence/contact-form-results.json` | Returns HTTP 400 rejection for automated rapid submissions under 3 seconds. |
| **QA-2.3.6** | Rate Limiting (5 requests / hour threshold) | High | **PASS** | `qa/evidence/contact-form-results.json` | Triggers HTTP 429 Too Many Requests on attempt 6. |
| **QA-2.3.7** | Valid Lead Submission & Privacy Protection | High | **PASS** | `qa/evidence/contact-form-results.json` | Returns HTTP 200; masks IP octet (`xxx.xxx.xxx.xxx` -> `xxx.xxx.xxx.xxx` or local). |
| **QA-2.4.1** | Crawl Hygiene & HTTP Status Codes | Critical | **PASS** | `qa/evidence/crawl-results.json` | 115 internal pages crawled; 0 500 errors, 0 broken internal links. |
| **QA-2.4.2** | Title Tag Length & Suffixing (<= 60 chars) | High | **PASS** | `qa/evidence/crawl-results.json` | Removed redundant `| Brand` suffixes from blog, category, editorial, and FAQ pages. |
| **QA-2.4.3** | Meta Description Presence & Length (<= 160 chars) | Medium | **PASS** | `qa/evidence/crawl-results.json` | 100% of indexable pages have unique, concise meta descriptions. |
| **QA-2.4.4** | Single H1 Tag per Page | High | **PASS** | `qa/evidence/crawl-results.json` | Exactly 1 H1 element per page across all archetypes. |
| **QA-2.4.5** | Self-Referencing Canonical URLs | High | **PASS** | `qa/evidence/crawl-results.json` | All pages contain matching self-referencing canonicals with trailing slashes. |
| **QA-2.4.6** | Gated Routes Return 404 (`/reviews/`, `/our-work/`, `/financing/`) | High | **PASS** | `qa/evidence/crawl-results.json` | Confirmed 404 response on gated pages lacking threshold real data. |
| **QA-2.4.7** | Robots.txt & Sitemap.xml Alignment | High | **PASS** | `qa/evidence/robots.txt`, `qa/evidence/sitemap.xml` | Robots allows crawl, disallows `/api/` and `/contact/thank-you/`, points to sitemap. |
| **QA-2.5.1** | Schema.org Syntax & @context Validation | High | **PASS** | `qa/evidence/structured-data-results.json` | 115 JSON-LD schemas validated across 28 representative routes; 0 syntax errors. |
| **QA-2.5.2** | BreadcrumbList Hierarchy & ItemListElement | Medium | **PASS** | `qa/evidence/structured-data-results.json` | Sequential position integers, valid URLs, and accurate names. |
| **QA-2.5.3** | LocalBusiness / Plumber Schema Entity Completeness | High | **PASS** | `qa/evidence/structured-data-results.json` | Required `name`, `telephone`, `address`, `areaServed` populated. Zero fake reviews. |
| **QA-2.5.4** | Article / BlogPosting Schema | Medium | **PASS** | `qa/evidence/structured-data-results.json` | Real authors, publication dates, and valid headline entities. |
| **QA-2.5.5** | FAQPage Schema Q&A Match | Medium | **PASS** | `qa/evidence/structured-data-results.json` | Valid Question/Answer entities matching on-page accordion text. |
| **QA-2.6.1** | Axe-Core Accessibility Critical Violations | Critical | **PASS** | `qa/evidence/a11y-axe-results.json` | 0 critical violations across 56 desktop and mobile scans. |
| **QA-2.6.2** | Axe-Core Accessibility Serious Violations | High | **PASS** | `qa/evidence/a11y-axe-results.json` | 0 serious violations. Resolved nested SVG interactive links, label mismatch, and contrast. |
| **QA-2.6.3** | WCAG 2.5.3 Label in Name Compliance | High | **PASS** | `qa/evidence/a11y-axe-results.json` | Phone CTA `ariaLabel` updated to include visible phone string `(602) 835-0102`. Heading anchors wrapped cleanly. |
| **QA-2.6.4** | WCAG 2.2 AA Color Contrast (>= 4.5:1 normal, >= 3.0:1 large) | High | **PASS** | `qa/evidence/a11y-axe-results.json` | Replaced white-on-orange badges with navy `#0B2A4A` (8.5:1) and updated dark card links. |
| **QA-2.6.5** | Keyboard Tab Order & Skip-to-Content Link | High | **PASS** | `qa/evidence/a11y-axe-results.json` | Pressing Tab targets `#main-content` skip link. Focus rings visible. |
| **QA-2.7.1** | DOM Element Complexity (< 1,200 nodes) | Medium | **PASS** | `qa/evidence/performance-cwv-results.json` | 0 pages exceed 1,200 DOM nodes. Lean server-rendered HTML. |
| **QA-2.7.2** | Image Optimization & Attributes | High | **PASS** | `qa/evidence/performance-cwv-results.json` | 100% of images have explicit alt text, width/height dimensions, and WebP/AVIF formats. |
| **QA-2.7.3** | Prerendered HTML Footprint | Medium | **PASS** | `qa/evidence/performance-cwv-results.json` | Average HTML payload is 175 KB across all pages. |
| **QA-2.8.1** | Horizontal Viewport Overflow (`scrollWidth <= clientWidth`) | Critical | **PASS** | `qa/evidence/visual-responsive-results.json` | 0 overflow issues across all 6 target breakpoints (360px, 390px, 768px, 1024px, 1280px, 1536px). |
| **QA-2.8.2** | Multi-Viewport Visual Screenshots | High | **PASS** | `qa/evidence/screens/` (36 files) | Captured above-the-fold visual renderings for Home, Emergency, City, Cost Guide, Contact, 404. |
| **QA-2.9.1** | 8-Word Shingle Content Uniqueness (< 15% overlap) | High | **PASS** | `qa/evidence/content-uniqueness-results.json` | All city and service pages exhibit < 15% overlap. Unique localized data and advice. |
| **QA-2.9.2** | Keyword Cannibalization Prevention | High | **PASS** | `qa/evidence/content-uniqueness-results.json` | 0 duplicate primary keyword targets across 77 indexed routes. Hub vs spoke separation maintained. |
| **QA-2.10.1** | Arizona Jurisdiction Legal Compliance | Medium | **PASS** | `app/terms/page.tsx`, `app/privacy-policy/page.tsx` | Maricopa County governing jurisdiction and clear contractor relationship defined. |
| **QA-2.10.2** | TCPA Phone & SMS Disclosure | High | **PASS** | `app/contact/page.tsx`, `app/api/contact/route.ts` | Explicit homeowner consent recorded with timestamp and terms before form submission. |
| **QA-2.11.1** | Content Security Policy (CSP) & Frame Ancestors | High | **PASS** | Production HTTP Header Inspection | `frame-ancestors 'none'`, `default-src 'self'`, strict script/style allowances. |
| **QA-2.11.2** | Security Headers (nosniff, strict-origin, HSTS) | High | **PASS** | Production HTTP Header Inspection | `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, HSTS 2-year preload. |
| **QA-2.11.3** | Framework Fingerprinting Protection | Medium | **PASS** | `next.config.ts` | `poweredByHeader: false` configured; `X-Powered-By` header stripped. |

---

## 3. Evidence Index

All audit artifacts and outputs are permanently saved in the codebase repository:
- Route Inventory: [`qa/evidence/routes.json`](file:///d:/Phoenix-Valley-Plumber/qa/evidence/routes.json)
- Sample Test Archetypes: [`qa/evidence/sample-urls.json`](file:///d:/Phoenix-Valley-Plumber/qa/evidence/sample-urls.json)
- Technical SEO & Crawl: [`qa/evidence/crawl-results.json`](file:///d:/Phoenix-Valley-Plumber/qa/evidence/crawl-results.json)
- Live Robots.txt: [`qa/evidence/robots.txt`](file:///d:/Phoenix-Valley-Plumber/qa/evidence/robots.txt)
- Live Sitemap.xml: [`qa/evidence/sitemap.xml`](file:///d:/Phoenix-Valley-Plumber/qa/evidence/sitemap.xml)
- Calls & DNI Audit: [`qa/evidence/calls-tracking-results.json`](file:///d:/Phoenix-Valley-Plumber/qa/evidence/calls-tracking-results.json)
- Contact Form Security: [`qa/evidence/contact-form-results.json`](file:///d:/Phoenix-Valley-Plumber/qa/evidence/contact-form-results.json)
- Truth & Claims Compliance: [`qa/evidence/claims-compliance-results.json`](file:///d:/Phoenix-Valley-Plumber/qa/evidence/claims-compliance-results.json)
- Structured Data (JSON-LD): [`qa/evidence/structured-data-results.json`](file:///d:/Phoenix-Valley-Plumber/qa/evidence/structured-data-results.json)
- Axe-Core Accessibility: [`qa/evidence/a11y-axe-results.json`](file:///d:/Phoenix-Valley-Plumber/qa/evidence/a11y-axe-results.json)
- Responsive Overflow: [`qa/evidence/visual-responsive-results.json`](file:///d:/Phoenix-Valley-Plumber/qa/evidence/visual-responsive-results.json)
- Responsive Screenshots: [`qa/evidence/screens/`](file:///d:/Phoenix-Valley-Plumber/qa/evidence/screens/) (36 screenshot PNGs)
- Content Uniqueness: [`qa/evidence/content-uniqueness-results.json`](file:///d:/Phoenix-Valley-Plumber/qa/evidence/content-uniqueness-results.json)
- Performance & DOM Complexity: [`qa/evidence/performance-cwv-results.json`](file:///d:/Phoenix-Valley-Plumber/qa/evidence/performance-cwv-results.json)

---

## 4. Next Actions for Launch

1. Review [`reports/needs-owner.md`](file:///d:/Phoenix-Valley-Plumber/reports/needs-owner.md) to provide final owner confirmation for license and GA4 IDs.
2. Execute the deployment sequence detailed in [`reports/launch-day-checklist.md`](file:///d:/Phoenix-Valley-Plumber/reports/launch-day-checklist.md).
3. Activate real-time call and indexing telemetry following [`reports/post-launch-monitoring.md`](file:///d:/Phoenix-Valley-Plumber/reports/post-launch-monitoring.md).
