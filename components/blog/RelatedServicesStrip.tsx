import Link from "next/link";
import type { ServiceItem } from "@/lib/routes";
import styles from "./RelatedServicesStrip.module.css";

interface RelatedServicesStripProps {
  services: ServiceItem[];
  postSlug: string;
}

export function RelatedServicesStrip({
  services,
  postSlug,
}: RelatedServicesStripProps) {
  if (!services || services.length === 0) return null;

  return (
    <section className={styles.section} aria-label="Related Professional Services">
      <div className={styles.header}>
        <span className={styles.badge}>Professional Plumbing Services</span>
        <h2 className={styles.heading}>Valley Plumbing Services Related to This Guide</h2>
        <p className={styles.subhead}>
          Our licensed technicians provide comprehensive diagnosis, repair, and replacement across the Phoenix metropolitan area:
        </p>
      </div>

      <div className={styles.grid}>
        {services.map((svc) => (
          <div key={svc.slug} className={styles.card}>
            <h3 className={styles.title}>
              <Link
                href={`/${svc.slug}/`}
                className={styles.link}
                data-service-click-from-post={svc.slug}
                data-from-post={postSlug}
              >
                {svc.name}
              </Link>
            </h3>
            <p className={styles.desc}>{svc.description}</p>
            <Link
              href={`/${svc.slug}/`}
              className={styles.cta}
              data-service-click-from-post={svc.slug}
              data-from-post={postSlug}
            >
              View service details <span aria-hidden="true">→</span>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
