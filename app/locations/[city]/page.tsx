import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSiteConfigResult } from "@/lib/config";
import { getCities, getCityBySlug, getNav } from "@/lib/routes";
import { StubPage } from "@/components/sections/StubPage";

export const dynamicParams = false;

export function generateStaticParams() {
  return getCities().map((city) => ({
    city: city.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city: citySlug } = await params;
  const city = getCityBySlug(citySlug);
  if (!city) {
    return {
      robots: { index: false, follow: true },
    };
  }

  return {
    title: `Plumber in ${city.name}, AZ`,
    description: `Licensed plumbing repairs, water heaters, drains and sewer services in ${city.name}, AZ.`,
    alternates: {
      canonical: `/locations/${city.slug}/`,
    },
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function CityLocationPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city: citySlug } = await params;
  const city = getCityBySlug(citySlug);
  if (!city) {
    notFound();
  }

  const { config: site } = getSiteConfigResult();
  const nav = getNav();

  return (
    <StubPage
      site={site}
      eyebrow={`${city.region} · Service Area`}
      title={`Plumber in ${city.name}, AZ`}
      description={`Call ${site.brand} for licensed plumbing repair, water heater service, drain cleaning, and leak detection in ${city.name}, Arizona.`}
      breadcrumbLabel={`${city.name}, AZ`}
      parentBreadcrumb={{ label: "Service Areas", href: "/locations/" }}
      linksHeading={`Plumbing Services in ${city.name}, AZ`}
      links={nav.topCityServiceSlugs.map((srv) => ({
        label: `${srv.label} in ${city.name}`,
        href: `/locations/${city.slug}/${srv.slug}/`,
      }))}
    />
  );
}
