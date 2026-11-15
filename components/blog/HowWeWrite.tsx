import Link from "next/link";
import type { Post } from "@/lib/post-schema";
import styles from "./HowWeWrite.module.css";

interface HowWeWriteProps {
  production: Post["production"];
}

export function HowWeWrite({ production }: HowWeWriteProps) {
  return (
    <section className={styles.container} aria-label="How This Article Was Produced">
      <div className={styles.header}>
        <span className={styles.badge}>Editorial Transparency</span>
        <h3 className={styles.title}>How This Guide Was Written</h3>
      </div>
      <div className={styles.statusGrid}>
        <div className={styles.statusItem}>
          <span className={styles.indicator} aria-hidden="true">✓</span>
          <div>
            <strong>Human Reviewed & Edited</strong>
            <p>Every paragraph and diagnostic step was checked by an experienced human editor.</p>
          </div>
        </div>
        <div className={styles.statusItem}>
          <span className={styles.indicator} aria-hidden="true">✓</span>
          <div>
            <strong>Fact-Checked Against Primary Sources</strong>
            <p>All hardness ratings and cost metrics come from official reports, not aggregator blogs.</p>
          </div>
        </div>
        <div className={styles.statusItem}>
          <span className={production.aiAssisted ? styles.indicator : styles.indicatorNeutral} aria-hidden="true">
            {production.aiAssisted ? "ℹ" : "—"}
          </span>
          <div>
            <strong>Production Method</strong>
            <p>
              {production.aiAssisted
                ? "Drafting and synthesis were assisted by AI research tools, followed by complete technical verification."
                : "Researched and drafted entirely by our human plumbing editorial team without automated generative drafting."}
            </p>
          </div>
        </div>
      </div>
      {production.note && <p className={styles.note}>{production.note}</p>}
      <div className={styles.policyRow}>
        <Link href="/editorial-policy/" className={styles.policyLink}>
          Learn about our editorial integrity policy, sourcing standards, and corrections process →
        </Link>
      </div>
    </section>
  );
}
