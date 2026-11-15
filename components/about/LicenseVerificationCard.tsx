import type { SiteConfig } from "@/lib/config";
import { ShieldIcon, ExternalLinkIcon } from "@/components/icons/Icons";
import { CallButton } from "@/components/ui/CallButton";
import styles from "./LicenseVerificationCard.module.css";

interface LicenseVerificationCardProps {
  site: SiteConfig;
}

export function LicenseVerificationCard({ site }: LicenseVerificationCardProps) {
  const roc = site.licensee.rocNumber;
  const legalName = site.licensee.legalName;
  const classification = site.licenseClassification || "ROC Class CR-37 (Commercial & Residential Plumbing)";
  const status = site.licensee.status || "Active";
  const checkedOn = site.claims.licenseCheckedOn;
  const rocUrl = "https://roc.az.gov/";

  return (
    <section id="license" className={styles.section} aria-labelledby="license-heading">
      <div className="container">
        <div className={styles.wrapper}>
          <div className={styles.header}>
            <div className={styles.shieldWrap} aria-hidden="true">
              <ShieldIcon size={28} />
            </div>
            <div>
              <span className={styles.badge}>State Regulatory Record</span>
              <h2 id="license-heading" className={styles.title}>
                Contractor Licensing &amp; Verification
              </h2>
            </div>
          </div>

          <div className={styles.grid}>
            {/* Left: License Data Card */}
            <div className={styles.licenseCard}>
              <div className={styles.fieldList}>
                <div className={styles.field}>
                  <span className={styles.label}>Contractor Legal Name</span>
                  <strong className={styles.value}>{legalName}</strong>
                </div>

                <div className={styles.field}>
                  <span className={styles.label}>Arizona ROC License #</span>
                  <strong className={styles.valueHighlight}>ROC #{roc}</strong>
                </div>

                <div className={styles.field}>
                  <span className={styles.label}>Classification</span>
                  <span className={styles.value}>{classification}</span>
                </div>

                <div className={styles.field}>
                  <span className={styles.label}>Standing &amp; Status</span>
                  <span className={styles.statusBadge}>
                    {status} {checkedOn ? `· Verified ${checkedOn}` : ""}
                  </span>
                </div>
              </div>

              <div className={styles.actionWrap}>
                <a
                  href={rocUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.verifyBtn}
                  data-track-roc="about-license"
                >
                  <span>Verify on roc.az.gov</span>
                  <ExternalLinkIcon size={16} />
                </a>

                <div className={styles.callLicenseWrap}>
                  <CallButton
                    display={site.phone.display}
                    e164={site.phone.e164}
                    location="about-license"
                    size="md"
                  />
                </div>
              </div>
            </div>

            {/* Right: Consumer Education Guide */}
            <div className={styles.guideCard}>
              <h3 className={styles.guideTitle}>How to Verify Any Arizona Contractor</h3>
              <p className={styles.guideSub}>
                In Arizona, plumbing work exceeding $1,000 (including labor and materials) requires a licensed contractor. Check any contractor before you hire—it takes two minutes:
              </p>

              <ol className={styles.stepList}>
                <li className={styles.stepItem}>
                  <span className={styles.stepNumber}>1</span>
                  <div>
                    <strong className={styles.stepHead}>Search the Official Portal</strong>
                    <p className={styles.stepBody}>Visit roc.az.gov and click &quot;Contractor Search&quot;.</p>
                  </div>
                </li>

                <li className={styles.stepItem}>
                  <span className={styles.stepNumber}>2</span>
                  <div>
                    <strong className={styles.stepHead}>Enter ROC Number or Business Name</strong>
                    <p className={styles.stepBody}>
                      Search ROC #{roc} or &quot;{legalName}&quot; to pull up the public record.
                    </p>
                  </div>
                </li>

                <li className={styles.stepItem}>
                  <span className={styles.stepNumber}>3</span>
                  <div>
                    <strong className={styles.stepHead}>Confirm Status &amp; Scope</strong>
                    <p className={styles.stepBody}>
                      Confirm license status reads &quot;Active&quot; without disciplinary suspensions, and verify the trade classification covers plumbing (CR-37, C-37, or L-37).
                    </p>
                  </div>
                </li>
              </ol>

              <p className={styles.quoteLine}>
                &ldquo;Check any contractor before you hire. It takes two minutes.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
