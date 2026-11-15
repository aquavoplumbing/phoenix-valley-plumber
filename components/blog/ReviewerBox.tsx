import type { Post } from "@/lib/post-schema";
import styles from "./ReviewerBox.module.css";

interface ReviewerBoxProps {
  reviewer: NonNullable<Post["reviewer"]>;
}

export function ReviewerBox({ reviewer }: ReviewerBoxProps) {
  return (
    <aside className={styles.container} aria-label="Technical Reviewer Verification">
      <div className={styles.iconWrap} aria-hidden="true">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      </div>
      <div className={styles.info}>
        <span className={styles.badge}>Technical Safety Review Complete</span>
        <h3 className={styles.title}>
          Reviewed by <strong>{reviewer.author}</strong>
        </h3>
        <p className={styles.scope}>
          Scope: <em>{reviewer.scope}</em>
        </p>
        <span className={styles.dates}>
          Review completed on {reviewer.reviewedOn} (Consent on record: {reviewer.consentOn})
        </span>
      </div>
    </aside>
  );
}
