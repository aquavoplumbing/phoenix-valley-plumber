import type { PostTocItem } from "@/lib/post-schema";
import styles from "./Toc.module.css";

interface TocProps {
  items: PostTocItem[];
  variant?: "inline" | "aside";
}

export function Toc({ items, variant = "aside" }: TocProps) {
  if (!items || items.length === 0) return null;

  const content = (
    <nav aria-label="On this page" className={styles.nav}>
      <ol className={styles.list}>
        {items.map((item) => (
          <li
            key={item.id}
            className={item.level === 3 ? styles.itemSub : styles.item}
          >
            <a
              href={`#${item.id}`}
              className={styles.link}
              data-toc-link=""
            >
              {item.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );

  if (variant === "inline") {
    return (
      <details className={styles.collapsible}>
        <summary className={styles.summary}>
          <span className={styles.summaryTitle}>On this page ({items.length} sections)</span>
          <span className={styles.chevron} aria-hidden="true">▾</span>
        </summary>
        <div className={styles.collapsibleBody}>{content}</div>
      </details>
    );
  }

  return (
    <div className={styles.asideCard}>
      <div className={styles.asideHeader}>
        <span className={styles.asideTitle}>On This Page</span>
      </div>
      {content}
    </div>
  );
}
