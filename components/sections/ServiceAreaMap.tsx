"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import type { CityItem } from "@/lib/routes";
import { MapPinIcon, PhoneIcon } from "@/components/icons/Icons";
import "leaflet/dist/leaflet.css";
import styles from "./ServiceAreas.module.css";

interface ValleyPin {
  name: string;
  slug?: string;
  lat: number;
  lng: number;
  region: string;
  isPrimary: boolean;
}

const ALL_VALLEY_LOCATIONS: ValleyPin[] = [
  // 13 Primary Published Service Cities
  { name: "Phoenix", slug: "phoenix-az", lat: 33.4484, lng: -112.0740, region: "Central Valley", isPrimary: true },
  { name: "Scottsdale", slug: "scottsdale-az", lat: 33.4942, lng: -111.9261, region: "Northeast Valley", isPrimary: true },
  { name: "Tempe", slug: "tempe-az", lat: 33.4255, lng: -111.9400, region: "East Valley", isPrimary: true },
  { name: "Mesa", slug: "mesa-az", lat: 33.4152, lng: -111.8315, region: "East Valley", isPrimary: true },
  { name: "Chandler", slug: "chandler-az", lat: 33.3062, lng: -111.8413, region: "Southeast Valley", isPrimary: true },
  { name: "Gilbert", slug: "gilbert-az", lat: 33.3528, lng: -111.7890, region: "Southeast Valley", isPrimary: true },
  { name: "Glendale", slug: "glendale-az", lat: 33.5387, lng: -112.1860, region: "West Valley", isPrimary: true },
  { name: "Peoria", slug: "peoria-az", lat: 33.5806, lng: -112.2374, region: "Northwest Valley", isPrimary: true },
  { name: "Surprise", slug: "surprise-az", lat: 33.6292, lng: -112.3679, region: "Northwest Valley", isPrimary: true },
  { name: "Goodyear", slug: "goodyear-az", lat: 33.4353, lng: -112.3577, region: "Southwest Valley", isPrimary: true },
  { name: "Avondale", slug: "avondale-az", lat: 33.4356, lng: -112.3496, region: "West Valley", isPrimary: true },
  { name: "Buckeye", slug: "buckeye-az", lat: 33.3703, lng: -112.5838, region: "Far West Valley", isPrimary: true },
  { name: "Queen Creek", slug: "queen-creek-az", lat: 33.2486, lng: -111.6343, region: "Southeast Valley", isPrimary: true },

  // Key Valley communities pinned in service radius
  { name: "Paradise Valley", lat: 33.5312, lng: -111.9426, region: "Northeast Valley", isPrimary: false },
  { name: "Sun City", lat: 33.5975, lng: -112.2718, region: "Northwest Valley", isPrimary: false },
  { name: "Sun City West", lat: 33.6620, lng: -112.3413, region: "Northwest Valley", isPrimary: false },
  { name: "El Mirage", lat: 33.6131, lng: -112.3246, region: "West Valley", isPrimary: false },
  { name: "Litchfield Park", lat: 33.4934, lng: -112.3579, region: "West Valley", isPrimary: false },
  { name: "Tolleson", lat: 33.4500, lng: -112.2618, region: "West Valley", isPrimary: false },
  { name: "Fountain Hills", lat: 33.6042, lng: -111.7257, region: "Northeast Valley", isPrimary: false },
  { name: "Apache Junction", lat: 33.4150, lng: -111.5496, region: "East Valley", isPrimary: false },
  { name: "San Tan Valley", lat: 33.1725, lng: -111.5583, region: "Southeast Valley", isPrimary: false },
  { name: "Maricopa", lat: 33.0581, lng: -112.0476, region: "South Valley", isPrimary: false },
  { name: "Cave Creek", lat: 33.8331, lng: -111.9507, region: "North Valley", isPrimary: false },
  { name: "Anthem", lat: 33.8653, lng: -112.1485, region: "North Valley", isPrimary: false },
];

const DEFAULT_CENTER: [number, number] = [33.49, -112.06];
const DEFAULT_ZOOM = 10;

