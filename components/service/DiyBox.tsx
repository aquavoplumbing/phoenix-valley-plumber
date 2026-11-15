import type { ServiceContent } from "@/lib/service-schema";
import styles from "./DiyBox.module.css";

export function DiyBox({ diy }: { diy: NonNullable<ServiceContent["diy"]> }) {
  return (
    <section id="diy-or-call" aria-labelledby="diy-heading">
      <h2 id="diy-heading">DIY or Call a Plumber?</h2>
      <div className={styles.grid}>
        <div className={styles.panelSafe}>
          <h3 className={styles.panelTitle}>Safe to try</h3>
          <ul className={styles.list}>
            {diy.canTry.map((item) => (
              <li key={item} className={styles.item}>
                <span className={styles.safeMark} aria-hidden="true">
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.panelCall}>
          <h3 className={styles.panelTitle}>Call a plumber when</h3>
          <ul className={styles.list}>
            {diy.callWhen.map((item) => (
              <li key={item} className={styles.item}>
                <span className={styles.callMark} aria-hidden="true">
                  !
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

