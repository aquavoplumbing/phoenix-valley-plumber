"use client";

import { useState } from "react";
import Link from "next/link";
import type { CityItem } from "@/lib/routes";
import { MapPinIcon } from "@/components/icons/Icons";
import styles from "./ServiceAreas.module.css";

export function ServiceAreaMap({ cities }: { cities: CityItem[] }) {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  return (
    <div className={styles.mapGrid}>
      <div className={styles.chipsWrap}>
        {cities.map((city) => {
          const isActive = hoveredSlug === city.slug;
          return (
            <Link
              key={city.slug}
              href={`/locations/${city.slug}/`}
              data-track-city={city.name}
              className={`${styles.cityChip} ${isActive ? styles.cityChipActive : ""}`}
              onMouseEnter={() => setHoveredSlug(city.slug)}
              onMouseLeave={() => setHoveredSlug(null)}
              onFocus={() => setHoveredSlug(city.slug)}
              onBlur={() => setHoveredSlug(null)}
            >
              <MapPinIcon size={16} />
              <span>{city.name}, AZ</span>
            </Link>
          );
        })}
      </div>

      <div className={styles.mapCard}>
        <svg
          viewBox="0 0 460 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Map of Phoenix Valley cities we serve"
          className={styles.mapSvg}
        >
          <rect width="460" height="320" rx="20" fill="#0B2A4A" />

          {/* Subtle Valley grid & Salt River / canal corridors */}
          <path
            d="M24 195 Q 150 210 245 186 T 435 170"
            stroke="#1E9BD7"
            strokeWidth="3"
            strokeOpacity="0.32"
            fill="none"
          />
          <path
            d="M40 120 H 420 M225 32 V 292 M135 45 V 280 M315 45 V 280"
            stroke="#FFFFFF"
            strokeOpacity="0.07"
            strokeWidth="1"
          />

          {/* Outer Valley highway loop */}
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
            const isActive = hoveredSlug === city.slug;
            const labelDx =
              city.labelPos === "left" ? -12 : city.labelPos === "right" ? 12 : 0;
            const labelDy =
              city.labelPos === "top" ? -13 : city.labelPos === "bottom" ? 20 : 4;
            const textAnchor =
              city.labelPos === "left"
                ? "end"
                : city.labelPos === "right"
                  ? "start"
                  : "middle";

            return (
              <g key={city.slug}>
                <Link
                  href={`/locations/${city.slug}/`}
                  aria-label={`${city.name}, Arizona plumbing service`}
                  onMouseEnter={() => setHoveredSlug(city.slug)}
                  onMouseLeave={() => setHoveredSlug(null)}
                  onFocus={() => setHoveredSlug(city.slug)}
                  onBlur={() => setHoveredSlug(null)}
                >
                  <circle
                    cx={city.mapX}
                    cy={city.mapY}
                    r={isActive ? 17 : 13}
                    fill="#FF7A1A"
                    fillOpacity={isActive ? 0.35 : 0.18}
                    className={styles.pinPulse}
                  />
                  <circle
                    cx={city.mapX}
                    cy={city.mapY}
                    r={isActive ? 8 : 6}
                    fill={isActive ? "#FF7A1A" : "#1E9BD7"}
                    stroke="#FFFFFF"
                    strokeWidth="2"
                  />
                  <text
                    x={city.mapX + labelDx}
                    y={city.mapY + labelDy}
                    textAnchor={textAnchor}
                    fill={isActive ? "#FF7A1A" : "#E6F4FB"}
                    fontSize={isActive ? "13" : "11.5"}
                    fontWeight={isActive ? "700" : "600"}
                    fontFamily="var(--font-display)"
                  >
                    {city.name}
                  </text>
                </Link>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

