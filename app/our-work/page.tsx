import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getSiteConfigResult } from "@/lib/config";
import { getSiteUrl } from "@/lib/routes";
import { computeOpenStatus } from "@/lib/hours";
import { Breadcrumbs } from "@/components/service/Breadcrumbs";
import { CallButton } from "@/components/ui/CallButton";
import { FinalCta } from "@/components/sections/FinalCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbSchema } from "@/lib/schema";
import styles from "./Gallery.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const { config: site } = getSiteConfigResult();
  if (!site.gallery?.items || site.gallery.items.length < 6) {
    return {
      robots: { index: false, follow: false },
    };
  }

  const siteUrl = getSiteUrl(site);
  const title = `Our Plumbing Work & Projects | ${site.brand}`;
  const description = `Browse real plumbing repairs, water heater installations, and repiping projects completed by ${site.brand} throughout Phoenix and the Valley.`;

  return {
    title: {
      absolute: title,
    },
    description,
    alternates: {
      canonical: `${siteUrl}/our-work/`,
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/our-work/`,
      type: "website",
      siteName: site.brand,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function OurWorkPage() {
  const { config: site } = getSiteConfigResult();

  // Strict gating: renders only when at least 6 consented real project photos exist
  if (!site.gallery?.items || site.gallery.items.length < 6) {
    notFound();
  }

  const siteUrl = getSiteUrl(site);
  const initialStatus = computeOpenStatus(site.hours);
  const galleryItems = site.gallery.items;

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Our Work", href: "/our-work/" },
  ];

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: `${siteUrl}/` },
    { name: "Our Work", url: `${siteUrl}/our-work/"` },
  ]);

  return (
    <div className={styles.page}>
      <JsonLd data={breadcrumbSchema} />

      <section className={styles.hero}>
        <div className="container">
          <Breadcrumbs items={breadcrumbItems} />

          <div className={styles.heroInner}>
            <h1 className={styles.h1}>Completed Plumbing Projects</h1>
            <p className={styles.lead}>
              Explore photographic documentation of real water heater retrofits, sewer line
              restorations, and plumbing diagnostics completed across Phoenix homes.
            </p>

            <CallButton
              display={site.phone.display}
              e164={site.phone.e164}
              location="gallery-hero"
              size="lg"
            />
          </div>
        </div>
      </section>

      <div className="container">
        <div className={styles.galleryGrid}>
          {galleryItems.map((item) => (
            <article key={item.id} className={styles.galleryCard}>
              {item.beforeImage && item.afterImage ? (
                <div className={styles.imageGrid}>
                  <div className={styles.imageSingle}>
                    <Image
                      src={item.beforeImage}
                      alt={`Before: ${item.title}`}
                      fill
                      sizes="(min-width: 768px) 25vw, 50vw"
                      className={styles.projectImage}
                      loading="lazy"
                    />
                  </div>
                  <div className={styles.imageSingle}>
                    <Image
                      src={item.afterImage}
                      alt={`After: ${item.title}`}
                      fill
                      sizes="(min-width: 768px) 25vw, 50vw"
                      className={styles.projectImage}
                      loading="lazy"
                    />
                  </div>
                </div>
              ) : item.afterImage || item.beforeImage ? (
                <div className={styles.imageSingle}>
                  <Image
                    src={(item.afterImage || item.beforeImage)!}
                    alt={item.title}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className={styles.projectImage}
                    loading="lazy"
                  />
                </div>
              ) : null}

              <div className={styles.cardBody}>
                <h2 className={styles.cardTitle}>{item.title}</h2>
                <p className={styles.cardMeta}>
                  {item.city}, AZ &bull; {item.service}
                </p>
                <p className={styles.cardCaption}>{item.caption}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <FinalCta site={site} initialStatus={initialStatus} />
    </div>
  );
}
