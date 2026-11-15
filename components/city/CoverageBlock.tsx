import type { CityContent } from "@/lib/city-schema";
import type { SiteConfig } from "@/lib/config";
import { CallButton } from "@/components/ui/CallButton";
import { SourceLink } from "@/components/service/SourceLink";
import { MapPinIcon, ShieldIcon } from "@/components/icons/Icons";
import styles from "./CoverageBlock.module.css";

interface CoverageBlockProps {
  coverage: CityContent["coverage"];
  cityName: string;
  site: SiteConfig;
}

export function CoverageBlock({ coverage, cityName, site }: CoverageBlockProps) {
  const { servedFrom, zips, neighborhoods, boundariesNote, sourceUrl } = coverage;

  const honestLine = servedFrom
    ? `Serving ${cityName} from ${servedFrom}`
    : `Serving ${cityName} and nearby Valley communities`;

  return (
    <div className={styles.wrapper}>
      <div className={styles.grid}>
        <div className={styles.leftCol}>
          <div className={styles.honestChip}>
            <MapPinIcon size={16} />
            <span>{honestLine}</span>
          </div>

          <h3 className={styles.subHeading}>Neighborhoods We Serve in {cityName}</h3>
          <div className={styles.chipsWrap}>
            {neighborhoods.map((n) => (
              <span key={n} className={styles.chip}>
                {n}
              </span>
            ))}
          </div>

          {boundariesNote ? (
            <p className={styles.boundaryNote}>{boundariesNote}</p>
          ) : null}

          <div className={styles.sourceRow}>
            <SourceLink href={sourceUrl} label={`Official ${cityName} Neighborhood Data`} />
          </div>
        </div>

        <div className={styles.rightCol}>
          <div className={styles.dispatchCard}>
            <div className={styles.dispatchHeader}>
              <ShieldIcon size={18} />
              <span>Full Local Coverage</span>
            </div>

            <h4 className={styles.zipsTitle}>Covered {cityName} ZIP Codes ({zips.length})</h4>
            <div className={styles.zipsGrid}>
              {zips.map((zip) => (
                <span key={zip} className={styles.zipBadge}>
                  {zip}
                </span>
              ))}
            </div>

            <div className={styles.dispatchDivider} />

            <p className={styles.callPrompt}>
              Not sure if your {cityName} neighborhood is covered? Call our local dispatch desk directly.
            </p>

            <CallButton
              display={site.phone.display}
              e164={site.phone.e164}
              location="city-coverage"
              size="lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
