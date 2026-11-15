import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSiteConfigResult } from "@/lib/config";
import { getSiteUrl, getServiceBySlug } from "@/lib/routes";
import {
  getAllPosts,
  getPostBySlug,
  getAllAuthors,
  getPublishedPosts,
} from "@/lib/blog-data";
import { PostTemplate } from "@/components/blog/PostTemplate";

export const dynamicParams = false;

export function generateStaticParams() {
  const posts = getAllPosts(process.env.NODE_ENV !== "production");
  const costGuides = posts.filter(
    (p) => p.frontmatter.type === "cost-guide" || p.frontmatter.category === "costs"
  );
  return costGuides.map((post) => ({
    slug: post.frontmatter.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug, true);
  if (!post) {
    return {
      robots: { index: false, follow: true },
    };
  }

  const { config: site } = getSiteConfigResult();
  const siteUrl = getSiteUrl(site);
  const isPublished = post.frontmatter.status === "published";

  return {
    title: {
      absolute: post.frontmatter.seo.title,
    },
    description: post.frontmatter.seo.metaDescription,
    alternates: {
      canonical: `${siteUrl}/cost-guides/${slug}/`,
    },
    robots: {
      index: isPublished,
      follow: true,
    },
    openGraph: {
      title: post.frontmatter.seo.title,
      description: post.frontmatter.seo.metaDescription,
      url: `${siteUrl}/cost-guides/${slug}/`,
      type: "article",
      publishedTime: post.frontmatter.datePublished,
      modifiedTime: post.frontmatter.dateModified,
      siteName: site.brand,
      images: [
        {
          url: post.frontmatter.hero.src.startsWith("http")
            ? post.frontmatter.hero.src
            : `${siteUrl}${post.frontmatter.hero.src}`,
          width: post.frontmatter.hero.width,
          height: post.frontmatter.hero.height,
          alt: post.frontmatter.hero.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.frontmatter.seo.title,
      description: post.frontmatter.seo.metaDescription,
    },
  };
}

export default async function CostGuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug, true);

  if (!post) {
    notFound();
  }

  const { config: site } = getSiteConfigResult();
  const siteUrl = getSiteUrl(site);
  const authors = getAllAuthors();

  const relatedServices = post.frontmatter.relatedServices
    .map((sSlug) => getServiceBySlug(sSlug))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  const allPublished = getPublishedPosts();
  const relatedPosts = post.frontmatter.relatedPosts
    .map((pSlug) => allPublished.find((p) => p.frontmatter.slug === pSlug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <PostTemplate
      post={post}
      authors={authors}
      site={site}
      siteUrl={siteUrl}
      relatedServices={relatedServices}
      relatedPosts={relatedPosts}
      variant="cost-guide"
    />
  );
}
