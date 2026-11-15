import { CallButton } from "@/components/ui/CallButton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { computeOpenStatus } from "@/lib/hours";
import type { SiteConfig } from "@/lib/config";
import styles from "./InlineCta.module.css";

interface InlineCtaProps {
  headline?: string;
  subtext?: string;
  site: SiteConfig;
  location?: "post-inline-1" | "post-inline-2" | "post-inline-3";
}

export function InlineCta({
  headline = "Seeing These Signs in Your Valley Home?",
  subtext = "Our licensed plumbing technicians can inspect the issue, answer your questions, and provide clear options without pressure.",
  site,
  location = "post-inline-1",
}: InlineCtaProps) {
  const initialStatus = computeOpenStatus(site.hours);

  return (
    <aside className={styles.container} aria-label="Plumbing Service Assistance">
      <div className={styles.textWrap}>
        <div className={styles.badgeRow}>
          <StatusBadge hours={site.hours} initialStatus={initialStatus} variant="dark" />
        </div>
        <h3 className={styles.headline}>{headline}</h3>
        <p className={styles.subtext}>{subtext}</p>
      </div>
      <div className={styles.buttonWrap}>
        <CallButton
          display={site.phone.display}
          e164={site.phone.e164}
          location={location}
          label="Call a Plumber"
          size="md"
        />
      </div>
    </aside>
  );
}
