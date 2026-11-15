import Link from "next/link";
import type { SiteConfig } from "@/lib/config";
import styles from "./PrivacyPolicyContent.module.css";

interface PrivacyPolicyContentProps {
  site: SiteConfig;
}

export function PrivacyPolicyContent({ site }: PrivacyPolicyContentProps) {
  const legalEntity = site.legalEntity || site.marketingOperatorName || site.brand;
  const lastUpdated = site.lastUpdated || "January 15, 2025";

  return (
    <section className={styles.section} aria-labelledby="privacy-policy-heading">
      <div className="container">
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/" className={styles.crumbLink}>
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <span>Privacy Policy</span>
        </nav>

        <article className={styles.card}>
          <header className={styles.header}>
            <p className={styles.eyebrow}>Legal &amp; Privacy</p>
            <h1 id="privacy-policy-heading" className={`t-h1 ${styles.title}`}>
              Privacy Policy
            </h1>
            <div className={styles.metaBox}>
              <div>
                <span className={styles.metaLabel}>Legal Entity</span>
                <strong>{legalEntity}</strong>
              </div>
              <div>
                <span className={styles.metaLabel}>Last Updated</span>
                <strong>{lastUpdated}</strong>
              </div>
              <div>
                <span className={styles.metaLabel}>Website &amp; Brand</span>
                <span>
                  {site.brand} ({site.domain})
                </span>
              </div>
            </div>
          </header>

          <div className={styles.policyBody}>
            <section className={styles.policySection}>
              <h2 className={styles.sectionHeading}>1. Overview &amp; Operating Model</h2>
              <p>
                This Privacy Policy explains how <strong>{legalEntity}</strong> (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;),
                operator of <strong>{site.brand}</strong> (<code>https://{site.domain}</code>), collects,
                uses, and safeguards information when you visit our website, submit a contact request,
                or call the telephone numbers displayed across our site.
              </p>
              {site.operatingModel === "partner" ? (
                <p>
                  <strong>Referral &amp; Partner Model Disclosure:</strong> {site.brand} operates as
                  a marketing and dispatch website. When you call or submit a service request, your
                  contact information is routed directly to our verified, licensed Arizona plumbing
                  contractor, <strong>{site.licensee.legalName}</strong> (ROC #{site.licensee.rocNumber}),
                  to schedule and perform the requested plumbing repairs or estimates.
                </p>
              ) : (
                <p>
                  <strong>Direct Contractor Operations:</strong> Plumbing services advertised on this
                  site are operated and provided directly by <strong>{site.licensee.legalName}</strong> (ROC #{site.licensee.rocNumber}).
                </p>
              )}
            </section>

            <section className={styles.policySection}>
              <h2 className={styles.sectionHeading}>2. Information We Collect</h2>
              <p>We collect only the information necessary to fulfill your plumbing request and maintain website security:</p>
              <ul className={styles.list}>
                <li>
                  <strong>Phone Call Data:</strong> When you call our telephone numbers, our routing
                  systems log standard metadata including caller ID, calling telephone number,
                  call duration, timestamp, and Valley service area code to connect your call to an
                  available plumbing dispatcher.
                  {site.claims.callRecording ? (
                    <span> Calls may be recorded for quality assurance, safety, and training purposes.</span>
                  ) : (
                    <span> Calls are not routinely recorded by this site; dispatchers take written job notes to coordinate arrival.</span>
                  )}
                  {site.claims.callTracking ? (
                    <span> We utilize dynamic campaign call tracking numbers to measure advertising channel effectiveness.</span>
                  ) : null}
                </li>
                <li>
                  <strong>Contact Form Inquiries:</strong> When you submit our online contact form at{" "}
                  <code>/contact/</code>, we collect your name, phone number, ZIP code, service category,
                  brief job notes, and your explicit timestamped consent. We store no sensitive payment
                  information on this site.
                </li>
                <li>
                  <strong>Technical &amp; Log Data:</strong> Like most websites, our web servers log
                  technical data including your IP address, browser type, device information, referring
                  URL, and timestamps. IP addresses are used temporarily by our rate limiters to prevent
                  automated spam and denial-of-service attacks.
                </li>
                <li>
                  <strong>Analytics:</strong> {site.analytics.ga4 ? (
                    <span>We use Google Analytics 4 (GA4) with IP anonymization enabled to analyze aggregate website performance and user engagement.</span>
                  ) : (
                    <span>We maintain privacy-preserving, minimal aggregate analytics without behavioral cross-site user tracking.</span>
                  )}
                </li>
              </ul>
            </section>

            <section className={styles.policySection}>
              <h2 className={styles.sectionHeading}>3. How We Use Information</h2>
              <ul className={styles.list}>
                <li>
                  To connect your telephone call or service request directly with licensed plumbing
                  technicians serving your Phoenix or Valley neighborhood.
                </li>
                <li>
                  To follow up regarding your service appointment, estimate request, or emergency dispatch.
                </li>
                <li>
                  To monitor site performance, prevent malicious automated form abuse, and maintain
                  overall technical security.
                </li>
                <li>
                  To comply with applicable Arizona and federal legal requirements.
                </li>
              </ul>
            </section>

            <section className={styles.policySection}>
              <h2 className={styles.sectionHeading}>4. Information Sharing &amp; Third Parties</h2>
              <ul className={styles.list}>
                <li>
                  <strong>Licensed Plumbing Contractors:</strong> Your contact inquiry (name, phone,
                  address/ZIP, and description of plumbing issue) is shared directly with{" "}
                  <strong>{site.licensee.legalName}</strong> (ROC #{site.licensee.rocNumber}) so their
                  dispatchers and technicians can contact you and perform the requested service.
                </li>
                <li>
                  <strong>Infrastructure &amp; Webhook Service Providers:</strong> {site.claims.leadWebhook ? (
                    <span>Form submissions are transmitted via encrypted webhooks to our secure dispatch software. </span>
                  ) : (
                    <span>Inquiries are securely processed through our encrypted cloud hosting infrastructure. </span>
                  )}
                  Our service providers are bound by confidentiality and security obligations.
                </li>
                <li>
                  <strong>No Sale of Personal Data:</strong> We never sell, rent, or trade your personal
                  data to unrelated marketing companies, advertising brokers, or lead aggregators.
                </li>
              </ul>
            </section>

            <section className={styles.policySection}>
              <h2 className={styles.sectionHeading}>5. Data Retention &amp; Security</h2>
              <p>
                We maintain appropriate administrative, technical, and physical security safeguards to
                protect your personal data. Contact form submissions and call routing records are retained
                only for as long as reasonably required to fulfill plumbing service requests, maintain
                warranty records, and comply with state regulatory and accounting standards.
              </p>
            </section>

            <section className={styles.policySection}>
              <h2 className={styles.sectionHeading}>6. Your Privacy Rights &amp; Choices</h2>
              <p>
                You have the right to request access to the personal information we maintain about you,
                to request corrections of inaccurate data, or to request deletion of your information,
                subject to legal and regulatory record-retention requirements. To submit a privacy request,
                contact us via our{" "}
                <Link href="/contact/" className={styles.inlineLink}>
                  Contact page
                </Link>{" "}
                or call{" "}
                <a href={`tel:${site.phone.e164}`} className={styles.inlineLink}>
                  {site.phone.display}
                </a>
                .
              </p>
            </section>

            <section className={styles.policySection}>
              <h2 className={styles.sectionHeading}>7. Policy Updates &amp; Contact</h2>
              <p>
                We may periodically update this policy to reflect enhancements in our practices or changes
                in legal obligations. The Effective and Last Updated date at the top of this document indicates
                the latest revision. For any questions regarding this Privacy Policy, please contact:
              </p>
              <p>
                <strong>{legalEntity}</strong>
                <br />
                Operating: {site.brand} ({site.domain})
                <br />
                Licensed Contractor: {site.licensee.legalName} (ROC #{site.licensee.rocNumber})
                <br />
                Phone:{" "}
                <a href={`tel:${site.phone.e164}`} className={styles.inlineLink}>
                  {site.phone.display}
                </a>
                {site.contactEmail ? (
                  <>
                    <br />
                    Email: <a href={`mailto:${site.contactEmail}`} className={styles.inlineLink}>{site.contactEmail}</a>
                  </>
                ) : null}
              </p>
            </section>
          </div>
        </article>
      </div>
    </section>
  );
}
