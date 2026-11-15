import Link from "next/link";
import type { CityContent } from "@/lib/city-schema";
import type { SiteConfig } from "@/lib/config";
import { formatHoursSummary, type OpenStatus } from "@/lib/hours";
import { CheckIcon, MapPinIcon, ShieldIcon } from "@/components/icons/Icons";
import { CallButton } from "@/components/ui/CallButton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ValleyLocator } from "./ValleyLocator";
import styles from "./CityHero.module.css";

interface CityHeroProps {
  city: CityContent;
  site: SiteConfig;
  initialStatus: OpenStatus;
}

export function CityHero({ city, site, initialStatus }: CityHeroProps) {
  const hoursSummary = formatHoursSummary(site.hours);
  const honestLine = city.coverage.servedFrom
    ? `Serving ${city.name} from ${city.coverage.servedFrom}`
    : `Serving ${city.name} and nearby Valley communities`;

  return (
    <section className={styles.hero} aria-label={`${city.name}, AZ plumbing introduction`}>
      <div className={styles.rippleWrap} aria-hidden="true">
        <div className={styles.rippleCircle1} />
        <div className={styles.rippleCircle2} />
      </div>

      <div className={`container ${styles.container}`}>
        <div className={styles.grid}>
          <div className={styles.left}>
            <div className={styles.eyebrowChip}>
              <ShieldIcon size={14} />
              <span>Licensed Arizona Plumber · ROC #{site.licensee.rocNumber}</span>
            </div>

            <h1 className={styles.h1}>{city.seo.h1}</h1>

            <p className={styles.introText}>{city.intro.answerFirst}</p>

            <div className={styles.coverageInfoChip}>
              <MapPinIcon size={15} />
              <span>{honestLine}</span>
            </div>

            <div className={styles.ctaWrap}>
              <CallButton
                display={site.phone.display}
                e164={site.phone.e164}
                location="city-hero"
                size="lg"
              />
              <span className={styles.ctaMicrocopy}>
                Tap to call · {hoursSummary || "Valley Service Hours"}
              </span>
            </div>

            <div className={styles.trustBadgesRow}>
              <div className={styles.trustBadgeItem}>
                <CheckIcon size={14} />
                <span>Direct Master Plumber Dispatch</span>
              </div>
              <div className={styles.trustBadgeItem}>
                <CheckIcon size={14} />
                <span>No Call Centers · Local Technicians</span>
              </div>
              <div className={styles.trustBadgeItem}>
                <CheckIcon size={14} />
                <span>Transparent Scope &amp; ROC Verified</span>
              </div>
            </div>

            <Link
              href="/contact/"
              className={styles.contactQuietLink}
              data-track-contact="city-hero"
            >
              Prefer to write? Go to the contact page →
            </Link>
          </div>

          <div className={styles.right}>
            <ValleyLocator
              currentCitySlug={city.slug}
              currentCityName={city.name}
              nearbySlugs={city.nearby}
            />

            <div className={styles.glassCard}>
              <StatusBadge hours={site.hours} initialStatus={initialStatus} variant="dark" />
              <span style={{ fontWeight: 600 }}>{city.coverage.zips.length} ZIP codes covered in {city.name}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
