import type { CityContent } from "@/lib/city-schema";
import type { SiteConfig } from "@/lib/config";
import { SirenIcon } from "@/components/icons/Icons";
import { CallButton } from "@/components/ui/CallButton";
import { SourceLink } from "@/components/service/SourceLink";
import styles from "./CityEmergencyBlock.module.css";

interface CityEmergencyBlockProps {
  city: CityContent;
  site: SiteConfig;
}

export function CityEmergencyBlock({ city, site }: CityEmergencyBlockProps) {
  const gasLeak = city.utilities?.gas?.leakLine;
  const gasName = city.utilities?.gas?.name ?? "Southwest Gas";

  return (
    <section
      id="emergency-steps"
      className={styles.box}
      aria-labelledby="city-emergency-heading"
    >
      <div className={styles.headerRow}>
        <h2 id="city-emergency-heading" className={styles.heading}>
          Plumbing Emergency in {city.name}?
        </h2>
        <CallButton
          display={site.phone.display}
          e164={site.phone.e164}
          location="city-emergency"
        />
      </div>

      <ol className={styles.steps}>
        <li className={styles.step}>
          <span className={styles.stepNum} aria-hidden="true">
            1
          </span>
          <div className={styles.stepText}>
            <strong>Shut off the main water valve:</strong> Stop incoming pressurized water at your street curb or house shutoff to prevent progressive structural flooding.
          </div>
        </li>
        <li className={styles.step}>
          <span className={styles.stepNum} aria-hidden="true">
            2
          </span>
          <div className={styles.stepText}>
            <strong>Turn off the water heater:</strong> If your water heater is leaking or rumbling, shut off the electrical circuit breaker or rotate the gas supply valve perpendicular to the pipe.
          </div>
        </li>
        <li className={styles.step}>
          <span className={styles.stepNum} aria-hidden="true">
            3
          </span>
          <div className={styles.stepText}>
            <strong>Call us and describe what you see:</strong> Our dispatch staff will guide your next steps and route an experienced technician to your {city.name} address.
          </div>
        </li>
      </ol>

      <div className={styles.gasCallout} role="alert">
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 700, marginBottom: "4px" }}>
          <SirenIcon size={16} />
          <span>Gas Smell Emergency Notice:</span>
        </div>
        <p style={{ margin: "0 0 6px 0" }}>
          If you smell gas, leave the home right away and call your gas utility or 911. Do not use electrical switches, lighters, or phones inside the home.
        </p>
        {gasLeak ? (
          <p style={{ margin: 0, fontWeight: 600 }}>
            {gasName} Emergency Line:{" "}
            <a
              href={`tel:${gasLeak.number.replace(/[^\d+]/g, "")}`}
              style={{ color: "inherit", textDecoration: "underline" }}
            >
              {gasLeak.number}
            </a>{" "}
            <SourceLink href={gasLeak.sourceUrl} label="Source" variant="light" />
          </p>
        ) : null}
      </div>
    </section>
  );
}
