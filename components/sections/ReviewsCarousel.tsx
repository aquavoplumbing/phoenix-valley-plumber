"use client";

import { useRef, useState } from "react";
import type { ReviewItem } from "@/lib/routes";
import { ChevronLeftIcon, ChevronRightIcon, ExternalLinkIcon, StarIcon } from "@/components/icons/Icons";
import styles from "./Reviews.module.css";

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0] ?? ""}${parts[parts.length - 1]![0] ?? ""}`.toUpperCase();
}

export function ReviewsCarousel({
  reviews,
  defaultSource,
}: {
  reviews: ReviewItem[];
  defaultSource: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  const scrollByCard = (dir: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    const step = Math.min(track.clientWidth * 0.85, 380);
    track.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <div className={styles.carouselShell}>
      <div className={styles.controls}>
        <button
          type="button"
          className={styles.arrowBtn}
          aria-label="Previous reviews"
          onClick={() => scrollByCard(-1)}
        >
          <ChevronLeftIcon size={20} />
        </button>
        <button
          type="button"
          className={styles.arrowBtn}
          aria-label="Next reviews"
          onClick={() => scrollByCard(1)}
        >
          <ChevronRightIcon size={20} />
        </button>
      </div>

      <div
        ref={trackRef}
        className={styles.track}
        tabIndex={0}
        role="region"
        aria-label="Customer reviews carousel"
      >
        {reviews.map((review, idx) => {
          const isExpanded = Boolean(expanded[idx]);
          const sourceLabel = review.source || defaultSource;
          return (
            <article key={review.id ?? `${review.author}-${idx}`} className={styles.card}>
              <div className={styles.cardTop}>
                <div className={styles.avatar} aria-hidden="true">
                  {getInitials(review.author)}
                </div>
                <div>
                  <p className={styles.author}>{review.author}</p>
                  <p className={styles.meta}>
                    {review.city ? `${review.city} · ` : ""}
                    {review.date}
                  </p>
                </div>
              </div>

              <div className={styles.cardStars} aria-label={`${review.rating} out of 5 stars`}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <StarIcon
                    key={n}
                    size={16}
                    className={n <= review.rating ? styles.star : styles.starMuted}
                  />
                ))}
              </div>

              <p className={`${styles.quote} ${isExpanded ? "" : styles.quoteClamped}`}>
                “{review.text}”
              </p>

              <div className={styles.cardBottom}>
                {review.text.length > 160 ? (
                  <button
                    type="button"
                    className={styles.readMoreBtn}
                    aria-expanded={isExpanded}
                    onClick={() =>
                      setExpanded((prev) => ({ ...prev, [idx]: !prev[idx] }))
                    }
                  >
                    {isExpanded ? "Show less" : "Read more"}
                  </button>
                ) : (
                  <span />
                )}

                {review.sourceUrl ? (
                  <a
                    href={review.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.sourceLink}
                  >
                    <span>View on {sourceLabel}</span>
                    <ExternalLinkIcon size={13} />
                  </a>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

