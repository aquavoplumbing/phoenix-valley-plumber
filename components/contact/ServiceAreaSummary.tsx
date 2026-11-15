import Link from "next/link";
import type { SiteConfig } from "@/lib/config";
import type { CityItem } from "@/lib/routes";
import { MapPinIcon } from "@/components/icons/Icons";
import styles from "./ServiceAreaSummary.module.css";

interface ServiceAreaSummaryProps {
  site: SiteConfig;
  publishedCities: CityItem[];
}

export function ServiceAreaSummary({ site, publishedCities }: ServiceAreaSummaryProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.pinIcon} aria-hidden="true">
          <MapPinIcon size={22} />
        </div>
        <div>
          <h3 className={styles.title}>Phoenix Valley Coverage</h3>
          <p className={styles.subtitle}>Mobile Service · We Come Directly to You</p>
        </div>
      </div>

      <p className={styles.intro}>
        We dispatch licensed plumbers directly from mobile service trucks throughout Phoenix and neighboring Valley municipalities:
      </p>

      <ul className={styles.cityList}>
        {publishedCities.map((city) => (
          <li key={city.slug} className={styles.cityItem}>
            <Link
              href={city.slug === "phoenix-az" ? "/" : `/locations/${city.slug}/`}
              className={styles.cityLink}
            >
              {city.name}, AZ
            </Link>
          </li>
        ))}
      </ul>

      <div className={styles.footerNote}>
        <p>
          {site.address.public && site.address.street
            ? `Headquarters: ${site.address.street}, ${site.address.city}, ${site.address.state} ${site.address.zip} · Dedicated field technician dispatch across all listed Valley zones.`
            : "Mobile Service-Area Contractor · No walk-in public showroom · Direct residential and commercial on-site dispatch."}
        </p>
      </div>
    </div>
  );
}
