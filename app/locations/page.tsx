import type { Metadata } from "next";
import { getSiteConfigResult } from "@/lib/config";
import { getCities } from "@/lib/routes";
import { StubPage } from "@/components/sections/StubPage";

export function generateMetadata(): Metadata {
  return {
    title: "Phoenix Valley Service Areas",
    description:
      "Licensed plumbing service across Phoenix, Scottsdale, Tempe, Mesa, Chandler, Gilbert, Glendale, Peoria, Surprise, and Goodyear, AZ.",
    alternates: {
      canonical: "/locations/",
    },
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default function LocationsHubPage() {
  const { config: site } = getSiteConfigResult();
  const cities = getCities();

  return (
    <StubPage
      site={site}
      eyebrow="Service Area Hub"
      title="Phoenix Valley Service Areas"
      description={`Call ${site.brand} for licensed plumbing repairs, water heaters, drains, and leak detection across Phoenix and neighboring Valley cities.`}
      breadcrumbLabel="Service Areas"
      linksHeading="Cities We Serve"
      links={cities.map((city) => ({
        label: `${city.name}, AZ Plumber`,
        href: `/locations/${city.slug}/`,
      }))}
    />
  );
}
