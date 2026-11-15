import type { SiteConfig } from "@/lib/config";
import type { ServiceContent } from "@/lib/service-schema";
import { SirenIcon } from "@/components/icons/Icons";
import { CallButton } from "@/components/ui/CallButton";
import styles from "./ServiceEmergencyBlock.module.css";

export function ServiceEmergencyBlock({
  site,
  emergency,
}: {
  site: SiteConfig;
  emergency: NonNullable<ServiceContent["emergency"]>;
}) {
  return (
    <section
      id="emergency-steps"
      className={styles.box}
      aria-labelledby="emergency-steps-heading"
    >
      {emergency.gasWarning ? (
        <div className={styles.gasBanner} role="alert">
          <SirenIcon size={20} className={styles.gasIcon} />
          <p>
            If you smell gas, leave the home right away and call your gas utility or
            911. Do not use switches, lighters or your phone inside.
          </p>
        </div>
      ) : null}

      <div className={styles.headerRow}>
        <h2 id="emergency-steps-heading" className={styles.heading}>
          {emergency.heading}
        </h2>
        <CallButton
          display={site.phone.display}
          e164={site.phone.e164}
          location="svc-emergency"
        />
      </div>

      <ol className={styles.steps}>
        {emergency.steps.map((step, idx) => (
          <li key={step.title} className={styles.step}>
            <span className={styles.num} aria-hidden="true">
              {idx + 1}
            </span>
            <div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepText}>{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

