import styles from "./OnThisPage.module.css";

export interface TocItem {
  id: string;
  label: string;
}

export function OnThisPage({ items }: { items: TocItem[] }) {
  if (items.length === 0) return null;

  return (
    <nav className={styles.wrap} aria-label="On this page">
      <p className={styles.heading}>On this page</p>
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`} className={styles.link}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

