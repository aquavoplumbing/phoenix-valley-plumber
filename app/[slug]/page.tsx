import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSiteConfigResult } from "@/lib/config";
import { getNav, getServiceBySlug, getServices } from "@/lib/routes";
import { StubPage } from "@/components/sections/StubPage";

export const dynamicParams = false;

export function generateStaticParams() {
  return getServices().map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) {
    return {
      robots: { index: false, follow: true },
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
  const service = getServiceBySlug(slug);
  if (!service) {
    notFound();
  }

  const { config: site } = getSiteConfigResult();
  const nav = getNav();
  const matchingHub = nav.serviceHubs.find((hub) => hub.id === service.slug);

  let linksHeading: string | undefined;
  let links: Array<{ label: string; href: string }> | undefined;
  let parentBreadcrumb: { label: string; href: string } | undefined;

  if (service.slug === "services") {
    linksHeading = "Plumbing Service Hubs";
    links = [
      ...nav.coreServiceLinks.filter((item) => item.href !== "/services/"),
      ...nav.serviceHubs.map((hub) => ({ label: hub.label, href: hub.hubHref })),
    ];
  } else if (service.slug === "cost-guides") {
    linksHeading = "Phoenix Plumbing Cost Guides";
    links = nav.costGuides;
  } else if (matchingHub) {
    parentBreadcrumb = { label: "Services", href: "/services/" };
    linksHeading = `${matchingHub.label} Services`;
    links = matchingHub.items;
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
