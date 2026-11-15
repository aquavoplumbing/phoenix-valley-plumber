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
    ...(site.contactEmail ? { email: site.contactEmail } : {}),
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
    ...(site.contactEmail ? { email: site.contactEmail } : {}),
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

export function buildServiceSchema(params: {
  site: SiteConfig;
  siteUrl: string;
  slug: string;
  name: string;
  serviceType: string;
  description: string;
  cities: CityItem[];
  reviews: ReviewItem[];
  priceRange?: {
    low: number;
    high: number;
    unit: string;
    sourceNote: string;
  };
}) {
  const { site, siteUrl, slug, name, serviceType, description, cities, reviews, priceRange } = params;
  const hasVisibleReviews = reviews.length > 0;
  const computedAvg = hasVisibleReviews
    ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1))
    : null;

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${siteUrl}/${slug}/#service`,
    name,
    serviceType,
    description,
    url: `${siteUrl}/${slug}/`,
    provider: {
      "@id": `${siteUrl}/#plumber`,
    },
    areaServed: cities.map((city) => ({
      "@type": "City",
      name: `${city.name}, AZ`,
    })),
  };

  if (priceRange) {
    schema.offers = {
      "@type": "Offer",
      priceCurrency: "USD",
      priceSpecification: {
        "@type": "PriceSpecification",
        minPrice: priceRange.low,
        maxPrice: priceRange.high,
        priceCurrency: "USD",
      },
      description: `${priceRange.unit} (${priceRange.sourceNote})`,
    };
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

export function buildCityPageSchema(params: {
  city: import("./city-schema").CityContent;
  site: SiteConfig;
  siteUrl: string;
}) {
  const { city, site, siteUrl } = params;
  const canonicalUrl = `${siteUrl}/locations/${city.slug.replace(/-az$/i, "")}-az/`;

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${canonicalUrl}#webpage`,
    url: canonicalUrl,
    name: city.seo.title,
    description: city.seo.metaDescription,
    about: [
      {
        "@type": "City",
        name: `${city.name}, AZ`,
        containedInPlace: {
          "@type": "State",
          name: "Arizona",
        },
      },
      {
        "@type": "Service",
        serviceType: "Plumbing",
        name: `Plumbing Services in ${city.name}, AZ`,
        areaServed: {
          "@type": "City",
          name: `${city.name}, AZ`,
        },
        provider: {
          "@type": "Plumber",
          "@id": `${siteUrl}/#plumber`,
          name: site.brand,
          url: `${siteUrl}/`,
        },
        url: canonicalUrl,
      },
    ],
  };

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: `${siteUrl}/` },
    { name: "Service Areas", url: `${siteUrl}/locations/` },
    { name: `${city.name}, AZ`, url: canonicalUrl },
  ]);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: city.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return [webPageSchema, breadcrumbSchema, faqSchema];
}

export function buildHubPageSchema(params: {
  site: SiteConfig;
  siteUrl: string;
  publishedCities: import("./city-schema").CityContent[];
}) {
  const { site, siteUrl, publishedCities } = params;
  const canonicalUrl = `${siteUrl}/locations/`;

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${canonicalUrl}#webpage`,
    url: canonicalUrl,
    name: "Phoenix Valley Plumbing Service Areas",
    description: "Licensed plumbing service across Phoenix and surrounding Valley communities.",
    about: {
      "@type": "Service",
      serviceType: "Plumbing",
      name: "Valley-Wide Plumbing Services",
      areaServed: publishedCities.map((c) => ({
        "@type": "City",
        name: `${c.name}, AZ`,
      })),
      provider: {
        "@type": "Plumber",
        "@id": `${siteUrl}/#plumber`,
        name: site.brand,
        url: `${siteUrl}/`,
      },
      url: canonicalUrl,
    },
  };

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: `${siteUrl}/` },
    { name: "Service Areas", url: canonicalUrl },
  ]);

  return [webPageSchema, breadcrumbSchema];
}

