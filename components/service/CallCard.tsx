import type { SiteConfig } from "@/lib/config";
import { formatHoursSummary, type OpenStatus } from "@/lib/hours";
import { CheckIcon, ExternalLinkIcon, ShieldIcon } from "@/components/icons/Icons";
import { CallButton } from "@/components/ui/CallButton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { OnThisPage, type TocItem } from "./OnThisPage";
import styles from "./CallCard.module.css";

export function CallCard({
  site,
  initialStatus,
  tocItems,
}: {
  site: SiteConfig;
  initialStatus: OpenStatus;
  tocItems: TocItem[];
}) {
  const hoursSummary = formatHoursSummary(site.hours);
  const bullets: string[] = [
    hoursSummary || "Call during posted Valley service hours",
    `Serving Phoenix & ${Math.max(site.serviceAreas.length - 1, 1)}+ Valley cities`,
  ];

  if (site.claims.sameDayService) {
    bullets.push("Same-day service scheduling available");
  } else if (site.claims.upfrontPricing) {
    bullets.push("Upfront pricing explained before work begins");
  } else if (site.claims.freeEstimates) {
    bullets.push("Free estimates available on request");
  } else {
    bullets.push(`Direct call to ${site.licensee.legalName}`);
  }

  return (
    <aside className={styles.card} aria-label="Call a Phoenix plumber">
      <h2 className={styles.heading}>Talk to a Phoenix plumber now</h2>

      <div className={styles.statusRow}>
        <StatusBadge hours={site.hours} initialStatus={initialStatus} variant="light" />
      </div>

      <CallButton
        display={site.phone.display}
        e164={site.phone.e164}
        location="svc-callcard"
        className={styles.ctaBtn}
      />

      <div className={styles.rocRow}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
          <ShieldIcon size={16} />
          ROC #{site.licensee.rocNumber}
        </span>
        <a
          href="https://roc.az.gov/"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.rocVerify}
        >
          <span>Verify license</span>
          <ExternalLinkIcon size={12} />
        </a>
      </div>

      <ul className={styles.bullets}>
        {bullets.slice(0, 3).map((b) => (
          <li key={b} className={styles.bullet}>
            <CheckIcon size={16} className={styles.bulletIcon} />
            <span>{b}</span>
          </li>
        ))}
      </ul>

      <OnThisPage items={tocItems} />
    </aside>
  );
}

