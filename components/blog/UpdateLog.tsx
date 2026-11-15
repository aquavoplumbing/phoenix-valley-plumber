import type { ChangelogItem } from "@/lib/post-schema";
import styles from "./UpdateLog.module.css";

interface UpdateLogProps {
  dateModified?: string;
  changelog: ChangelogItem[];
}

export function UpdateLog({ dateModified, changelog }: UpdateLogProps) {
  if (!changelog || changelog.length === 0) return null;

  return (
    <details className={styles.container}>
      <summary className={styles.summary}>
        <span>
          Article History & Updates {dateModified ? `(Last modified: ${dateModified})` : ""}
        </span>
        <span className={styles.chevron} aria-hidden="true">▾</span>
      </summary>
      <div className={styles.content}>
        <ol className={styles.list}>
          {changelog.map((item, idx) => (
            <li key={idx} className={styles.item}>
              <span className={styles.date}>{item.date}</span>
              <span className={styles.summaryText}>{item.summary}</span>
            </li>
          ))}
        </ol>
      </div>
    </details>
  );
}
