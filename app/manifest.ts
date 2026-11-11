import type { MetadataRoute } from "next";
import { getSiteConfigResult } from "@/lib/config";

export default function manifest(): MetadataRoute.Manifest {
  const { config: site } = getSiteConfigResult();

  return {
    name: site.brand,
    short_name: "Phoenix Plumber",
    description: "Licensed Phoenix, AZ plumbing service across the Valley.",
    start_url: "/",
    display: "standalone",
    background_color: "#0B2A4A",
    theme_color: "#0B2A4A",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}

