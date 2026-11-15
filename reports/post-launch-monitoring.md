# Post-Launch Monitoring Plan — phoenixvalleyplumber.com

This document establishes the telemetry, search index, and call tracking monitoring routines for the first 30 days after launch.

---

## 1. Day 1 Monitoring (First 24 Hours)

### Operations & Availability
- **Server HTTP Error Rate:** Monitor hosting logs for any HTTP 500 or 502 responses. Target: 0.00%.
- **404 Error Log Audit:** Inspect access logs for unexpected 404s caused by external inbound links, broken assets, or crawler requests.
- **Form Error Monitoring:** Check `/api/contact` logs for rate limiter triggers (HTTP 429) or validation rejections (HTTP 400). Ensure legitimate homeowner inquiries are not being caught by anti-spam time traps.

### Call Tracking Reconciliation
- **Phone Click Count vs. Received Calls:** Compare the count of `phone_click` GA4 events against telephony logs from the primary call center. Typical phone click-to-connected call ratios range from 65% to 85% on mobile devices.
- **DNI Accuracy:** If dynamic number insertion (DNI) is active for paid ad campaigns, test campaign landing pages with `?phone_override=...` to confirm clean number swapping.

---

## 2. Week 1 Monitoring (Days 2 to 7)

### Google Search Console & Indexing Health
- **Coverage Report:** Check GSC Page Indexing status. Confirm that all 102 public indexable URLs are discovered and transitioning to "Indexed".
- **Excluded URLs Verification:** Confirm that gated pages (`/reviews/`, `/our-work/`, `/financing/`), internal API routes (`/api/contact`), and the thank-you confirmation (`/contact/thank-you/`) remain properly excluded or returning 404.
- **Structured Data Enhancements:** Review the Enhancements tab in GSC for `Breadcrumbs`, `FAQ`, and `Articles`. Confirm zero warnings or invalid items.

### Core Web Vitals (Real User Metrics)
- **LCP (Largest Contentful Paint):** Target <= 2.0s on 75th percentile mobile devices.
- **CLS (Cumulative Layout Shift):** Target <= 0.05.
- **INP (Interaction to Next Paint):** Target <= 150ms.
- **Tooling:** Check Chrome User Experience Report (CrUX) and Vercel Analytics Speed Insights.

---

## 3. Month 1 Milestones & Content Gating Review (Day 30)

### Conversion Rate by Call Location
Review GA4 custom event parameters for `phone_click` broken down by `call_location`:
- `header`: Desktop header phone link
- `sticky_bar`: Mobile bottom sticky call bar
- `hero_cta`: Above-the-fold hero button
- `emergency_block`: Emergency safety procedure callout
- `city_service_grid`: Municipal service cards
- `blog_mid_article`: Mid-content call banners

Identify underperforming pages and optimize CTA copy.

### Content Gating Unlocks
- **Customer Reviews Gating:** If the business has accumulated at least 5 verified customer reviews from Google Business Profile or direct feedback, populate `data/reviews.json` and set `site.json` rating flags to publish `/reviews/`.
- **Project Gallery Gating:** If 6 authentic high-resolution Valley plumbing job photos are captured, upload them to `public/img/gallery/` and publish `/our-work/`.
- **Financing Gating:** If a consumer financing lender agreement is executed, set `claims.financing: true` to publish `/financing/`.
