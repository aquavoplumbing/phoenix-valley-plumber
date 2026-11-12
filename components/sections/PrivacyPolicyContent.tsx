import Link from "next/link";
import type { SiteConfig } from "@/lib/config";
import styles from "./PrivacyPolicyContent.module.css";

interface PrivacyPolicyContentProps {
  site: SiteConfig;
}

const EFFECTIVE_DATE = "November 12, 2026";

export function PrivacyPolicyContent({ site }: PrivacyPolicyContentProps) {
  const ownerDisplay =
    site.ownerName.trim() ||
    "[Owner Full Name Pending — set ownerName in data/site.json]";

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
                <span className={styles.metaLabel}>Website Owner</span>
                <strong>{ownerDisplay}</strong>
              </div>
              <div>
                <span className={styles.metaLabel}>Effective &amp; Last Updated Date</span>
                <strong>{EFFECTIVE_DATE}</strong>
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
              <h2 className={styles.sectionHeading}>1. Overview &amp; Referral Service Disclosure</h2>
              <p>
                This Privacy Policy explains how <strong>{ownerDisplay}</strong>, owner and operator
                of <strong>{site.brand}</strong> (<code>https://{site.domain}</code>), collects,
                uses, and safeguards information when you visit our website or call the phone numbers
                displayed on our pages.
              </p>
              <p>
                {site.brand} operates as an advertising and referral service that connects
                homeowners and property managers in the Phoenix metro area with independent,
                licensed local plumbing service providers. We do not directly perform plumbing
                repairs, installations, or inspections.
              </p>
            </section>

            <section className={styles.policySection}>
              <h2 className={styles.sectionHeading}>2. Information We Collect</h2>
              <p>We may collect the following categories of information:</p>
              <ul className={styles.list}>
                <li>
                  <strong>Call &amp; Routing Information:</strong> When you tap or dial a phone
                  number listed on {site.domain}, call routing systems may log your caller ID,
                  phone number, call timestamp, call duration, and geographic area code so your call
                  can be connected to an available independent plumbing provider.
                </li>
                <li>
                  <strong>Technical &amp; Usage Data:</strong> Our website uses standard web logs
                  and analytics tools (including Google Tag Manager) that may collect your IP
                  address, browser type, device category, referring URL, pages viewed, and click
                  events (such as click-to-call interactions).
                </li>
                <li>
                  <strong>Cookies &amp; Similar Technologies:</strong> Small data files stored by
                  your browser to measure site performance, diagnose technical issues, and
                  understand how visitors navigate service pages.
                </li>
              </ul>
            </section>

            <section className={styles.policySection}>
              <h2 className={styles.sectionHeading}>3. How We Use Information</h2>
              <ul className={styles.list}>
                <li>
                  To connect your telephone inquiry with independent plumbing contractors serving
                  your area in Phoenix and the surrounding Valley.
                </li>
                <li>
                  To operate, maintain, and improve website speed, reliability, and service-page
                  accuracy.
                </li>
                <li>
                  To measure advertising effectiveness, prevent spam or automated abuse, and comply
                  with applicable legal obligations.
                </li>
              </ul>
            </section>

            <section className={styles.policySection}>
              <h2 className={styles.sectionHeading}>4. How Information Is Shared</h2>
              <ul className={styles.list}>
                <li>
                  <strong>Independent Service Providers:</strong> When you place a call through our
                  referral numbers, your call and any details you provide during the conversation are
                  received by the independent plumbing contractor handling your request, subject to
                  that contractor&apos;s own privacy practices.
                </li>
                <li>
                  <strong>Analytics &amp; Infrastructure Vendors:</strong> We rely on hosting,
                  call-routing, and analytics providers (such as Google Tag Manager) that process
                  technical data strictly to deliver and measure the site.
                </li>
                <li>
                  <strong>Legal &amp; Safety Compliance:</strong> We may disclose information if
                  required by law, subpoena, or legal process, or to protect the rights and safety
                  of users and the website owner.
                </li>
              </ul>
              <p>We do not sell your personal information to unrelated third-party data brokers.</p>
            </section>

            <section className={styles.policySection}>
              <h2 className={styles.sectionHeading}>5. Your Privacy Choices &amp; Cookies</h2>
              <p>
                Most web browsers allow you to control or disable cookies through browser settings.
                Disabling cookies may affect certain measurement features, but core informational
                pages on {site.domain} remain accessible. Depending on your jurisdiction, you may
                request access to, correction of, or deletion of personal data collected directly by
                us by contacting us through our{" "}
                <Link href="/contact/" className={styles.inlineLink}>
                  Contact page
                </Link>
                .
              </p>
            </section>

            <section className={styles.policySection}>
              <h2 className={styles.sectionHeading}>6. Data Security &amp; Retention</h2>
              <p>
                We apply reasonable administrative and technical safeguards to protect site logs and
                call-routing metadata against unauthorized access. Technical analytics and call logs
                are retained only for as long as needed for referral fulfillment, billing
                verification, and legal compliance.
              </p>
            </section>

            <section className={styles.policySection}>
              <h2 className={styles.sectionHeading}>7. Children&apos;s Privacy</h2>
              <p>
                This website is intended for adult homeowners and property managers and is not
                directed to children under the age of 13. We do not knowingly collect personal
                information from children.
              </p>
            </section>

            <section className={styles.policySection}>
              <h2 className={styles.sectionHeading}>8. Updates to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time to reflect operational or legal
                changes. Any updates will be posted on this page with an updated Effective Date.
              </p>
            </section>

            <section className={styles.policySection}>
              <h2 className={styles.sectionHeading}>9. Contact &amp; Ownership Information</h2>
              <p>
                Questions regarding this Privacy Policy or ownership of {site.domain} may be
                directed to <strong>{ownerDisplay}</strong> via our{" "}
                <Link href="/contact/" className={styles.inlineLink}>
                  Contact page
                </Link>{" "}
                or by calling{" "}
                <a href={`tel:${site.phone.e164}`} className={styles.inlineLink}>
                  {site.phone.display}
                </a>
                .
              </p>
            </section>
          </div>
        </article>
      </div>
    </section>
  );
}

