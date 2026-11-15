import fs from "node:fs";
import path from "node:path";
import { loadRawSiteConfig } from "../../lib/config";
import { getPublishedServices } from "../../lib/service-data";
import { getPublishedCities, getCityRouteSlug } from "../../lib/city-data";
import { getPublishedPosts, getAllAuthors, getPostsByCategory } from "../../lib/blog-data";
import { POST_CATEGORIES } from "../../lib/post-schema";

export interface RouteEntry {
  path: string;
  type:
    | "home"
    | "hub"
    | "service"
    | "city"
    | "blog"
    | "cost-guide"
    | "contact"
    | "about"
    | "emergency"
    | "faq"
    | "legal"
    | "utility"
    | "gated"
    | "stub";
  status: "published" | "draft" | "gated";
  indexable: boolean;
}

export function buildRouteInventory(): RouteEntry[] {
  const site = loadRawSiteConfig();
  const routes: RouteEntry[] = [];

  // Home
  routes.push({ path: "/", type: "home", status: "published", indexable: true });

  // Hubs
  routes.push({ path: "/services/", type: "hub", status: "published", indexable: true });
  routes.push({ path: "/locations/", type: "hub", status: "published", indexable: true });
  routes.push({ path: "/blog/", type: "hub", status: "published", indexable: true });
  routes.push({ path: "/cost-guides/", type: "hub", status: "published", indexable: true });

  // Core & Trust
  routes.push({ path: "/contact/", type: "contact", status: "published", indexable: true });
  routes.push({ path: "/contact/thank-you/", type: "contact", status: "published", indexable: false });
  routes.push({ path: "/about/", type: "about", status: "published", indexable: true });
  routes.push({ path: "/emergency-plumber/", type: "emergency", status: "published", indexable: true });
  routes.push({ path: "/editorial-policy/", type: "about", status: "published", indexable: true });
  routes.push({ path: "/faq/", type: "faq", status: "published", indexable: true });

  // Legal & Compliance
  routes.push({ path: "/privacy-policy/", type: "legal", status: "published", indexable: true });
  routes.push({ path: "/privacy/", type: "legal", status: "published", indexable: false }); // redirect
  routes.push({ path: "/terms/", type: "legal", status: "published", indexable: true });
  routes.push({ path: "/accessibility/", type: "legal", status: "published", indexable: true });
  routes.push({ path: "/sitemap/", type: "utility", status: "published", indexable: true });

  // Gated Pages
  const reviewsActive = Boolean(site.reviews?.verified && site.reviews.verified.length >= 5);
  routes.push({
    path: "/reviews/",
    type: "gated",
    status: reviewsActive ? "published" : "gated",
    indexable: reviewsActive,
  });

  const galleryActive = Boolean(site.gallery?.items && site.gallery.items.length >= 6);
  routes.push({
    path: "/our-work/",
    type: "gated",
    status: galleryActive ? "published" : "gated",
    indexable: galleryActive,
  });

  const financingActive = Boolean(
    site.claims.financing &&
      site.financing &&
      site.financing.lenderName &&
      site.financing.applyUrl
  );
  routes.push({
    path: "/financing/",
    type: "gated",
    status: financingActive ? "published" : "gated",
    indexable: financingActive,
  });

  const commercialActive = Boolean(site.claims.commercial);
  routes.push({
    path: "/commercial-plumbing/",
    type: "service",
    status: commercialActive ? "published" : "gated",
    indexable: commercialActive,
  });

  // Published Services (excluding commercial if not active, since it's above)
  const publishedServices = getPublishedServices();
  for (const s of publishedServices) {
    if (s.slug === "services" || s.slug === "commercial-plumbing") continue;
    routes.push({
      path: `/${s.slug}/`,
      type: s.type === "hub" ? "hub" : "service",
      status: "published",
      indexable: true,
    });
  }

  // Published Cities
  const publishedCities = getPublishedCities();
  for (const c of publishedCities) {
    routes.push({
      path: `/locations/${getCityRouteSlug(c)}/`,
      type: "city",
      status: "published",
      indexable: true,
    });
  }

  // Published Posts & Cost Guides
  const publishedPosts = getPublishedPosts();
  for (const p of publishedPosts) {
    const isCost = p.frontmatter.type === "cost-guide" || p.frontmatter.category === "costs";
    routes.push({
      path: isCost ? `/cost-guides/${p.frontmatter.slug}/` : `/blog/${p.frontmatter.slug}/`,
      type: isCost ? "cost-guide" : "blog",
      status: "published",
      indexable: true,
    });
  }

  // Category Pages (>= 3 posts)
  for (const cat of POST_CATEGORIES) {
    const count = getPostsByCategory(cat, false).length;
    if (count >= 3) {
      routes.push({
        path: `/blog/category/${cat}/`,
        type: "blog",
        status: "published",
        indexable: true,
      });
    }
  }

  // Author Pages
  for (const a of getAllAuthors()) {
    routes.push({
      path: `/blog/author/${a.slug}/`,
      type: "blog",
      status: "published",
      indexable: true,
    });
  }

  return routes;
}

function main() {
  const routes = buildRouteInventory();
  const evidenceDir = path.join(process.cwd(), "qa", "evidence");
  if (!fs.existsSync(evidenceDir)) fs.mkdirSync(evidenceDir, { recursive: true });

  const outPath = path.join(evidenceDir, "routes.json");
  fs.writeFileSync(outPath, JSON.stringify(routes, null, 2), "utf8");
  console.log(`Route inventory built: ${routes.length} routes (${routes.filter((r) => r.indexable).length} indexable). Saved to qa/evidence/routes.json.`);
}

main();
