import Image from "next/image";
import Link from "next/link";
import type { SiteConfig } from "@/lib/config";
import { formatHoursSummary } from "@/lib/hours";
import type { CityItem, NavData } from "@/lib/routes";
import { ShieldIcon, MapPinIcon } from "@/components/icons/Icons";
import { CallButton } from "@/components/ui/CallButton";
import { PhoneLink } from "@/components/ui/PhoneLink";
import styles from "./Footer.module.css";

export function Footer({
  site,
  nav,
  cities,
}: {
  site: SiteConfig;
  nav: NavData;
  cities: CityItem[];
}) {
  const hoursSummary = formatHoursSummary(site.hours);
  const year = new Date().getFullYear();

  const visibleCompanyLinks = nav.companyLinks.filter((item) => {
    if (item.href === "/contact/") return false; // Contact is placed in bottom legal bar & brand NAP
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

  const featuredServices = [
    { label: "Emergency Plumber", href: "/emergency-plumber/" },
    { label: "Water Heater Repair & Install", href: "/water-heater/" },
    { label: "Drain Cleaning & Jetting", href: "/drain-cleaning/" },
    { label: "Sewer Line Repair & Trenchless", href: "/sewer-line/" },
    { label: "Leak Detection & Slab Leaks", href: "/leak-detection-repair/" },
    { label: "Water Softeners & Filtration", href: "/water-treatment/" },
    { label: "Residential Plumbing", href: "/residential-plumbing/" },
    ...(site.claims.commercial ? [{ label: "Commercial Plumbing", href: "/commercial-plumbing/" }] : []),
  ];

  const displayedCities = cities.slice(0, 12);

  return (
    <footer className={styles.footer}>
      <div className="container">
        {/* Urgent Call Banner */}
        <div className={styles.callBanner}>
          <div>
            <p className={styles.bannerTitle}>Need a licensed Phoenix plumber?</p>
            <p className={styles.bannerSub}>
              {hoursSummary || "Call during business hours to speak directly with our dispatch team."}
            </p>
          </div>
          <CallButton
            display={site.phone.display}
            e164={site.phone.e164}
            location="footer-banner"
            size="lg"
          />
        </div>

        {/* Streamlined Main 4-Column Footer Grid */}
        <div className={styles.grid}>
          {/* Col 1: Brand & Contact Dispatch */}
          <div className={styles.brandCol}>
            <Link href="/" className={styles.logoLink} aria-label={`${site.brand} homepage`}>
              <Image
                src="/img/logo-footer.png"
                alt={site.brand}
                width={793}
                height={324}
                className={styles.footerLogo}
              />
            </Link>

            <p className={styles.brandBio}>
              Licensed, bonded, and insured plumbing solutions for homes and businesses across Maricopa County.
            </p>

            <div className={styles.nap}>
              {site.address.public && site.address.street ? (
                <p className={styles.napRow}>
                  <MapPinIcon size={15} className={styles.napIcon} />
                  <span>
                    {site.address.street}, {site.address.city}, {site.address.state} {site.address.zip}
                  </span>
                </p>
              ) : (
                <p className={styles.napRow}>
                  <MapPinIcon size={15} className={styles.napIcon} />
                  <span>Serving Phoenix and all surrounding Valley communities</span>
                </p>
              )}

              <p>
                Phone:{" "}
                <PhoneLink
                  display={site.phone.display}
                  e164={site.phone.e164}
                  location="footer-nap"
                  className={styles.inlinePhone}
                />
              </p>

              {site.contactEmail ? (
                <p>
                  Email:{" "}
                  <a
                    href={`mailto:${site.contactEmail}`}
                    className={styles.inlinePhone}
                    data-track-email="footer"
                  >
                    {site.contactEmail}
                  </a>
                </p>
              ) : null}

              {hoursSummary ? <p className={styles.hoursLine}>Hours: {hoursSummary}</p> : null}

              <div className={styles.rocRow}>
                <ShieldIcon size={15} />
                <span>ROC #{site.licensee.rocNumber} · Licensed Contractor</span>
              </div>
            </div>
          </div>

          {/* Col 2: Plumbing Services (Curated & Link to Hub) */}
          <div className={styles.col}>
            <h3 className={styles.colTitle}>Plumbing Services</h3>
            <ul className={styles.linkList}>
              {featuredServices.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={styles.footerLink}>
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className={styles.highlightItem}>
                <Link href="/services/" className={styles.footerLinkStrong}>
                  View All Services (40+) →
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Valley Service Areas (Compact 2-Column Grid) */}
          <div className={styles.col}>
            <h3 className={styles.colTitle}>Valley Service Areas</h3>
            <ul className={styles.citiesGrid}>
              {displayedCities.map((city) => (
                <li key={city.slug}>
                  <Link
                    href={city.slug === "phoenix-az" ? "/" : `/locations/${city.slug}/`}
                    className={styles.footerLink}
                    data-track-city={city.name}
                  >
                    {city.name}, AZ
                  </Link>
                </li>
              ))}
            </ul>
            <div className={styles.highlightItem}>
              <Link href="/locations/" className={styles.footerLinkStrong}>
                All Valley Locations →
              </Link>
            </div>
          </div>

          {/* Col 4: Cost Guides & Company Information */}
          <div className={styles.col}>
            <h3 className={styles.colTitle}>Cost Guides</h3>
            <ul className={styles.linkList}>
              {nav.costGuides.slice(0, 4).map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={styles.footerLink}>
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className={styles.highlightItem}>
                <Link href="/cost-guides/" className={styles.footerLinkStrong}>
                  All Cost Guides →
                </Link>
              </li>
            </ul>

            <h3 className={`${styles.colTitle} ${styles.colTitleSub}`}>Company &amp; Resources</h3>
            <ul className={styles.linkList}>
              {visibleCompanyLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={styles.footerLink}>
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/sitemap/" className={styles.footerLink}>
                  HTML Sitemap
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Integrated Valley Service Area Map Card */}
        <div className={styles.mapSection}>
          <div className={styles.mapHeader}>
            <div>
              <h3 className={styles.mapTitle}>Phoenix &amp; Valley Dispatch Area</h3>
              <span className={styles.mapSub}>
                Central Valley Dispatch · Fast Response Across Phoenix, Scottsdale, Mesa &amp; Surrounding Cities
              </span>
            </div>
            <span className={styles.mapBadge}>
              <ShieldIcon size={14} />
              <span>ROC #{site.licensee.rocNumber}</span>
            </span>
          </div>
          <div className={styles.mapFrameWrapper}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d425348.16396026436!2d-112.45445083782347!3d33.60446040098893!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x872b12ed50a179cb%3A0x8c69c7f8354a1bac!2sPhoenix%2C%20AZ%2C%20USA!5e0!3m2!1sen!2s!4v1794745624428!5m2!1sen!2s"
              width="100%"
              height="220"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              title="Phoenix Valley Service Area Map"
            />
          </div>
        </div>

        {/* Advertising & Referral Disclosure */}
        <div className={styles.disclaimerBox} role="note" aria-label="Advertising and referral disclosure">
          <p>
            <strong>Advertising &amp; Referral Disclosure:</strong> {site.brand} ({site.domain}) connects callers
            with independent, licensed local plumbing contractors. We do not directly perform plumbing repairs,
            installations, or inspections. All work is performed by independent service providers; verify licensing,
            insurance, and written estimates directly with the dispatched contractor before authorizing work.
          </p>
        </div>

        {/* Bottom Legal Bar (No Duplication) */}
        <div className={styles.bottom}>
          <p>
            © {year} {site.brand} ({site.licensee.legalName}). All rights reserved.
          </p>
          <div className={styles.bottomLinks}>
            <Link href="/privacy-policy/" className={styles.bottomLink}>
              Privacy Policy
            </Link>
            <span aria-hidden="true" className={styles.sep}>·</span>
            <Link href="/terms/" className={styles.bottomLink}>
              Terms of Service
            </Link>
            <span aria-hidden="true" className={styles.sep}>·</span>
            <Link href="/accessibility/" className={styles.bottomLink}>
              Accessibility
            </Link>
            <span aria-hidden="true" className={styles.sep}>·</span>
            <Link href="/contact/" className={styles.bottomLink} data-track-contact="footer-bottom">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
