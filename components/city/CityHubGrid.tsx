import Link from "next/link";
import type { CityContent } from "@/lib/city-schema";
import type { SiteConfig } from "@/lib/config";
import { getCityUrl } from "@/lib/city-data";
import { MapPinIcon } from "@/components/icons/Icons";
import { CallButton } from "@/components/ui/CallButton";
import styles from "./CityHubGrid.module.css";

interface CityHubGridProps {
  publishedCities: CityContent[];
  draftCityNames: string[];
  tier3CityNames: string[];
  phoenixNeighborhoods: string[];
  site: SiteConfig;
}

export function CityHubGrid({
  publishedCities,
  draftCityNames,
  tier3CityNames,
  phoenixNeighborhoods,
  site,
}: CityHubGridProps) {
  return (
    <div>
      <div className={styles.grid}>
        {/* Phoenix Featured Card linking to Homepage per Rule 12 */}
        <article className={styles.cityCard}>
          <div className={styles.cityHeader}>
            <h3 className={styles.cityName}>Phoenix</h3>
            <span style={{ fontSize: "0.8125rem", color: "#9A3E00", backgroundColor: "#FFF3EB", padding: "2px 8px", borderRadius: "9999px", fontWeight: 700 }}>
              Primary Hub
            </span>
          </div>
          <p className={styles.cityDetail}>
            Central Valley coverage spanning Downtown, Midtown, Biltmore, Arcadia, Ahwatukee, and North Phoenix neighborhoods.
          </p>
          <div>
            <Link href="/" className={styles.cityLink}>
              <span>Phoenix Plumbing Overview →</span>
            </Link>
          </div>
        </article>

        {publishedCities.map((city) => {
          // Extract a 1-line local detail from city's data
          const detail =
            city.water?.zones[0]
              ? `Water hardness averages ${city.water.zones[0].gpgMin}–${city.water.zones[0].gpgMax} gpg across local distribution zones.`
              : city.housing?.eras[0]
                ? `Specialized plumbing service tailored to ${city.housing.eras[0].builtRange} homes and modern developments.`
                : `Complete licensed plumbing, water heater, and drain services across ${city.name}, AZ.`;

          return (
            <article key={city.slug} className={styles.cityCard}>
              <div className={styles.cityHeader}>
                <h3 className={styles.cityName}>{city.name}</h3>
                <span style={{ fontSize: "0.8125rem", color: "var(--ink-600)" }}>
                  {city.coverage.zips.length} ZIPs
                </span>
              </div>
              <p className={styles.cityDetail}>{detail}</p>
              <div>
                <Link
                  href={getCityUrl(city)}
                  className={styles.cityLink}
                  data-track-city={city.name}
                >
                  <span>Plumber in {city.name} →</span>
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      {/* Phoenix Neighborhoods Section */}
      <section className={styles.tierSection} aria-labelledby="phoenix-villages-heading">
        <h3 id="phoenix-villages-heading" className={styles.tierHeading}>
          Neighborhoods We Cover in Phoenix (Linked to Homepage)
        </h3>
        <p style={{ fontSize: "0.875rem", color: "var(--ink-600)", marginBottom: "12px" }}>
          Phoenix is served directly through our main dispatch center. Local neighborhood service requests are handled through our primary Phoenix plumbing hub:
        </p>
        <div className={styles.chipsWrap}>
          <Link href="/" className={styles.phoenixLinkChip}>
            <MapPinIcon size={14} />
            <span>Phoenix (Main Hub / Homepage)</span>
          </Link>
          {phoenixNeighborhoods.map((n) => (
            <span key={n} className={styles.inertChip}>
              {n}
            </span>
          ))}
        </div>
      </section>

      {/* Additional Valley Communities (Plain-Text Chips per Rule 4/7) */}
      <section className={styles.tierSection} aria-labelledby="additional-cities-heading">
        <h3 id="additional-cities-heading" className={styles.tierHeading}>
          Additional Valley Communities We Service
        </h3>
        <p style={{ fontSize: "0.875rem", color: "var(--ink-600)", marginBottom: "12px" }}>
          Our service area extends across the greater Phoenix metropolitan area. The communities below are serviced by our mobile plumbing technicians:
        </p>

        <div className={styles.chipsWrap}>
          {[...draftCityNames, ...tier3CityNames].map((name) => (
            <span key={name} className={styles.inertChip}>
              {name}, AZ
            </span>
          ))}
        </div>

        <div className={styles.callRow}>
          <span>Don&apos;t see your city? Call and ask our dispatch team about coverage at your address.</span>
          <CallButton
            display={site.phone.display}
            e164={site.phone.e164}
            location="hub-city-chips"
            size="md"
          />
        </div>
      </section>
    </div>
  );
}
