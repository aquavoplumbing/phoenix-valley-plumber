import type { Metadata } from "next";
import Link from "next/link";
import { getSiteConfigResult } from "@/lib/config";
import { getSiteUrl } from "@/lib/routes";
import { computeOpenStatus } from "@/lib/hours";
import { getPublishedServices } from "@/lib/service-data";
import { getPublishedCities, getCityRouteSlug } from "@/lib/city-data";
import { getPublishedPosts } from "@/lib/blog-data";
import { Breadcrumbs } from "@/components/service/Breadcrumbs";
import { CallButton } from "@/components/ui/CallButton";
import { FinalCta } from "@/components/sections/FinalCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbSchema } from "@/lib/schema";
import styles from "./HtmlSitemap.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const { config: site } = getSiteConfigResult();
  const siteUrl = getSiteUrl(site);
  const title = `HTML Sitemap & Directory | ${site.brand}`;
  const description =
    "Complete directory of plumbing services, Valley city coverage areas, maintenance tips, and cost guides for Phoenix Valley Plumber.";

  return {
    title: {
      absolute: title,
    },
    description,
    alternates: {
      canonical: `${siteUrl}/sitemap/`,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/sitemap/`,
      type: "website",
      siteName: site.brand,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function HtmlSitemapPage() {
  const { config: site } = getSiteConfigResult();
  const siteUrl = getSiteUrl(site);
  const initialStatus = computeOpenStatus(site.hours);

  const publishedServices = getPublishedServices();
  const publishedCities = getPublishedCities();
  const publishedPosts = getPublishedPosts();

  const costGuides = publishedPosts.filter(
    (p) => p.frontmatter.type === "cost-guide" || p.frontmatter.category === "costs"
  );
  const blogPosts = publishedPosts.filter(
    (p) => p.frontmatter.type !== "cost-guide" && p.frontmatter.category !== "costs"
  );

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "HTML Sitemap", href: "/sitemap/" },
  ];

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: `${siteUrl}/` },
    { name: "HTML Sitemap", url: `${siteUrl}/sitemap/` },
  ]);

  const companyPages = [
    { label: "Homepage", href: "/" },
    { label: "About Us & Licensing", href: "/about/" },
    { label: "Contact Dispatch Team", href: "/contact/" },
    { label: "Plumbing FAQ", href: "/faq/" },
    { label: "Editorial Policy", href: "/editorial-policy/" },
  ];

  if (site.reviews?.verified && site.reviews.verified.length >= 5) {
    companyPages.push({ label: "Customer Reviews", href: "/reviews/" });
  }
  if (site.gallery?.items && site.gallery.items.length >= 6) {
    companyPages.push({ label: "Completed Projects", href: "/our-work/" });
  }
  if (
    site.claims.financing &&
    site.financing &&
    site.financing.lenderName &&
    site.financing.applyUrl
  ) {
    companyPages.push({ label: "Financing Options", href: "/financing/" });
  }

  const legalPages = [
    { label: "Privacy Policy", href: "/privacy-policy/" },
    { label: "Terms of Service", href: "/terms/" },
    { label: "Accessibility Statement", href: "/accessibility/" },
  ];

  return (
    <div className={styles.page}>
      <JsonLd data={breadcrumbSchema} />

      <section className={styles.hero}>
        <div className="container">
          <Breadcrumbs items={breadcrumbItems} />

          <div className={styles.heroInner}>
            <h1 className={styles.h1}>Website Directory &amp; Sitemap</h1>
            <p className={styles.lead}>
              Easily navigate all plumbing service guides, municipal service areas, pricing
              breakdowns, and legal disclosures published on {site.brand}.
            </p>

            <CallButton
              display={site.phone.display}
              e164={site.phone.e164}
              location="sitemap-hero"
              size="lg"
            />
          </div>
        </div>
      </section>

      <div className="container">
        <div className={styles.sitemapWrapper}>
          {/* Company & Core */}
          <section className={styles.categoryCard} aria-labelledby="heading-company">
            <h2 id="heading-company" className={styles.categoryTitle}>
              Company &amp; Main Pages
            </h2>
            <p className={styles.categoryDesc}>
              Overview, licensing credentials, consumer contact channels, and frequently asked questions.
            </p>
            <div className={styles.linksGrid}>
              {companyPages.map((page) => (
                <Link key={page.href} href={page.href} className={styles.sitemapLink}>
                  {page.label}
                </Link>
              ))}
            </div>
          </section>

          {/* Plumbing Services */}
          <section className={styles.categoryCard} aria-labelledby="heading-services">
            <h2 id="heading-services" className={styles.categoryTitle}>
              Plumbing Services ({publishedServices.length})
            </h2>
            <p className={styles.categoryDesc}>
              Residential and commercial diagnostic, repair, and replacement services across the Valley.
            </p>
            <div className={styles.linksGrid}>
              <Link href="/services/" className={styles.sitemapLink}>
                <strong>All Plumbing Services Directory</strong>
              </Link>
              {publishedServices.map((service) => (
                <Link
                  key={service.slug}
                  href={`/${service.slug}/`}
                  className={styles.sitemapLink}
                >
                  {service.seo.h1}
                </Link>
              ))}
            </div>
          </section>

          {/* Service Areas */}
          <section className={styles.categoryCard} aria-labelledby="heading-areas">
            <h2 id="heading-areas" className={styles.categoryTitle}>
              Valley Service Areas ({publishedCities.length})
            </h2>
            <p className={styles.categoryDesc}>
              Municipal plumbing service pages tailored to local housing eras, water hardness, and codes.
            </p>
            <div className={styles.linksGrid}>
              <Link href="/locations/" className={styles.sitemapLink}>
                <strong>All Valley Locations Directory</strong>
              </Link>
              {publishedCities.map((city) => (
                <Link
                  key={city.slug}
                  href={`/locations/${getCityRouteSlug(city)}/`}
                  className={styles.sitemapLink}
                >
                  {city.name}, AZ Plumbing
                </Link>
              ))}
            </div>
          </section>

          {/* Cost Guides */}
          {costGuides.length > 0 ? (
            <section className={styles.categoryCard} aria-labelledby="heading-cost-guides">
              <h2 id="heading-cost-guides" className={styles.categoryTitle}>
                Plumbing Cost Guides ({costGuides.length})
              </h2>
              <p className={styles.categoryDesc}>
                Realistic pricing factors, permit requirements, and cost estimates for major plumbing projects.
              </p>
              <div className={styles.linksGrid}>
                <Link href="/cost-guides/" className={styles.sitemapLink}>
                  <strong>Cost Guides Hub</strong>
                </Link>
                {costGuides.map((guide) => (
                  <Link
                    key={guide.frontmatter.slug}
                    href={`/cost-guides/${guide.frontmatter.slug}/`}
                    className={styles.sitemapLink}
                  >
                    {guide.frontmatter.seo.h1}
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          {/* Blog & Maintenance Guides */}
          {blogPosts.length > 0 ? (
            <section className={styles.categoryCard} aria-labelledby="heading-blog">
              <h2 id="heading-blog" className={styles.categoryTitle}>
                Plumbing Blog &amp; Maintenance Tips ({blogPosts.length})
              </h2>
              <p className={styles.categoryDesc}>
                How-to troubleshooting, hard water scale prevention, and preventive maintenance guides.
              </p>
              <div className={styles.linksGrid}>
                <Link href="/blog/" className={styles.sitemapLink}>
                  <strong>Blog Index Hub</strong>
                </Link>
                {blogPosts.map((post) => (
                  <Link
                    key={post.frontmatter.slug}
                    href={`/blog/${post.frontmatter.slug}/`}
                    className={styles.sitemapLink}
                  >
                    {post.frontmatter.seo.h1}
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          {/* Legal & Compliance */}
          <section className={styles.categoryCard} aria-labelledby="heading-legal">
            <h2 id="heading-legal" className={styles.categoryTitle}>
              Legal &amp; Compliance Disclosures
            </h2>
            <p className={styles.categoryDesc}>
              Consumer privacy disclosures, terms of referral service, and digital accessibility targets.
            </p>
            <div className={styles.linksGrid}>
              {legalPages.map((page) => (
                <Link key={page.href} href={page.href} className={styles.sitemapLink}>
                  {page.label}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>

      <FinalCta site={site} initialStatus={initialStatus} />
    </div>
  );
}
