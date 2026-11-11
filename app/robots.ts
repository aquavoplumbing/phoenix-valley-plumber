import type { MetadataRoute } from "next";
import { getSiteConfigResult } from "@/lib/config";
import { getSiteUrl } from "@/lib/routes";

export default function robots(): MetadataRoute.Robots {
  const { config: site } = getSiteConfigResult();
  const siteUrl = getSiteUrl(site);

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}