export function buildBlogPostSchema(params: {
  site: SiteConfig;
  siteUrl: string;
  post: import("./post-schema").Post;
  wordCount: number;
  author?: import("./post-schema").Author;
  canonicalUrl: string;
  relatedServiceNames: string[];
}) {
  const { site, siteUrl, post, wordCount, author, canonicalUrl, relatedServiceNames } = params;

  // Hero images array (16:9, 4:3, 1:1)
  const heroBase = post.hero.src.startsWith("http")
    ? post.hero.src
    : `${siteUrl}${post.hero.src}`;

  // Image ratios (derive 4:3 and 1:1 paths if available or provide base)
  const imageList = [
    heroBase,
    heroBase.replace(/\.(png|jpg|webp|svg)$/i, "-4x3.$1"),
    heroBase.replace(/\.(png|jpg|webp|svg)$/i, "-1x1.$1"),
  ];

  const authorSchema =
    author && author.consentOn
      ? {
          "@type": "Person",
          name: author.name,
          url: `${siteUrl}/blog/author/${author.slug}/`,
          ...(author.sameAs && author.sameAs.length > 0 ? { sameAs: author.sameAs } : {}),
        }
      : {
          "@type": "Organization",
          name: site.brand,
          url: `${siteUrl}/`,
        };

  const blogPostingSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${canonicalUrl}#article`,
    isPartOf: {
      "@type": "Blog",
      "@id": `${siteUrl}/blog/#blog`,
      name: `${site.brand} Plumbing Advice`,
      publisher: {
        "@id": `${siteUrl}/#organization`,
      },
    },
    headline: post.seo.h1,
    description: post.seo.metaDescription,
    image: imageList,
    datePublished: post.datePublished,
    inLanguage: "en-US",
    articleSection: post.category,
    keywords: [post.seo.primaryKeyword, ...post.seo.secondaryKeywords].join(", "),
    wordCount,
    author: authorSchema,
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
      url: canonicalUrl,
      ...(post.reviewer && post.reviewer.reviewedOn
        ? {
            reviewedBy: {
              "@type": "Person",
              name: post.reviewer.author,
            },
            lastReviewed: post.reviewer.reviewedOn,
          }
        : {}),
    },
    citation: post.sources.map((s) => s.url),
    about: relatedServiceNames.map((name) => ({
      "@type": "Thing",
      name,
    })),
  };

  // Only include dateModified if a changelog exists
  if (post.dateModified && post.changelog && post.changelog.length > 0) {
    blogPostingSchema.dateModified = post.dateModified;
  }

  // FAQ Schema if FAQs exist
  const faqSchema =
    post.faqs && post.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: post.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.q,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.a,
            },
          })),
        }
      : null;

  return { blogPostingSchema, faqSchema };
}

export function buildBlogIndexSchema(site: SiteConfig, siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${siteUrl}/blog/#webpage`,
    url: `${siteUrl}/blog/`,
    name: `Plumbing Advice & Cost Guides for Phoenix Homeowners | ${site.brand}`,
    description:
      "Expert plumbing troubleshooting, maintenance guides, and verified cost breakdowns for homeowners in Phoenix and the Valley.",
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
  };
}

export function buildContactPageSchema(params: {
  site: SiteConfig;
  siteUrl: string;
}) {
  const { site, siteUrl } = params;
  const openingHours = getOpeningHoursSpec(site.hours);

  const contactPoint: Record<string, unknown> = {
    "@type": "ContactPoint",
    telephone: site.phone.e164,
    contactType: "customer service",
    availableLanguage: ["English", ...(site.phone.spanishDisplay ? ["Spanish"] : [])],
    areaServed: site.serviceAreas.map((area) => ({
      "@type": "AdministrativeArea",
      name: `${area}, AZ`,
    })),
  };

  if (openingHours && openingHours.length > 0) {
    contactPoint.hoursAvailable = openingHours;
  }

  const contactPageSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${siteUrl}/contact/#webpage`,
    url: `${siteUrl}/contact/`,
    name: `Contact ${site.brand} | Call or Message`,
    description: `Call ${site.phone.display} or send an inquiry to ${site.brand}. Licensed Phoenix plumbers serving the Valley.`,
    mainEntity: {
      "@id": `${siteUrl}/#plumber`,
    },
  };

  const localBusinessSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Plumber",
    "@id": `${siteUrl}/#plumber`,
    name: site.brand,
    legalName: site.licensee.legalName,
    url: `${siteUrl}/`,
    telephone: site.phone.e164,
    contactPoint,
    areaServed: site.serviceAreas.map((area) => ({
      "@type": "City",
      name: `${area}, AZ`,
    })),
    openingHoursSpecification: openingHours,
  };

  if (site.address.public && site.address.street.trim()) {
    localBusinessSchema.address = {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.state,
      postalCode: site.address.zip,
      addressCountry: "US",
    };
  }

  return {
    contactPageSchema,
    localBusinessSchema,
  };
}

export function buildAboutPageSchema(params: {
  site: SiteConfig;
  siteUrl: string;
  faqs?: Array<{ q: string; a: string }>;
}) {
  const { site, siteUrl, faqs } = params;

  const aboutPageSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${siteUrl}/about/#webpage`,
    url: `${siteUrl}/about/`,
    name: `About ${site.brand} | Licensed Plumbing`,
    description: `Learn how ${site.brand} connects Phoenix Valley homeowners with licensed Arizona plumbing contractor ROC #${site.licensee.rocNumber}.`,
    mainEntity: {
      "@id": `${siteUrl}/#plumber`,
    },
  };

  const isPartner = site.operatingModel === "partner";
  if (isPartner) {
    aboutPageSchema.provider = {
      "@type": "Organization",
      name: site.licensee.legalName,
      identifier: `ROC #${site.licensee.rocNumber}`,
    };
    aboutPageSchema.publisher = {
      "@type": "Organization",
      name: site.marketingOperatorName || "Valley Plumbing Dispatch Network",
    };
  } else {
    aboutPageSchema.publisher = {
      "@id": `${siteUrl}/#organization`,
    };
  }

  const faqSchema =
    faqs && faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.q,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.a,
            },
          })),
        }
      : null;

  return {
    aboutPageSchema,
    faqSchema,
  };
}




