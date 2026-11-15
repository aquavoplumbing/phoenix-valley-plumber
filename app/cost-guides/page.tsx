import type { Metadata } from "next";
import Link from "next/link";
import { getSiteConfigResult } from "@/lib/config";
import { getSiteUrl } from "@/lib/routes";
import { getPublishedCostGuides } from "@/lib/blog-data";
import { PostCard } from "@/components/blog/PostCard";
import { computeOpenStatus } from "@/lib/hours";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/service/Breadcrumbs";
import { CallButton } from "@/components/ui/CallButton";
import { PhoneLink } from "@/components/ui/PhoneLink";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { FinalCta } from "@/components/sections/FinalCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbSchema } from "@/lib/schema";
import { ArrowRightIcon } from "@/components/icons/Icons";
import styles from "./CostGuidesHub.module.css";

export const dynamic = "force-static";

export function generateMetadata(): Metadata {
  const { config: site } = getSiteConfigResult();
  const siteUrl = getSiteUrl(site);
  const costGuides = getPublishedCostGuides();
  const isIndexed = costGuides.length >= 3;

  return {
    title: {
      absolute: `Plumbing Cost Guides for Phoenix | ${site.brand}`,
    },
    description:
      "Verified regional plumbing cost factors, permit guidelines, and replacement cost guides for Phoenix homeowners. Sourced, realistic, and updated.",
    alternates: {
      canonical: `${siteUrl}/cost-guides/`,
    },
    robots: {
      index: isIndexed,
      follow: true,
    },
    openGraph: {
      title: `Plumbing Cost Guides for Phoenix Homeowners | ${site.brand}`,
      description:
        "Transparent regional cost guides and pricing factor breakdowns for water heaters, sewer lines, slab leaks, and softeners in Phoenix.",
      url: `${siteUrl}/cost-guides/`,
      type: "website",
      siteName: site.brand,
    },
    twitter: {
      card: "summary_large_image",
      title: `Plumbing Cost Guides for Phoenix Homeowners | ${site.brand}`,
      description:
        "Transparent regional cost guides and pricing factor breakdowns for water heaters, sewer lines, slab leaks, and softeners in Phoenix.",
    },
  };
}

const CATEGORY_ORDER = [
  { key: "water-heaters", label: "Water Heaters & Heating Systems" },
  { key: "drains-and-sewer", label: "Drain Cleaning & Sewer Lines" },
  { key: "leaks-and-pipes", label: "Pipes, Leaks & Foundations" },
  { key: "toilets-and-fixtures", label: "Toilets & Plumbing Fixtures" },
  { key: "water-treatment", label: "Water Treatment & Softening" },
  { key: "costs", label: "General Plumbing Cost Guides" },
];

const COST_FACTORS = [
  {
    title: "Access & Subterranean Conditions",
    text: "Piping buried beneath thick concrete foundations or expansive caliche clay soil requires specialized electronic locating gear and trenchless equipment, increasing labor requirements compared to open crawlspace installations.",
  },
  {
    title: "Pipe Material & Existing System Age",
    text: "Connecting modern scale-resistant PEX or copper to deteriorating galvanized iron or brittle polybutylene piping requires specialized transition fittings, dielectric unions, or localized header replacements.",
  },
  {
    title: "Fuel Supply & Energy Hookups",
    text: "Gas water heaters demand verified atmospheric venting, combustion air clearance, and rigid black iron supply hookups, whereas electric units depend on dedicated 240-volt double-pole breaker panels.",
  },
  {
    title: "Municipal Permits & Code Compliance",
    text: "Most Valley municipalities require formal building safety permits for water heater replacements, sewer lateral excavations, and whole-home repiping to verify safety devices and seismic strapping meet local codes.",
  },
  {
    title: "Equipment Grade & Manufacturer Warranty",
    text: "Commercial-grade brass ball valves, heavy-gauge anode rods, and multi-stage water filtration units carry longer manufacturer warranties and durable components compared to contractor-grade builder units.",
  },
  {
    title: "Service Scheduling & Priority Dispatch",
    text: "Scheduling routine replacements during normal business hours provides predictable service, while severe burst pipes and pressurized flooding emergencies necessitate prompt priority dispatch across the Valley.",
  },
];

const RELATED_SERVICES = [
  { label: "Emergency Plumber", href: "/emergency-plumber/" },
  { label: "Water Heater Repair", href: "/water-heater-repair/" },
  { label: "Water Heater Replacement", href: "/water-heater-replacement/" },
  { label: "Sewer Line Repair", href: "/sewer-line-repair/" },
  { label: "Slab Leak Repair", href: "/slab-leak-repair/" },
  { label: "Water Softener Installation", href: "/water-softener-installation/" },
  { label: "Toilet Repair", href: "/toilet-repair/" },
  { label: "All Plumbing Services", href: "/services/" },
];

