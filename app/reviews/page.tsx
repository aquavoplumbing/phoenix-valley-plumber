import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSiteConfigResult } from "@/lib/config";
import { getSiteUrl } from "@/lib/routes";
import { computeOpenStatus } from "@/lib/hours";
import { Breadcrumbs } from "@/components/service/Breadcrumbs";
import { CallButton } from "@/components/ui/CallButton";
import { FinalCta } from "@/components/sections/FinalCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbSchema } from "@/lib/schema";
import { ShieldIcon } from "@/components/icons/Icons";
import styles from "./Reviews.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const { config: site } = getSiteConfigResult();
  if (!site.reviews?.verified || site.reviews.verified.length < 5) {
    return {
      robots: { index: false, follow: false },
    };
  }

  const siteUrl = getSiteUrl(site);
  const title = `Verified Customer Reviews | ${site.brand}`;
  const description = `Read genuine, verified homeowner reviews and feedback for plumbing services provided by ${site.brand} across Phoenix and the Valley.`;

  return {
    title: {
      absolute: title,
    },
    description,
    alternates: {
      canonical: `${siteUrl}/reviews/`,
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/reviews/`,
      type: "website",
      siteName: site.brand,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function ReviewsPage() {
  const { config: site } = getSiteConfigResult();

  // Strict gating: renders only when at least 5 real verified reviews exist
  if (!site.reviews?.verified || site.reviews.verified.length < 5) {
    notFound();
  }

  const siteUrl = getSiteUrl(site);
  const initialStatus = computeOpenStatus(site.hours);
  const verifiedReviews = site.reviews.verified;

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Customer Reviews", href: "/reviews/" },
  ];

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: `${siteUrl}/` },
    { name: "Customer Reviews", url: `${siteUrl}/reviews/` },
  ]);

  return (
    <div className={styles.page}>
      <JsonLd data={breadcrumbSchema} />

      <section className={styles.hero}>
        <div className="container">
          <Breadcrumbs items={breadcrumbItems} />

          <div className={styles.heroInner}>
            <h1 className={styles.h1}>Verified Customer Feedback</h1>
            <p className={styles.lead}>
              Read candid experiences from Valley homeowners who trusted our licensed plumbing
              partners for water heater replacements, emergency drain clearing, and leak repairs.
            </p>

            <CallButton
              display={site.phone.display}
              e164={site.phone.e164}
              location="reviews-hero"
              size="lg"
            />
          </div>
        </div>
      </section>

      <div className="container">
        <div className={styles.reviewGrid}>
          {verifiedReviews.map((rev, idx) => (
            <article key={rev.id || idx} className={styles.reviewCard}>
              <div>
                <div className={styles.reviewHeader}>
                  <div>
                    <h2 className={styles.reviewerName}>{rev.reviewerName}</h2>
                    <p className={styles.reviewerMeta}>
                      {rev.city}, AZ &bull; {rev.service}
                    </p>
                  </div>
                  <div className={styles.ratingStars} aria-label={`${rev.rating} out of 5 stars`}>
                    {"★".repeat(Math.round(rev.rating))}
                  </div>
                </div>

                <p className={styles.reviewBody}>{rev.body}</p>
              </div>

              <div className={styles.reviewFooter}>
                <span>{rev.date}</span>
                {rev.verifiedSource ? (
                  <span className={styles.verifiedBadge}>
                    <ShieldIcon size={14} />
                    <span>Verified via {rev.verifiedSource}</span>
                  </span>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>

      <FinalCta site={site} initialStatus={initialStatus} />
    </div>
  );
}
