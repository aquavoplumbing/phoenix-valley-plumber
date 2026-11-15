import type { SiteConfig } from "@/lib/config";
import { formatHoursSummary, type OpenStatus } from "@/lib/hours";
import { CheckIcon, ExternalLinkIcon, ShieldIcon } from "@/components/icons/Icons";
import { CallButton } from "@/components/ui/CallButton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { OnThisPage, type TocItem } from "@/components/service/OnThisPage";
import styles from "@/components/service/CallCard.module.css";

interface CityCallCardProps {
  cityName: string;
  site: SiteConfig;
  initialStatus: OpenStatus;
  tocItems: TocItem[];
}

export function CityCallCard({
  cityName,
  site,
  initialStatus,
  tocItems,
}: CityCallCardProps) {
  const hoursSummary = formatHoursSummary(site.hours);
  const bullets: string[] = [
    hoursSummary || "Call during posted Valley service hours",
    `Serving ${cityName} & neighboring Valley communities`,
    `Direct call to ${site.licensee.legalName}`,
  ];

  return (
    <aside className={styles.card} aria-label={`Call a ${cityName} plumber`}>
      <h2 className={styles.heading}>Talk to a {cityName} plumber now</h2>

      <div className={styles.statusRow}>
        <StatusBadge hours={site.hours} initialStatus={initialStatus} variant="light" />
      </div>

      <CallButton
        display={site.phone.display}
        e164={site.phone.e164}
        location="city-callcard"
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

      <ul className={styles.bulletList}>
        {bullets.map((b) => (
          <li key={b} className={styles.bulletItem}>
            <CheckIcon size={16} className={styles.checkIcon} />
            <span>{b}</span>
          </li>
        ))}
      </ul>

      <OnThisPage items={tocItems} />
    </aside>
  );
}
