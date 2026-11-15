import Link from "next/link";
import { PhoneLink } from "@/components/ui/PhoneLink";
import type { SiteConfig } from "@/lib/config";
import styles from "./QuickAnswer.module.css";

interface QuickAnswerProps {
  answer: string;
  relatedServiceSlug?: string;
  relatedServiceLabel?: string;
  site: SiteConfig;
}

export function QuickAnswer({
  answer,
  relatedServiceSlug,
  relatedServiceLabel,
  site,
}: QuickAnswerProps) {
  return (
    <section className={styles.container} aria-label="Quick Answer Summary">
      <div className={styles.badgeRow}>
        <span className={styles.badge}>Quick Answer</span>
      </div>
      <p className={styles.text}>{answer}</p>
      <div className={styles.actionRow}>
        {relatedServiceSlug && relatedServiceLabel ? (
          <Link href={`/${relatedServiceSlug}/`} className={styles.serviceLink}>
            Explore our {relatedServiceLabel} services →
          </Link>
        ) : null}
        <span className={styles.callPrompt}>
          Need help now?{" "}
          <PhoneLink
            display={site.phone.display}
            e164={site.phone.e164}
            location="post-quickanswer"
            className={styles.phoneLink}
          />
        </span>
      </div>
    </section>
  );
}
