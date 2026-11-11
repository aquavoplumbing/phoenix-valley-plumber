import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSiteConfigResult } from "@/lib/config";
import { getCities, getCityBySlug, getNav, getServiceBySlug } from "@/lib/routes";
import { StubPage } from "@/components/sections/StubPage";

export const dynamicParams = false;

export function generateStaticParams() {
  const cities = getCities();
  const nav = getNav();
  return cities.flatMap((city) =>
    nav.topCityServiceSlugs.map((srv) => ({
      city: city.slug,
      service: srv.slug,
    }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string; service: string }>;
}): Promise<Metadata> {
  const { city: citySlug, service: serviceSlug } = await params;
  const city = getCityBySlug(citySlug);
  const service = getServiceBySlug(serviceSlug);
  const nav = getNav();
  const allowed = nav.topCityServiceSlugs.some((s) => s.slug === serviceSlug);

  if (!city || !service || !allowed) {
    return {
      robots: { index: false, follow: true },
    };
  }

  return {
    title: `${service.shortName} in ${city.name}, AZ`,
    description: `${service.description} Licensed plumbing service for homeowners in ${city.name}, AZ.`,
    alternates: {
      canonical: `/locations/${city.slug}/${service.slug}/`,
    },
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function CityServicePage({
  params,
}: {
  params: Promise<{ city: string; service: string }>;
}) {
  const { city: citySlug, service: serviceSlug } = await params;
  const city = getCityBySlug(citySlug);
  const service = getServiceBySlug(serviceSlug);
  const nav = getNav();
  const allowed = nav.topCityServiceSlugs.some((s) => s.slug === serviceSlug);

  if (!city || !service || !allowed) {
    notFound();
  }

  const { config: site } = getSiteConfigResult();

  return (
    <StubPage
      site={site}
      eyebrow={`${city.name}, AZ · Local Service`}
      title={`${service.shortName} in ${city.name}, AZ`}
      description={`${service.description} Call ${site.brand} for licensed service in ${city.name} and surrounding ${city.region} neighborhoods.`}
      breadcrumbLabel={service.shortName}
      parentBreadcrumb={{ label: `${city.name}, AZ`, href: `/locations/${city.slug}/` }}
      linksHeading={`Service & Other ${city.name} Pages`}
      links={[
        { label: `General ${service.shortName} Overview`, href: `/${service.slug}/` },
        ...nav.topCityServiceSlugs
          .filter((s) => s.slug !== service.slug)
          .map((s) => ({
            label: `${s.label} in ${city.name}`,
            href: `/locations/${city.slug}/${s.slug}/`,
          })),
      ]}
    />
  );
}

