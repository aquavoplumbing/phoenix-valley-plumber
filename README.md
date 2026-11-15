# phoenixvalleyplumber.com

Call-first, statically prerendered (SSG) Next.js App Router homepage and shared design system for **Phoenix Valley Plumber**, serving Phoenix, AZ and surrounding Valley cities.

## Tech Stack
- **Next.js App Router** (TypeScript `strict: true`, React Server Components by default)
- **CSS Modules + CSS Custom Properties** (`app/globals.css`)
- **Self-hosted Google Fonts** (`Sora` + `Inter` via `next/font/google`)
- **Zod** config validation (`lib/config.ts` & `npm run check`)
- **`sharp`** for AVIF/WebP image optimization

## Scripts
- `npm run dev` — Start local development server (`http://localhost:3000`). Missing config values render visible `TODO` markers instead of crashing.
- `npm run check` — Validate `data/site.json` against strict production requirements.
- `npm run lint:content` — Validate all `/data/services/*.json` files against `lib/service-schema.ts`, word counts, Phoenix/claim/form rules, duplicate content (<15% 7-word overlap), and cannibalization checks; writes `reports/content-lint.md`.
- `npm run typecheck` — Run TypeScript compiler check (`tsc --noEmit`).
- `npm run lint` — Run ESLint.
- `npm run build` — Run `npm run lint:content && next build` (aborts with a clear error if `data/site.json` or any `published` service file fails validation).
- `npm start` — Start the production server after `npm run build`.

## Configuration (`data/site.json`)
All business-specific details live in `data/site.json`. No partner details are hard-coded in components.

Required fields before `npm run build` will succeed:
- `brand`, `domain`
- `licensee.legalName`, `licensee.rocNumber` (must appear in utility bar & trust strip per AZ ROC advertising rules)
- `phone.display`, `phone.e164` (valid E.164 like `+16025550199`)
- `serviceAreas` (non-empty array)

Optional / truth-gated fields:
- `licensee.bonded`, `licensee.insured`
- `hours.is24x7`, `hours.schedule`, `hours.emergencyAfterHours`
- `claims.*` (`sameDayService`, `freeEstimates`, `upfrontPricing`, `warranty`, `yearsInBusiness`, `seniorMilitaryDiscount`, `financing`, `liveAnswer`, `expectationNotice`) — badges/tiles only render when `true` or non-empty
- `address.public` — when `false`, street address is omitted from UI and JSON-LD (service-area business)
- `extraAreas` — optional neighborhood list shown below the Valley map
- `rating.value`, `rating.count`, `rating.source`

### Swapping the Partner Business
1. Update `data/site.json` with the partner's legal name, ROC license number, phone number, hours, and verified claims.
2. Run `npm run check` to verify zero missing or placeholder fields.
3. Set `NEXT_PUBLIC_SITE_URL` and (optionally) `NEXT_PUBLIC_GA4_ID` in `.env.local` or deployment env vars.
4. Run `npm run build`.

### Adding Real Customer Reviews (`data/reviews.json`)
When `data/reviews.json` is `[]`, the Reviews section and `Review`/`AggregateRating` JSON-LD are completely omitted. To enable them, add verified reviews with:
```json
[
  {
    "author": "Maria G.",
    "city": "Phoenix",
    "date": "2026-09-14",
    "rating": 5,
    "text": "Cleared our main drain line quickly and explained everything clearly.",
    "source": "Google",
    "sourceUrl": "https://maps.google.com/...",
    "tags": ["water-heater-repair", "water-heater"]
  }
]
```
Also update `rating.value` and `rating.count` in `data/site.json` to match. Optional `tags` allow service and hub pages to display matching local reviews when populated; when empty, the Reviews section is omitted.

