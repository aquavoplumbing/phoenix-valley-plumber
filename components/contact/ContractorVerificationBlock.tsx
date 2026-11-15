import type { SiteConfig } from "@/lib/config";
import { ShieldIcon } from "@/components/icons/Icons";
import styles from "./ContractorVerificationBlock.module.css";

interface ContractorVerificationBlockProps {
  site: SiteConfig;
}

export function ContractorVerificationBlock({ site }: ContractorVerificationBlockProps) {
  const roc = site.licensee.rocNumber;
  const classification =
    site.licenseClassification || "ROC Class CR-37 (Commercial & Residential Plumbing)";
  const rocUrl = `https://roc.az.gov/`;

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.shieldIcon} aria-hidden="true">
          <ShieldIcon size={24} />
        </div>
        <div>
          <h3 className={styles.title}>Licensed Arizona Plumbing Contractor</h3>
          <p className={styles.subtitle}>Verified Credentials &amp; Public Regulatory Record</p>
        </div>
      </div>

      <div className={styles.detailsGrid}>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Contractor Legal Entity:</span>
          <strong className={styles.detailValue}>{site.licensee.legalName}</strong>
        </div>

        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Arizona ROC License #:</span>
          <strong className={styles.detailValue}>{roc}</strong>
        </div>

        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>License Classification:</span>
          <span className={styles.detailValue}>{classification}</span>
        </div>

        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Physical Presence:</span>
          <span className={styles.detailValue}>
            {site.address.public && site.address.street
              ? `${site.address.street}, ${site.address.city}, ${site.address.state} ${site.address.zip}`
              : "Mobile Service-Area Contractor · We dispatch directly to your home"}
          </span>
        </div>
      </div>

      {site.operatingModel ? (
        <div className={styles.operatingModelNote}>
          <p>{site.operatingModel}</p>
        </div>
      ) : null}

      <div className={styles.verifyLinkWrap}>
        <a
          href={rocUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.verifyLink}
          data-track-roc="contact-verify"
        >
          Verify this license on the Arizona Registrar of Contractors site ↗
        </a>
      </div>
    </div>
  );
}
