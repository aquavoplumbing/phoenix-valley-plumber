import Link from "next/link";
import type { SiteConfig } from "@/lib/config";
import { getServiceBySlug } from "@/lib/routes";
import { ServiceIcon } from "@/components/icons/Icons";
import { PhoneLink } from "@/components/ui/PhoneLink";
import styles from "./HubChildGrid.module.css";

export function HubChildGrid({
  site,
  heading,
  childSlugs,
}: {
  site: SiteConfig;
  heading: string;
  childSlugs: string[];
}) {
  const children = childSlugs
    .map((slug) => getServiceBySlug(slug))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  if (children.length === 0) return null;

  return (
    <section id="services-list" aria-labelledby="hub-children-heading">
      <h2 id="hub-children-heading">{heading}</h2>

      <div className={styles.grid}>
        {children.map((child) => (
          <article key={child.slug} className={styles.card}>
            <div>
              <div className={styles.iconCircle} aria-hidden="true">
                <ServiceIcon name={child.icon} size={20} />
              </div>
              <h3 className={styles.title}>{child.name}</h3>
              <p className={styles.desc}>{child.description}</p>
            </div>

            <div className={styles.actions}>
              <Link href={`/${child.slug}/`} className={styles.learnLink}>
                Learn more →
              </Link>
              <PhoneLink
                display={site.phone.display}
                e164={site.phone.e164}
                location={`svc-related-${child.slug}`}
                className={styles.callLink}
              >
                Call <span data-phone-display="">{site.phone.display}</span>
              </PhoneLink>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

