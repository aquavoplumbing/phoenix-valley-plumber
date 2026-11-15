import type { CityContent } from "@/lib/city-schema";
import type { SiteConfig } from "@/lib/config";
import type { OpenStatus } from "@/lib/hours";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/service/Breadcrumbs";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { FinalCta } from "@/components/sections/FinalCta";
import { CallButton } from "@/components/ui/CallButton";
import { PhoneLink } from "@/components/ui/PhoneLink";
import { PhoneIcon } from "@/components/icons/Icons";
import { CityHero } from "./CityHero";
import { CityEmergencyBlock } from "./CityEmergencyBlock";
import { HardnessBars } from "./HardnessBars";
import { EraTimeline } from "./EraTimeline";
import { LocalServiceGrid } from "./LocalServiceGrid";
import { CoverageBlock } from "./CoverageBlock";
import { RecentJobs } from "./RecentJobs";
import { GoodToKnow } from "./GoodToKnow";
import { CityFaq } from "./CityFaq";
import { NearbyCities } from "./NearbyCities";
import styles from "./CityPageTemplate.module.css";

interface CityPageTemplateProps {
  city: CityContent;
  site: SiteConfig;
  initialStatus: OpenStatus;
  devErrors?: string[];
}

export function CityPageTemplate({
  city,
  site,
  initialStatus,
  devErrors,
}: CityPageTemplateProps) {
  const isDev = process.env.NODE_ENV !== "production";

  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: "Service Areas", href: "/locations/" },
    { label: `${city.name}, AZ` },
  ];

  return (
    <div data-city-slug={city.slug} className={styles.page}>
      {isDev && devErrors && devErrors.length > 0 ? (
        <div className={styles.devTodoBanner} role="status">
          <strong>Draft TODO ({city.slug}.json):</strong> {devErrors.join(" · ")}
        </div>
      ) : null}

      <Breadcrumbs items={breadcrumbs} />

      {/* 1. Location Hero with Map Locator & Quick Trust */}
      <CityHero city={city} site={site} initialStatus={initialStatus} />

      {/* 2. Trust Strip */}
      <TrustStrip site={site} />

      {/* 3. Emergency Fast-Dispatch Card */}
      <div className={styles.bandWhite}>
        <div className="container">
          <CityEmergencyBlock city={city} site={site} />
        </div>
      </div>

      {/* 4. PRIMARY CORE: Plumbing Services in {City} */}
      <section id="services" className={styles.bandSand} aria-labelledby="city-services-heading">
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionBadge}>Complete Plumbing Coverage</span>
            <h2 id="city-services-heading" className={styles.sectionTitle}>
              Plumbing Services in {city.name}, AZ
            </h2>
            <p className={styles.sectionSubtitle}>
              Prompt diagnostic visits, water heater repairs, sewer solutions, and complete fixture replacements across {city.name}:
            </p>
          </div>

          <LocalServiceGrid
            localServices={city.localServices}
            cityName={city.name}
            citySlug={city.slug}
            site={site}
          />
        </div>
      </section>

      {/* 5. Mid-Page Fast Dispatch Call Banner */}
      <section className={styles.midCtaBand} aria-label={`Call a ${city.name} plumber`}>
        <div className="container">
          <div className={styles.midCtaContent}>
            <div className={styles.midCtaText}>
              <h3 className={styles.midCtaTitle}>Need a Licensed Plumber in {city.name} Today?</h3>
              <p className={styles.midCtaDesc}>
                Speak directly with our local dispatch staff. No call centers, no online forms, no automated phone trees.
              </p>
            </div>
            <div className={styles.midCtaActions}>
              <CallButton
                display={site.phone.display}
                e164={site.phone.e164}
                location="city-mid-cta"
                size="lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 6. Where We Serve: Neighborhoods & ZIPs */}
      <section id="coverage" className={styles.bandWhite} aria-labelledby="city-coverage-heading">
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionBadge}>Local Coverage Area</span>
            <h2 id="city-coverage-heading" className={styles.sectionTitle}>
              Where We Serve in {city.name}
            </h2>
            <p className={styles.sectionSubtitle}>
              From master-planned subdivisions to established desert ranch properties, our technicians provide complete coverage across {city.name}:
            </p>
          </div>

          <CoverageBlock
            coverage={city.coverage}
            cityName={city.name}
            site={site}
          />
        </div>
      </section>

      {/* 7. Local Diagnostic Insights (Water & Housing Eras) */}
      <section id="local-insights" className={styles.bandSand} aria-labelledby="local-core-heading">
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionBadge}>Local Technical Expertise</span>
            <h2 id="local-core-heading" className={styles.sectionTitle}>
              Plumbing in {city.name}: What Makes This Area Unique
            </h2>
            <p className={styles.sectionSubtitle}>
              Local housing eras, soil conditions, and municipal water sources create distinct plumbing demands across {city.name}. Here is what homeowners need to know:
            </p>
          </div>

          <div className={styles.insightsStack}>
            {/* Sub-block 1: Housing and pipes */}
            {city.housing ? (
              <EraTimeline housing={city.housing} cityName={city.name} />
            ) : null}

            {/* Sub-block 2: Water hardness */}
            {city.water ? (
              <HardnessBars water={city.water} cityName={city.name} />
            ) : null}
          </div>

          <div className={styles.promptRow}>
            <span>Dealing with hard-water pipe scale or pressure issues in {city.name}?</span>
            <PhoneLink
              display={site.phone.display}
              e164={site.phone.e164}
              location="city-local-insights"
              className={styles.promptPhoneLink}
            >
              <PhoneIcon size={14} />
              <span>Call {site.phone.display} for Expert Local Advice</span>
            </PhoneLink>
          </div>
        </div>
      </section>

      {/* 8. Recent jobs in {City} (hidden if none) */}
      <RecentJobs jobs={city.jobs} />

      {/* 9. Permits & Utilities (Contractor Reference) */}
      <section id="good-to-know" className={styles.bandWhite} aria-labelledby="good-to-know-heading">
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionBadge}>Permits &amp; Emergency Contacts</span>
            <h2 id="good-to-know-heading" className={styles.sectionTitle}>
              {city.name} Building Codes &amp; Local Utility Info
            </h2>
            <p className={styles.sectionSubtitle}>
              Essential municipal building safety and utility emergency contacts for {city.name} property owners:
            </p>
          </div>

          <GoodToKnow city={city} site={site} />
        </div>
      </section>

      {/* 10. Local FAQs */}
      <section id="faqs" className={styles.bandSand} aria-labelledby="faqs-heading">
        <div className="container">
          <CityFaq
            faqs={city.faqs}
            cityName={city.name}
            citySlug={city.slug}
            site={site}
          />
        </div>
      </section>

      {/* 11. Nearby Valley Communities */}
      <section className={styles.bandWhite}>
        <div className="container">
          <NearbyCities
            nearbySlugs={city.nearby}
            currentCitySlug={city.slug}
            currentCityName={city.name}
          />
        </div>
      </section>

      {/* 12. Final High-Contrast Conversion CTA */}
      <FinalCta
        site={site}
        initialStatus={initialStatus}
        heading={`Plumbing Problem in ${city.name}? Call Now.`}
        numberLocation="city-final"
        btnLocation="city-final"
      />
    </div>
  );
}
