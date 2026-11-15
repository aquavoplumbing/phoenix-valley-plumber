import type { SiteConfig } from "@/lib/config";
import type { ServiceContent } from "@/lib/service-schema";
import { ServiceIcon } from "@/components/icons/Icons";
import { CallButton } from "@/components/ui/CallButton";
import styles from "./SymptomGrid.module.css";

export function SymptomGrid({
  site,
  heading,
  symptoms,
}: {
  site: SiteConfig;
  heading: string;
  symptoms: NonNullable<ServiceContent["symptoms"]>;
}) {
  return (
    <section id="symptoms" aria-labelledby="symptoms-heading">
      <h2 id="symptoms-heading">{heading}</h2>

      <div className={styles.grid}>
        {symptoms.map((symptom) => (
          <article key={symptom.title} className={styles.card}>
            <div className={styles.iconCircle} aria-hidden="true">
              <ServiceIcon name={symptom.icon} size={20} />
            </div>
            <h3 className={styles.title}>{symptom.title}</h3>
            <p className={styles.text}>{symptom.text}</p>
          </article>
        ))}
      </div>

      <div className={styles.ctaRow}>
        <p className={styles.ctaText}>
          Seeing one of these? Call <span data-phone-display="">{site.phone.display}</span>.
        </p>
        <CallButton
          display={site.phone.display}
          e164={site.phone.e164}
          location="svc-symptoms"
        />
      </div>
    </section>
  );
}

