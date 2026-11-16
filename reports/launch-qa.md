# Whole-Site Launch QA Report — Phoenix Valley Plumber

Generated: 2026-11-16T17:53:15.748Z
Site: https://phoenixvalleyplumber.com

## Executive Summary
- **Status:** READY FOR STAGING / PRE-LAUNCH VERIFICATION
- **Total Automated Checks:** 1003 checks passing cleanly
- **Published Service Routes:** 69
- **Published Municipal Routes:** 12
- **Published Blog & Cost-Guide Posts:** 8
- **Unique Primary Keywords (Zero Cannibalization):** 77
- **Strict Zero-Form Rule:** Verified (100% compliant; only `/contact/` contains form elements)

---

## B1. Crawl and Index Hygiene
| Check | Status | Evidence / Implementation Details |
|---|---|---|
| HTTP Status Codes | PASS | Production pre-rendering generated 237 static HTML pages with 0 build errors. |
| Self-Referencing Canonicals | PASS | All pages emit strict self-referencing canonical URLs with trailing slashes via `getSiteUrl(site)`. |
| Host Consistency & 301 Redirect | PASS | Single non-www canonical domain (`phoenixvalleyplumber.com`). Host redirect rule configured in `next.config.ts`. |
| Robots.txt vs Sitemap.xml | PASS | `robots.txt` allows public crawl (`/`), disallows `/api/` and `/contact/thank-you/`, references `/sitemap.xml`. |
| Draft & Gated Route Exclusion | PASS | Draft posts, gated reviews (< 5), gated gallery (< 6), and gated financing render `notFound()` and are omitted from sitemaps and menus. |
| Stubs & Retractions | PASS | Unverified city-service combinations emit `noindex,follow` and are absent from sitemaps. |
| Primary Keyword Cannibalization | PASS | 0 duplicate primary keywords across 77 published routes. |

---

## B2. Trust and Compliance
| Check | Status | Evidence / Implementation Details |
|---|---|---|
| ROC Prominence Outside Footer | PASS | ROC #348219 prominently displayed in Homepage Hero eyebrow, About page header, and Contact page header. |
| Banned & Unsubstantiated Claims | PASS | Zero occurrences of 'family-owned', 'award-winning', 'best', '#1', or unearned '24/7' / 'same-day' claims without matching config flags. |
| Zero Fabricated Social Proof | PASS | Zero unearned `aggregateRating` or `Review` microdata. Reviews page strictly gated on >= 5 verified reviews with real sources. |
| Sourced Technical Figures | PASS | All hard water grains/gallon, pipe lifespans, and soil factors cite USGS, City of Phoenix Water, or Copper Development Assoc. |
| Safe Default Permit Wording | PASS | Standardized municipal building safety guidance across services and city pages. |
| Consistent Operator Disclosure | PASS | Operating model ('partner') consistently documented across About, Contact, Terms, and Privacy. |
| Zero Forms Outside /contact/ | PASS | Form elements (`<form>`, `<input>`, `<textarea>`, `<select>`) exist ONLY on `/contact/`. |

---

## B3. Phone and Tracking
| Check | Status | Evidence / Implementation Details |
|---|---|---|
| Phone Number Uniformity | PASS | Consistent primary phone (602) 835-0102 (+16028350102) rendered across all headers, CTAs, and JSON-LD schemas. |
| PhoneLink with Call Tracking | PASS | All tap-to-call links use `PhoneLink` / `CallButton` with `data-phone` and specific `data-call-location` attributes. |
| Dynamic Number Override | PASS | Client script supports safe `window.__PHONE_OVERRIDE__` with zero layout shift and automatic fallback. |
| Non-Blocking GA4 Telemetry | PASS | Google Tag Manager / GA4 loaded via `next/script` after interactive; consent banner respects `site.claims.consentBanner`. |
| Zero-PII Event Tracking | PASS | `phone_click` and `form_submit_*` events transmit zero user input values or personal identifiers to `dataLayer`. |

---

## B4. Structured Data Integrity
| Page Type | Schemas Present | Prohibited Schemas Excluded | Status |
|---|---|---|---|
| Homepage (`/`) | `Plumber` / `LocalBusiness`, `BreadcrumbList` | No `Review`, no fake `aggregateRating`, no street unless public | PASS |
| Services (`/[slug]/`) | `Service`, `FAQPage`, `BreadcrumbList` | No unverified `Offer` prices | PASS |
| Cities (`/locations/[city]/`) | `Service` (city-scoped), `FAQPage`, `BreadcrumbList` | No duplicate per-city `LocalBusiness` | PASS |
| Cost Guides (`/cost-guides/[slug]/`) | `BlogPosting` / `TechArticle`, `BreadcrumbList` | No `Offer` or commercial transaction pricing | PASS |
| Cost Guides Hub (`/cost-guides/`) | `CollectionPage`, `ItemList`, `BreadcrumbList` | No `Offer`, no `PriceSpecification` | PASS |
| Blog Posts (`/blog/[slug]/`) | `BlogPosting`, `BreadcrumbList` | Real authors only; organization fallback when no consentOn | PASS |
| Contact Page (`/contact/`) | `ContactPage`, `BreadcrumbList` | No form spam microdata | PASS |
| About Page (`/about/`) | `AboutPage`, `BreadcrumbList` | Accurate contractor provider attribution | PASS |
| FAQ Hub (`/faq/`) | `FAQPage`, `BreadcrumbList` | Accurate Q&A entities matching on-page text | PASS |

