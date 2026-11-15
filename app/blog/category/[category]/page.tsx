import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getSiteConfigResult } from "@/lib/config";
import { getSiteUrl } from "@/lib/routes";
import { getPostsByCategory } from "@/lib/blog-data";
import {
  POST_CATEGORIES,
  CATEGORY_LABELS,
  type PostCategory,
} from "@/lib/post-schema";
import { PostCard } from "@/components/blog/PostCard";
import { computeOpenStatus } from "@/lib/hours";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/service/Breadcrumbs";
import { FinalCta } from "@/components/sections/FinalCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbSchema } from "@/lib/schema";
import styles from "@/app/blog/BlogIndex.module.css";

export const dynamicParams = false;

const CATEGORY_INTROS: Record<
  PostCategory,
  {
    intro: string;
    hubSlug: string;
    hubName: string;
  }
> = {
  "water-heaters": {
    intro:
      "Water heaters face uniquely punishing conditions across the Phoenix metropolitan area. With municipal water hardness averaging between 12 and 15 grains per gallon, calcium carbonate precipitates rapidly when heated, creating dense sediment layers at the bottom of storage tanks. This calcified crust insulates heating elements, triggers rumbling noises, and reduces the typical tank lifespan to just 6 to 10 years compared to the 10 to 14 year national average. Our expert guides walk you through sizing calculations, sediment flushing protocols, anode rod replacements, and comprehensive repair-versus-replacement comparisons.",
    hubSlug: "water-heater",
    hubName: "Water Heater Services",
  },
  "drains-and-sewer": {
    intro:
      "Residential sewer and drainage systems in the Valley endure severe seasonal pressures. During dry summer heatwaves, aggressive root systems from desert landscaping—including ficus, mesquite, pine, and palms—seek out moisture by invading tiny mortar gaps in vintage vitrified clay sewer joints. When sudden summer monsoon thunderstorms strike, roof and yard runoff quickly overwhelms partially obstructed lines, causing hazardous whole-house backups. Read our guides on hydro jetting, camera inspection diagnostics, and the engineering differences between open-trench digging and modern trenchless epoxy pipe lining.",
    hubSlug: "sewer-line",
    hubName: "Sewer & Drain Services",
  },
  "leaks-and-pipes": {
    intro:
      "Because the vast majority of Phoenix single-family homes are built on monolithic concrete slabs poured directly over expansive clay soils, plumbing leaks require specialized detection techniques. When copper water supply lines buried in gravel beneath the foundation develop pinhole breaches from water chemistry and thermal movement, pressurized water can erode soil, create damp floor warm spots, or destabilize foundations. Explore our diagnostic explainers on identifying hidden slab leaks, listening for running water, and deciding between focused concrete excavation and whole-home PEX rerouting.",
    hubSlug: "leak-detection-repair",
    hubName: "Leak & Pipe Repair",
  },
  "toilets-and-fixtures": {
    intro:
      "Toilet problems are among the most frequent sources of residential water waste and unexpected utility bill spikes in Phoenix. A running toilet can quietly waste over 200 gallons of treated drinking water daily through a warped rubber flapper, an improperly set float cup, or a cracked overflow tube. In Arizona's chlorinated, mineral-dense water, standard rubber components degrade faster than in soft-water regions. Our detailed guides cover step-by-step DIY flapper repairs, fill valve replacements, wax ring resealing, and new high-efficiency toilet installations.",
    hubSlug: "toilet",
    hubName: "Toilet & Fixture Services",
  },
  "water-treatment": {
    intro:
      "Phoenix tap water originates primarily from the Salt and Verde rivers and the Colorado River via the Central Arizona Project (CAP), picking up heavy dissolved mineral loads across hundreds of miles of limestone terrain. As a result, tap water across Maricopa County consistently rates as 'very hard' to 'extremely hard'. Without proper water softening or conditioning, this mineral load damages water heaters, crusts showerheads, and leaves cloudy spotting on dishes. Review our sourced explainers breaking down official city water quality reports, ion-exchange softener loops, and whole-house filtration options.",
    hubSlug: "water-treatment",
    hubName: "Water Quality Services",
  },
  "emergency-and-safety": {
    intro:
      "When a catastrophic pipe rupture, sewer overflow, or gas leak occurs, immediate and correct homeowner action prevents thousands of dollars in structural damage and protects family safety. Every Phoenix resident should know exactly where their primary water shut-off valve is located—whether on an exterior hose bib riser or inside the street meter box—and understand the critical difference between multi-turn gate valves and quarter-turn ball valves. Review our safety guides for immediate emergency containment protocols and Arizona safety standards.",
    hubSlug: "emergency-plumber",
    hubName: "Emergency Plumbing Services",
  },
  "phoenix-homes": {
    intro:
      "Residential architecture in Phoenix reflects distinct building eras with specific plumbing profiles. Historic mid-century brick homes in central Phoenix often still rely on aging galvanized iron supply lines and clay sewer pipes. Homes constructed during the late 1970s and 1980s frequently contain failure-prone polybutylene piping, while modern Valley subdivisions utilize flexible PEX running through attics exposed to 140°F summer desert heat. Our local housing guides examine era-specific risks, permit rules under City of Phoenix building codes, and preventative maintenance checklists.",
    hubSlug: "locations",
    hubName: "Valley Service Areas",
  },
  costs: {
    intro:
      "Accurate cost budgeting is essential when planning major plumbing repairs or equipment replacements. Unlike national directories that present generic, outdated ranges, our Phoenix cost guides analyze true regional labor averages, material costs, permit exemptions under municipal codes, and site-specific variables like slab trenching or attic access. Review verified cost breakdowns for water heaters, water softeners, sewer line replacements, and slab leak fixes, complete with primary source citations and pricing factor explanations.",
    hubSlug: "cost-guides",
    hubName: "All Cost Guides",
  },
};

