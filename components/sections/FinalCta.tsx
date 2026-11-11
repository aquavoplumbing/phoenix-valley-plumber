import type { SiteConfig } from "@/lib/config";
import { formatHoursSummary, type OpenStatus } from "@/lib/hours";
import { CallButton } from "@/components/ui/CallButton";
import { PhoneLink } from "@/components/ui/PhoneLink";
import { StatusBadge } from "@/components/ui/StatusBadge";
import styles from "./FinalCta.module.css";

export function FinalCta({
  site,
  initialStatus,
}: {
  site: SiteConfig;
  initialStatus: OpenStatus;
}) {
  const hoursSummary = formatHoursSummary(site.hours);

  return (
    <section className={styles.section} aria-labelledby="final-cta-heading">
      <div className={styles.waveWrap} aria-hidden="true">
        <svg
          className={styles.waveSvg}
          viewBox="0 0 1440 72"
          preserveAspectRatio="none"
        >
          <path
            d="M0,32 C240,68 480,0 720,34 C960,68 1200,4 1440,34 L1440,0 L0,0 Z"
            fill="#FFFFFF"
          />
        </svg>
      </div>

      <div className={`container ${styles.inner}`}>
        <h2 id="final-cta-heading" className={styles.title}>
          Plumbing Problem in Phoenix? Call Now.
        </h2>

        <PhoneLink
          display={site.phone.display}
          e164={site.phone.e164}
          location="final-cta-number"
          className={styles.giantPhone}
        />

        <div className={styles.btnWrap}>
          <CallButton
            display={site.phone.display}
            e164={site.phone.e164}
            location="final-cta-btn"
            size="lg"
          />
        </div>

        <div className={styles.metaRow}>
          <StatusBadge
            hours={site.hours}
            initialStatus={initialStatus}
            variant="dark"
          />
          {hoursSummary ? (
            <>
              <span aria-hidden="true">·</span>
              <span>{hoursSummary}</span>
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}

