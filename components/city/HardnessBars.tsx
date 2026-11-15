import Link from "next/link";
import type { CityContent } from "@/lib/city-schema";
import { SourceLink } from "@/components/service/SourceLink";
import styles from "./HardnessBars.module.css";

interface HardnessBarsProps {
  water: NonNullable<CityContent["water"]>;
  cityName: string;
}

const SCALE_MAX = 28; // gpg maximum scale for visualization

export function HardnessBars({ water, cityName }: HardnessBarsProps) {
  const { utility, sourceUrl, reportYear, zones, note } = water;

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <div>
          <h3 className={styles.heading}>Water Hardness by Zone in {cityName}</h3>
          <p className={styles.metaInfo}>
            Official Data: {utility} {reportYear ? `(${reportYear} Report)` : "(Utility Fact Sheet)"}
          </p>
        </div>
        <SourceLink href={sourceUrl} label="View Utility Source" />
      </div>

      <div className={styles.zonesList}>
        {zones.map((zone) => {
          const widthPct = Math.min(100, Math.max(10, (zone.gpgMax / SCALE_MAX) * 100));
          const gpgLabel =
            zone.gpgMin === zone.gpgMax
              ? `${zone.gpgMin} gpg`
              : `${zone.gpgMin}–${zone.gpgMax} gpg`;

          return (
            <div key={zone.label} className={styles.zoneItem}>
              <div className={styles.zoneHeader}>
                <span className={styles.zoneLabel}>{zone.label}</span>
                <span className={styles.zoneGpg}>{gpgLabel}</span>
              </div>

              <div className={styles.barTrack} role="presentation">
                <div
                  className={styles.barFill}
                  style={{ width: `${widthPct}%` }}
                  aria-hidden="true"
                />
              </div>

              {zone.sourceNote ? (
                <p className={styles.zoneNote}>{zone.sourceNote}</p>
              ) : null}
            </div>
          );
        })}

        <div className={styles.scaleAxis} aria-hidden="true">
          <span>0 gpg (Soft)</span>
          <span>7 gpg (Hard)</span>
          <span>14 gpg (Very Hard)</span>
          <span>28 gpg (Extreme)</span>
        </div>
      </div>

      {note ? <p className={styles.zoneNote}><strong>Utility Guidance:</strong> {note}</p> : null}

      <p className={styles.caveat}>
        Hardness varies by zone, source and year. Check your utility&apos;s current report.
      </p>

      {/* Screen reader accessible data table equivalent */}
      <div className="sr-only">
        <table>
          <caption>
            Official drinking water hardness zones and measurements for {cityName}, Arizona from {utility}.
          </caption>
          <thead>
            <tr>
              <th scope="col">Zone / Area</th>
              <th scope="col">Minimum Hardness (gpg)</th>
              <th scope="col">Maximum Hardness (gpg)</th>
              <th scope="col">Water Source Note</th>
            </tr>
          </thead>
          <tbody>
            {zones.map((zone) => (
              <tr key={zone.label}>
                <td>{zone.label}</td>
                <td>{zone.gpgMin}</td>
                <td>{zone.gpgMax}</td>
                <td>{zone.sourceNote ?? "Standard municipal distribution"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Explanatory impact copy with links */}
      <p className={styles.impactText}>
        Elevated mineral hardness accelerates calcium carbonate scale buildup inside domestic water heaters, tankless heat exchangers, and household fixtures. Untreated desert water restricts water pipe diameters and reduces appliance lifespan; learn more about{" "}
        <Link href="/water-heater-repair/">water heater repair and descaling</Link> or consider{" "}
        <Link href="/water-softener-installation/">whole-home water softener installation</Link> tailored to {cityName}&apos;s water profile.
      </p>
    </div>
  );
}
