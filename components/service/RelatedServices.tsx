import Link from "next/link";
import { getServiceBySlug } from "@/lib/routes";
import type { ServiceContent } from "@/lib/service-schema";
import styles from "./RelatedServices.module.css";

export function RelatedServices({
  currentSlug,
  related,
}: {
  currentSlug: string;
  related: ServiceContent["related"];
}) {
  const siblings = related.siblings
    .map((slug) => getServiceBySlug(slug))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  const hub = related.hub ? getServiceBySlug(related.hub) : undefined;
  const costGuide = related.costGuide ? getServiceBySlug(related.costGuide) : undefined;
  const guides = (related.guides ?? [])
    .map((slug) => getServiceBySlug(slug))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  if (siblings.length === 0 && !hub && !costGuide && guides.length === 0) {
    return null;
  }

  return (
    <section id="related-services" aria-labelledby="related-heading">
      <h2 id="related-heading">Related Plumbing Services in Phoenix</h2>

      {siblings.length > 0 ? (
        <div className={styles.grid}>
          {siblings.map((item) => (
            <Link
              key={item.slug}
              href={`/${item.slug}/`}
              className={styles.card}
              data-related-service={item.slug}
              data-from-slug={currentSlug}
            >
              <div>
                <h3 className={styles.cardTitle}>{item.name} in Phoenix</h3>
                <p className={styles.cardDesc}>{item.description}</p>
              </div>
              <span className={styles.cardLink}>
                Explore {item.shortName} →
              </span>
            </Link>
          ))}
        </div>
      ) : null}

      {hub || costGuide || guides.length > 0 ? (
        <div className={styles.metaLinks}>
          {hub ? (
            <Link href={`/${hub.slug}/`} className={styles.metaLink}>
              ← Back to {hub.name}
            </Link>
          ) : null}
          {costGuide ? (
            <Link href={`/${costGuide.slug}/`} className={styles.metaLink}>
              {costGuide.name} →
            </Link>
          ) : null}
          {guides.map((guide) => (
            <Link key={guide.slug} href={`/${guide.slug}/`} className={styles.metaLink}>
              {guide.name} →
            </Link>
          ))}
        </div>
      ) : null}
    </section>
  );
}

