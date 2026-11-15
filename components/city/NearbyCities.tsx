import Link from "next/link";
import { getPublishedCities, getCityUrl } from "@/lib/city-data";
import { ArrowRightIcon, MapPinIcon } from "@/components/icons/Icons";
import styles from "./NearbyCities.module.css";

interface NearbyCitiesProps {
  nearbySlugs: string[];
  currentCitySlug: string;
  currentCityName: string;
}

export function NearbyCities({
  nearbySlugs,
  currentCitySlug,
  currentCityName,
}: NearbyCitiesProps) {
  const publishedCities = getPublishedCities();
  const cleanNearbySet = new Set(
    nearbySlugs.map((s) => s.replace(/-az$/i, "").toLowerCase())
  );
  const cleanCurrent = currentCitySlug.replace(/-az$/i, "").toLowerCase();

  // Filter to published neighbors only, excluding current city
  const neighbors = publishedCities.filter((c) => {
    const cSlug = c.slug.replace(/-az$/i, "").toLowerCase();
    return cSlug !== cleanCurrent && cleanNearbySet.has(cSlug);
  });

  if (neighbors.length === 0) {
    return null;
  }

  return (
    <nav className={styles.wrapper} aria-label={`Other Valley cities near ${currentCityName}`}>
      <h3 className={styles.heading}>
        Also Serving Valley Communities Near {currentCityName}
      </h3>
      <div className={styles.chipsGrid}>
        {neighbors.map((neighbor) => (
          <Link
            key={neighbor.slug}
            href={getCityUrl(neighbor)}
            className={styles.cityChip}
            data-track-city={neighbor.name}
            data-from-slug={currentCitySlug}
            data-to-slug={neighbor.slug}
          >
            <MapPinIcon size={14} />
            <span>Plumber in {neighbor.name}, AZ</span>
          </Link>
        ))}

        <Link href="/locations/" className={styles.hubLink}>
          <span>View all Valley locations</span>
          <ArrowRightIcon size={14} />
        </Link>
      </div>
    </nav>
  );
}