export function ServiceAreaMap({
  cities,
  publishedSlugs,
}: {
  cities: CityItem[];
  publishedSlugs?: string[];
}) {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<Map<string, any>>(new Map());

  const isSlugPublished = (slug: string, name: string) => {
    if (name.toLowerCase() === "phoenix" || slug.replace(/-az$/i, "") === "phoenix") {
      return true;
    }
    if (!publishedSlugs) {
      return true;
    }
    const clean = slug.replace(/-az$/i, "").toLowerCase();
    return publishedSlugs.some((p) => p.replace(/-az$/i, "").toLowerCase() === clean);
  };

  const getCityHref = (city: { slug?: string; name: string }) => {
    if (city.name.toLowerCase() === "phoenix" || city.slug?.replace(/-az$/i, "") === "phoenix") {
      return "/";
    }
    return `/locations/${city.slug}/`;
  };

  // Initialize Leaflet Map safely on client
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    let isMounted = true;

    import("leaflet").then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      // Fix default Leaflet icon paths
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;

      // Initialize map instance
      const map = L.map(mapContainerRef.current, {
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
        minZoom: 8,
        maxZoom: 15,
        scrollWheelZoom: false,
        zoomControl: false,
      });

      mapInstanceRef.current = map;

      // Add zoom control in bottom-right corner like user image
      L.control.zoom({ position: "bottomright" }).addTo(map);

      // OpenStreetMap Tiles Layer
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      // Valley Service Area Circle Overlay (matching user screenshot)
      L.circle(DEFAULT_CENTER, {
        radius: 41000, // ~25.5 mile radius covering entire Phoenix Valley
        color: "#1479AE",
        weight: 2,
        opacity: 0.85,
        fillColor: "#1E9BD7",
        fillOpacity: 0.05,
        dashArray: "6 6",
      }).addTo(map);

      // Helper to generate custom blue teardrop pin with drop shadow
      const createPinIcon = (isHovered: boolean, isPrimary: boolean) => {
        const size = isHovered ? 34 : isPrimary ? 28 : 24;
        const color = isHovered ? "#FF7A1A" : "#1E9BD7";
        const stroke = "#0B2A4A";

        return L.divIcon({
          className: "valley-custom-pin",
          html: `
            <div style="filter: drop-shadow(0 3px 6px rgba(11, 42, 74, 0.45)); transform: translate(-50%, -100%); cursor: pointer; transition: transform 0.2s ease;">
              <svg width="${size}" height="${size * 1.3}" viewBox="0 0 32 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 0C7.163 0 0 7.163 0 16C0 26.5 14 40.5 15.1 41.6C15.6 42.1 16.4 42.1 16.9 41.6C18 40.5 32 26.5 32 16C32 7.163 24.837 0 16 0Z" fill="${color}" stroke="${stroke}" stroke-width="1.5"/>
                <circle cx="16" cy="15" r="5" fill="#FFFFFF"/>
              </svg>
            </div>
          `,
          iconSize: [size, size * 1.3],
          iconAnchor: [size / 2, size * 1.3],
          popupAnchor: [0, -(size * 1.3 + 4)],
        });
      };

      // Add Pins for All Mentioned Valley Locations
      ALL_VALLEY_LOCATIONS.forEach((loc) => {
        const marker = L.marker([loc.lat, loc.lng], {
          icon: createPinIcon(false, loc.isPrimary),
          title: `${loc.name}, AZ`,
        }).addTo(map);

        const href = getCityHref(loc);
        const actionHtml = loc.isPrimary
          ? `<a href="${href}" style="display: inline-block; margin-top: 8px; padding: 6px 12px; background: #0B2A4A; color: #FFFFFF; font-size: 12px; font-weight: 700; border-radius: 6px; text-decoration: none;">View ${loc.name} Services &rarr;</a>`
          : `<span style="display: block; margin-top: 6px; font-size: 11px; color: #4A5A70;">Covered by Central Valley Dispatch</span>`;

        marker.bindPopup(`
          <div style="font-family: system-ui, -apple-system, sans-serif; min-width: 170px; padding: 4px;">
            <div style="font-size: 15px; font-weight: 700; color: #0B2A4A; margin-bottom: 2px;">${loc.name}, AZ</div>
            <div style="font-size: 11px; color: #1FA971; font-weight: 700;">✓ Active Service Area</div>
            <div style="font-size: 12px; color: #4A5A70; margin-top: 4px;">${loc.region}</div>
            ${actionHtml}
            <div style="margin-top: 8px; border-top: 1px solid #E2D9C8; padding-top: 6px;">
              <a href="tel:+16028350102" style="color: #FF7A1A; font-weight: 700; font-size: 12px; text-decoration: none;">📞 (602) 835-0102</a>
            </div>
          </div>
        `);

        // Tooltip on hover
        marker.bindTooltip(`<strong>${loc.name}</strong>`, {
          direction: "top",
          offset: [0, -32],
        });

        // Store marker by slug or normalized name
        const key = loc.slug || loc.name.toLowerCase().replace(/\s+/g, "-");
        markersRef.current.set(key, marker);
      });

      setIsMapReady(true);
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Pan to location on chip hover / click
  const focusLocation = useCallback((slug: string) => {
    setHoveredSlug(slug);
    const marker = markersRef.current.get(slug);
    if (marker && mapInstanceRef.current) {
      const latLng = marker.getLatLng();
      mapInstanceRef.current.panTo(latLng, { animate: true, duration: 0.4 });
      marker.openPopup();
    }
  }, []);

  const resetView = () => {
    setHoveredSlug(null);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(DEFAULT_CENTER, DEFAULT_ZOOM, { animate: true });
      mapInstanceRef.current.closePopup();
    }
  };

  return (
    <div className={styles.mapGrid}>
      {/* City Chips Navigation */}
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
              onMouseEnter={() => focusLocation(city.slug)}
              onFocus={() => focusLocation(city.slug)}
            >
              <MapPinIcon size={16} />
              <span>{city.name}, AZ</span>
            </Link>
          );
        })}
      </div>

      {/* Interactive OpenStreetMap Map Panel */}
      <div className={styles.mapCard}>
        <div className={styles.mapHeaderBar}>
          <div className={styles.mapRadiusBadge}>
            <span className={styles.mapBadgeDot} />
            <span>30-Mile Valley Service Radius</span>
          </div>
          <button
            type="button"
            onClick={resetView}
            className={styles.mapResetBtn}
            title="Reset map view to entire Phoenix Valley"
            aria-label="Reset map view"
          >
            Reset View ↺
          </button>
        </div>

        <div className={styles.leafletContainerWrap}>
          <div ref={mapContainerRef} className={styles.leafletMap} />

          {!isMapReady && (
            <div className={styles.mapLoadingSkeleton}>
              <div className={styles.skeletonSpinner} />
              <span>Loading Phoenix Valley Service Map...</span>
            </div>
          )}
        </div>

        <div className={styles.mapFooterBar}>
          <span className={styles.mapNote}>
            📍 Blue pins indicate active technician coverage across all Valley cities
          </span>
          <a href="tel:+16028350102" className={styles.mapCallLink}>
            <PhoneIcon size={14} />
            <span>Dispatch: (602) 835-0102</span>
          </a>
        </div>
      </div>
    </div>
  );
}
