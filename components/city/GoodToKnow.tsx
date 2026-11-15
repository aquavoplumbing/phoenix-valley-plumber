import type { CityContent } from "@/lib/city-schema";
import type { SiteConfig } from "@/lib/config";
import { ExternalLinkIcon, ShieldIcon, SirenIcon } from "@/components/icons/Icons";
import { SourceLink } from "@/components/service/SourceLink";
import styles from "./GoodToKnow.module.css";

interface GoodToKnowProps {
  city: CityContent;
  site: SiteConfig;
}

export function GoodToKnow({ city, site }: GoodToKnowProps) {
  const { permits, utilities } = city;

  return (
    <section className={styles.wrapper} aria-labelledby="good-to-know-heading">
      <h2 id="good-to-know-heading" className={styles.heading}>
        Good to Know in {city.name}, AZ
      </h2>

      <div className={styles.grid}>
        {/* Permits office */}
        {permits ? (
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Local Building Permits</h3>
            <p className={styles.cardText}>
              {permits.verifiedNote
                ? permits.verifiedNote.text
                : `Rules differ by city and by the work being done. Your plumber will tell you whether a permit applies in ${city.name}.`}
            </p>
            <a
              href={permits.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.cardLink}
            >
              <span>{permits.officeName}</span>
              <ExternalLinkIcon size={12} />
              <span className="sr-only"> (opens in new tab)</span>
            </a>
          </div>
        ) : null}

        {/* ROC license verification */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Arizona ROC License</h3>
          <p className={styles.cardText}>
            Always verify contractor credentials with the Arizona Registrar of Contractors. Our active Arizona plumbing license is ROC #{site.licensee.rocNumber}.
          </p>
          <a
            href="https://roc.az.gov/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.cardLink}
          >
            <ShieldIcon size={14} />
            <span>Verify ROC #{site.licensee.rocNumber} on roc.az.gov</span>
            <ExternalLinkIcon size={12} />
            <span className="sr-only"> (opens in new tab)</span>
          </a>
        </div>

        {/* Water utility */}
        {utilities?.water ? (
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Water Utility</h3>
            <p className={styles.cardText}>
              Municipal water supply, billing inquiries, and water quality updates for {city.name} residents.
            </p>
            <a
              href={utilities.water.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.cardLink}
            >
              <span>{utilities.water.name}</span>
              <ExternalLinkIcon size={12} />
              <span className="sr-only"> (opens in new tab)</span>
            </a>
          </div>
        ) : null}

        {/* Gas utility */}
        {utilities?.gas ? (
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Gas Utility</h3>
            <p className={styles.cardText}>
              Residential gas service provider for {city.name}.
            </p>
            <a
              href={utilities.gas.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.cardLink}
            >
              <span>{utilities.gas.name}</span>
              <ExternalLinkIcon size={12} />
              <span className="sr-only"> (opens in new tab)</span>
            </a>
          </div>
        ) : null}

        {/* Electric utility */}
        {utilities?.electric ? (
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Electric Utility</h3>
            <p className={styles.cardText}>
              Electric power provider serving {city.name} residences.
            </p>
            <a
              href={utilities.electric.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.cardLink}
            >
              <span>{utilities.electric.name}</span>
              <ExternalLinkIcon size={12} />
              <span className="sr-only"> (opens in new tab)</span>
            </a>
          </div>
        ) : null}
      </div>

      {/* Gas leak safety advisory */}
      {utilities?.gas?.leakLine ? (
        <div className={styles.gasWarningBox} role="alert">
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 700, marginBottom: "4px" }}>
            <SirenIcon size={18} />
            <span>Gas Leak Safety Protocol in {city.name}</span>
          </div>
          <p style={{ margin: "0 0 6px 0" }}>
            If you smell gas, leave the home right away and call your gas utility or 911. Do not operate light switches, appliances, or phones indoors.
          </p>
          <p style={{ margin: 0, fontWeight: 600 }}>
            {utilities.gas.name} 24-Hour Emergency Line:{" "}
            <a href={`tel:${utilities.gas.leakLine.number.replace(/[^\d+]/g, "")}`} style={{ textDecoration: "underline", color: "inherit" }}>
              {utilities.gas.leakLine.number}
            </a>{" "}
            <SourceLink href={utilities.gas.leakLine.sourceUrl} label="Emergency Source" />
          </p>
        </div>
      ) : (
        <div className={styles.gasWarningBox} role="alert">
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 700, marginBottom: "4px" }}>
            <SirenIcon size={18} />
            <span>Gas Leak Safety Protocol</span>
          </div>
          <p style={{ margin: 0 }}>
            If you smell gas, leave the home right away and call your gas utility or 911. Do not use switches, lighters, or cell phones inside.
          </p>
        </div>
      )}
    </section>
  );
}
