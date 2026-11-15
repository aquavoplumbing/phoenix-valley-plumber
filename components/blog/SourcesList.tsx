import type { Source } from "@/lib/post-schema";
import styles from "./SourcesList.module.css";

interface SourcesListProps {
  sources: Source[];
}

export function SourcesList({ sources }: SourcesListProps) {
  if (!sources || sources.length === 0) return null;

  const typeLabels: Record<string, string> = {
    government: "Government / Municipal",
    utility: "Public Utility",
    manufacturer: "Equipment Manufacturer",
    standards: "Technical Standards Body",
    research: "Academic / Research",
    trade: "Trade Association",
  };

  return (
    <section className={styles.container} aria-label="Sources and Documentation">
      <h2 className={styles.heading}>Sources & Primary Documentation</h2>
      <p className={styles.intro}>
        To protect homeowners from misinformation, all technical metrics, water hardness measurements, and building codes cited in this guide are verified against primary records:
      </p>
      <ol className={styles.list}>
        {sources.map((source, idx) => (
          <li key={idx} className={styles.item}>
            <div className={styles.sourceMeta}>
              <span className={styles.publisher}>{source.publisher}</span>
              <span className={styles.typeBadge}>
                {typeLabels[source.type] ?? source.type}
              </span>
            </div>
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.titleLink}
            >
              {source.title} ↗
            </a>
            <span className={styles.retrieved}>
              Verified record retrieved: {source.retrievedOn}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
