import type { SiteConfig } from "@/lib/config";
import type { ServiceContent } from "@/lib/service-schema";
import { CallButton } from "@/components/ui/CallButton";
import styles from "./ProcessSteps.module.css";

export function ProcessSteps({
  site,
  heading,
  process,
}: {
  site: SiteConfig;
  heading: string;
  process: NonNullable<ServiceContent["process"]>;
}) {
  return (
    <section id="process" aria-labelledby="process-heading">
      <h2 id="process-heading">{heading}</h2>

      <div className={styles.timelineWrap}>
        <svg
          className={styles.connectorSvg}
          viewBox="0 0 800 12"
          fill="none"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <line
            x1="20"
            y1="6"
            x2="780"
            y2="6"
            stroke="#1E9BD7"
            strokeWidth="3"
            strokeDasharray="10 10"
            className={styles.connectorLine}
          />
        </svg>

        <ol className={styles.steps}>
          {process.map((step, idx) => (
            <li key={step.title} className={styles.step}>
              <div className={styles.badge} aria-hidden="true">
                {idx + 1}
              </div>
              <h3 className={styles.title}>{step.title}</h3>
              <p className={styles.text}>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className={styles.ctaRow}>
        <CallButton
          display={site.phone.display}
          e164={site.phone.e164}
          location="svc-process"
          size="lg"
        />
      </div>
    </section>
  );
}

