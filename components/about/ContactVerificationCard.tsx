import Link from "next/link";
import type { SiteConfig } from "@/lib/config";
import { formatHoursSummary, type OpenStatus } from "@/lib/hours";
import { PhoneLink } from "@/components/ui/PhoneLink";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PhoneIcon, ShieldIcon } from "@/components/icons/Icons";
import styles from "./ContactVerificationCard.module.css";

interface ContactVerificationCardProps {
  site: SiteConfig;
  initialStatus: OpenStatus;
}

export function ContactVerificationCard({ site, initialStatus }: ContactVerificationCardProps) {
  const hoursSummary = formatHoursSummary(site.hours);
  const rocUrl = "https://roc.az.gov/";

  return (
    <section className={styles.section} aria-labelledby="contact-verify-heading">
      <div className="container">
        <div className={styles.card}>
          <div className={styles.leftCol}>
            <span className={styles.badge}>Get In Touch</span>
            <h2 id="contact-verify-heading" className={styles.title}>
              Contact &amp; Verification
            </h2>
            <p className={styles.desc}>
              Have a plumbing question or want to confirm technician availability in your neighborhood? Speak directly with our dispatch staff:
            </p>

            <div className={styles.phoneBlock}>
              <PhoneIcon size={20} />
              <PhoneLink
                display={site.phone.display}
                e164={site.phone.e164}
                location="about-contact-card"
                className={styles.phoneLink}
              />
            </div>

            <div className={styles.statusRow}>
              <StatusBadge hours={site.hours} initialStatus={initialStatus} variant="light" />
              <span className={styles.hoursNote}>{hoursSummary || "Valley Service Hours"}</span>
            </div>
          </div>

          <div className={styles.rightCol}>
            <div className={styles.quietActionBox}>
              <h3 className={styles.boxTitle}>Prefer to Write?</h3>
              <p className={styles.boxDesc}>
                If you are at work, hearing impaired, or planning a future plumbing project, use our written inquiry form:
              </p>
              <Link href="/contact/" className={styles.contactBtn}>
                Go to Contact Form →
              </Link>
              {site.contactEmail ? (
                <p style={{ marginTop: "12px", fontSize: "0.875rem", color: "#4A5A70" }}>
                  Or email directly:{" "}
                  <a
                    href={`mailto:${site.contactEmail}`}
                    style={{ color: "#1E9BD7", textDecoration: "underline", wordBreak: "break-all" }}
                    data-track-email="about-contact-card"
                  >
                    {site.contactEmail}
                  </a>
                </p>
              ) : null}
            </div>

            <div className={styles.rocCheckLink}>
              <ShieldIcon size={16} />
              <a
                href={rocUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-track-roc="about-contact-verify"
              >
                Verify ROC #{site.licensee.rocNumber} on Arizona Registrar of Contractors ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
