import { useEffect, useRef } from "react";
import Link from "next/link";
import type { SiteConfig } from "@/lib/config";
import type { CityItem, NavData } from "@/lib/routes";
import { CloseIcon, PhoneIcon } from "@/components/icons/Icons";
import styles from "./MobileMenu.module.css";

export function MobileMenu({
  open,
  onClose,
  site,
  nav,
  cities,
}: {
  open: boolean;
  onClose: () => void;
  site: SiteConfig;
  nav: NavData;
  cities: CityItem[];
}) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    closeBtnRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "Tab" && sheetRef.current) {
        const focusables = sheetRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), summary, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0]!;
        const last = focusables[focusables.length - 1]!;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const cleanE164 = site.phone.e164.replace(/[^\d+]/g, "") || "+16028350102";
  const visibleCompanyLinks = nav.companyLinks.filter((item) => {
    if (
      item.href === "/financing/" &&
      (!site.claims.financing || !site.financing || !site.financing.lenderName || !site.financing.applyUrl)
    ) {
      return false;
    }
    if (item.href === "/reviews/" && (!site.reviews?.verified || site.reviews.verified.length < 5)) return false;
    if (item.href === "/our-work/" && (!site.gallery?.items || site.gallery.items.length < 6)) return false;
    return true;
  });

  const visibleCoreServices = nav.coreServiceLinks.filter((item) => {
    if (item.href === "/commercial-plumbing/" && !site.claims.commercial) return false;
    return true;
  });

  return (
    <div
      id="mobile-menu-sheet"
      ref={sheetRef}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation"
      className={styles.sheet}
    >
      <div className={styles.topRow}>
        <span className={styles.brandLabel}>{site.brand}</span>
        <button
          ref={closeBtnRef}
          type="button"
          className={styles.closeBtn}
          aria-label="Close navigation menu"
          onClick={onClose}
        >
          <CloseIcon size={24} />
        </button>
      </div>

      <div className={styles.ctaPinned}>
        <a
          href={`tel:${cleanE164}`}
          data-phone=""
          data-call-location="mobile-menu"
          className={`btn-call ${styles.fullBtn}`}
        >
          <PhoneIcon size={20} />
          <span>
            Call Now · <span data-phone-display="">{site.phone.display}</span>
          </span>
        </a>
      </div>

      <nav className={styles.navList} aria-label="Mobile navigation links">
        <Link
          href="/emergency-plumber/"
          className={styles.urgentTopLink}
          onClick={onClose}
        >
          Emergency Plumbing
        </Link>

        <details className={styles.accordion}>
          <summary className={styles.summary}>Plumbing Services</summary>
          <div className={styles.subLinks}>
            {visibleCoreServices
              .filter((item) => item.href !== "/emergency-plumber/")
              .map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={styles.subLinkStrong}
                  onClick={onClose}
                >
                  {item.label}
                </Link>
              ))}

            {nav.serviceHubs.map((hub) => (
              <details key={hub.id} className={styles.nestedAccordion}>
                <summary className={styles.nestedSummary}>{hub.label}</summary>
                <div className={styles.nestedLinks}>
                  <Link
                    href={hub.hubHref}
                    className={styles.subLinkStrong}
                    onClick={onClose}
                  >
                    {hub.hubLabel} →
                  </Link>
                  {hub.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={styles.subLink}
                      onClick={onClose}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </details>

        <details className={styles.accordion}>
          <summary className={styles.summary}>Locations</summary>
          <div className={styles.subLinks}>
            <Link href="/locations/" className={styles.subLinkStrong} onClick={onClose}>
              All Service Areas →
            </Link>
            {cities.map((city) => (
              <Link
                key={city.slug}
                href={city.slug === "phoenix-az" ? "/" : `/locations/${city.slug}/`}
                className={styles.subLink}
                data-track-city={city.name}
                onClick={onClose}
              >
                {city.name}, AZ
              </Link>
            ))}
          </div>
        </details>

        <details className={styles.accordion}>
          <summary className={styles.summary}>Cost Guides</summary>
          <div className={styles.subLinks}>
            <Link href="/cost-guides/" className={styles.subLinkStrong} onClick={onClose}>
              All Cost Guides →
            </Link>
            {nav.costGuides.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={styles.subLink}
                onClick={onClose}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </details>

        <details className={styles.accordion}>
          <summary className={styles.summary}>Company &amp; Resources</summary>
          <div className={styles.subLinks}>
            {visibleCompanyLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={styles.subLink}
                onClick={onClose}
              >
                {item.label}
              </Link>
            ))}
            {nav.legalLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={styles.subLink}
                onClick={onClose}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </details>

        <Link
          href="/contact/"
          className={styles.topLink}
          data-track-contact="mobile-menu"
          onClick={onClose}
        >
          Contact
        </Link>
      </nav>
    </div>
  );
}
