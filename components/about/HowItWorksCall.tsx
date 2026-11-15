import type { SiteConfig } from "@/lib/config";
import styles from "./HowItWorksCall.module.css";

interface HowItWorksCallProps {
  site: SiteConfig;
}

export function HowItWorksCall({ site }: HowItWorksCallProps) {
  const steps = [
    {
      num: "1",
      title: "You Call Our Dispatch Line",
      desc: "Speak directly with local dispatch staff during posted operating hours. We confirm your city, neighborhood, and general plumbing urgency.",
    },
    {
      num: "2",
      title: "You Describe What You See",
      desc: "Share symptoms, fixture locations, or leak observations. We identify whether immediate water shutoff or standard diagnostic dispatch is needed.",
    },
    {
      num: "3",
      title: "Technician Confirms Arrival & Scope",
      desc: "A licensed plumbing technician confirms scheduling, examines the installation on-site, and explains repair options before work begins.",
    },
  ];

  return (
    <section className={styles.section} aria-labelledby="how-it-works-heading">
      <div className="container">
        <div className={styles.header}>
          <span className={styles.badge}>Simple Process</span>
          <h2 id="how-it-works-heading" className={styles.title}>
            What to Expect When You Call
          </h2>
          <p className={styles.subtitle}>
            A straightforward, human dispatch process without automated phone menus or long delays:
          </p>
        </div>

        <div className={styles.grid}>
          {steps.map((s) => (
            <div key={s.num} className={styles.stepCard}>
              <div className={styles.numberCircle}>{s.num}</div>
              <h3 className={styles.stepTitle}>{s.title}</h3>
              <p className={styles.stepDesc}>{s.desc}</p>
            </div>
          ))}
        </div>

        {(site.claims.upfrontPricing || site.claims.freeEstimates) && (
          <div className={styles.pricingNote}>
            {site.claims.upfrontPricing && (
              <p>
                <strong>Upfront Pricing:</strong> Scope and pricing are reviewed and approved before hands-on repair work begins.
              </p>
            )}
            {site.claims.freeEstimates && (
              <p>
                <strong>Estimates:</strong> Visual on-site estimates are complimentary for standard residential replacements.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