export default async function CostGuidesHubPage() {
  const { config: site } = getSiteConfigResult();
  const siteUrl = getSiteUrl(site);
  const costGuides = getPublishedCostGuides();
  const initialStatus = computeOpenStatus(site.hours);

  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: "Cost Guides" },
  ];

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: `${siteUrl}/` },
    { name: "Cost Guides", url: `${siteUrl}/cost-guides/` },
  ]);

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Plumbing Cost Guides for Phoenix Homeowners",
    description:
      "Transparent, sourced plumbing cost guides and factor explanations for Phoenix homeowners.",
    url: `${siteUrl}/cost-guides/`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: costGuides.map((guide, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        url: `${siteUrl}/cost-guides/${guide.frontmatter.slug}/`,
        name: guide.frontmatter.seo.h1,
      })),
    },
  };

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={collectionSchema} />

      <main className={styles.main}>
        <div className="container">
          <div className={styles.breadcrumbsWrap}>
            <Breadcrumbs items={breadcrumbs} />
          </div>

          <header className={styles.header}>
            <span className={styles.eyebrow}>Pricing Transparency</span>
            <h1 className={styles.title}>Plumbing Cost Guides for Phoenix Homeowners</h1>
            <p className={styles.lead}>
              Explore verified cost factor breakdowns, municipal permit considerations, and realistic
              replacement expectations for residential plumbing systems across the Phoenix metropolitan
              area. Our detailed guides synthesize regional trade data, manufacturer specifications, and
              Arizona Registrar of Contractors standards to help you make informed decisions before
              technicians arrive.
            </p>

            <div className={styles.heroActions}>
              <CallButton
                display={site.phone.display}
                e164={site.phone.e164}
                location="costhub-hero"
                size="lg"
              />
              <PhoneLink
                display={site.phone.display}
                e164={site.phone.e164}
                location="costhub-hero-inline"
              />
              <StatusBadge hours={site.hours} initialStatus={initialStatus} />
            </div>

            <div className={styles.disclaimerBanner} role="note" aria-label="Pricing notice">
              <p className={styles.disclaimerTitle}>Important Pricing Context</p>
              <p className={styles.disclaimerText}>
                Typical ranges, not quotes. Your price depends on your home and the work. Specific
                quotations require an on-site diagnostic inspection by a licensed technician to evaluate
                access, existing pipe materials, and local municipal permit requirements.
              </p>
            </div>
          </header>

          {/* Guides Grouped by Category */}
          {CATEGORY_ORDER.map((cat) => {
            const guidesInCat = costGuides.filter(
              (g) => g.frontmatter.category === cat.key || (cat.key === "costs" && g.frontmatter.type === "cost-guide")
            );
            if (guidesInCat.length === 0) return null;

            return (
              <section key={cat.key} className={styles.categoryGroup} aria-label={cat.label}>
                <h2 className={styles.categoryTitle}>{cat.label}</h2>
                <div className={styles.grid}>
                  {guidesInCat.map((guide) => (
                    <PostCard key={guide.frontmatter.slug} post={guide} />
                  ))}
                </div>
              </section>
            );
          })}

          {/* What Affects Any Plumbing Price Explainer */}
          <section className={styles.explainerSection} aria-labelledby="heading-factors">
            <h2 id="heading-factors" className={styles.sectionHeading}>
              What Affects Any Plumbing Price in Phoenix?
            </h2>
            <p className={styles.sectionLead}>
              While every residential plumbing configuration is unique, plumbing project costs across
              the Valley are consistently determined by six foundational technical factors:
            </p>

            <div className={styles.factorsGrid}>
              {COST_FACTORS.map((factor) => (
                <article key={factor.title} className={styles.factorCard}>
                  <h3 className={factor.title}>{factor.title}</h3>
                  <p className={styles.factorText}>{factor.text}</p>
                </article>
              ))}
            </div>
          </section>

          {/* How to Get an Accurate Quote Checklist */}
          <section className={styles.checklistSection} aria-labelledby="heading-quote">
            <h2 id="heading-quote" className={styles.checklistHeading}>
              How to Get an Accurate Plumbing Quote
            </h2>
            <p className={styles.checklistLead}>
              Avoid unexpected price surprises by following this straightforward consumer checklist
              whenever you consult a plumbing contractor:
            </p>

            <div className={styles.checklistGrid}>
              <div className={styles.checkCard}>
                <h3 className={styles.checkCardTitle}>1. Prepare Site Facts</h3>
                <p className={styles.checkCardText}>
                  Note the approximate age of your water heater, location of the main water shutoff valve,
                  and whether symptoms occur at a single fixture or throughout the entire household.
                </p>
              </div>

              <div className={styles.checkCard}>
                <h3 className={styles.checkCardTitle}>2. Ask Targeted Questions</h3>
                <p className={styles.checkCardText}>
                  Inquire whether the quoted price includes required municipal permit fees, disposal of
                  old equipment, new brass shutoff valves, and written workmanship warranties.
                </p>
              </div>

              <div className={styles.checkCard}>
                <h3 className={styles.checkCardTitle}>3. Verify Contractor License</h3>
                <p className={styles.checkCardText}>
                  Confirm the contractor holds an active license with the Arizona Registrar of Contractors.
                  Review our{" "}
                  <Link href="/about/#license" className={styles.licenseLink}>
                    License Verification Guide
                  </Link>{" "}
                  to look up bond standing and credentials on roc.az.gov.
                </p>
              </div>
            </div>

            <div className={styles.heroActions}>
              <CallButton
                display={site.phone.display}
                e164={site.phone.e164}
                location="costhub-quote"
                size="md"
              />
              <PhoneLink
                display={site.phone.display}
                e164={site.phone.e164}
                location="costhub-quote-inline"
              />
            </div>
          </section>

          {/* Related Services Strip */}
          <section className={styles.relatedServicesWrap} aria-labelledby="heading-related-services">
            <h2 id="heading-related-services" className={styles.relatedHeading}>
              Explore Associated Plumbing Services
            </h2>
            <div className={styles.relatedPills}>
              {RELATED_SERVICES.map((item) => (
                <Link key={item.href} href={item.href} className={styles.relatedPill}>
                  <span>{item.label}</span>
                  <ArrowRightIcon size={14} />
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>

      <FinalCta
        site={site}
        initialStatus={initialStatus}
        heading="Need an Honest Plumbing Estimate in Phoenix?"
        btnLocation="costhub-final"
      />
    </>
  );
}
