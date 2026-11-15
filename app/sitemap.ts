import type { MetadataRoute } from "next";
import { getSiteConfigResult } from "@/lib/config";
import { getSiteUrl } from "@/lib/routes";
import { getPublishedServices } from "@/lib/service-data";
import { getPublishedCities, getCityRouteSlug } from "@/lib/city-data";
import {
  getPublishedPosts,
  getAllAuthors,
  getPostsByCategory,
} from "@/lib/blog-data";
import { POST_CATEGORIES } from "@/lib/post-schema";

export default function sitemap(): MetadataRoute.Sitemap {
  const { config: site } = getSiteConfigResult();
  const siteUrl = getSiteUrl(site);
  const publishedServices = getPublishedServices();
  const publishedCities = getPublishedCities();
  const publishedPosts = getPublishedPosts();
  const authors = getAllAuthors();

  // Categories with 3+ posts
  const indexedCategories = POST_CATEGORIES.filter(
    (cat) => getPostsByCategory(cat, false).length >= 3
  );

  const costGuidesCount = publishedPosts.filter(
    (p) => p.frontmatter.type === "cost-guide" || p.frontmatter.category === "costs"
  ).length;

  const hasFinancing =
    site.claims.financing &&
    site.financing &&
    site.financing.lenderName &&
    site.financing.applyUrl;

  const entries: MetadataRoute.Sitemap = [
    // 1. Homepage
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    // 2. Locations Hub
    {
      url: `${siteUrl}/locations/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    // 3. Blog Hub
    {
      url: `${siteUrl}/blog/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    // 4. Cost Guides Hub (indexed if >= 3 cost guides)
    ...(costGuidesCount >= 3
      ? [
          {
            url: `${siteUrl}/cost-guides/`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.9,
          },
        ]
      : []),
    // 5. Editorial Policy
    {
      url: `${siteUrl}/editorial-policy/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    // 6. Contact Page
    {
      url: `${siteUrl}/contact/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    // 7. About Page
    {
      url: `${siteUrl}/about/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    // 8. FAQ Hub
    {
      url: `${siteUrl}/faq/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    // 9. Privacy Policy
    {
      url: `${siteUrl}/privacy-policy/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    // 10. Terms of Service
    {
      url: `${siteUrl}/terms/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    // 11. Accessibility Statement
    {
      url: `${siteUrl}/accessibility/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    // 12. HTML Sitemap
    {
      url: `${siteUrl}/sitemap/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    // Conditional Gated: Customer Reviews (>= 5 verified)
    ...(site.reviews?.verified && site.reviews.verified.length >= 5
      ? [
          {
            url: `${siteUrl}/reviews/`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.7,
          },
        ]
      : []),
    // Conditional Gated: Gallery / Our Work (>= 6 items)
    ...(site.gallery?.items && site.gallery.items.length >= 6
      ? [
          {
            url: `${siteUrl}/our-work/`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.7,
          },
        ]
      : []),
    // Conditional Gated: Financing (claims.financing && valid lender config)
    ...(hasFinancing
      ? [
          {
            url: `${siteUrl}/financing/`,
            lastModified: new Date(),
            changeFrequency: "monthly" as const,
            priority: 0.6,
          },
        ]
      : []),
    // 6. Published City Pages
    ...publishedCities.map((city) => ({
      url: `${siteUrl}/locations/${getCityRouteSlug(city)}/`,
      lastModified: city.updatedAt ? new Date(city.updatedAt) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),
    // 7. Published Service Pages
    ...publishedServices.map((service) => ({
      url: `${siteUrl}/${service.slug}/`,
      lastModified: service.updatedAt ? new Date(service.updatedAt) : new Date(),
      changeFrequency: "weekly" as const,
      priority: service.type === "hub" ? 0.9 : 0.8,
    })),
    // 8. Published Blog & Cost Guide Posts
    ...publishedPosts.map((post) => {
      const isCostGuide =
        post.frontmatter.type === "cost-guide" ||
        post.frontmatter.category === "costs";
      const pathPrefix = isCostGuide ? "cost-guides" : "blog";
      const modDate = post.frontmatter.dateModified || post.frontmatter.datePublished;
      const heroUrl = post.frontmatter.hero.src.startsWith("http")
        ? post.frontmatter.hero.src
        : `${siteUrl}${post.frontmatter.hero.src}`;

      return {
        url: `${siteUrl}/${pathPrefix}/${post.frontmatter.slug}/`,
        lastModified: new Date(modDate),
        changeFrequency: "monthly" as const,
        priority: isCostGuide ? 0.8 : 0.75,
        images: [heroUrl],
      };
    }),
    // 9. Categories with >= 3 posts
    ...indexedCategories.map((cat) => ({
      url: `${siteUrl}/blog/category/${cat}/`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    // 10. Author pages with real consent
    ...authors.map((author) => ({
      url: `${siteUrl}/blog/author/${author.slug}/`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];

  return entries;
}

