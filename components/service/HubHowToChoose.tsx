import Link from "next/link";
import type { ServiceContent } from "@/lib/service-schema";
import styles from "./HubHowToChoose.module.css";

export function HubHowToChoose({
  rows,
}: {
  rows: NonNullable<ServiceContent["howToChoose"]>;
}) {
  return (
    <section id="how-to-choose" aria-labelledby="how-to-choose-heading">
      <h2 id="how-to-choose-heading">How to Choose the Right Service</h2>

      <ul className={styles.list}>
        {rows.map((row) => (
          <li key={`${row.symptom}-${row.targetSlug}`} className={styles.row}>
            <div>
              <p className={styles.symptom}>{row.symptom}</p>
              <p className={styles.note}>{row.note}</p>
            </div>
            <Link href={`/${row.targetSlug}/`} className={styles.link}>
              {row.label} →
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

