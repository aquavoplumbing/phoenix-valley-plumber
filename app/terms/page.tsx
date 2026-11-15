import type { Metadata } from "next";
import Link from "next/link";
import { getSiteConfigResult } from "@/lib/config";
import { getSiteUrl } from "@/lib/routes";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbSchema } from "@/lib/schema";
import styles from "./Terms.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const { config: site } = getSiteConfigResult();
  const siteUrl = getSiteUrl(site);
  const title = `Terms of Service | ${site.brand}`;
  const description =
    "Terms of Service governing the use of phoenixvalleyplumber.com, referral service terms, and Arizona contractor licensing disclosures.";

  return {
    title: {
      absolute: title,
    },
    description,
    alternates: {
      canonical: `${siteUrl}/terms/`,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/terms/`,
      type: "website",
      siteName: site.brand,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function TermsPage() {
  const { config: site } = getSiteConfigResult();
  const siteUrl = getSiteUrl(site);
  const legalEntity = site.legalEntity || site.marketingOperatorName || site.brand;
  const lastUpdated = site.lastUpdated || "January 15, 2025";

  const breadcrumbs = [
    { name: "Home", url: `${siteUrl}/` },
    { name: "Terms of Service", url: `${siteUrl}/terms/` },
  ];

  const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbs);

  return (
    <section className={styles.section} aria-labelledby="terms-heading">
      <JsonLd data={breadcrumbSchema} />

      <div className="container">
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/" className={styles.crumbLink}>
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <span>Terms of Service</span>
        </nav>

        <article className={styles.card}>
          <header>
            <p className={styles.eyebrow}>Legal Agreement</p>
            <h1 id="terms-heading" className={styles.title}>
              Terms of Service
            </h1>
            <div className={styles.metaBox}>
              <div>
                <span className={styles.metaLabel}>Operator</span>
                <strong>{legalEntity}</strong>
              </div>
              <div>
                <span className={styles.metaLabel}>Last Updated</span>
                <strong>{lastUpdated}</strong>
              </div>
              <div>
                <span className={styles.metaLabel}>Governing Jurisdiction</span>
                <strong>State of Arizona (Maricopa Co.)</strong>
              </div>
            </div>
          </header>

          <div className={styles.policyBody}>
            <section className={styles.policySection}>
              <h2 className={styles.sectionHeading}>1. Acceptance of Terms</h2>
              <p>
                By accessing, browsing, or utilizing the services provided on <strong>{site.brand}</strong>{" "}
                (<code>https://{site.domain}</code>), or by placing a telephone call to numbers displayed on this
                website, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not
                agree with these terms, you should immediately cease use of this website.
              </p>
            </section>

            <section className={styles.policySection}>
              <h2 className={styles.sectionHeading}>2. Service Model &amp; Contractor Relationship</h2>
              {site.operatingModel === "partner" ? (
                <>
                  <p>
                    <strong>Marketing &amp; Dispatch Referral Service:</strong> {site.brand} and {legalEntity}{" "}
                    operate as a marketing and dispatch connection platform. We do not hold a direct contractor
                    license in our corporate marketing entity. Physical plumbing diagnosis, repairs, replacements,
                    and installations are performed independently by licensed Arizona plumbing contractor{" "}
                    <strong>{site.licensee.legalName}</strong> (Arizona Registrar of Contractors ROC #{site.licensee.rocNumber}).
                  </p>
                  <p>
                    When you call our telephone numbers or submit a service inquiry, you are connected with{" "}
                    {site.licensee.legalName}. Any service contract, warranty commitment, or financial transaction
                    is entered into directly between you (the consumer) and the licensed plumbing contractor.
                  </p>
                </>
              ) : (
                <p>
                  Plumbing services advertised on this website are directly performed by{" "}
                  <strong>{site.licensee.legalName}</strong> (ROC #{site.licensee.rocNumber}).
                </p>
              )}
            </section>

            <section className={styles.policySection}>
              <h2 className={styles.sectionHeading}>3. Informational Content &amp; Pricing Disclaimers</h2>
              <p>
                The articles, maintenance tips, troubleshooting guides, and cost ranges published on {site.domain}{" "}
                are provided strictly for general informational and educational purposes. Plumbing configurations,
                building codes, and local utility regulations vary widely across Maricopa County.
              </p>
              <ul className={styles.list}>
                <li>
                  Content published on this website does not constitute official engineering advice or an on-site
                  architectural evaluation.
                </li>
                <li>
                  Estimates, cost ranges, or pricing figures mentioned on blog posts or cost guides are ballpark
                  historical figures and do not constitute a formal binding quotation until a licensed technician
                  personally inspects your plumbing system.
                </li>
                <li>
                  Technician arrival windows and emergency dispatch are subject to technician availability,
                  geographical weather conditions, and active Valley call volumes.
                </li>
              </ul>
            </section>

            <section className={styles.policySection}>
              <h2 className={styles.sectionHeading}>4. User Responsibilities &amp; Permitted Use</h2>
              <p>When using this website or requesting plumbing service, you agree to:</p>
              <ul className={styles.list}>
                <li>Provide accurate, truthful contact information and property details.</li>
                <li>Refrain from using automated bots, crawlers, or scrapers to harvest telephone numbers or submit spam form data.</li>
                <li>Ensure that an authorized adult (18 years or older) is present at the service location during scheduled technician appointments.</li>
              </ul>
            </section>

            <section className={styles.policySection}>
              <h2 className={styles.sectionHeading}>5. Limitation of Liability</h2>
              <p>
                To the fullest extent permitted under applicable law, {legalEntity}, its officers, and affiliates
                shall not be liable for any indirect, incidental, consequential, or punitive damages arising out of
                your use of this website, delayed technician response times resulting from unforeseen traffic or emergency
                surges, or service interactions between you and independent contractors.
              </p>
            </section>

            <section className={styles.policySection}>
              <h2 className={styles.sectionHeading}>6. Governing Law &amp; Dispute Resolution</h2>
              <p>
                These Terms of Service are governed by and construed in accordance with the laws of the State of
                Arizona, without regard to conflict of law principles. Any legal proceeding or dispute arising out of
                or relating to this agreement shall be brought exclusively in the state or federal courts located in
                Maricopa County, Arizona.
              </p>
            </section>

            <section className={styles.policySection}>
              <h2 className={styles.sectionHeading}>7. Modifications to Terms</h2>
              <p>
                We reserve the right to revise or update these Terms of Service at any time without prior individual
                notice. Any changes will become effective immediately upon posting to this URL.
              </p>
            </section>

            <section className={styles.policySection}>
              <h2 className={styles.sectionHeading}>8. Contact Information</h2>
              <p>
                For questions regarding these Terms of Service or contractor verification disclosures, please contact:
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
              </p>
            </section>
          </div>
        </article>
      </div>
    </section>
  );
}
