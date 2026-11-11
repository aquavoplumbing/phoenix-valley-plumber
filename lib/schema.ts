import type { SiteConfig } from "./config";
import { getOpeningHoursSpec } from "./hours";
import type { CityItem, FaqItem, ReviewItem, ServiceItem } from "./routes";

export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function buildOrganizationSchema(site: SiteConfig, siteUrl: string) {
  const sameAs = Object.values(site.social).filter((url) => Boolean(url && url.trim()));
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: site.brand,
    url: `${siteUrl}/`,
    logo: {
      "@type": "ImageObject",
      url: `${siteUrl}/icon-512.png`,
      width: 512,
      height: 512,
    },
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

export function buildWebSiteSchema(site: SiteConfig, siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: site.brand,
    url: `${siteUrl}/`,
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
  };
}

export function buildBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildPlumberSchema(params: {
  site: SiteConfig;
  siteUrl: string;
  services: ServiceItem[];
  cities: CityItem[];
  reviews: ReviewItem[];
}) {
  const { site, siteUrl, services, cities, reviews } = params;
  const sameAs = Object.values(site.social).filter((url) => Boolean(url && url.trim()));
  const serviceItems = services.filter((s) => s.category === "service");
  const priceRanges = serviceItems
    .map((s) => s.priceRange)
    .filter((p): p is string => Boolean(p && p.trim()));

  const hasVisibleReviews = reviews.length > 0;
  const computedAvg =
    hasVisibleReviews
      ? Number(
          (
            reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
          ).toFixed(1)
        )
      : null;

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Plumber",
    "@id": `${siteUrl}/#plumber`,
    name: site.brand,
    legalName: site.licensee.legalName,
    url: `${siteUrl}/`,
    telephone: site.phone.e164,
    image: `${siteUrl}/og-image.jpg`,
    areaServed: cities.map((city) => ({
      "@type": "City",
      name: `${city.name}, AZ`,
    })),
    openingHoursSpecification: getOpeningHoursSpec(site.hours),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Plumbing Services in Phoenix, AZ",
      itemListElement: serviceItems.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.name,
          url: `${siteUrl}/${service.slug}/`,
          description: service.description,
        },
      })),
    },
  };

  if (sameAs.length > 0) {
    schema.sameAs = sameAs;
  }

  // Only include street address if address.public is true; otherwise service-area business
  if (site.address.public && site.address.street.trim()) {
    schema.address = {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.state,
      postalCode: site.address.zip,
      addressCountry: "US",
    };
  }

  if (priceRanges.length > 0) {
    schema.priceRange = priceRanges[0];
  }

  if (hasVisibleReviews && computedAvg !== null) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: site.rating.value ?? computedAvg,
      reviewCount: site.rating.count ?? reviews.length,
      bestRating: 5,
      worstRating: 1,
    };
    schema.review = reviews.map((r) => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: r.author,
      },
      datePublished: r.date,
      reviewBody: r.text,
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating,
        bestRating: 5,
        worstRating: 1,
      },
    }));
  }

  return schema;
}

export function buildFaqSchema(faqs: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
