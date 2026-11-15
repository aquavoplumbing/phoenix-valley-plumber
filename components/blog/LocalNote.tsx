import type { LocalFact } from "@/lib/post-schema";
import styles from "./LocalNote.module.css";

interface LocalNoteProps {
  heading?: string;
  facts: LocalFact[];
}

export function LocalNote({
  heading = "Phoenix Homes & Desert Plumbing Context",
  facts,
}: LocalNoteProps) {
  if (!facts || facts.length === 0) return null;

  return (
    <aside className={styles.container} aria-label="Phoenix Local Context">
      <div className={styles.header}>
        <span className={styles.badge}>Phoenix Angle</span>
        <h3 className={styles.title}>{heading}</h3>
      </div>
      <ul className={styles.list}>
        {facts.map((fact, idx) => (
          <li key={idx} className={styles.item}>
            <p className={styles.text}>{fact.text}</p>
            <span className={styles.sourceSpan}>
              Source:{" "}
              <a
                href={fact.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                Official Report / Documentation ↗
              </a>{" "}
              (As of {fact.asOf})
            </span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
