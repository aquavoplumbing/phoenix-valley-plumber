import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { getSiteConfigResult } from "@/lib/config";
import { computeOpenStatus } from "@/lib/hours";
import { getSiteUrl } from "@/lib/routes";
import {
  getAllCityContent,
  getCityContent,
  getPublishedCities,
  getCityRouteSlug,
  evaluateCityGate,
} from "@/lib/city-data";
import { buildCityPageSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { CityPageTemplate } from "@/components/city/CityPageTemplate";

export const dynamicParams = false;

export function generateStaticParams() {
  const published = getPublishedCities();
  const all = getAllCityContent();

  const citiesToRender =
    process.env.NODE_ENV === "production"
      ? published
      : all
          .filter((a) => a.result.isValid && a.result.data)
          .map((a) => a.result.data!);

  return citiesToRender
    .filter((c) => c.slug.replace(/-az$/i, "").toLowerCase() !== "phoenix")
    .map((city) => ({
      city: getCityRouteSlug(city),
    }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city: citySlug } = await params;
  const cleanSlug = citySlug.replace(/-az$/i, "").toLowerCase();

  if (cleanSlug === "phoenix") {
    return {
      robots: { index: false, follow: true },
    };
  }

  const contentResult = getCityContent(cleanSlug);
  const city = contentResult?.data;

  if (!city) {
    return {
      robots: { index: false, follow: true },
    };
  }

  const { config: site } = getSiteConfigResult();
  const siteUrl = getSiteUrl(site);
  const routeSlug = getCityRouteSlug(city);
  const canonicalUrl = `${siteUrl}/locations/${routeSlug}/`;
  const gate = evaluateCityGate(city);
  const isIndexable = city.status === "published" && gate.passesGate;

  return {
    title: {
      absolute: city.seo.title,
    },
    description: city.seo.metaDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: isIndexable,
      follow: true,
      googleBot: {
        index: isIndexable,
        follow: true,
      },
    },
    openGraph: {
      title: city.seo.title,
      description: city.seo.metaDescription,
      url: canonicalUrl,
      siteName: site.brand,
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: city.seo.title,
      description: city.seo.metaDescription,
    },
  };
}

export default async function CityLocationPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city: citySlug } = await params;
  const cleanSlug = citySlug.replace(/-az$/i, "").toLowerCase();

  // Rule 12: Phoenix is the homepage. Never compete with the homepage.
  if (cleanSlug === "phoenix") {
    permanentRedirect("/");
  }

  const contentResult = getCityContent(cleanSlug);
  if (!contentResult.isValid || !contentResult.data) {
    notFound();
  }

  const city = contentResult.data;
  const { config: site } = getSiteConfigResult();
  const siteUrl = getSiteUrl(site);
  const initialStatus = computeOpenStatus(site.hours);
  const schemas = buildCityPageSchema({ city, site, siteUrl });

  return (
    <>
      <JsonLd data={schemas} />
      <CityPageTemplate
        city={city}
        site={site}
        initialStatus={initialStatus}
        devErrors={contentResult.errors}
      />
    </>
  );
}
