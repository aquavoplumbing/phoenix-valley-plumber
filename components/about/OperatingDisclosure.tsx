import type { SiteConfig } from "@/lib/config";
import styles from "./OperatingDisclosure.module.css";

interface OperatingDisclosureProps {
  site: SiteConfig;
}

export function OperatingDisclosure({ site }: OperatingDisclosureProps) {
  const isPartner = site.operatingModel === "partner";
  const legalName = site.licensee.legalName;
  const roc = site.licensee.rocNumber;
  const operator = site.marketingOperatorName || "Valley Plumbing Dispatch Network";

  return (
    <section className={styles.section} aria-label="Business Operating Structure Disclosure">
      <div className="container">
        <div className={styles.card}>
          <div className={styles.tagWrap}>
            <span className={styles.tag}>Plain Operating Disclosure</span>
          </div>

          <h2 className={styles.heading}>Who We Are &amp; How This Website Operates</h2>

          {isPartner ? (
            <div className={styles.bodyText}>
              <p>
                This website helps Phoenix-area homeowners reach a licensed plumber. Plumbing work is performed by{" "}
                <strong>{legalName}</strong>, Arizona Registrar of Contractors License <strong>ROC #{roc}</strong>.{" "}
                <strong>{operator}</strong> operates this website.
              </p>
              <p className={styles.noteText}>
                We do not employ an in-house plumbing workforce under the marketing domain name. All telephone calls connect callers directly to licensed contractor dispatch staff.
              </p>
            </div>
          ) : (
            <div className={styles.bodyText}>
              <p>
                {site.brand} is operated by <strong>{legalName}</strong>, a plumbing contractor licensed by the Arizona Registrar of Contractors (<strong>ROC #{roc}</strong>).
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