### Adding & Optimizing Photos (`public/img/`)
Place real, cropped, metadata-stripped photos in `public/img/`:
- `hero-main.jpg` (or `.webp`/`.avif`, `1600x1000`) — replaces the illustrated hero fallback (`HeroIllustration`).
- `water-heater.jpg` (or `.webp`/`.avif`, `1200x900`) — replaces the water heater diagram in Section 5.
- Service hero photos (e.g., `/img/water-heater-repair-hero.jpg`) — set `hero.image`, `hero.imageAlt`, and optional `hero.imageCaption` in `/data/services/{slug}.json`. Until a real photo is supplied, the page renders a crisp vector `ServiceHeroIllustration`.
Next.js serves AVIF and WebP automatically via `next/image`.

## Service & Hub Pages (`/data/services/{slug}.json`)
All service and hub pages render through the shared `ServicePageTemplate` (`components/service/ServicePageTemplate.tsx`) at `app/[slug]/page.tsx`, backed by `/data/services/{slug}.json` and validated by `lib/service-schema.ts`.

### Adding a New Service or Hub
1. Ensure the slug and route exist in `data/services.json` (do not rename or move existing URLs).
2. Create `/data/services/{slug}.json` matching `serviceContentSchema` in `lib/service-schema.ts` (`kind: "service"` or `"hub"`). Start with `"status": "draft"` while authoring.
3. Follow all content rules: zero `<form>`/`<input>`/`<textarea>`/`<select>`, no hard-coded business/phone/ROC details, no invented prices/timelines, hedge or cite `sourceUrl` on Phoenix claims, and keep `claimsUsed` aligned with `data/site.json`.
4. Run `npm run lint:content` and review `reports/content-lint.md`.

### Publishing a Draft
1. Verify all `npm run lint:content` checks pass for the slug (`0` errors, `<15%` 7-word overlap with all sibling pages, unique `primaryKeyword`).
2. Change `"status": "draft"` to `"status": "published"` in `/data/services/{slug}.json`.
3. Run `npm run build` — published pages become indexable (`index, follow`) and are automatically included in `app/sitemap.ts`. Draft pages render `noindex, follow` and are excluded from the sitemap.

## Location (City) Pages (`/data/cities/{slug}.json`)
City pages render through `CityPageTemplate` (`components/city/CityPageTemplate.tsx`) at `app/locations/[city]/page.tsx` (`/locations/{city}-az/`), backed by `/data/cities/{slug}.json` and validated by `lib/city-schema.ts`. The central Service Areas Hub lives at `app/locations/page.tsx` (`/locations/`).

### Page-Worthiness Gate
A city page cannot be published merely because a keyword exists. To prevent low-value doorway pages, a city may be `"status": "published"` ONLY if:
1. `coverage` is complete with verified ZIPs, real neighborhoods (8–20), and `sourceUrl` + `retrievedOn`.
2. At least **four** of eight evidence categories are present and sourced: `water`, `housing`, `permits`, `utilities`, `jobs`, city-tagged reviews, `localServices` (≥6 unique angles), and partner-supplied `servedFrom`.
3. At least one of `water` or `housing` is present (official source required).
4. The **City-Swap Test** passes (≤20% 7-word shingle overlap across published peer pages; ≤30% overlap across service angles).
A city that fails any gate requirement remains `"status": "draft"`, is marked `noindex, follow`, is excluded from the sitemap, renders as a plain-text chip on the hub, and is reported in `reports/city-data-gaps.md`.

### Sourcing & Data Gathering Protocol
- **Water Quality & Hardness:** Must come from the municipality's official annual Consumer Confidence Report or water fact sheet. Third-party aggregators (e.g. tapwaterdata) and competitor plumbing blogs are banned. Hardness numbers appear **only** in the structured `water` block, never in free-form prose.
- **Housing Eras:** Must cite U.S. Census Bureau ACS data or municipal historic preservation archives. Eras detail observed plumbing materials (galvanized, copper pitting, polybutylene, PEX).
- **Permit Office:** Must link to municipal development services. Never state whether a permit is required without an official sourced statement (`permits.verifiedNote`).
- **Presence Claims:** Never imply a local office or crew unless `coverage.servedFrom` matches and is partner-verified. Default honest framing: `"Serving {City} and nearby Valley communities."`
- **Phoenix is Homepage:** Per Rule 12, Phoenix links directly to `/`. No competing `/locations/phoenix-az/` page exists.

