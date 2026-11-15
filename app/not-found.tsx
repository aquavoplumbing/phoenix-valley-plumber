import type { Metadata } from "next";
import Link from "next/link";
import { getSiteConfigResult } from "@/lib/config";
import { CallButton } from "@/components/ui/CallButton";
import { PhoneLink } from "@/components/ui/PhoneLink";
import { NotFoundTracker } from "@/components/analytics/NotFoundTracker";
import { ArrowRightIcon, SirenIcon } from "@/components/icons/Icons";
import styles from "./NotFound.module.css";

export const metadata: Metadata = {
  title: "Page Not Found (404) | Phoenix Valley Plumber",
  description: "The page you requested could not be found. Call for immediate plumbing assistance across Phoenix and the Valley.",
  robots: {
    index: false,
    follow: false,
  },
};

const TOP_SERVICES = [
  { label: "Emergency Plumber", href: "/emergency-plumber/" },
  { label: "Water Heater Repair", href: "/water-heater-repair/" },
  { label: "Drain Cleaning", href: "/drain-cleaning/" },
  { label: "Sewer Line Repair", href: "/sewer-line-repair/" },
  { label: "Slab Leak Repair", href: "/slab-leak-repair/" },
  { label: "Whole-Home Repiping", href: "/repiping/" },
];

export default function NotFound() {
  const { config: site } = getSiteConfigResult();

  return (
    <section className={styles.section} aria-labelledby="not-found-heading">
      <NotFoundTracker />

      <div className="container">
        <div className={styles.inner}>
          <span className={styles.eyebrow}>404 Error</span>
          <h1 id="not-found-heading" className={styles.title}>
            That Page Isn&apos;t Here
          </h1>
          <p className={styles.desc}>
            The link you clicked may be outdated or mistyped. If you are experiencing a plumbing
            leak, water heater failure, or drain emergency, you don&apos;t need to search—call our
            dispatch team right now.
          </p>

          <div className={styles.callBox}>
            <p className={styles.callBoxTitle}>Speak directly with a Phoenix plumbing dispatcher:</p>
            <CallButton
              display={site.phone.display}
              e164={site.phone.e164}
              location="404-hero"
              size="lg"
            />
            <PhoneLink
              display={site.phone.display}
              e164={site.phone.e164}
              location="404-hero-inline"
            />
          </div>

          <div className={styles.navigationSection}>
            <h2 className={styles.navSectionTitle}>Popular Plumbing Services &amp; Guides</h2>
            <div className={styles.servicesGrid}>
              {TOP_SERVICES.map((srv) => (
                <Link key={srv.href} href={srv.href} className={styles.serviceLink}>
                  <ArrowRightIcon size={14} />
                  <span>{srv.label}</span>
                </Link>
              ))}
            </div>

            <div className={styles.quickLinksRow}>
              <Link href="/emergency-plumber/" className={styles.quickLink}>
                <SirenIcon size={14} style={{ display: "inline", marginRight: 4 }} />
                Emergency Plumbing
              </Link>
              <Link href="/blog/" className={styles.quickLink}>
                Plumbing Blog &amp; Guides
              </Link>
              <Link href="/contact/" className={styles.quickLink}>
                Contact Page
              </Link>
              <Link href="/" className={styles.quickLink}>
                Return to Homepage →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
