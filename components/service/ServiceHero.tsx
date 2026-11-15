import Image from "next/image";
import Link from "next/link";
import { isPlaceholderValue, type SiteConfig } from "@/lib/config";
import { formatHoursSummary, type OpenStatus } from "@/lib/hours";
import type { ServiceIconName } from "@/lib/routes";
import type { ServiceContent } from "@/lib/service-schema";
import { ShieldIcon, StarIcon } from "@/components/icons/Icons";
import { ServiceHeroIllustration } from "@/components/icons/ServiceIllustration";
import { CallButton } from "@/components/ui/CallButton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import styles from "./ServiceHero.module.css";

export function ServiceHero({
  site,
  content,
  icon,
  initialStatus,
}: {
  site: SiteConfig;
  content: ServiceContent;
  icon: ServiceIconName;
  initialStatus: OpenStatus;
}) {
  const isDev = process.env.NODE_ENV !== "production";
  const hoursSummary = formatHoursSummary(site.hours);

  const chips: string[] = [];
  if (site.licensee.bonded && site.licensee.insured) {
    chips.push("Licensed, Bonded & Insured");
  } else if (site.licensee.bonded) {
    chips.push("Licensed & Bonded");
  } else if (site.licensee.insured) {
    chips.push("Licensed & Insured");
  }
  if (site.claims.sameDayService) chips.push("Same-Day Service");
  if (site.claims.upfrontPricing) chips.push("Upfront Pricing");
  if (site.claims.freeEstimates) chips.push("Free Estimates");

  const hasRating =
    typeof site.rating.value === "number" &&
    typeof site.rating.count === "number" &&
    site.rating.count > 0;

  const heroImage = content.images?.hero;

  return (
    <section className={styles.hero} aria-labelledby="service-hero-heading">
      <div className={styles.bgEffects} aria-hidden="true">
        <div className={`${styles.ripple} ${styles.rippleOne}`} />
        <div className={`${styles.ripple} ${styles.rippleTwo}`} />
        <svg className={styles.contourSvg} viewBox="0 0 1200 220" preserveAspectRatio="none">
          <path
            d="M0 130 Q 240 80 480 125 T 960 100 T 1200 140"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M0 175 Q 280 135 560 170 T 1020 150 T 1200 185"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      <div className={`container ${styles.grid}`}>
        <div className={styles.content}>
          <div className={`${styles.eyebrow} ${styles.stagger1}`}>
            <ShieldIcon size={16} />
            <span>Licensed Arizona Plumber · ROC #{site.licensee.rocNumber}</span>
            {isPlaceholderValue(site.licensee.rocNumber) && isDev ? (
              <span className="todo-badge">TODO: ROC</span>
            ) : null}
          </div>

          <h1 id="service-hero-heading" className={`${styles.title} ${styles.stagger2}`}>
            {content.seo.h1}
          </h1>

          <p className={`${styles.subhead} ${styles.stagger3}`}>
            {content.intro.answerFirst}
          </p>

          {content.intro.support ? (
            <p className={`${styles.support} ${styles.stagger3}`}>
              {content.intro.support}
            </p>
          ) : null}

          <div className={`${styles.ctaBlock} ${styles.stagger4}`}>
            <div className={styles.pulseWrap}>
              <CallButton
                display={site.phone.display}
                e164={site.phone.e164}
                location="svc-hero"
                size="lg"
              />
            </div>
            <p className={styles.microcopy}>
              Tap to call · {hoursSummary || "Call during posted service hours"}
            </p>
          </div>

          {chips.length > 0 || hasRating ? (
            <div className={`${styles.chipsRow} ${styles.stagger5}`}>
              {chips.map((chip) => (
                <span key={chip} className={styles.chip}>
                  {chip}
                </span>
              ))}
              {hasRating ? (
                <span className={styles.chip}>
                  <StarIcon size={14} className={styles.starIcon} />
                  <span>
                    {site.rating.value?.toFixed(1)} on {site.rating.source} · {site.rating.count} reviews
                  </span>
                </span>
              ) : null}
            </div>
          ) : null}

          <p className={`${styles.contactRow} ${styles.stagger5}`}>
            <Link
              href="/contact/"
              className={styles.contactLink}
              data-track-contact="svc-hero"
            >
              Prefer to write? Go to the contact page →
            </Link>
          </p>
        </div>

        <div className={styles.visualCol}>
          <div className={styles.visualFrame}>
            {heroImage ? (
              <Image
                src={heroImage.src}
                alt={heroImage.alt}
                width={heroImage.width}
                height={heroImage.height}
                priority
                sizes="(max-width: 899px) 100vw, 42vw"
                className={styles.heroImage}
              />
            ) : (
              <ServiceHeroIllustration icon={icon} slug={content.slug} />
            )}

            <div className={styles.glassCard}>
              <StatusBadge
                hours={site.hours}
                initialStatus={initialStatus}
                variant="dark"
              />
              <span>Serving Phoenix and the Valley</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

