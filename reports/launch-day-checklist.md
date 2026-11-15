# Launch Day Operations Checklist — phoenixvalleyplumber.com

Follow this checklist on the day of production deployment to guarantee zero downtime, verified call routing, and immediate search engine indexing.

---

## Phase 1: Pre-Cutover Verification (T-Minus 2 Hours)

- [ ] **Final Build Verification:** Run production build locally or in CI:
  ```bash
  npm run lint:content
  npx next build
  ```
  Assert 237 static routes compile with 0 TypeScript and 0 lint errors.
- [ ] **Environment Variables:** Verify the following production environment variables are configured in the hosting dashboard (e.g. Vercel):
  - `NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX`
  - `LEAD_WEBHOOK_URL=https://...` (if CRM dispatch is active)
  - `LEAD_WEBHOOK_SECRET=...` (if CRM dispatch is active)
  - `TURNSTILE_SECRET=...` (if Cloudflare Turnstile CAPTCHA is enabled)
- [ ] **Database & CRM Dispatch Test:** Send a test payload to the CRM webhook endpoint to verify the endpoint is listening and authorized.

---

## Phase 2: DNS Cutover & SSL Issuance (T-Minus 0)

- [ ] **Apex Domain DNS (A Record):**
  - Host: `@` (phoenixvalleyplumber.com)
  - Type: `A`
  - Value: `76.76.21.21` (or production host IP)
  - TTL: 300 seconds (5 minutes)
- [ ] **Subdomain DNS (CNAME Record):**
  - Host: `www`
  - Type: `CNAME`
  - Value: `cname.vercel-dns.com` (or production host CNAME)
  - TTL: 300 seconds
- [ ] **SSL Certificate Validation:**
  - Verify HTTPS certificate is issued and valid for both `phoenixvalleyplumber.com` and `www.phoenixvalleyplumber.com`.
- [ ] **Host & Protocol Redirects:**
  - Visit `http://phoenixvalleyplumber.com` -> Assert 301 redirect to `https://phoenixvalleyplumber.com/`
  - Visit `https://www.phoenixvalleyplumber.com/` -> Assert 301 redirect to `https://phoenixvalleyplumber.com/`
  - Visit `http://www.phoenixvalleyplumber.com/` -> Assert 301 redirect to `https://phoenixvalleyplumber.com/`

---

## Phase 3: Critical Path Operational Smoke Test (T-Plus 15 Minutes)

- [ ] **Live Phone Call Test (PRIORITY 1):**
  - Dial `(602) 835-0102` from an external mobile device (iOS and Android).
  - Confirm the call connects immediately to the intended dispatch team.
  - Verify audio quality and business hours greeting.
- [ ] **Mobile Sticky Call Bar:**
  - Open `https://phoenixvalleyplumber.com/` on a smartphone.
  - Verify the bottom sticky call bar is visible, displays `(602) 835-0102`, and triggers the native phone dialer when tapped.
- [ ] **Contact Form Submission:**
  - Navigate to `https://phoenixvalleyplumber.com/contact/`.
  - Fill out and submit a legitimate test inquiry.
  - Confirm redirect to `/contact/thank-you/?success=1`.
  - Confirm the notification email or CRM lead record arrives with customer details and masked IP.
- [ ] **Form Restriction Audit:**
  - Verify that `<form>` exists ONLY on `/contact/` and cannot be found on `/`, `/services/`, or `/locations/phoenix-az/`.
- [ ] **Custom 404 Verification:**
  - Visit `https://phoenixvalleyplumber.com/does-not-exist-test/`.
  - Verify custom branded 404 page renders with quick emergency call button and search navigation links.

---

## Phase 4: Search Engine & Indexing Activation (T-Plus 1 Hour)

- [ ] **Robots.txt Crawl Check:**
  - Visit `https://phoenixvalleyplumber.com/robots.txt`.
  - Confirm `User-agent: *` `Allow: /`, `Disallow: /api/`, `Disallow: /contact/thank-you/`, and `Sitemap: https://phoenixvalleyplumber.com/sitemap.xml`.
- [ ] **Google Search Console (GSC):**
  - Add property `https://phoenixvalleyplumber.com/` in Google Search Console.
  - Verify ownership via DNS TXT record or the existing HTML verification meta tag in `app/layout.tsx`.
  - Submit `https://phoenixvalleyplumber.com/sitemap.xml`.
  - Request indexing on the Homepage (`/`), primary Emergency page (`/emergency-plumber/`), and top city hub (`/locations/phoenix-az/`).
- [ ] **Bing Webmaster Tools:**
  - Import verified property from Google Search Console into Bing Webmaster Tools.
  - Submit sitemap URL.

---

## Phase 5: Telemetry & Analytics Validation (T-Plus 2 Hours)

- [ ] **Google Analytics 4 Realtime View:**
  - Open GA4 Realtime dashboard.
  - Navigate between 3 pages on the site; verify pageviews record in real time.
  - Click a phone link; verify the `phone_click` custom event fires with `call_location` parameter.
  - Confirm zero PII (names, phone numbers, email addresses) appears in GA4 event parameters.
