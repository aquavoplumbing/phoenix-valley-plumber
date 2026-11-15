import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSiteConfigResult } from "@/lib/config";
import { computeOpenStatus } from "@/lib/hours";
import {
  getCities,
  getNav,
  getReviews,
  getServiceBySlug,
  getServices,
  getSiteUrl,
} from "@/lib/routes";
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildServiceSchema,
} from "@/lib/schema";
import { getServiceContent } from "@/lib/service-data";
import { getPostBySlug, getAllAuthors, getPublishedPosts } from "@/lib/blog-data";
import { JsonLd } from "@/components/seo/JsonLd";
import { StubPage } from "@/components/sections/StubPage";
import { ServicePageTemplate } from "@/components/service/ServicePageTemplate";
import { PostTemplate } from "@/components/blog/PostTemplate";

export const dynamicParams = false;

export function generateStaticParams() {
  const { config: site } = getSiteConfigResult();
  return getServices()
    .filter((service) => service.slug !== "commercial-plumbing" || site.claims.commercial)
    .map((service) => ({
      slug: service.slug,
    }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { config: site } = getSiteConfigResult();
  if (slug === "commercial-plumbing" && !site.claims.commercial) {
    return {
      robots: { index: false, follow: false },
    };
  }
  const service = getServiceBySlug(slug);
  if (!service) {
    return {
      robots: { index: false, follow: true },
    };
  }

  const contentResult = getServiceContent(slug);
  const content = contentResult?.data;

  if (content) {
    const isPublished = content.status === "published";
    return {
      title: {
        absolute: content.seo.title,
      },
      description: content.seo.metaDescription,
      alternates: {
        canonical: `/${service.slug}/`,
      },
      robots: {
        index: isPublished,
        follow: true,
      },
      openGraph: {
        title: content.seo.title,
        description: content.seo.metaDescription,
        url: `/${service.slug}/`,
        type: "website",
        siteName: site.brand,
      },
      twitter: {
        card: "summary_large_image",
        title: content.seo.title,
        description: content.seo.metaDescription,
      },
    };
  }

  // Check if this slug is an authored MDX post or cost guide
  const post = getPostBySlug(slug, true);
  if (post) {
    const isCostGuide =
      post.frontmatter.type === "cost-guide" || post.frontmatter.category === "costs";
    const canonicalPath = isCostGuide ? `/cost-guides/${slug}/` : `/blog/${slug}/`;
    return {
      title: {
        absolute: post.frontmatter.seo.title,
      },
      description: post.frontmatter.seo.metaDescription,
      alternates: {
        canonical: canonicalPath,
      },
      robots: {
        index: post.frontmatter.status === "published",
        follow: true,
      },
    };
  }

  return {
    title: service.name,
    description: service.description,
    alternates: {
      canonical: `/${service.slug}/`,
    },
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function ServiceSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { config: site } = getSiteConfigResult();
  if (slug === "commercial-plumbing" && !site.claims.commercial) {
    notFound();
  }
  const service = getServiceBySlug(slug);
  if (!service) {
    notFound();
  }

  const contentResult = getServiceContent(slug);

  if (contentResult?.data) {
    const content = contentResult.data;
    const siteUrl = getSiteUrl(site);
    const initialStatus = computeOpenStatus(site.hours);
    const cities = getCities();
    const allReviews = getReviews();
    const matchingReviews = content.reviewTag
      ? allReviews.filter((r) => r.tags?.includes(content.reviewTag!))
      : [];

    const hubItem = content.related.hub
      ? getServiceBySlug(content.related.hub)
      : undefined;

    const breadcrumbItems: Array<{ name: string; url: string }> = [
      { name: "Home", url: `${siteUrl}/` },
    ];
    if (content.slug !== "services") {
      breadcrumbItems.push({ name: "Services", url: `${siteUrl}/services/` });
    }
    if (hubItem && hubItem.slug !== "services") {
      breadcrumbItems.push({
        name: hubItem.shortName,
        url: `${siteUrl}/${hubItem.slug}/`,
      });
    }
    breadcrumbItems.push({
      name: service.shortName,
      url: `${siteUrl}/${content.slug}/`,
    });

    const serviceSchema = buildServiceSchema({
      site,
      siteUrl,
      slug: content.slug,
      name: content.seo.h1,
      serviceType: service.name,
      description: content.seo.metaDescription,
      cities,
      reviews: matchingReviews,
      priceRange: content.costFactors?.priceRange,
    });
    const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbItems);
    const faqSchema = buildFaqSchema(
      content.faqs.map((f, i) => ({
        id: `faq-${i + 1}`,
        question: f.q,
        answer: f.a,
      }))
    );

    return (
      <>
        <JsonLd data={serviceSchema} />
        <JsonLd data={breadcrumbSchema} />
        <JsonLd data={faqSchema} />
        <ServicePageTemplate
          site={site}
          content={content}
          serviceMeta={service}
          cities={cities}
          reviews={matchingReviews}
          initialStatus={initialStatus}
        />
      </>
    );
  }

  // If this slug is an authored MDX post/cost guide, render the rich PostTemplate
  const post = getPostBySlug(slug, true);
  if (post) {
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
        variant={post.frontmatter.type === "cost-guide" ? "cost-guide" : "blog"}
      />
    );
  }

  // Fallback: Stub page
  const nav = getNav();
  let linksHeading = "Related Services";
  let links: Array<{ label: string; href: string }> = [];
  let parentBreadcrumb: { label: string; href: string } | undefined;

  const currentHub = nav.serviceHubs.find((hub) => hub.hubHref === `/${service.slug}/`);
  if (currentHub) {
    linksHeading = `${service.shortName} Services`;
    links = currentHub.items.map((item) => ({ label: item.label, href: item.href }));
    parentBreadcrumb = { label: "Services", href: "/services/" };
  } else {
    const parentHub = nav.serviceHubs.find((hub) =>
      hub.items.some((item) => item.href === `/${service.slug}/`)
    );
    if (parentHub) {
      parentBreadcrumb = { label: parentHub.label, href: parentHub.hubHref };
    } else if (service.category === "cost-guide") {
      parentBreadcrumb = { label: "Cost Guides", href: "/cost-guides/" };
    }
  }

  return (
    <StubPage
      site={site}
      eyebrow={service.category === "cost-guide" ? "Phoenix Cost Guide" : "Phoenix Plumbing Service"}
      title={service.name}
      description={service.description}
      breadcrumbLabel={service.shortName}
      parentBreadcrumb={parentBreadcrumb}
      linksHeading={linksHeading}
      links={links}
    />
  );
}
