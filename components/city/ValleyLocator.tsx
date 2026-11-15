import type { CityItem } from "@/lib/routes";
import citiesData from "@/data/cities.json";
import styles from "./ValleyLocator.module.css";

interface ValleyLocatorProps {
  currentCitySlug: string;
  currentCityName: string;
  nearbySlugs?: string[];
}

export function ValleyLocator({
  currentCitySlug,
  currentCityName,
  nearbySlugs = [],
}: ValleyLocatorProps) {
  const cities = citiesData as CityItem[];
  const cleanCurrent = currentCitySlug.replace(/-az$/i, "").toLowerCase();
  const cleanNearby = new Set(nearbySlugs.map((s) => s.replace(/-az$/i, "").toLowerCase()));

  const neighborNames = cities
    .filter((c) => cleanNearby.has(c.slug.replace(/-az$/i, "").toLowerCase()))
    .map((c) => c.name);

  return (
    <div className={styles.wrapper}>
      <div className={styles.captionRow}>
        <span>Valley Service Map</span>
        <span className={styles.badgeActive}>
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "var(--sun-500)",
            }}
          />
          {currentCityName}, AZ
        </span>
      </div>

      <svg
        viewBox="0 0 460 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.mapSvg}
        aria-hidden="true"
      >
        <rect width="460" height="320" rx="14" fill="#0B2A4A" />

        {/* River & Canal corridor */}
        <path
          d="M24 195 Q 150 210 245 186 T 435 170"
          stroke="#1E9BD7"
          strokeWidth="3"
          strokeOpacity="0.32"
          fill="none"
        />
        {/* Subtle grid lines */}
        <path
          d="M40 120 H 420 M225 32 V 292 M135 45 V 280 M315 45 V 280"
          stroke="#FFFFFF"
          strokeOpacity="0.08"
          strokeWidth="1"
        />
        {/* Valley loop highway */}
        <path
          d="M95 92 Q 220 55 340 108 Q 388 180 342 252 Q 210 286 92 224 Q 58 156 95 92 Z"
          stroke="#1E9BD7"
          strokeOpacity="0.35"
          strokeWidth="2"
          strokeDasharray="6 6"
          fill="#123F6B"
          fillOpacity="0.35"
        />

        {cities.map((city) => {
          const cSlug = city.slug.replace(/-az$/i, "").toLowerCase();
          const isCurrent = cSlug === cleanCurrent;
          const isNeighbor = cleanNearby.has(cSlug);

          const labelDx =
            city.labelPos === "left" ? -12 : city.labelPos === "right" ? 12 : 0;
          const labelDy =
            city.labelPos === "top" ? -11 : city.labelPos === "bottom" ? 18 : 4;
          const textAnchor =
            city.labelPos === "left"
              ? "end"
              : city.labelPos === "right"
                ? "start"
                : "middle";

          return (
            <g key={city.slug}>
              {/* Highlight neighbor outline */}
              {isNeighbor ? (
                <circle
                  cx={city.mapX}
                  cy={city.mapY}
                  r={10}
                  fill="none"
                  stroke="#1E9BD7"
                  strokeWidth="1.5"
                  strokeOpacity="0.8"
                />
              ) : null}

              {/* Pin circle */}
              <circle
                cx={city.mapX}
                cy={city.mapY}
                r={isCurrent ? 7 : 4}
                className={isCurrent ? styles.pinActive : undefined}
                fill={isCurrent ? "#FF7A1A" : isNeighbor ? "#1E9BD7" : "#FFFFFF"}
                fillOpacity={isCurrent ? 1 : isNeighbor ? 0.9 : 0.45}
              />

              {/* CSS pulse ring on active city */}
              {isCurrent ? (
                <circle
                  cx={city.mapX}
                  cy={city.mapY}
                  r={10}
                  fill="none"
                  stroke="#FF7A1A"
                  strokeWidth="2"
                  className={styles.pulseRing}
                />
              ) : null}

              {/* City Label */}
              <text
                x={city.mapX + labelDx}
                y={city.mapY + labelDy}
                textAnchor={textAnchor}
                className={`${styles.cityNode} ${isCurrent ? styles.cityNodeActive : ""}`}
              >
                {city.name}
              </text>
            </g>
          );
        })}
      </svg>

      <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)", marginTop: "6px" }}>
        Schematic map, not to scale.
      </p>

      {/* Screen reader text alternative */}
      <div className="sr-only">
        Schematic map showing Phoenix Valley service coverage for {currentCityName}, Arizona.
        {neighborNames.length > 0
          ? ` Nearby service areas include ${neighborNames.join(", ")}.`
          : ""}
      </div>
    </div>
  );
}
