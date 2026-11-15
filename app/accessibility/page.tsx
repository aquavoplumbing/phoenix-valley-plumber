import type { Metadata } from "next";
import Link from "next/link";
import { getSiteConfigResult } from "@/lib/config";
import { getSiteUrl } from "@/lib/routes";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbSchema } from "@/lib/schema";
import styles from "./Accessibility.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const { config: site } = getSiteConfigResult();
  const siteUrl = getSiteUrl(site);
  const title = `Accessibility Statement | ${site.brand}`;
  const description =
    "Our commitment to digital accessibility, WCAG 2.2 AA standards, keyboard navigation, and telephone accommodations for Phoenix valley homeowners.";

  return {
    title: {
      absolute: title,
    },
    description,
    alternates: {
      canonical: `${siteUrl}/accessibility/`,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/accessibility/`,
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

export default function AccessibilityPage() {
  const { config: site } = getSiteConfigResult();
  const siteUrl = getSiteUrl(site);
  const lastUpdated = site.lastUpdated || "January 15, 2025";
  const tty = site.tty || "711 (Arizona Relay Service)";

  const breadcrumbs = [
    { name: "Home", url: `${siteUrl}/` },
    { name: "Accessibility Statement", url: `${siteUrl}/accessibility/` },
  ];

  const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbs);

  return (
    <section className={styles.section} aria-labelledby="accessibility-heading">
      <JsonLd data={breadcrumbSchema} />

      <div className="container">
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/" className={styles.crumbLink}>
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <span>Accessibility Statement</span>
        </nav>

        <article className={styles.card}>
          <header>
            <p className={styles.eyebrow}>Inclusivity &amp; Access</p>
            <h1 id="accessibility-heading" className={styles.title}>
              Accessibility Statement
            </h1>
            <div className={styles.metaBox}>
              <div>
                <span className={styles.metaLabel}>Target Standard</span>
                <strong>WCAG 2.2 Level AA</strong>
              </div>
              <div>
                <span className={styles.metaLabel}>Last Evaluated</span>
                <strong>{lastUpdated}</strong>
              </div>
              <div>
                <span className={styles.metaLabel}>Phone Accommodations</span>
                <strong>Direct &amp; Relay Support</strong>
              </div>
            </div>
          </header>

          <div className={styles.policyBody}>
            <section className={styles.policySection}>
              <h2 className={styles.sectionHeading}>1. Our Commitment to Digital Accessibility</h2>
              <p>
                <strong>{site.brand}</strong> is committed to ensuring that our digital resources,
                emergency guides, and plumbing dispatch services are accessible to all visitors,
                including individuals with visual, auditory, motor, or cognitive disabilities.
              </p>
              <p>
                We strive to conform with the Web Content Accessibility Guidelines (WCAG) 2.2 at Level AA.
                These international guidelines explain how to make web content more usable for people
                relying on assistive technologies such as screen readers, voice dictation, and keyboard-only
                navigation.
              </p>
            </section>

            <section className={styles.policySection}>
              <h2 className={styles.sectionHeading}>2. Technical Accessibility Measures Implemented</h2>
              <p>
                We have engineered this website with accessibility as a foundational requirement:
              </p>
              <ul className={styles.list}>
                <li>
                  <strong>Semantic HTML Structure:</strong> Logical heading hierarchies (H1 through H3),
                  meaningful landmark regions (<code>header</code>, <code>nav</code>, <code>main</code>,{" "}
                  <code>footer</code>), and descriptive button labels.
                </li>
                <li>
                  <strong>Keyboard Navigability:</strong> All interactive elements, including tap-to-call
                  buttons and city links, can be operated using a keyboard with clear visual focus indicators.
                  A visible &quot;Skip to main content&quot; link is provided at the very top of each page.
                </li>
                <li>
                  <strong>Color Contrast &amp; Typography:</strong> Text colors meet or exceed WCAG 2.2 AA
                  contrast ratios (minimum 4.5:1 for standard body text and 3:1 for large display headings).
                  High-contrast deep navy, white, and warning call-to-action badges are utilized consistently.
                </li>
                <li>
                  <strong>Reduced Motion Safe:</strong> All layout animations and transitions respect user
                  operating system preferences (<code>prefers-reduced-motion: reduce</code>).
                </li>
                <li>
                  <strong>Zero Form Traps:</strong> We maintain a strict call-first design. Except for our
                  single dedicated <code>/contact/</code> route, pages contain zero input fields, captcha traps,
                  or modal popups that could disorient screen reader users.
                </li>
              </ul>
            </section>

            <section className={styles.policySection}>
              <h2 className={styles.sectionHeading}>3. Ongoing Assessment &amp; Feedback</h2>
              <p>
                While we continuously test and review our pages against modern accessibility benchmarks,
                we recognize that digital accessibility is an ongoing effort. We actively remediate issues
                identified during automated audits and manual assistive technology testing.
              </p>
            </section>

            <section className={styles.policySection}>
              <h2 className={styles.sectionHeading}>4. Assistance &amp; Alternative Formats</h2>
              <div className={styles.supportBanner}>
                <p>
                  <strong>Need Immediate Assistance or an Accessible Format?</strong>
                  <br />
                  If you encounter any difficulty accessing content or need assistance scheduling plumbing
                  service, our dispatch team is available by phone to read information aloud, answer
                  licensing questions, or take your service request directly.
                </p>
              </div>

              <p>
                <strong>Telephone Support:</strong>{" "}
                <a href={`tel:${site.phone.e164}`} className={styles.inlineLink}>
                  {site.phone.display}
                </a>
                <br />
                <strong>Telecommunications Relay Service:</strong> Dial <strong>{tty}</strong> for TTY
                assistance.
                <br />
                <strong>Online Request:</strong> Visit our{" "}
                <Link href="/contact/" className={styles.inlineLink}>
                  Accessible Contact Page
                </Link>
                {site.contactEmail ? (
                  <>
                    <br />
                    <strong>Email Support:</strong>{" "}
                    <a href={`mailto:${site.contactEmail}`} className={styles.inlineLink}>
                      {site.contactEmail}
                    </a>
                  </>
                ) : null}
              </p>
              <p>
                When reporting an accessibility issue, please specify the URL, the device and assistive
                technology used, and a brief description of the obstacle so our engineering team can
                promptly investigate and resolve it.
              </p>
            </section>
          </div>
        </article>
      </div>
    </section>
  );
}
