import type { Metadata } from "next";
import Link from "next/link";
import { getSiteConfigResult } from "@/lib/config";
import { getSiteUrl } from "@/lib/routes";
import { getPublishedPosts } from "@/lib/blog-data";
import { POST_CATEGORIES, CATEGORY_LABELS } from "@/lib/post-schema";
import { PostCard } from "@/components/blog/PostCard";
import { computeOpenStatus } from "@/lib/hours";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/service/Breadcrumbs";
import { FinalCta } from "@/components/sections/FinalCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBlogIndexSchema, buildBreadcrumbSchema } from "@/lib/schema";
import styles from "./BlogIndex.module.css";

export const dynamic = "force-static";

export function generateMetadata(): Metadata {
  const { config: site } = getSiteConfigResult();
  const siteUrl = getSiteUrl(site);

  return {
    title: {
      absolute: `Phoenix Plumbing Blog & Guides | ${site.brand}`,
    },
    description:
      "Sourced plumbing diagnostic guides, hard water maintenance tips, and regional cost breakdowns for Phoenix and Valley homeowners.",
    alternates: {
      canonical: `${siteUrl}/blog/`,
    },
    openGraph: {
      title: `Plumbing Advice & Cost Guides for Phoenix Homeowners | ${site.brand}`,
      description:
        "Diagnostic troubleshooting, cost breakdowns, and seasonal maintenance advice for Phoenix homes.",
      url: `${siteUrl}/blog/`,
      siteName: site.brand,
      images: [
        {
          url: `${siteUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: "Phoenix Valley Plumber Advice & Guides",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `Plumbing Advice & Cost Guides for Phoenix Homeowners | ${site.brand}`,
      description:
        "Diagnostic troubleshooting, cost breakdowns, and seasonal maintenance advice for Phoenix homes.",
    },
  };
}

export default async function BlogIndexPage() {
  const { config: site } = getSiteConfigResult();
  const siteUrl = getSiteUrl(site);
  const posts = getPublishedPosts();

  const initialStatus = computeOpenStatus(site.hours);
  const featuredPost = posts[0];
  const gridPosts = posts.slice(1);

  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: "Blog" },
  ];

  const breadcrumbSchemaItems = [
    { name: "Home", url: `${siteUrl}/` },
    { name: "Blog", url: `${siteUrl}/blog/` },
  ];

  const indexSchema = buildBlogIndexSchema(site, siteUrl);
  const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbSchemaItems);

  return (
    <>
      <JsonLd data={indexSchema} />
      <JsonLd data={breadcrumbSchema} />

      <main className={styles.main}>
        <div className="container">
          <div className={styles.breadcrumbsWrap}>
            <Breadcrumbs items={breadcrumbs} />
          </div>

          <header className={styles.header}>
            <span className={styles.eyebrow}>Valley Homeowner Resources</span>
            <h1 className={styles.title}>Plumbing Advice for Phoenix Homeowners</h1>
            <p className={styles.lead}>
              Practical troubleshooting guides, verified municipal water hardness facts, and transparent cost breakdowns tailored to Arizona slab foundations and desert conditions. Sourced from official utilities and Registrar of Contractors standards.
            </p>
          </header>

          {/* Category Chips Bar */}
          <nav aria-label="Blog Categories" className={styles.categoryNav}>
            <ul className={styles.categoryList}>
              <li>
                <span className={`${styles.chip} ${styles.chipActive}`}>All Topics</span>
              </li>
              {POST_CATEGORIES.map((cat) => (
                <li key={cat}>
                  <Link href={`/blog/category/${cat}/`} className={styles.chip}>
                    {CATEGORY_LABELS[cat]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Featured Post */}
          {featuredPost && (
            <section className={styles.featuredSection} aria-label="Featured Guide">
              <span className={styles.featuredBadge}>Featured Diagnostic Guide</span>
              <div className={styles.featuredGrid}>
                <PostCard post={featuredPost} priority={true} />
              </div>
            </section>
          )}

          {/* Post Grid */}
          <section className={styles.gridSection} aria-label="All Articles">
            <h2 className={styles.sectionHeading}>Recent Guides &amp; Explainers</h2>
            {gridPosts.length > 0 ? (
              <div className={styles.postGrid}>
                {gridPosts.map((post) => (
                  <PostCard key={post.frontmatter.slug} post={post} />
                ))}
              </div>
            ) : (
              <p className={styles.emptyNote}>
                More guides are undergoing technical review by our editorial team. Check back shortly.
              </p>
            )}
          </section>
        </div>
      </main>

      <FinalCta site={site} initialStatus={initialStatus} />
    </>
  );
}
