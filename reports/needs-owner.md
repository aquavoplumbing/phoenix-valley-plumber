# Pre-Launch QA — Needs Owner Decisions & Real Data

Before `phoenixvalleyplumber.com` is deployed to production, the website owner must review and supply real business data for the items below. In accordance with strict truth-gating rules, all unearned claims and placeholder features remain gated (returning 404 or safe defaults) until verified.

---

## 1. Arizona Registrar of Contractors (ROC) Credentials & Insurance
- **Current Config:** `data/site.json` -> `licensee.rocNumber: "348219"`, `licensee.legalName: "Phoenix Valley Plumber"`, `bonded: false`, `insured: false`
- **Owner Action:**
  1. Confirm that ROC #348219 is active and in good standing on the [Arizona Registrar of Contractors public portal](https://roc.az.gov/).
  2. Verify that the legal business name associated with ROC #348219 matches `"Phoenix Valley Plumber"` exactly.
  3. If the contractor carries active commercial general liability insurance and a surety bond, update `bonded: true` and `insured: true` in `data/site.json`. This will automatically unlock the verified "Licensed, Bonded & Insured" trust chips across all headers, cards, and schemas.

---

## 2. Operating Model Confirmation (Direct vs. Partner)
- **Current Config:** `data/site.json` -> `operatingModel: "partner"`, `marketingOperatorName: "Valley Plumbing Dispatch Network"`
- **Owner Action:**
  - If the website is owned and operated directly by the licensed plumbing contractor, change `operatingModel` to `"direct"`.
  - If the website is operated as a marketing/lead generation network that routes calls to a partner plumbing contractor, keep `operatingModel: "partner"` and ensure `"Valley Plumbing Dispatch Network"` matches the registered LLC or corporate entity responsible for advertising.

---

## 3. Web Telemetry & Analytics IDs
- **Current Config:** `data/site.json` -> `analytics.ga4: ""`; `app/layout.tsx` -> `GTM-M8V457FF`
- **Owner Action:**
  - Supply the official Google Analytics 4 Measurement ID (`G-XXXXXXXXXX`) in `data/site.json` or set `NEXT_PUBLIC_GA4_ID` in production environment variables.
  - Confirm whether Google Tag Manager container `GTM-M8V457FF` is live and configured with client-side phone click and form submission triggers.

---

## 4. Google Business Profile & Social Profiles
- **Current Config:** `data/site.json` -> `social.googleBusinessProfile: ""`, `facebook: ""`, `yelp: ""`
- **Owner Action:**
  - Provide the live Google Business Profile URL (Google Maps listing) once claimed and verified.
  - Adding the GBP link will automatically populate `sameAs` entity links in the homepage `Plumber` schema, reinforcing local map pack authority.

---

## 5. Real Customer Reviews (Gated Route: `/reviews/`)
- **Current Status:** Gated (`notFound()` 404 response; excluded from XML sitemap and navigation).
- **Current Config:** `data/site.json` -> `rating.value: null`, `rating.count: null`
- **Owner Action:**
  - The Reviews page and star ratings in schema are strictly blocked until at least 5 genuine, non-incentivized reviews with real customer first names and Valley municipalities are provided.
  - When real reviews are ready, populate `data/reviews.json` and set `site.json` rating fields to unlock the page. **Never fabricate reviews or star ratings.**

---

## 6. Real Job Site Photography (Gated Route: `/our-work/`)
- **Current Status:** Gated (`notFound()` 404 response; excluded from XML sitemap and navigation).
- **Owner Action:**
  - Supply at least 6 authentic Valley project photographs (e.g. water heater installations, drain hydro-jetting, trenchless sewer lining, slab leak detection equipment on-site).
  - Place WebP/AVIF images in `public/img/gallery/` and populate `data/gallery.json` to publish the route.

---

## 7. Financing Partner Agreement (Gated Route: `/financing/`)
- **Current Status:** Gated (`notFound()` 404 response; excluded from XML sitemap and navigation).
- **Current Config:** `data/site.json` -> `claims.financing: false`
- **Owner Action:**
  - If financing programs are to be offered, finalize terms with an authorized home improvement lender (e.g. Synchrony, Wisetack, GreenSky) and obtain compliant APR disclosure language.
  - Set `claims.financing: true` in `data/site.json` to publish `/financing/`.

---

## 8. Real-Time Lead Dispatch Webhook (CRM Integration)
- **Current Config:** `data/site.json` -> `claims.leadWebhook: false`
- **Owner Action:**
  - To route contact form submissions directly into your plumbing dispatch CRM (e.g. ServiceTitan, Housecall Pro, Jobber, Zapier), set the following production environment variables in your hosting dashboard:
    - `LEAD_WEBHOOK_URL=https://hooks.zapier.com/...`
    - `LEAD_WEBHOOK_SECRET=your_signature_secret_key`
  - Update `claims.leadWebhook: true` in `data/site.json`.

---

## 9. Legal Counsel Sign-Off
- **Affected Routes:** `/privacy-policy/`, `/terms/`, `/accessibility/`
- **Owner Action:**
  - Have an Arizona-licensed attorney review the drafted Terms of Service, Privacy Policy (including telephone number data protection clauses), and TCPA telephone call/SMS consent disclosures before running paid advertising campaigns.
