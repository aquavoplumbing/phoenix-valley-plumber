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
- `npm run typecheck` — Run TypeScript compiler check (`tsc --noEmit`).
- `npm run lint` — Run ESLint.
- `npm run build` — Run production SSG build (aborts with a clear error if `data/site.json` has missing or `{{PLACEHOLDER}}` required fields).
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
    "sourceUrl": "https://maps.google.com/..."
  }
]
```
Also update `rating.value` and `rating.count` in `data/site.json` to match.

### Adding & Optimizing Photos (`public/img/`)
Place real, cropped, metadata-stripped photos in `public/img/`:
- `hero-main.jpg` (or `.webp`/`.avif`, `1600x1000`) — replaces the illustrated hero fallback (`HeroIllustration`).
- `water-heater.jpg` (or `.webp`/`.avif`, `1200x900`) — replaces the water heater diagram in Section 5.
Next.js serves AVIF and WebP automatically via `next/image`.

### Plugging In Call-Tracking Dynamic Number Insertion (DNI)
Every phone link uses `<PhoneLink />` with `data-phone` and `data-call-location`. After hydration, `components/ui/CallTracker.tsx` checks `window.__PHONE_OVERRIDE__`:
```js
window.__PHONE_OVERRIDE__ = {
  display: "(602) 555-0144",
  e164: "+16025550144"
};
```
If defined, all `[data-phone]` anchors and `[data-phone-display]` spans update automatically without editing components.

