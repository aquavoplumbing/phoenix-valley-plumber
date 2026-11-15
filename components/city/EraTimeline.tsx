import type { CityContent } from "@/lib/city-schema";
import { SourceLink } from "@/components/service/SourceLink";
import styles from "./EraTimeline.module.css";

interface EraTimelineProps {
  housing: NonNullable<CityContent["housing"]>;
  cityName: string;
}

export function EraTimeline({ housing, cityName }: EraTimelineProps) {
  const { summary, eras, medianYearBuilt } = housing;

  return (
    <div className={styles.wrapper}>
      <div className={styles.headerRow}>
        <div>
          <h3 className={styles.heading}>Housing &amp; Piping Eras in {cityName}</h3>
          <p style={{ fontSize: "0.875rem", color: "var(--ink-600)", margin: "4px 0 0 0" }}>
            {summary}
          </p>
        </div>
        {medianYearBuilt ? (
          <span className={styles.medianBadge}>
            Median Year Built: {medianYearBuilt.value} ({medianYearBuilt.asOf})
          </span>
        ) : null}
      </div>

      <div className={styles.timeline}>
        {eras.map((era) => (
          <article key={era.label} className={styles.eraCard}>
            <div className={styles.eraTop}>
              <span className={styles.builtRange}>{era.builtRange}</span>
            </div>
            <h4 className={styles.eraLabel}>{era.label}</h4>
            <p className={styles.whatWeSee}>
              <strong>Typical plumbing observations:</strong> {era.whatWeSee}
            </p>
            <div className={styles.sourceFooter}>
              <SourceLink href={era.sourceUrl} label="Era Source" />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
