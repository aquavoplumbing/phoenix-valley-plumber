import type { SiteConfig } from "@/lib/config";
import styles from "./WhatHappensNext.module.css";

interface WhatHappensNextProps {
  site: SiteConfig;
}

export function WhatHappensNext({ site }: WhatHappensNextProps) {
  const responsePromise = site.responseTime
    ? `We aim to reply within ${site.responseTime}.`
    : "We'll contact you as soon as our dispatchers can. For urgent problems, calling is faster.";

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.heading}>What Happens After You Submit:</h3>

      <ol className={styles.stepsList}>
        <li className={styles.stepItem}>
          <span className={styles.stepNumber}>1</span>
          <div className={styles.stepContent}>
            <strong className={styles.stepTitle}>Your Inquiry is Delivered</strong>
            <p className={styles.stepDesc}>
              Your information is securely forwarded directly to our local Phoenix dispatch inbox.
            </p>
          </div>
        </li>

        <li className={styles.stepItem}>
          <span className={styles.stepNumber}>2</span>
          <div className={styles.stepContent}>
            <strong className={styles.stepTitle}>Reviewed During Business Hours</strong>
            <p className={styles.stepDesc}>
              A local technician or service coordinator evaluates the issue, scope, and technician availability.
            </p>
          </div>
        </li>

        <li className={styles.stepItem}>
          <span className={styles.stepNumber}>3</span>
          <div className={styles.stepContent}>
            <strong className={styles.stepTitle}>We Contact You Directly</strong>
            <p className={styles.stepDesc}>
              We reach out by phone or email to schedule an appointment or provide guidance. {responsePromise}
            </p>
          </div>
        </li>
      </ol>
    </div>
  );
}
