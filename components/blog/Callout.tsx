import type { ReactNode } from "react";
import styles from "./Callout.module.css";

interface CalloutProps {
  type?: "tip" | "note" | "warning" | "safety";
  title?: string;
  children: ReactNode;
}

export function Callout({ type = "note", title, children }: CalloutProps) {
  const labels: Record<string, string> = {
    tip: "Helpful Tip",
    note: "Important Note",
    warning: "Caution",
    safety: "Critical Safety Warning",
  };

  const displayTitle = title ?? labels[type];

  return (
    <aside className={`${styles.callout} ${styles[type]}`} role={type === "safety" ? "alert" : "note"}>
      <div className={styles.header}>
        <span className={styles.typeLabel}>{displayTitle}</span>
      </div>
      <div className={styles.content}>{children}</div>
    </aside>
  );
}
