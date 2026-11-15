import styles from "./KeyTakeaways.module.css";

interface KeyTakeawaysProps {
  takeaways: string[];
}

export function KeyTakeaways({ takeaways }: KeyTakeawaysProps) {
  if (!takeaways || takeaways.length === 0) return null;

  return (
    <aside className={styles.container} aria-label="Key Takeaways">
      <div className={styles.header}>
        <svg
          className={styles.icon}
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="9 11 12 14 22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
        <span className={styles.title}>Key Takeaways</span>
      </div>
      <ul className={styles.list}>
        {takeaways.map((item, idx) => (
          <li key={idx} className={styles.item}>
            {item}
          </li>
        ))}
      </ul>
    </aside>
  );
}
