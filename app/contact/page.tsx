import type { Metadata } from "next";
import Link from "next/link";
import { getSiteConfigResult } from "@/lib/config";
import { formatHoursSummary } from "@/lib/hours";
import { CallButton } from "@/components/ui/CallButton";
import styles from "@/components/sections/StubPage.module.css";

export const metadata: Metadata = {
  title: "Contact",
  description: "Call Phoenix Valley Plumber or view contact details for our Phoenix, AZ plumbing service.",
  alternates: {
    canonical: "/contact/",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function ContactPage() {
  const { config: site } = getSiteConfigResult();
  const hoursSummary = formatHoursSummary(site.hours);

  return (
    <section className={styles.section}>
      <div className="container">
        <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
          <Link href="/" className={styles.crumbLink}>
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <span>Contact</span>
        </nav>

        <div className={styles.card}>
          <p className={styles.eyebrow}>Contact {site.brand}</p>
          <h1 className={styles.title}>Call or Reach Our Phoenix Plumbing Team</h1>
          <p className={styles.desc}>
            For fastest service, call us directly. This Contact page is the only page on the
            site reserved for a future written inquiry form.
          </p>

          <div className={styles.actions}>
            <CallButton
              display={site.phone.display}
              e164={site.phone.e164}
              location="contact-page"
              size="lg"
            />
            <Link href="/" className="btn-ghost">
              ← Back to homepage
            </Link>
          </div>

          <div className={styles.note}>
            <p>
              <strong>Licensee:</strong> {site.licensee.legalName} · ROC #{site.licensee.rocNumber}
            </p>
            {hoursSummary ? (
              <p>
                <strong>Hours:</strong> {hoursSummary}
              </p>
            ) : null}
            <p>
              {site.address.public && site.address.street
                ? `${site.address.street}, ${site.address.city}, ${site.address.state} ${site.address.zip}`
                : "Serving Phoenix and the surrounding Valley."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

