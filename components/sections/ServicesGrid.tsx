import Link from "next/link";
import type { SiteConfig } from "@/lib/config";
import type { ServiceItem } from "@/lib/routes";
import { PhoneIcon, ServiceIcon } from "@/components/icons/Icons";
import { PhoneLink } from "@/components/ui/PhoneLink";
import { ScrollReveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./ServicesGrid.module.css";

export function ServicesGrid({
  site,
  services,
}: {
  site: SiteConfig;
  services: ServiceItem[];
}) {
  return (
    <section className={styles.section} aria-labelledby="services-heading">
      <div className="container">
        <SectionHeading
          id="services-heading"
          eyebrow="Full-Service Valley Plumbing"
          title="Plumbing Services in Phoenix, AZ"
          subtitle="Complete residential plumbing repair, water heater service, drain cleaning and sewer solutions across Phoenix, Scottsdale, Tempe, Mesa, Chandler, Gilbert, Glendale, Peoria, Surprise and Goodyear."
        />

        <ScrollReveal>
          <div className={styles.grid}>
            {services.map((service) => (
              <article key={service.slug} className={styles.card}>
                <div className={styles.iconCircle} aria-hidden="true">
                  <ServiceIcon name={service.icon} size={22} />
                </div>

                <h3 className={styles.cardTitle}>
                  <Link href={`/${service.slug}/`} className={styles.stretchedLink}>
                    {service.name}
                  </Link>
                </h3>

                <p className={styles.cardDesc}>{service.description}</p>

                <div className={styles.cardFooter}>
                  <span className={styles.learnMore} aria-hidden="true">
                    Learn more →
                  </span>
                  <PhoneLink
                    display={site.phone.display}
                    e164={site.phone.e164}
                    location={`services-card-${service.slug}`}
                    className={styles.microCall}
                  >
                    <PhoneIcon size={14} />
                    <span>
                      Call <span data-phone-display="">{site.phone.display}</span>
                    </span>
                  </PhoneLink>
                </div>
              </article>
            ))}
          </div>
        </ScrollReveal>

        <div className={styles.bottomCta}>
          <Link href="/services/" className="btn-ghost">
            View all plumbing services
          </Link>
        </div>
      </div>
    </section>
  );
}
