import type { Metadata } from "next";
import Link from "next/link";
import { getSiteConfigResult } from "@/lib/config";
import { computeOpenStatus } from "@/lib/hours";
import { getCities, getSiteUrl } from "@/lib/routes";
import { getPublishedCities } from "@/lib/city-data";
import { buildHubPageSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/service/Breadcrumbs";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { FinalCta } from "@/components/sections/FinalCta";
import { ServiceAreaMap } from "@/components/sections/ServiceAreaMap";
import { CityHubGrid } from "@/components/city/CityHubGrid";
import { CallButton } from "@/components/ui/CallButton";
import { ShieldIcon, ChevronDownIcon } from "@/components/icons/Icons";
import { PhoneLink } from "@/components/ui/PhoneLink";
import faqStyles from "@/components/sections/Faq.module.css";
import heroStyles from "@/components/city/CityHero.module.css";

export function generateMetadata(): Metadata {
  const { config: site } = getSiteConfigResult();
  const siteUrl = getSiteUrl(site);

  return {
    title: {
      absolute: "Phoenix Valley Plumbing Service Areas | Call Now",
    },
    description:
      "Licensed plumbing service areas across Phoenix and the Valley. Explore coverage for Mesa, Scottsdale, Tempe, Gilbert, Chandler, and Glendale. Call today.",
    alternates: {
      canonical: `${siteUrl}/locations/`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    openGraph: {
      title: "Phoenix Valley Plumbing Service Areas | Call Now",
      description:
        "Licensed plumbing service areas across Phoenix and the Valley. Explore coverage for Mesa, Scottsdale, Tempe, Gilbert, Chandler, and Glendale. Call today.",
      url: `${siteUrl}/locations/`,
      siteName: site.brand,
      locale: "en_US",
      type: "website",
    },
  };
}

export default function LocationsHubPage() {
  const { config: site } = getSiteConfigResult();
  const siteUrl = getSiteUrl(site);
  const cities = getCities();
  const publishedCities = getPublishedCities();
  const publishedSlugs = publishedCities.map((c) => c.slug);
  const initialStatus = computeOpenStatus(site.hours);

  const draftCityNames = [
    "Peoria",
    "Surprise",
    "Goodyear",
    "Avondale",
    "Queen Creek",
    "Buckeye",
  ];

  const tier3CityNames = [
    "Fountain Hills",
    "Cave Creek",
    "Paradise Valley",
    "Litchfield Park",
  ];

  const phoenixNeighborhoods = [
    "Ahwatukee",
    "Laveen",
    "Arcadia",
    "Moon Valley",
    "Anthem",
    "Biltmore",
    "Midtown",
    "Desert Ridge",
  ];

  const hubFaqs = [
    {
      q: "How do you decide which Phoenix Valley cities to serve?",
      a: "Our coverage boundaries reflect mobile technician routing from our central Valley dispatch hub. We service municipalities where we can maintain dependable scheduling and adhere strictly to local plumbing codes, focusing primary coverage on Phoenix, Scottsdale, Tempe, Mesa, Chandler, Gilbert, and Glendale.",
    },
    {
      q: "Does service pricing differ between different Valley cities?",
      a: "No, our diagnostic procedures and standard repair recommendations follow uniform guidelines throughout the Phoenix metropolitan service territory. Whether your home is located in North Scottsdale, Central Phoenix, or East Mesa, pricing estimates depend on the complexity of the plumbing task rather than travel zip codes.",
    },
    {
      q: "What should I do if my specific Valley city is not listed as a published page?",
      a: "We frequently handle plumbing service calls in growing communities like Peoria, Surprise, Goodyear, and Queen Creek. If your address is located within Maricopa County, call our dispatch line directly. Our team will verify technician availability near your neighborhood based on current daily routes.",
    },
    {
      q: "Are your plumbers licensed to perform work across all Valley municipalities?",
      a: "Yes, our contracting operations are fully licensed under Arizona Registrar of Contractors license ROC #348219. This statewide ROC credential authorizes our plumbers to pull municipal permits and execute residential and commercial plumbing repairs across every city and town throughout the Valley.",
    },
    {
      q: "Do you offer emergency plumbing dispatch in outer Valley communities?",
      a: "We treat active water leaks, failed water heaters, and mainline sewer blockages as urgent service calls across all covered Valley cities. Calling our direct dispatch line allows us to assess technician locations and provide honest arrival expectations according to Valley service schedules.",
    },
  ];

  const schemas = [
    ...buildHubPageSchema({ site, siteUrl, publishedCities }),
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: hubFaqs.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.a,
        },
      })),
    },
  ];

  return (
    <>
      <JsonLd data={schemas} />

      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Service Areas" },
        ]}
      />

      {/* Hub Hero */}
      <section className={heroStyles.hero} aria-label="Valley service areas overview">
        <div className={heroStyles.rippleWrap} aria-hidden="true">
          <div className={heroStyles.rippleCircle1} />
          <div className={heroStyles.rippleCircle2} />
        </div>

        <div className={`container ${heroStyles.container}`}>
          <div style={{ maxWidth: "800px" }}>
            <div className={heroStyles.eyebrowChip}>
              <ShieldIcon size={14} />
              <span>Licensed Arizona Plumber · ROC #{site.licensee.rocNumber}</span>
            </div>

            <h1 className={heroStyles.h1}>
              Plumbing Service Areas in Phoenix and the Valley
            </h1>

            <p className={heroStyles.introText}>
              Reliable residential and commercial plumbing across Maricopa County. We schedule mobile technicians across major freeway corridors including the Loop 101, Loop 202, US 60, and I-10 to provide prompt response for water heaters, drain stoppages, and pipe repairs.
            </p>

            <div className={heroStyles.ctaWrap}>
              <CallButton
                display={site.phone.display}
                e164={site.phone.e164}
                location="hub-hero"
                size="lg"
              />
              <span className={heroStyles.ctaMicrocopy}>
                Tap to call · Licensed Valley Plumbing Dispatch
              </span>
            </div>

            <Link
              href="/contact/"
              className={heroStyles.contactQuietLink}
              data-track-contact="hub-hero"
            >
              Prefer to write? Go to the contact page →
            </Link>
          </div>
        </div>
      </section>

      <TrustStrip site={site} />

      {/* Main Hub Content */}
      <div className="container" style={{ padding: "clamp(32px, 5vw, 64px) 0" }}>
        <section aria-labelledby="interactive-map-heading" style={{ marginBottom: "48px" }}>
          <h2 id="interactive-map-heading" className="section-title">
            Interactive Valley Service Map
          </h2>
          <p style={{ fontSize: "1.0625rem", color: "var(--ink-600)", marginBottom: "24px" }}>
            Select your city on the schematic map or browse published local service guides below. Cities with active guides link to dedicated local pages detailing municipal water hardness, housing eras, and neighborhood coverage:
          </p>

          <ServiceAreaMap cities={cities} publishedSlugs={publishedSlugs} />
        </section>

        <section aria-labelledby="cities-grid-heading" style={{ marginBottom: "56px" }}>
          <h2 id="cities-grid-heading" className="section-title">
            Published City Plumbing Guides
          </h2>
          <p style={{ fontSize: "1.0625rem", color: "var(--ink-600)", marginBottom: "16px" }}>
            Each city in the Valley features unique water hardness profiles, building eras, and municipal permitting guidelines. Explore our localized plumbing guides:
          </p>

          <CityHubGrid
            publishedCities={publishedCities}
            draftCityNames={draftCityNames}
            tier3CityNames={tier3CityNames}
            phoenixNeighborhoods={phoenixNeighborhoods}
            site={site}
          />
        </section>

        {/* Hub FAQs */}
        <section aria-labelledby="hub-faq-heading" className={faqStyles.section}>
          <h2 id="hub-faq-heading" className="section-title">
            Valley Service Area FAQs
          </h2>

          <div className={faqStyles.list}>
            {hubFaqs.map((faq, idx) => (
              <details
                key={faq.q}
                className={faqStyles.item}
                data-faq-id={`hub-faq-${idx + 1}`}
              >
                <summary className={faqStyles.summary}>
                  <span className={faqStyles.question}>{faq.q}</span>
                  <ChevronDownIcon size={18} className={faqStyles.chevron} />
                </summary>
                <div className={faqStyles.answer}>
                  <p>{faq.a}</p>
                </div>
              </details>
            ))}
          </div>

          <div style={{ marginTop: "24px", textAlign: "center" }}>
            <p style={{ fontSize: "0.9375rem", color: "var(--ink-600)" }}>
              Have questions about plumbing coverage at your Valley address?{" "}
              <PhoneLink
                display={site.phone.display}
                e164={site.phone.e164}
                location="hub-faq"
                className="phone-link-strong"
              >
                <span style={{ color: "var(--water-700)", fontWeight: 700, textDecoration: "underline" }}>
                  Call {site.phone.display}
                </span>
              </PhoneLink>{" "}
              to speak directly with our team.
            </p>
          </div>
        </section>
      </div>

      <FinalCta
        site={site}
        initialStatus={initialStatus}
        heading="Need a Plumber Anywhere in the Valley? Call Now."
        numberLocation="hub-final"
        btnLocation="hub-final"
      />
    </>
  );
}
