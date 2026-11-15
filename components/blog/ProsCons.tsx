import styles from "./ProsCons.module.css";

interface ProsConsProps {
  prosTitle?: string;
  pros: string[];
  consTitle?: string;
  cons: string[];
}

export function ProsCons({
  prosTitle = "Advantages",
  pros,
  consTitle = "Disadvantages & Limits",
  cons,
}: ProsConsProps) {
  return (
    <div className={styles.grid}>
      <div className={styles.proBox}>
        <div className={styles.header}>
          <span className={styles.proIcon} aria-hidden="true">✓</span>
          <h3 className={styles.title}>{prosTitle}</h3>
        </div>
        <ul className={styles.list}>
          {pros.map((p, idx) => (
            <li key={idx} className={styles.item}>{p}</li>
          ))}
        </ul>
      </div>

      <div className={styles.conBox}>
        <div className={styles.header}>
          <span className={styles.conIcon} aria-hidden="true">✕</span>
          <h3 className={styles.title}>{consTitle}</h3>
        </div>
        <ul className={styles.list}>
          {cons.map((c, idx) => (
            <li key={idx} className={styles.item}>{c}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