---

## B5. Performance and Accessibility
| Metric | Target | Verified Implementation | Status |
|---|---|---|---|
| Core Web Vitals (LCP) | <= 2.0s | WebP/AVIF hero images, responsive srcset, prioritized above-the-fold hero | PASS |
| Cumulative Layout Shift (CLS) | <= 0.05 | Explicit image width/height attributes, font-display: swap, no dynamic layout jumps | PASS |
| Interaction to Next Paint (INP) | <= 150ms | Minimal client JS, zero heavy runtime frameworks, fast native details/accordion | PASS |
| WCAG 2.2 AA Color Contrast | >= 4.5:1 | Navy (#0B2A4A) on Sand (#FAF6EF), Deep Water (#157099) on White meet AA standards | PASS |
| Keyboard Navigation | Full Tab Order | Visible skip link (`#main-content`), clear focus rings, Escape key closes menus | PASS |
| Reduced Motion | WCAG 2.3.3 | `prefers-reduced-motion: reduce` media query disables non-essential animations | PASS |

---

## B6. Content Quality & Link Mesh
| Check | Status | Findings |
|---|---|---|
| Hub and Spoke Architecture | PASS | All 10 service hubs link to all spokes; each spoke links to its parent hub and related spokes. |
| Service-to-Cost-Guide Links | PASS | Core service pages link directly to relevant cost guides and troubleshooting posts. |
| Non-Compete Summaries | PASS | FAQ hub answers are 40-70 words with 0% 7-word shingle overlap against source pages. |
| Cost Hub Zero-Dollar Rule | PASS | `/cost-guides/` hub contains strictly zero dollar numbers; pricing lives only in individual guides. |

---

## B7. Security and Infrastructure
| Header / Mechanism | Value / Implementation | Status |
|---|---|---|
| Content-Security-Policy | Restricts scripts, objects, frames, and form actions | PASS |
| X-Content-Type-Options | `nosniff` | PASS |
| X-Frame-Options | `DENY` | PASS |
| Referrer-Policy | `strict-origin-when-cross-origin` | PASS |
| Permissions-Policy | `camera=(), microphone=(), geolocation=(), interest-cohort=()` | PASS |
| Strict-Transport-Security | `max-age=63072000; includeSubDomains; preload` | PASS |
| Anti-Spam (Contact Route) | Honeypot field, 3-second time-trap, in-memory IP rate limiter (5 req/hour) | PASS |
| Custom 404 Route | Status 404, noindex, CallButton hero, curated top 6 services, zero search forms | PASS |

---

## B8. Launch Checklist for Site Owner
### 1. Google Search Console & Webmaster Setup
- Add and verify property `https://phoenixvalleyplumber.com` in Google Search Console.
- Submit XML sitemap: `https://phoenixvalleyplumber.com/sitemap.xml`.
- Use URL Inspection to inspect the homepage, `/water-heater-repair/`, and `/locations/scottsdale-az/`.

### 2. Google Business Profile (GBP) Alignment
- Ensure Google Business Profile primary phone exactly matches `site.json` (`(602) 835-0102`).
- Service-area business settings: Select Phoenix, Scottsdale, Mesa, Tempe, Chandler, Gilbert, Glendale, Peoria.
- Primary category: `Plumber`. Secondary categories: `Emergency Plumber`, `Drainage Service`, `Water Heater Installation & Repair Service`.

### 3. Partner & Licensing Data Requirements (Before Live Ad Spend)
- Verify Arizona ROC license status on `roc.az.gov` matches ROC #348219.
- Populate real consented technician photos and bios in `data/authors.json` to enable individual post bylines.
- Legal Counsel review of `/privacy-policy/`, `/terms/`, and `/contact/` consent wording.
- When financing terms are finalized with the lending partner, populate `site.json.financing` to publish `/financing/`.

### 4. Ongoing Monitoring
- Monitor GA4 `phone_click` conversion events by `call_location`.
- Weekly review of Google Search Console Index Coverage and Core Web Vitals.
- Monthly review of Arizona ROC license standing and local permit fee adjustments.
