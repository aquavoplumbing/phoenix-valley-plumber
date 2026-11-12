"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { SiteConfig } from "@/lib/config";
import type { OpenStatus } from "@/lib/hours";
import type { CityItem, NavData } from "@/lib/routes";
import {
  ChevronDownIcon,
  MapPinIcon,
  MenuIcon,
  PhoneIcon,
  SirenIcon,
} from "@/components/icons/Icons";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { MobileMenu } from "./MobileMenu";
import styles from "./Header.module.css";

type OpenMenuKey = "services" | "areas" | "costs" | "company" | null;

export function Header({
  site,
  nav,
  cities,
  initialStatus,
}: {
  site: SiteConfig;
  nav: NavData;
  cities: CityItem[];
  initialStatus: OpenStatus;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<OpenMenuKey>(null);
  const [activeHubId, setActiveHubId] = useState<string>(nav.serviceHubs[0]?.id ?? "water-heater");
  const [activeCitySlug, setActiveCitySlug] = useState<string>(cities[0]?.slug ?? "phoenix-az");
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenMenu(null);
      }
    };
    const onPointerDown = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, []);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("pvp:menu-toggle", { detail: { open: mobileOpen } }));
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const cleanE164 = site.phone.e164.replace(/[^\d+]/g, "") || "+16028350102";
  const activeHub =
    nav.serviceHubs.find((hub) => hub.id === activeHubId) ?? nav.serviceHubs[0];
  const activeCity = cities.find((c) => c.slug === activeCitySlug) ?? cities[0];
  const visibleCompanyLinks = nav.companyLinks.filter(
    (item) => item.href !== "/financing/" || site.claims.financing
  );

  const toggleMenu = (key: Exclude<OpenMenuKey, null>) => {
    setOpenMenu((prev) => (prev === key ? null : key));
  };

  return (
    <>
      <header
        ref={headerRef}
        className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}
      >
        <div className={`container ${styles.inner}`}>
          <Link
            href="/"
            className={styles.brand}
            aria-label={`${site.brand} homepage`}
            onClick={() => setOpenMenu(null)}
          >
            <Image
              src="/img/logo.png"
              alt={site.brand}
              width={793}
              height={324}
              priority
              className={styles.brandLogo}
            />
          </Link>

          <nav className={styles.nav} aria-label="Primary navigation">
            <Link
              href="/emergency-plumber/"
              className={styles.emergencyLink}
              onClick={() => setOpenMenu(null)}
            >
              <SirenIcon size={15} />
              <span>Emergency</span>
            </Link>

            <div className={styles.megaWrapper}>
              <button
                type="button"
                className={`${styles.navButton} ${openMenu === "services" ? styles.navButtonActive : ""}`}
                aria-expanded={openMenu === "services"}
                aria-controls="mega-services"
                onClick={() => toggleMenu("services")}
              >
                <span>Services</span>
                <ChevronDownIcon size={15} />
              </button>

              {openMenu === "services" ? (
                <div
                  id="mega-services"
                  className={styles.megaMenu}
                  role="region"
                  aria-label="Plumbing services menu"
                >
                  <div className={styles.megaSplit}>
                    <div className={styles.megaRail}>
                      <Link
                        href="/emergency-plumber/"
                        className={styles.megaUrgentCard}
                        onClick={() => setOpenMenu(null)}
                      >
                        <SirenIcon size={18} />
                        <div>
                          <span className={styles.urgentTitle}>Emergency Plumber</span>
                          <span className={styles.urgentSub}>Burst pipes, leaks &amp; backups</span>
                        </div>
                      </Link>

                      <p className={styles.railLabel}>Service Categories</p>
                      <div className={styles.hubTabs} role="tablist" aria-label="Plumbing service hubs">
                        {nav.serviceHubs.map((hub) => {
                          const isSelected = activeHub?.id === hub.id;
                          return (
                            <button
                              key={hub.id}
                              type="button"
                              role="tab"
                              aria-selected={isSelected}
                              className={`${styles.hubTab} ${isSelected ? styles.hubTabActive : ""}`}
                              onMouseEnter={() => setActiveHubId(hub.id)}
                              onFocus={() => setActiveHubId(hub.id)}
                              onClick={() => setActiveHubId(hub.id)}
                            >
                              <span>{hub.label}</span>
                              <span className={styles.hubCount}>{hub.items.length}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {activeHub ? (
                      <div className={styles.megaPanel} role="tabpanel" aria-label={activeHub.label}>
                        <div className={styles.panelHeader}>
                          <div>
                            <p className={styles.megaHeading}>{activeHub.label}</p>
                            <p className={styles.panelDesc}>{activeHub.description}</p>
                          </div>
                          <Link
                            href={activeHub.hubHref}
                            className={styles.panelHubLink}
                            onClick={() => setOpenMenu(null)}
                          >
                            {activeHub.hubLabel} →
                          </Link>
                        </div>

                        <ul className={styles.megaSubGrid}>
                          {activeHub.items.map((item) => (
                            <li key={item.href}>
                              <Link
                                href={item.href}
                                className={styles.megaLink}
                                onClick={() => setOpenMenu(null)}
                              >
                                {item.label}
                              </Link>
                            </li>
                          ))}
                        </ul>

                        <div className={styles.megaFooter}>
                          <div className={styles.coreLinksRow}>
                            {nav.coreServiceLinks
                              .filter((item) => item.href !== "/emergency-plumber/")
                              .map((item) => (
                                <Link
                                  key={item.href}
                                  href={item.href}
                                  className={styles.corePillLink}
                                  onClick={() => setOpenMenu(null)}
                                >
                                  {item.label}
                                </Link>
                              ))}
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>

            <div className={styles.megaWrapper}>
              <button
                type="button"
                className={`${styles.navButton} ${openMenu === "areas" ? styles.navButtonActive : ""}`}
                aria-expanded={openMenu === "areas"}
                aria-controls="mega-areas"
                onClick={() => toggleMenu("areas")}
              >
                <span>Locations</span>
                <ChevronDownIcon size={15} />
              </button>

              {openMenu === "areas" ? (
                <div
                  id="mega-areas"
                  className={styles.areasMenu}
                  role="region"
                  aria-label="Phoenix Valley locations menu"
                >
                  <div className={styles.areasSplit}>
                    <div>
                      <div className={styles.areasHeader}>
                        <p className={styles.megaHeading}>Phoenix Valley Cities</p>
                        <Link
                          href="/locations/"
                          className={styles.smallHubLink}
                          onClick={() => setOpenMenu(null)}
                        >
                          All locations →
                        </Link>
                      </div>
                      <ul className={styles.areasGrid}>
                        {cities.map((city) => {
                          const isActive = activeCity?.slug === city.slug;
                          return (
                            <li key={city.slug}>
                              <Link
                                href={`/locations/${city.slug}/`}
                                className={`${styles.megaLink} ${isActive ? styles.megaLinkActive : ""}`}
                                data-track-city={city.name}
                                onMouseEnter={() => setActiveCitySlug(city.slug)}
                                onFocus={() => setActiveCitySlug(city.slug)}
                                onClick={() => setOpenMenu(null)}
                              >
                                <MapPinIcon size={14} />
                                <span>{city.name}, AZ</span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>

                    {activeCity ? (
                      <div className={styles.cityServicesBox}>
                        <p className={styles.megaHeading}>
                          Top Services in {activeCity.name}
                        </p>
                        <ul className={styles.cityServiceList}>
                          {nav.topCityServiceSlugs.slice(0, 6).map((srv) => (
                            <li key={srv.slug}>
                              <Link
                                href={`/locations/${activeCity.slug}/${srv.slug}/`}
                                className={styles.megaLink}
                                data-track-city={activeCity.name}
                                onClick={() => setOpenMenu(null)}
                              >
                                {srv.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                        <Link
                          href={`/locations/${activeCity.slug}/`}
                          className={styles.smallHubLink}
                          onClick={() => setOpenMenu(null)}
                        >
                          View {activeCity.name} service page →
                        </Link>
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>

            <div className={styles.dropdownWrapper}>
              <button
                type="button"
                className={`${styles.navButton} ${openMenu === "costs" ? styles.navButtonActive : ""}`}
                aria-expanded={openMenu === "costs"}
                aria-controls="mega-costs"
                onClick={() => toggleMenu("costs")}
              >
                <span>Cost Guides</span>
                <ChevronDownIcon size={15} />
              </button>

              {openMenu === "costs" ? (
                <div
                  id="mega-costs"
                  className={styles.simpleDropdown}
                  role="region"
                  aria-label="Plumbing cost guides menu"
                >
                  <div className={styles.dropdownHeaderRow}>
                    <p className={styles.megaHeading}>Pricing Guides</p>
                    <Link
                      href="/cost-guides/"
                      className={styles.smallHubLink}
                      onClick={() => setOpenMenu(null)}
                    >
                      Cost Guides Hub →
                    </Link>
                  </div>
                  <ul className={styles.megaList}>
                    {nav.costGuides.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={styles.megaLink}
                          onClick={() => setOpenMenu(null)}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                    {site.claims.financing ? (
                      <li className={styles.dividerItem}>
                        <Link
                          href="/financing/"
                          className={styles.megaLink}
                          onClick={() => setOpenMenu(null)}
                        >
                          Financing Options
                        </Link>
                      </li>
                    ) : null}
                  </ul>
                </div>
              ) : null}
            </div>

            <div className={styles.dropdownWrapper}>
              <button
                type="button"
                className={`${styles.navButton} ${openMenu === "company" ? styles.navButtonActive : ""}`}
                aria-expanded={openMenu === "company"}
                aria-controls="mega-company"
                onClick={() => toggleMenu("company")}
              >
                <span>Company</span>
                <ChevronDownIcon size={15} />
              </button>

              {openMenu === "company" ? (
                <div
                  id="mega-company"
                  className={styles.simpleDropdown}
                  role="region"
                  aria-label="Company and resources menu"
                >
                  <p className={styles.megaHeading}>Company &amp; Resources</p>
                  <ul className={styles.megaList}>
                    {visibleCompanyLinks.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={styles.megaLink}
                          data-track-contact={item.href === "/contact/" ? "header-dropdown" : undefined}
                          onClick={() => setOpenMenu(null)}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            <Link
              href="/contact/"
              className={styles.navLink}
              data-track-contact="header"
              onClick={() => setOpenMenu(null)}
            >
              Contact
            </Link>
          </nav>

          <div className={styles.actions}>
            <div className={styles.statusDesktop}>
              <StatusBadge hours={site.hours} initialStatus={initialStatus} compact />
            </div>

            <a
              href={`tel:${cleanE164}`}
              data-phone=""
              data-call-location="header"
              aria-label={`Call ${site.phone.display}`}
              className={`btn-call ${styles.headerCallDesktop}`}
            >
              <PhoneIcon size={18} />
              <span data-phone-display="">{site.phone.display}</span>
            </a>

            <a
              href={`tel:${cleanE164}`}
              data-phone=""
              data-call-location="header-mobile"
              aria-label={`Call ${site.phone.display}`}
              className={styles.headerCallMobile}
            >
              <span className={styles.mobileIconCircle}>
                <PhoneIcon size={18} />
              </span>
              <span data-phone-display="" className={styles.mobilePhoneText}>
                {site.phone.display}
              </span>
            </a>

            <button
              ref={menuBtnRef}
              type="button"
              className={styles.menuToggle}
              aria-label="Open navigation menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu-sheet"
              onClick={() => setMobileOpen(true)}
            >
              <MenuIcon size={24} />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu
        open={mobileOpen}
        onClose={() => {
          setMobileOpen(false);
          menuBtnRef.current?.focus();
        }}
        site={site}
        nav={nav}
        cities={cities}
      />
    </>
  );
}
