import Link from "next/link";
import { isPlaceholderValue, type SiteConfig } from "@/lib/config";
import { formatHoursSummary } from "@/lib/hours";
import type { CityItem, NavData } from "@/lib/routes";
import { ShieldIcon } from "@/components/icons/Icons";
import { LogoMark } from "@/components/icons/LogoMark";
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
  const isDev = process.env.NODE_ENV !== "production";
  const hoursSummary = formatHoursSummary(site.hours);
  const year = new Date().getFullYear();

  const visibleCompanyLinks = nav.companyLinks.filter(
    (item) => item.href !== "/financing/" || site.claims.financing
  );

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.callBanner}>
          <div>
            <p className={styles.bannerTitle}>Need a licensed Phoenix plumber?</p>
            <p className={styles.bannerSub}>
              {hoursSummary || "Call during business hours to speak with our dispatch team."}
            </p>
          </div>
          <CallButton
            display={site.phone.display}
            e164={site.phone.e164}
            location="footer-banner"
            size="lg"
          />
        </div>

        <div className={styles.grid}>
          <div className={styles.brandCol}>
            <Link href="/" className={styles.logoLink}>
              <LogoMark size={34} />
              <span className={styles.brandName}>{site.brand}</span>
            </Link>

            <div className={styles.nap}>
              <p className={styles.legalName}>
                {site.licensee.legalName}
                {isPlaceholderValue(site.licensee.legalName) && isDev ? (
                  <>
                    {" "}
                    <span className="todo-badge">TODO</span>
                  </>
                ) : null}
              </p>

              {site.address.public && site.address.street ? (
                <p>
                  {site.address.street}, {site.address.city}, {site.address.state}{" "}
                  {site.address.zip}
                </p>
              ) : (
                <p>Serving Phoenix and the surrounding Valley</p>
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

              {site.phone.spanishDisplay && site.phone.spanishE164 ? (
                <p>
                  En Español:{" "}
                  <PhoneLink
                    display={site.phone.spanishDisplay}
                    e164={site.phone.spanishE164}
                    location="footer-spanish"
                    className={styles.inlinePhone}
                  />
                </p>
              ) : null}

              {hoursSummary ? <p className={styles.hoursLine}>Hours: {hoursSummary}</p> : null}

              <p className={styles.rocRow}>
                <ShieldIcon size={16} />
                <span>ROC #{site.licensee.rocNumber}</span>
              </p>
            </div>
          </div>

          <div>
            <h3 className={styles.colTitle}>Plumbing Services</h3>
            <ul className={styles.linkList}>
              {nav.coreServiceLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={styles.footerLink}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={styles.colTitle}>Service Areas</h3>
            <ul className={styles.linkList}>
              <li>
                <Link href="/locations/" className={styles.footerLinkStrong}>
                  All Valley Locations
                </Link>
              </li>
              {cities.map((city) => (
                <li key={city.slug}>
                  <Link
                    href={`/locations/${city.slug}/`}
                    className={styles.footerLink}
                    data-track-city={city.name}
                  >
                    {city.name}, AZ
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={styles.colTitle}>Cost Guides</h3>
            <ul className={styles.linkList}>
              <li>
                <Link href="/cost-guides/" className={styles.footerLinkStrong}>
                  All Plumbing Cost Guides
                </Link>
              </li>
              {nav.costGuides.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={styles.footerLink}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={styles.colTitle}>Company &amp; Legal</h3>
            <ul className={styles.linkList}>
              {visibleCompanyLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={styles.footerLink}
                    data-track-contact={item.href === "/contact/" ? "footer" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              {nav.legalLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={styles.footerLink}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <nav className={styles.directorySection} aria-label="Complete plumbing service directory">
          <div className={styles.directoryHeader}>
            <h3 className={styles.directoryTitle}>Complete Plumbing Service Directory</h3>
            <Link href="/services/" className={styles.directoryViewAll}>
              View services hub →
            </Link>
          </div>

          <div className={styles.directoryGrid}>
            {nav.serviceHubs.map((hub) => (
              <div key={hub.id} className={styles.directoryGroup}>
                <Link href={hub.hubHref} className={styles.directoryHubLink}>
                  {hub.label}
                </Link>
                <ul className={styles.directoryList}>
                  {hub.items.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className={styles.directoryItemLink}>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className={styles.cityServicesStrip}>
            <span className={styles.cityServicesLabel}>Popular Local City Services:</span>
            <div className={styles.cityServicesLinks}>
              {cities.slice(0, 5).flatMap((city) =>
                nav.topCityServiceSlugs.slice(0, 2).map((srv) => (
                  <Link
                    key={`${city.slug}-${srv.slug}`}
                    href={`/locations/${city.slug}/${srv.slug}/`}
                    className={styles.directoryItemLink}
                    data-track-city={city.name}
                  >
                    {city.name} {srv.label}
                  </Link>
                ))
              )}
            </div>
          </div>
        </nav>

        <div className={styles.disclaimerBox} role="note" aria-label="Advertising and referral disclosure">
          <p>
            <strong>Advertising &amp; Referral Disclosure:</strong> {site.brand} ({site.domain}) is a
            free advertising and referral service that connects callers with independent, licensed
            local plumbing contractors. We are not a plumbing service provider ourselves and do not
            directly perform plumbing repairs, installations, or inspections. All work is performed
            by independent service providers; verify licensing, insurance, and written estimates
            directly with the dispatched contractor before authorizing work.
          </p>
        </div>

        <div className={styles.bottom}>
          <p>
            © {year} {site.brand} ({site.licensee.legalName}). All rights reserved.
          </p>
          <div className={styles.bottomLinks}>
            <Link href="/privacy-policy/" className={styles.bottomLink}>
              Privacy Policy
            </Link>
            <span aria-hidden="true">·</span>
            <Link href="/terms/" className={styles.bottomLink}>
              Terms of Service
            </Link>
            <span aria-hidden="true">·</span>
            <Link href="/contact/" className={styles.bottomLink} data-track-contact="footer-bottom">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
