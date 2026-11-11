import { ExternalLinkIcon, ShieldIcon } from "@/components/icons/Icons";
import { isPlaceholderValue, type SiteConfig } from "@/lib/config";
import { formatHoursSummary } from "@/lib/hours";
import styles from "./UtilityBar.module.css";

export function UtilityBar({ site }: { site: SiteConfig }) {
  const isDev = process.env.NODE_ENV !== "production";
  const missingName = isPlaceholderValue(site.licensee.legalName);
  const missingRoc = isPlaceholderValue(site.licensee.rocNumber);
  const hoursSummary = formatHoursSummary(site.hours);

  return (
    <div className={styles.bar}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.left}>
          <ShieldIcon size={16} className={styles.shield} />
          <span className={styles.rocText}>
            <span>{site.licensee.legalName}</span>
            {missingName && isDev ? <span className="todo-badge">TODO: legalName</span> : null}
            <span aria-hidden="true"> · </span>
            <strong>ROC #{site.licensee.rocNumber}</strong>
            {missingRoc && isDev ? <span className="todo-badge">TODO: ROC</span> : null}
          </span>
          <a
            href="https://roc.az.gov"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.verifyLink}
          >
            <span>Verify license</span>
            <ExternalLinkIcon size={13} />
          </a>
        </div>
        <div className={styles.right}>
          <span>Serving Phoenix &amp; the Valley</span>
          {hoursSummary ? (
            <>
              <span aria-hidden="true"> · </span>
              <span>{hoursSummary}</span>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