### Adding a New City
1. Create `/data/cities/{slug}.json` adhering to `cityContentSchema` in `lib/city-schema.ts`.
2. Gather official municipal sources for water, housing, permits, and utilities, recording `sourceUrl` and `retrievedOn`.
3. Author unique, local angles for 6–10 services and 5–8 city-specific FAQs.
4. Set `"status": "draft"` while gathering and auditing data.
5. Run `npm run lint:content`. Check `reports/content-lint.md` and `reports/city-data-gaps.md`.
6. When all gate criteria and shingle overlap tests pass, change `"status": "published"`.

### Adding Real Jobs (`jobs` array in `/data/cities/{slug}.json`)
When the partner supplies real completed job records, add them to `jobs`:
```json
"jobs": [
  {
    "title": "Tankless Water Heater Descaling & Flush",
    "neighborhood": "Gainey Ranch",
    "month": "October 2026",
    "serviceSlug": "tankless-water-heater-repair",
    "summary": "Flushed severe mineral scale from a dual-unit condensing tankless water heater system and replaced calcified isolation valves.",
    "photo": {
      "src": "/img/jobs/gainey-ranch-tankless.jpg",
      "alt": "Plumber descaling a residential tankless water heater in Gainey Ranch",
      "width": 800,
      "height": 600
    }
  }
]
```
If `jobs` is empty or omitted, the section is cleanly hidden.

### Plugging In Call-Tracking Dynamic Number Insertion (DNI)
Every phone link uses `<PhoneLink />` with `data-phone` and `data-call-location`. After hydration, `components/ui/CallTracker.tsx` checks `window.__PHONE_OVERRIDE__`:
```js
window.__PHONE_OVERRIDE__ = {
  display: "(602) 555-0144",
  e164: "+16025550144"
};
```
If defined, all `[data-phone]` anchors and `[data-phone-display]` spans update automatically without editing components.

## Blog & Cost Guide Content System (`/content/blog/` & `/content/cost-guides/`)

The blog and cost-guide system provides high-authority informational content designed to earn links, answer mid-funnel questions, build topical authority, and convert readers directly into phone calls.

### Routes
- `/blog/` — Blog index with category filter pills, reading times, and quick takeaways.
- `/blog/{slug}/` — Informational guides, how-tos, local explainers, and checklists.
- `/cost-guides/` — Cost guide index with transparent regional and partner pricing tables.
- `/cost-guides/{slug}/` — Comprehensive cost breakdowns with scoped pricing tables (`scope: "regional"` or `"partner"`).
- `/blog/category/{category}/` — Category archive pages (`water-heaters`, `drains-and-sewer`, `leaks-and-pipes`, etc.).
- `/blog/author/{slug}/` — Author bio pages for verified real authors.
- `/editorial-policy/` — Transparent editorial standards, AI disclosures, fact-checking rules, and correction policy.
- `/feed.xml` — Live RSS feed of published posts.

### Zero Forms & Call-First Conversions
Blog pages strictly prohibit forms: **zero `<form>`, `<input>`, `<textarea>`, `<select>`, newsletter signups, or popups**. Every conversion touchpoint is a tap-to-call link (`tel:+16028350102`) or an internal link to a relevant commercial service page.

