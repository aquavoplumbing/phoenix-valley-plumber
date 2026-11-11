import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import Link from "next/link";
import { isPlaceholderValue, type SiteConfig } from "@/lib/config";
import { formatHoursSummary, type OpenStatus } from "@/lib/hours";
import { ShieldIcon, StarIcon } from "@/components/icons/Icons";
import { HeroIllustration } from "@/components/icons/HeroIllustration";
import { CallButton } from "@/components/ui/CallButton";
import styles from "./Hero.module.css";

function findHeroImage(): string | null {
  const candidates = ["hero-main.avif", "hero-main.webp", "hero-main.jpg", "hero-main.png"];
  for (const name of candidates) {
    if (fs.existsSync(path.join(process.cwd(), "public", "img", name))) {
      return `/img/${name}`;
    }
  }
  return null;
}

export function Hero({
  site,
  initialStatus,
}: {
  site: SiteConfig;
  initialStatus: OpenStatus;
}) {
  const isDev = process.env.NODE_ENV !== "production";
  const heroImgSrc = findHeroImage();
  const hoursSummary = formatHoursSummary(site.hours);

  const headline = site.claims.sameDayService
    ? "Phoenix Plumber — Call for Same-Day Service"
    : "Phoenix Plumber You Can Call Right Now";

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

  const hasRating =
    typeof site.rating.value === "number" &&
    typeof site.rating.count === "number" &&
    site.rating.count > 0;

  return (
    <section className={styles.hero} aria-labelledby="hero-heading">
      {/* Background water ripple and subtle desert contour pattern */}
      <div className={styles.bgEffects} aria-hidden="true">
        <div className={`${styles.ripple} ${styles.rippleOne}`} />
        <div className={`${styles.ripple} ${styles.rippleTwo}`} />
        <svg className={styles.contourSvg} viewBox="0 0 1200 600" preserveAspectRatio="none">
          <path
            d="M0 440 Q 220 380 460 430 T 920 400 T 1200 445"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M0 495 Q 260 445 520 490 T 980 465 T 1200 505"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M0 545 Q 310 505 600 540 T 1040 520 T 1200 555"
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
            <span>
              Licensed Arizona Plumber · ROC #{site.licensee.rocNumber}
            </span>
            {isPlaceholderValue(site.licensee.rocNumber) && isDev ? (
              <span className="todo-badge">TODO: ROC</span>
            ) : null}
          </div>

          <h1 id="hero-heading" className={`${styles.title} ${styles.stagger2}`}>
            {headline}
          </h1>

          <p className={`${styles.subhead} ${styles.stagger3}`}>
            Burst pipes, leaking water heaters, clogged drains and sewer problems across
            Phoenix, Scottsdale, Tempe, Mesa and the Valley.
            {site.claims.liveAnswer ? " Call and talk to a real person." : ""}
          </p>

          <div className={`${styles.ctaBlock} ${styles.stagger4}`}>
            <div className={styles.pulseWrap}>
              <CallButton
                display={site.phone.display}
                e164={site.phone.e164}
                location="hero"
                size="lg"
                className={styles.heroCallBtn}
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
              data-track-contact="hero"
            >
              Prefer to write? Go to the contact page →
            </Link>
          </p>
        </div>

        <div className={styles.visualCol}>
          <div className={styles.visualFrame}>
            {heroImgSrc ? (
              <Image
                src={heroImgSrc}
                alt="Licensed plumber servicing plumbing equipment at a Phoenix, AZ home"
                width={1600}
                height={1000}
                priority
                sizes="(max-width: 899px) 100vw, 44vw"
                className={styles.heroImage}
              />
            ) : (
              <HeroIllustration />
            )}

            {initialStatus.isOpen ? (
              <div className={styles.glassCard}>
                <span className={styles.liveDot} aria-hidden="true" />
                <span>Technicians available in the Valley today</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

