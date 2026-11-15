import Link from "next/link";
import type { CityContent } from "@/lib/city-schema";
import type { SiteConfig } from "@/lib/config";
import { getServiceBySlug } from "@/lib/routes";
import { ArrowRightIcon, PhoneIcon, ServiceIcon } from "@/components/icons/Icons";
import { PhoneLink } from "@/components/ui/PhoneLink";
import styles from "./LocalServiceGrid.module.css";

interface LocalServiceGridProps {
  localServices: CityContent["localServices"];
  cityName: string;
  citySlug: string;
  site: SiteConfig;
}

export function LocalServiceGrid({
  localServices,
  cityName,
  citySlug,
  site,
}: LocalServiceGridProps) {
  return (
    <div>
      <div className={styles.grid}>
        {localServices.map((item) => {
          const service = getServiceBySlug(item.serviceSlug);
          const serviceName = service ? service.name : item.serviceSlug.replace(/-/g, " ");
          const iconName = service?.icon ?? "wrench";
          const targetUrl = `/${item.serviceSlug}/`;

          return (
            <article key={item.serviceSlug} className={styles.card}>
              <div className={styles.iconRow}>
                <div className={styles.iconBox} aria-hidden="true">
                  <ServiceIcon name={iconName} size={22} />
                </div>
                <h3 className={styles.serviceTitle}>{serviceName}</h3>
              </div>

              <p className={styles.angleText}>{item.cityAngle}</p>

              <div className={styles.actionRow}>
                <Link
                  href={targetUrl}
                  className={styles.learnMoreLink}
                  data-service-click-from-city={item.serviceSlug}
                  data-from-city-slug={citySlug}
                >
                  <span>Learn more</span>
                  <ArrowRightIcon size={14} />
                </Link>

                <PhoneLink
                  display={site.phone.display}
                  e164={site.phone.e164}
                  location={`city-service-${item.serviceSlug}`}
                  className={styles.callDirect}
                  ariaLabel={`Call ${site.phone.display} to schedule ${serviceName} in ${cityName}`}
                >
                  <PhoneIcon size={13} />
                  <span>Call {site.phone.display}</span>
                </PhoneLink>
              </div>
            </article>
          );
        })}
      </div>

      <div className={styles.viewAllRow}>
        <Link href="/services/" className={styles.ghostBtn}>
          <span>View all plumbing services</span>
          <ArrowRightIcon size={16} />
        </Link>
      </div>
    </div>
  );
}
