import Link from "next/link";
import type { SiteConfig } from "@/lib/config";
import type { OpenStatus } from "@/lib/hours";
import { CallButton } from "@/components/ui/CallButton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import styles from "./ServiceMidCta.module.css";

export function ServiceMidCta({
  site,
  serviceName,
  initialStatus,
}: {
  site: SiteConfig;
  serviceName: string;
  initialStatus: OpenStatus;
}) {
  return (
    <section className={styles.band} aria-label={`Call for ${serviceName}`}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.copy}>
          <StatusBadge hours={site.hours} initialStatus={initialStatus} variant="dark" />
          <h2 className={styles.heading}>
            Need {serviceName} in Phoenix? Call Now.
          </h2>
          <p className={styles.sub}>
            Speak directly with a licensed Arizona plumber (ROC #{site.licensee.rocNumber})—no
            lead forms, no call centers, and clear answers on what to expect when you call.
          </p>
        </div>

        <div className={styles.actions}>
          <CallButton
            display={site.phone.display}
            e164={site.phone.e164}
            location="svc-mid"
            size="lg"
          />
          <Link
            href="/contact/"
            className={styles.contactLink}
            data-track-contact="svc-mid"
          >
            Prefer to send a note? Contact page →
          </Link>
        </div>
      </div>
    </section>
  );
}

