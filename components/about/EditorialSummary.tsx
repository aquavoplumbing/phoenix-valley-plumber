import Link from "next/link";
import styles from "./EditorialSummary.module.css";

export function EditorialSummary() {
  return (
    <section className={styles.section} aria-labelledby="editorial-heading">
      <div className="container">
        <div className={styles.card}>
          <div className={styles.content}>
            <span className={styles.badge}>Editorial Independence &amp; Quality</span>
            <h2 id="editorial-heading" className={styles.title}>
              How We Write Our Advice
            </h2>
            <p className={styles.body}>
              Our plumbing troubleshooting advice and cost guides are researched using official Arizona municipal water reports, trade data, and local building codes. We plainly disclose whenever automated tools assist in drafting, and all safety-critical advice is reviewed for accuracy before publication.
            </p>
            <div className={styles.links}>
              <Link href="/editorial-policy/" className={styles.primaryLink}>
                Read Our Full Editorial Policy →
              </Link>
              <Link href="/blog/" className={styles.secondaryLink}>
                Browse Plumbing Blog &amp; Guides →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
