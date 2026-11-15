import { CallButton } from "@/components/ui/CallButton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { computeOpenStatus } from "@/lib/hours";
import type { SiteConfig } from "@/lib/config";
import styles from "./WhenToCall.module.css";

interface WhenToCallProps {
  triggers: string[];
  heading?: string;
  site: SiteConfig;
  isEmergency?: boolean;
}

export function WhenToCall({
  triggers,
  heading = "When to Stop and Call a Licensed Plumber",
  site,
  isEmergency = false,
}: WhenToCallProps) {
  if (!triggers || triggers.length === 0) return null;
  const initialStatus = computeOpenStatus(site.hours);

  return (
    <section
      className={`${styles.container} ${isEmergency ? styles.emergency : ""}`}
      aria-label="When to call a plumber"
    >
      <div className={styles.header}>
        <div className={styles.badgeRow}>
          <span className={styles.badge}>
            {isEmergency ? "Immediate Action Required" : "Professional Threshold"}
          </span>
          <StatusBadge hours={site.hours} initialStatus={initialStatus} />
        </div>
        <h2 className={styles.heading}>{heading}</h2>
        <p className={styles.subhead}>
          Call a licensed plumbing professional immediately if you notice any of the following:
        </p>
      </div>

      <ul className={styles.list}>
        {triggers.map((trigger, idx) => (
          <li key={idx} className={styles.item}>
            <span className={styles.alertIcon} aria-hidden="true">⚠️</span>
            <span className={styles.text}>{trigger}</span>
          </li>
        ))}
      </ul>

      <div className={styles.actionRow}>
        <div className={styles.prompt}>
          <strong>Ready for professional service?</strong>
          <span>Call our dispatch desk directly to discuss your options.</span>
        </div>
        <CallButton
          display={site.phone.display}
          e164={site.phone.e164}
          location="post-whentocall"
          label="Call a Plumber"
          size="lg"
        />
      </div>
    </section>
  );
}
