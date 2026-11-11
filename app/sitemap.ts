import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  // All pages are currently noindex, so exclude all URLs from the sitemap.
  return [];
}

