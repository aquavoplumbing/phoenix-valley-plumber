import type { Metadata } from "next";
import { getSiteConfigResult } from "@/lib/config";
import { computeOpenStatus } from "@/lib/hours";
import {
  getCities,
  getCostGuides,
  getFaqs,
  getFeaturedServices,
  getReviews,
  getServices,
  getSiteUrl,
} from "@/lib/routes";
import { buildBreadcrumbSchema, buildFaqSchema, buildPlumberSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { CostTeaser } from "@/components/sections/CostTeaser";
import { EmergencyBlock } from "@/components/sections/EmergencyBlock";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { PhoenixProblems } from "@/components/sections/PhoenixProblems";
import { Reviews } from "@/components/sections/Reviews";
import { ServiceAreas } from "@/components/sections/ServiceAreas";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { WaterHeaterSpotlight } from "@/components/sections/WaterHeaterSpotlight";
import { WhyChooseUs as WhyChooseUsSection } from "@/components/sections/WhyChooseUs";

export function generateMetadata(): Metadata {
  const { config: site } = getSiteConfigResult();
  const title = "Phoenix Plumber | Emergency Plumbing & Repairs | Call Now";
  const description =
    "Licensed Phoenix, AZ plumber for emergency repairs, water heaters, drains and sewer lines. Serving the Valley. Call now.";

  return {
    title: {
      absolute: title,
    },
    description,
    alternates: {
      canonical: "/",
    },
    robots: {
      index: false,
      follow: false,
    },
    openGraph: {
      title,
      description,
      url: "/",
      type: "website",
      siteName: site.brand,
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: `${site.brand} — Phoenix, AZ Plumbing Services`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.jpg"],
    },
  };
}

export default function HomePage() {
  const { config: site } = getSiteConfigResult();
  const siteUrl = getSiteUrl(site);
  const initialStatus = computeOpenStatus(site.hours);
  const featuredServices = getFeaturedServices();
  const allServices = getServices();
  const costGuides = getCostGuides();
  const cities = getCities();
  const reviews = getReviews();
  const faqs = getFaqs();

  const plumberSchema = buildPlumberSchema({
    site,
    siteUrl,
    services: allServices,
    cities,
    reviews,
  });

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: `${siteUrl}/` },
  ]);

  const faqSchema = buildFaqSchema(faqs);

  return (
    <>
      <Hero site={site} initialStatus={initialStatus} />
      <TrustStrip site={site} />
      <EmergencyBlock site={site} />
      <ServicesGrid site={site} services={featuredServices} />
      <WaterHeaterSpotlight site={site} />
      <HowItWorks site={site} />
      <WhyChooseUsSection site={site} />
      <PhoenixProblems />
      <ServiceAreas site={site} cities={cities} />
      <Reviews site={site} reviews={reviews} />
      <CostTeaser site={site} costGuides={costGuides} />
      <Faq site={site} faqs={faqs} />
      <FinalCta site={site} initialStatus={initialStatus} />

      <JsonLd data={plumberSchema} />
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />
    </>
  );
}
