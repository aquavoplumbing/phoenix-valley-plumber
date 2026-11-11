import type { SiteConfig } from "@/lib/config";
import type { CityItem } from "@/lib/routes";
import { CallButton } from "@/components/ui/CallButton";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceAreaMap } from "./ServiceAreaMap";
import styles from "./ServiceAreas.module.css";

export function ServiceAreas({
  site,
  cities,
}: {
  site: SiteConfig;
  cities: CityItem[];
}) {
  const configuredCities = cities.filter((city) =>
    site.serviceAreas.some(
      (area) => area.trim().toLowerCase() === city.name.toLowerCase()
    )
  );
  const displayCities = configuredCities.length > 0 ? configuredCities : cities;
  const extraAreas = site.extraAreas.filter((a) => a.trim().length > 0);

  return (
    <section className={styles.section} aria-labelledby="service-areas-heading">
      <div className="container">
        <SectionHeading
          id="service-areas-heading"
          eyebrow="Valley-Wide Coverage"
          title="Plumber Serving Phoenix and the Entire Valley"
          subtitle="Select a city below for local service details, or call to check immediate technician coverage near you."
        />

        <ServiceAreaMap cities={displayCities} />

        {extraAreas.length > 0 ? (
          <p className={styles.neighborhoods}>
            Including {extraAreas.join(", ")} and surrounding Valley neighborhoods.
          </p>
        ) : null}

        <div className={styles.ctaRow}>
          <p className={styles.ctaPrompt}>
            Not sure if we cover your area? Call and ask.
          </p>
          <CallButton
            display={site.phone.display}
            e164={site.phone.e164}
            location="service-areas"
          />
        </div>
      </div>
    </section>
  );
}

