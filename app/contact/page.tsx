import type { Metadata } from "next";
import { getSiteConfigResult } from "@/lib/config";
import { computeOpenStatus } from "@/lib/hours";
import { getSiteUrl, getCities, getServices } from "@/lib/routes";
import { buildBreadcrumbSchema, buildContactPageSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/service/Breadcrumbs";
import { ContactHeroPanel } from "@/components/contact/ContactHeroPanel";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContractorVerificationBlock } from "@/components/contact/ContractorVerificationBlock";
import { ServiceAreaSummary } from "@/components/contact/ServiceAreaSummary";
import { WhatHappensNext } from "@/components/contact/WhatHappensNext";
import { EmergencyWarningStrip } from "@/components/contact/EmergencyWarningStrip";
import { ContactFaq } from "@/components/contact/ContactFaq";
import { FinalCta } from "@/components/sections/FinalCta";
import styles from "./ContactPage.module.css";

export function generateMetadata(): Metadata {
  const { config: site } = getSiteConfigResult();
  const siteUrl = getSiteUrl(site);
  const title = `Contact ${site.brand} | Call or Message`;
  const description = `Call ${site.phone.display} or send an inquiry for fast Phoenix plumbing help. Licensed Arizona plumbers serving the Valley. Direct dispatch.`;

  return {
    title: {
      absolute: title,
    },
    description,
    alternates: {
      canonical: `${siteUrl}/contact/`,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/contact/`,
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

export default function ContactPage() {
  const { config: site } = getSiteConfigResult();
  const siteUrl = getSiteUrl(site);
  const initialStatus = computeOpenStatus(site.hours);
  const allServices = getServices();
  const publishedCities = getCities();

  const servicesForDropdown = allServices
    .filter((s) => s.category === "service" || s.category === "hub")
    .map((s) => ({
      slug: s.slug,
      name: s.name,
    }));

  // Schema Generation
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: `${siteUrl}/` },
    { name: "Contact", url: `${siteUrl}/contact/` },
  ]);

  const { contactPageSchema, localBusinessSchema } = buildContactPageSchema({
    site,
    siteUrl,
  });

  const hasRoc = Boolean(site.licensee.rocNumber && site.licensee.rocNumber.trim());
  const answerFirstText = hasRoc
    ? "The fastest way to reach a licensed plumber is to call. If you can't call, send a message below."
    : "The fastest way to reach a plumber is to call. If you can't call, send a message below.";

  return (
    <div className={styles.page}>
      <JsonLd data={[breadcrumbSchema, contactPageSchema, localBusinessSchema]} />

      <div className="container">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Contact" },
          ]}
        />

        <section className={styles.introSection} aria-label="Contact Information Introduction">
          <p className={styles.eyebrow}>Valley Dispatch &amp; Inquiries</p>
          <h1 className={styles.h1}>Contact {site.brand}: Phoenix Plumbing Help</h1>
          <p className={styles.answerFirst}>{answerFirstText}</p>
        </section>

        {/* Two-Column Responsive Layout: Call Panel 5 / Form 7 */}
        <div className={styles.mainGrid}>
          {/* Left Column: Call-First Hero Panel & Verification */}
          <div className={styles.leftCol}>
            <ContactHeroPanel site={site} initialStatus={initialStatus} />
            <ContractorVerificationBlock site={site} />
            <ServiceAreaSummary site={site} publishedCities={publishedCities} />
          </div>

          {/* Right Column: Secondary Form & Expectations */}
          <div className={styles.rightCol}>
            <ContactForm
              brand={site.brand}
              phoneDisplay={site.phone.display}
              phoneE164={site.phone.e164}
              services={servicesForDropdown}
            />
            <WhatHappensNext site={site} />
          </div>
        </div>
      </div>

      {/* Emergency Guidance Strip */}
      <EmergencyWarningStrip site={site} />

      {/* FAQ Accordion Section */}
      <ContactFaq site={site} />

      {/* Final Call CTA Band */}
      <FinalCta
        site={site}
        initialStatus={initialStatus}
        btnLocation="contact-final"
        numberLocation="contact-final-number"
      />
    </div>
  );
}
