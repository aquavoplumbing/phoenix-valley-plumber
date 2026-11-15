import Link from "next/link";
import type { SiteConfig } from "@/lib/config";
import type { OpenStatus } from "@/lib/hours";
import { getServiceBySlug, type CityItem, type FaqItem, type ReviewItem, type ServiceItem } from "@/lib/routes";
import type { ServiceContent } from "@/lib/service-schema";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { Reviews } from "@/components/sections/Reviews";
import { ServiceAreas } from "@/components/sections/ServiceAreas";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { Breadcrumbs, type BreadcrumbItem } from "./Breadcrumbs";
import { ComparisonTable } from "./ComparisonTable";
import { CostFactors } from "./CostFactors";
import { DiyBox } from "./DiyBox";
import { HubChildGrid } from "./HubChildGrid";
import { HubHowToChoose } from "./HubHowToChoose";
import { MethodCards } from "./MethodCards";
import { PhoenixAngle } from "./PhoenixAngle";
import { ProcessSteps } from "./ProcessSteps";
import { RelatedServices } from "./RelatedServices";
import { ServiceEmergencyBlock } from "./ServiceEmergencyBlock";
import { ServiceHero } from "./ServiceHero";
import { ServiceMidCta } from "./ServiceMidCta";
import { SymptomGrid } from "./SymptomGrid";
import styles from "./ServicePageTemplate.module.css";

