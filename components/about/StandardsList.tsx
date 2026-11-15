import type { SiteConfig } from "@/lib/config";
import { CheckIcon } from "@/components/icons/Icons";
import styles from "./StandardsList.module.css";

interface StandardsListProps {
  site: SiteConfig;
}

export function StandardsList({ site }: StandardsListProps) {
  const standards: Array<{ label: string; desc: string }> = [
    {
      label: `Licensed Arizona Plumbing Contractor (ROC #${site.licensee.rocNumber})`,
      desc: "Contractor is vetted, bonded, and registered with the Arizona Registrar of Contractors under Class CR-37.",
    },
  ];

  if (site.licensee.bonded && site.licensee.insured) {
    standards.push({
      label: "Bonded & Insured",
      desc: "Maintains active statutory surety bond and commercial general liability coverage for customer protection.",
    });
  } else if (site.licensee.bonded) {
    standards.push({
      label: "Statutory Contractor Bond",
      desc: "Carries statutory surety bonding on file with the State of Arizona.",
    });
  } else if (site.licensee.insured) {
    standards.push({
      label: "Commercial General Liability Insurance",
      desc: "Active commercial liability insurance protecting your residential or commercial property during service calls.",
    });
  }

  if (site.claims.upfrontPricing) {
    standards.push({
      label: "Upfront Written Scope",
      desc: "Clear explanation of required repairs and written pricing provided before diagnostic or replacement work begins.",
    });
  }

  if (site.claims.warranty && site.claims.warranty.trim()) {
    standards.push({
      label: "Workmanship Warranty",
      desc: site.claims.warranty,
    });
  }

  if (site.claims.freeEstimates) {
    standards.push({
      label: "Complimentary In-Home Estimates",
      desc: "No-cost estimates for standard residential water heater and equipment replacements.",
    });
  }

  if (standards.length === 0) {
    return null;
  }

  return (
    <section className={styles.section} aria-labelledby="standards-heading">
      <div className="container">
        <div className={styles.wrapper}>
          <div className={styles.header}>
            <span className={styles.badge}>Accountability &amp; Safety</span>
            <h2 id="standards-heading" className={styles.title}>
              Operating Standards &amp; Commitments
            </h2>
            <p className={styles.subtitle}>
              Verified trade practices adhered to on every dispatch:
            </p>
          </div>

          <div className={styles.grid}>
            {standards.map((std, i) => (
              <div key={i} className={styles.standardCard}>
                <div className={styles.iconWrap} aria-hidden="true">
                  <CheckIcon size={18} />
                </div>
                <div>
                  <h3 className={styles.standardLabel}>{std.label}</h3>
                  <p className={styles.standardDesc}>{std.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