export function generateStaticParams() {
  return POST_CATEGORIES.map((cat) => ({
    category: cat,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = category as PostCategory;
  if (!POST_CATEGORIES.includes(cat)) {
    return { robots: { index: false, follow: true } };
  }

  const { config: site } = getSiteConfigResult();
  const siteUrl = getSiteUrl(site);
  const label = CATEGORY_LABELS[cat] || cat;
  const posts = getPostsByCategory(cat, false);
  const shouldIndex = posts.length >= 3;

  return {
    title: {
      absolute: `${label} Guides | ${site.brand}`,
    },
    description: `Plumbing guides and diagnostic advice on ${label.toLowerCase()} for homeowners across Phoenix and the Valley.`,
    alternates: {
      canonical: `${siteUrl}/blog/category/${cat}/`,
    },
    robots: {
      index: shouldIndex,
      follow: true,
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cat = category as PostCategory;
  if (!POST_CATEGORIES.includes(cat)) {
    notFound();
  }

  const { config: site } = getSiteConfigResult();
  const siteUrl = getSiteUrl(site);
  const label = CATEGORY_LABELS[cat] || cat;
  const info = CATEGORY_INTROS[cat];
  const posts = getPostsByCategory(cat, false);

  const initialStatus = computeOpenStatus(site.hours);
  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog/" },
    { label },
  ];

  const breadcrumbSchemaItems = [
    { name: "Home", url: `${siteUrl}/` },
    { name: "Blog", url: `${siteUrl}/blog/` },
    { name: label, url: `${siteUrl}/blog/category/${cat}/` },
  ];

  const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbSchemaItems);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />

      <main className={styles.main}>
        <div className="container">
          <div className={styles.breadcrumbsWrap}>
            <Breadcrumbs items={breadcrumbs} />
          </div>

          <header className={styles.header}>
            <span className={styles.eyebrow}>Topic Hub</span>
            <h1 className={styles.title}>{label} in Phoenix</h1>
            <p className={styles.lead}>{info.intro}</p>

            <div style={{ marginTop: "1rem" }}>
              <Link href={`/${info.hubSlug}/`} className={styles.chip}>
                Explore Our {info.hubName} Hub →
              </Link>
            </div>
          </header>

          <section className={styles.gridSection} aria-label={`${label} Articles`}>
            <h2 className={styles.sectionHeading}>Published Guides in {label}</h2>
            {posts.length > 0 ? (
              <div className={styles.postGrid}>
                {posts.map((post) => (
                  <PostCard key={post.frontmatter.slug} post={post} />
                ))}
              </div>
            ) : (
              <p className={styles.emptyNote}>
                Guides in this category are currently undergoing technical review. Please explore our other topic clusters or check back soon.
              </p>
            )}
          </section>
        </div>
      </main>

      <FinalCta site={site} initialStatus={initialStatus} />
    </>
  );
}