export function ServicePageTemplate({
  site,
  content,
  serviceMeta,
  cities,
  reviews,
  initialStatus,
  devErrors,
}: {
  site: SiteConfig;
  content: ServiceContent;
  serviceMeta: ServiceItem;
  cities: CityItem[];
  reviews: ReviewItem[];
  initialStatus: OpenStatus;
  devErrors?: string[];
}) {
  const isDev = process.env.NODE_ENV !== "production";
  const isHub = content.type === "hub";
  const hubItem = content.related.hub ? getServiceBySlug(content.related.hub) : undefined;

  const breadcrumbs: BreadcrumbItem[] = [{ label: "Home", href: "/" }];
  if (content.slug !== "services") {
    breadcrumbs.push({ label: "Services", href: "/services/" });
  }
  if (hubItem && hubItem.slug !== "services") {
    breadcrumbs.push({ label: hubItem.shortName, href: `/${hubItem.slug}/` });
  }
  breadcrumbs.push({ label: serviceMeta.shortName });

  const faqItems: FaqItem[] = content.faqs.map((faq, idx) => ({
    id: `${content.slug}-faq-${idx + 1}`,
    question: faq.q,
    answer: faq.a,
  }));

  const showEmergency =
    Boolean(content.emergency) &&
    (content.urgency === "high" || content.urgency === "medium");

  return (
    <div data-service-slug={content.slug}>
      {isDev && devErrors && devErrors.length > 0 ? (
        <div className={styles.devTodoBanner} role="status">
          <strong>Draft TODO ({content.slug}.json):</strong>{" "}
          {devErrors.join(" · ")}
        </div>
      ) : null}

      <Breadcrumbs items={breadcrumbs} />

      <ServiceHero
        site={site}
        content={content}
        icon={serviceMeta.icon}
        initialStatus={initialStatus}
      />

      <TrustStrip site={site} />

      {showEmergency && content.emergency ? (
        <div className={styles.bandWhite}>
          <div className="container">
            <ServiceEmergencyBlock site={site} emergency={content.emergency} />
          </div>
        </div>
      ) : null}

      {isHub ? (
        <>
          {content.related.children && content.related.children.length > 0 ? (
            <div className={styles.bandSand}>
              <div className="container">
                <HubChildGrid
                  site={site}
                  heading={`${serviceMeta.shortName} in Phoenix`}
                  childSlugs={content.related.children}
                />
              </div>
            </div>
          ) : null}

          {content.howToChoose && content.howToChoose.length > 0 ? (
            <div className={styles.bandWhite}>
              <div className="container">
                <HubHowToChoose rows={content.howToChoose} />
              </div>
            </div>
          ) : null}

          <ServiceMidCta
            site={site}
            serviceName={serviceMeta.shortName}
            initialStatus={initialStatus}
          />

          <div className={styles.bandSand}>
            <div className="container">
              <PhoenixAngle
                slug={content.slug}
                phoenixAngle={content.phoenixAngle}
                image={content.images?.hero}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          {content.symptoms ? (
            <div className={styles.bandSand}>
              <div className="container">
                <SymptomGrid
                  site={site}
                  heading={`Signs You Need ${serviceMeta.shortName}`}
                  symptoms={content.symptoms}
                />
              </div>
            </div>
          ) : null}

          {content.methods ? (
            <div className={styles.bandWhite}>
              <div className={`container ${styles.stack}`}>
                <MethodCards
                  heading={`${serviceMeta.shortName} Options in Phoenix`}
                  methods={content.methods}
                />
                {content.comparison ? (
                  <ComparisonTable comparison={content.comparison} />
                ) : null}
              </div>
            </div>
          ) : null}

          <ServiceMidCta
            site={site}
            serviceName={serviceMeta.shortName}
            initialStatus={initialStatus}
          />

          {content.process || content.diy ? (
            <div className={styles.bandSand}>
              <div className={`container ${styles.stack}`}>
                {content.process ? (
                  <ProcessSteps
                    site={site}
                    heading={`How ${serviceMeta.shortName} Works When You Call`}
                    process={content.process}
                  />
                ) : null}
                {content.diy ? <DiyBox diy={content.diy} /> : null}
              </div>
            </div>
          ) : null}

          <div className={styles.bandWhite}>
            <div className="container">
              <PhoenixAngle
                slug={content.slug}
                phoenixAngle={content.phoenixAngle}
                image={content.images?.hero}
              />
            </div>
          </div>

          {content.costFactors ? (
            <div className={styles.bandSand}>
              <div className="container">
                <CostFactors
                  site={site}
                  heading={`What Affects ${serviceMeta.shortName} Cost in Phoenix`}
                  costFactors={content.costFactors}
                  costGuideSlug={content.related.costGuide}
                />
              </div>
            </div>
          ) : null}

          {(content.related.siblings.length > 0 ||
            (content.related.inBodyLinks && content.related.inBodyLinks.length > 0)) ? (
            <div className={styles.bandWhite}>
              <div className={`container ${styles.stackSm}`}>
                {content.related.inBodyLinks && content.related.inBodyLinks.length > 0 ? (
                  <div className={styles.quickLinks}>
                    {content.related.inBodyLinks.map((item) => (
                      <Link
                        key={item.slug}
                        href={`/${item.slug}/`}
                        className={styles.quickLinkCard}
                        data-related-service={item.slug}
                        data-from-slug={content.slug}
                      >
                        <span className={styles.quickLinkSentence}>{item.sentence}</span>
                        <span className={styles.quickLinkAnchor}>{item.anchorText} →</span>
                      </Link>
                    ))}
                  </div>
                ) : null}
                <RelatedServices currentSlug={content.slug} related={content.related} />
              </div>
            </div>
          ) : null}
        </>
      )}

      <WhyChooseUs site={site} />

      <Reviews site={site} reviews={reviews} />

      <ServiceAreas site={site} cities={cities} />

      <Faq
        site={site}
        faqs={faqItems}
        title={`${serviceMeta.shortName} FAQ`}
        subtitle={`Common questions Phoenix homeowners ask about ${serviceMeta.shortName.toLowerCase()}.`}
        callLocation="svc-faq"
      />

      <FinalCta
        site={site}
        initialStatus={initialStatus}
        heading={`${serviceMeta.shortName} in Phoenix? Call Now.`}
        numberLocation="svc-final"
        btnLocation="svc-final"
      />
    </div>
  );
}