### Strict Authorship & Safety Gating (Rule 11 & Rule 13)
- **No Invented Personas:** Authors and reviewers must be real people who agreed to be named (`data/authors.json` with verified `consentOn`). When no individual author is assigned, bylines automatically default to the organization entity (`Phoenix Valley Plumber`) without personal headshots or bios.
- **Safety Gate:** Any post with `safetyLevel: "high"` (topics involving gas, high voltage, scalding hot water, raw sewage, or structural foundation flooding) **CANNOT be published** without a named licensed Arizona plumbing contractor reviewer (`ROC` license and `consentOn`). Without a reviewer, posts remain safely gated in `"status": "draft"`, are marked `noindex, follow`, and are reported in `reports/blog-gaps.md`.

### Adding a New Post
1. Create `/content/blog/{slug}.mdx` or `/content/cost-guides/{slug}.mdx`.
2. Populate frontmatter conforming to `postSchema` in `lib/post-schema.ts`:
   - `type`: `"guide"` (1400–2200w), `"how-to"` (1000–1800w), `"cost-guide"` (1500–2500w), `"local-explainer"` (1000–1600w), `"checklist"` (800–1400w).
   - `seo`: `primaryKeyword` must appear in slug, title (<=60 chars), h1, metaDescription (<=155 chars), hero alt (<=125 chars), and the first 100 words of the body.
   - `quickAnswer`: 40–60 words answering the primary user intent immediately.
   - `takeaways`: 3–5 bullet points.
   - `faqs`: 3–6 questions with 40–90 word answers. No question may duplicate any H2 or H3 heading.
   - `costData`: required on cost guides with >=3 rows citing verifiable sources and asOf dates.
   - `hero`: hero image with 16:9, 4:3, and 1:1 crops generated on disk.
3. Run `npm run lint:content` to verify all 11 quality gates.
4. Run `npm run build` to verify static pre-rendering.

## Launch Checklist for the Site Owner (B8)

### 1. Google Search Console & Webmaster Setup
- Add and verify property `https://phoenixvalleyplumber.com` in Google Search Console via DNS TXT record or HTML file.
- Submit XML sitemap: `https://phoenixvalleyplumber.com/sitemap.xml`.
- Use the URL Inspection tool to confirm live indexing on the homepage (`/`), a representative service page (`/water-heater-repair/`), and a municipal page (`/locations/scottsdale-az/`).

### 2. Google Business Profile (GBP) Alignment
- Ensure Google Business Profile primary telephone number exactly matches `data/site.json` (`(602) 835-0102`).
- Set up as a Service-Area Business (SAB) with physical address hidden (unless `site.json.address.public` is true).
- Specify Valley coverage: Phoenix, Scottsdale, Mesa, Tempe, Chandler, Gilbert, Glendale, Peoria, Surprise, Goodyear.
- Primary category: `Plumber`. Secondary categories: `Emergency Plumber`, `Drainage Service`, `Water Heater Installation & Repair Service`.

### 3. Partner & Licensing Data Requirements (Before Live Ad Spend)
- **Registrar of Contractors:** Verify active ROC standing for license #348219 at `roc.az.gov`.
- **Real Authorship & Reviewers:** Collect signed consent (`consentOn`) and bios for licensed master plumbers in `data/authors.json` to publish high-safety draft posts (`gas-leak-signs-phoenix`).
- **Real Customer Reviews:** Gather $\ge 5$ genuine customer reviews from Google Business Profile into `site.json.reviews.verified` to unlock `/reviews/`.
- **Real Project Photos:** Collect $\ge 6$ real job photos with customer consent into `site.json.gallery.items` to unlock `/our-work/`.
- **Financing Terms:** When lending agreements are signed with your financial institution, populate `site.json.financing` to unlock `/financing/`.
- **Legal Review:** Have counsel perform final review of `/privacy-policy/`, `/terms/`, and the `/contact/` consent checkbox wording.

### 4. Ongoing Monitoring Protocol
- Monitor GA4 custom conversion events for `phone_click` segmented by `call_location`.
- Weekly review of Google Search Console Index Coverage and Core Web Vitals report.
- Monthly review of Arizona ROC license standing and local municipal building permit fee adjustments.



