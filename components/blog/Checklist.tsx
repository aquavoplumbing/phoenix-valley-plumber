import type { ReactNode } from "react";
import styles from "./Checklist.module.css";

interface ChecklistItem {
  task: string;
  detail?: string;
}

interface ChecklistProps {
  title?: string;
  items?: ChecklistItem[];
  children?: ReactNode;
}

export function Checklist({ title, items, children }: ChecklistProps) {
  return (
    <div className={styles.container}>
      {title && <h3 className={styles.title}>{title}</h3>}
      {items && items.length > 0 ? (
        <ul className={styles.list}>
          {items.map((item, idx) => (
            <li key={idx} className={styles.item}>
              <span className={styles.checkboxBox} aria-hidden="true" />
              <div className={styles.textWrap}>
                <span className={styles.task}>{item.task}</span>
                {item.detail && <span className={styles.detail}>{item.detail}</span>}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className={styles.childrenWrap}>{children}</div>
      )}
    </div>
  );
}

export function CheckItem({ children }: { children: ReactNode }) {
  return (
    <div className={styles.item}>
      <span className={styles.checkboxBox} aria-hidden="true" />
      <div className={styles.textWrap}>{children}</div>
    </div>
  );
}
