import type { Metadata } from "next";
import { getSiteConfigResult } from "@/lib/config";
import { computeOpenStatus } from "@/lib/hours";
import { getSiteUrl, getCities } from "@/lib/routes";
import { buildBreadcrumbSchema, buildAboutPageSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/service/Breadcrumbs";
import { FinalCta } from "@/components/sections/FinalCta";
import { AboutHero } from "@/components/about/AboutHero";
import { OperatingDisclosure } from "@/components/about/OperatingDisclosure";
import { LicenseVerificationCard } from "@/components/about/LicenseVerificationCard";
import { ServicesGridAbout } from "@/components/about/ServicesGridAbout";
import { HowItWorksCall } from "@/components/about/HowItWorksCall";
import { StandardsList } from "@/components/about/StandardsList";
import { ServiceAreaSummary } from "@/components/contact/ServiceAreaSummary";
import { EditorialSummary } from "@/components/about/EditorialSummary";
import { ContactVerificationCard } from "@/components/about/ContactVerificationCard";
import { AboutFaq, getAboutFaqs } from "@/components/about/AboutFaq";
import styles from "./AboutPage.module.css";

export function generateMetadata(): Metadata {
  const { config: site } = getSiteConfigResult();
  const siteUrl = getSiteUrl(site);
  const title = `About ${site.brand} | Licensed Plumbing`;
  const description = `Learn how ${site.brand} connects Valley homeowners with licensed Arizona plumbing contractor ROC #${site.licensee.rocNumber}. Honest operating disclosures.`;

  return {
    title: {
      absolute: title,
    },
    description,
    alternates: {
      canonical: `${siteUrl}/about/`,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/about/`,
      siteName: site.brand,
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function AboutPage() {
  const { config: site } = getSiteConfigResult();
  const siteUrl = getSiteUrl(site);
  const initialStatus = computeOpenStatus(site.hours);
  const publishedCities = getCities();
  const faqs = getAboutFaqs(site);

  // Schema generation
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: `${siteUrl}/` },
    { name: "About", url: `${siteUrl}/about/` },
  ]);

  const { aboutPageSchema, faqSchema } = buildAboutPageSchema({
    site,
    siteUrl,
    faqs,
  });

  return (
    <div className={styles.page}>
      <JsonLd data={[breadcrumbSchema, aboutPageSchema, ...(faqSchema ? [faqSchema] : [])]} />

      <div className="container">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "About" },
          ]}
        />
      </div>

      {/* 1. Hero with Status and License Jump */}
      <AboutHero site={site} initialStatus={initialStatus} />

      {/* 2. Plain Operating Model Disclosure */}
      <OperatingDisclosure site={site} />

      {/* 3. License Card & Verification Guide (#license) */}
      <LicenseVerificationCard site={site} />

      {/* 4. What We Do - Service Scope */}
      <ServicesGridAbout />

      {/* 5. What Happens When You Call */}
      <HowItWorksCall site={site} />

      {/* 6. Where We Work - Valley Municipalities */}
      <section className={styles.areaSection} aria-label="Valley Service Areas">
        <div className="container">
          <ServiceAreaSummary site={site} publishedCities={publishedCities} />
        </div>
      </section>

      {/* 7. Standards & Verification */}
      <StandardsList site={site} />

      {/* 8. Advice Research & Editorial Quality */}
      <EditorialSummary />

      {/* 9. Contact & Verification */}
      <ContactVerificationCard site={site} initialStatus={initialStatus} />

      {/* 10. Frequently Asked Questions */}
      <AboutFaq site={site} />

      {/* 11. Final Call Band */}
      <FinalCta
        site={site}
        initialStatus={initialStatus}
        heading="Need a Licensed Phoenix Plumber?"
        btnLocation="about-final"
        numberLocation="about-final-number"
      />
    </div>
  );
}
