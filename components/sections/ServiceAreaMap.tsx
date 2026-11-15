"use client";

import { useState } from "react";
import Link from "next/link";
import type { CityItem } from "@/lib/routes";
import { MapPinIcon } from "@/components/icons/Icons";
import styles from "./ServiceAreas.module.css";

export function ServiceAreaMap({
  cities,
  publishedSlugs,
}: {
  cities: CityItem[];
  publishedSlugs?: string[];
}) {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  const isSlugPublished = (slug: string, name: string) => {
    if (name.toLowerCase() === "phoenix" || slug.replace(/-az$/i, "") === "phoenix") {
      return true; // Phoenix links to homepage
    }
    if (!publishedSlugs) {
      return true; // default fallback
    }
    const clean = slug.replace(/-az$/i, "").toLowerCase();
    return publishedSlugs.some((p) => p.replace(/-az$/i, "").toLowerCase() === clean);
  };

  const getCityHref = (city: CityItem) => {
    if (city.name.toLowerCase() === "phoenix" || city.slug.replace(/-az$/i, "") === "phoenix") {
      return "/";
    }
    return `/locations/${city.slug}/`;
  };

  return (
    <div className={styles.mapGrid}>
      <div className={styles.chipsWrap}>
        {cities.map((city) => {
          const isActive = hoveredSlug === city.slug;
          const isPublished = isSlugPublished(city.slug, city.name);
          const href = getCityHref(city);

          if (!isPublished) {
            return (
              <span
                key={city.slug}
                className={`${styles.cityChip} ${styles.cityChipInert ?? ""}`}
                style={{ opacity: 0.65, cursor: "default" }}
              >
                <MapPinIcon size={16} />
                <span>{city.name}, AZ</span>
              </span>
            );
          }

          return (
            <Link
              key={city.slug}
              href={href}
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
          role="group"
          aria-label="Interactive map of Phoenix Valley service cities"
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
            const isPublished = isSlugPublished(city.slug, city.name);
            const href = getCityHref(city);
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

            const pinElements = (
              <>
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
              </>
            );

            if (!isPublished) {
              return (
                <g key={city.slug} opacity={0.6}>
                  {pinElements}
                </g>
              );
            }

            return (
              <g key={city.slug}>
                <Link
                  href={href}
                  aria-label={`${city.name}, Arizona plumbing service`}
                  onMouseEnter={() => setHoveredSlug(city.slug)}
                  onMouseLeave={() => setHoveredSlug(null)}
                  onFocus={() => setHoveredSlug(city.slug)}
                  onBlur={() => setHoveredSlug(null)}
                >
                  {pinElements}
                </Link>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
