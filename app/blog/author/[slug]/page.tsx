import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getSiteConfigResult } from "@/lib/config";
import { getSiteUrl } from "@/lib/routes";
import { getAllAuthors, getAuthorBySlug, getPublishedPosts } from "@/lib/blog-data";
import { PostCard } from "@/components/blog/PostCard";
import { computeOpenStatus } from "@/lib/hours";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/service/Breadcrumbs";
import { FinalCta } from "@/components/sections/FinalCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbSchema } from "@/lib/schema";
import styles from "./AuthorPage.module.css";

export const dynamicParams = false;

export function generateStaticParams() {
  const authors = getAllAuthors();
  return authors.map((a) => ({
    slug: a.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);
  if (!author) {
    return { robots: { index: false, follow: true } };
  }

  const { config: site } = getSiteConfigResult();
  const siteUrl = getSiteUrl(site);

  return {
    title: `${author.name}, ${author.role} | ${site.brand}`,
    description: author.bio,
    alternates: {
      canonical: `${siteUrl}/blog/author/${slug}/`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function AuthorProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);
  if (!author) {
    notFound();
  }

  const { config: site } = getSiteConfigResult();
  const siteUrl = getSiteUrl(site);

  const posts = getPublishedPosts().filter((p) =>
    p.frontmatter.authors.includes(author.slug)
  );

  const initialStatus = computeOpenStatus(site.hours);
  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog/" },
    { label: author.name },
  ];

  const breadcrumbSchemaItems = [
    { name: "Home", url: `${siteUrl}/` },
    { name: "Blog", url: `${siteUrl}/blog/` },
    { name: author.name, url: `${siteUrl}/blog/author/${slug}/` },
  ];

  const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbSchemaItems);

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteUrl}/blog/author/${slug}/#person`,
    name: author.name,
    jobTitle: author.role,
    description: author.bio,
    image: `${siteUrl}${author.photo}`,
    worksFor: {
      "@id": `${siteUrl}/#organization`,
    },
    ...(author.sameAs && author.sameAs.length > 0 ? { sameAs: author.sameAs } : {}),
  };

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={personSchema} />

      <main className={styles.main}>
        <div className="container">
          <div className={styles.breadcrumbsWrap}>
            <Breadcrumbs items={breadcrumbs} />
          </div>

          <header className={styles.profileHeader}>
            <div className={styles.avatarWrap}>
              <Image
                src={author.photo}
                alt={author.name}
                width={120}
                height={120}
                className={styles.avatar}
                priority
              />
            </div>
            <div className={styles.info}>
              <span className={styles.eyebrow}>Contributing Author</span>
              <h1 className={styles.name}>{author.name}</h1>
              <p className={styles.role}>{author.role}</p>
              <p className={styles.bio}>{author.bio}</p>

              {author.credentials && author.credentials.length > 0 && (
                <div className={styles.credList}>
                  {author.credentials.map((cred, idx) => (
                    <span key={idx} className={styles.credBadge}>
                      {cred}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </header>

          <section className={styles.postsSection} aria-label={`Articles by ${author.name}`}>
            <h2 className={styles.sectionHeading}>Guides Written by {author.name}</h2>
            {posts.length > 0 ? (
              <div className={styles.postGrid}>
                {posts.map((post) => (
                  <PostCard key={post.frontmatter.slug} post={post} />
                ))}
              </div>
            ) : (
              <p className={styles.emptyNote}>No published articles currently listed.</p>
            )}
          </section>
        </div>
      </main>

      <FinalCta site={site} initialStatus={initialStatus} />
    </>
  );
}
