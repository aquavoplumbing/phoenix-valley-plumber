import type { SiteConfig } from "@/lib/config";
import type { ReviewItem } from "@/lib/routes";
import { StarIcon } from "@/components/icons/Icons";
import { CallButton } from "@/components/ui/CallButton";
import { ReviewsCarousel } from "./ReviewsCarousel";
import styles from "./Reviews.module.css";

export function Reviews({
  site,
  reviews,
}: {
  site: SiteConfig;
  reviews: ReviewItem[];
}) {
  // Rule 2 & Section 10: If reviews.json is empty, do not render this section at all.
  if (reviews.length === 0) {
    return null;
  }

  const computedAvg =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const displayValue = (site.rating.value ?? computedAvg).toFixed(1);
  const displayCount = site.rating.count ?? reviews.length;
  const sourceName = site.rating.source || "Google";

  return (
    <section className={styles.section} aria-labelledby="reviews-heading">
      <div className="container">
        <div className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Verified Customer Reviews</p>
            <h2 id="reviews-heading" className={styles.title}>
              What Valley Homeowners Say
            </h2>
          </div>

          <div className={styles.summaryPill}>
            <div className={styles.stars} aria-hidden="true">
              {[1, 2, 3, 4, 5].map((n) => (
                <StarIcon key={n} size={18} className={styles.star} />
              ))}
            </div>
            <span className={styles.summaryText}>
              <strong>{displayValue}</strong> on {sourceName} · {displayCount} reviews
            </span>
          </div>
        </div>

        <ReviewsCarousel reviews={reviews} defaultSource={sourceName} />

        <div className={styles.ctaRow}>
          <p className={styles.ctaText}>
            Join your neighbors — call {site.phone.display}
          </p>
          <CallButton
            display={site.phone.display}
            e164={site.phone.e164}
            location="reviews"
          />
        </div>
      </div>
    </section>
  );
}

