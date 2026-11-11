import Link from "next/link";
import type { SiteConfig } from "@/lib/config";
import { CallButton } from "@/components/ui/CallButton";
import styles from "./StubPage.module.css";

export function StubPage({
  site,
  eyebrow,
  title,
  description,
  breadcrumbLabel,
  parentBreadcrumb,
  linksHeading,
  links,
}: {
  site: SiteConfig;
  eyebrow: string;
  title: string;
  description: string;
  breadcrumbLabel: string;
  parentBreadcrumb?: { label: string; href: string };
  linksHeading?: string;
  links?: Array<{ label: string; href: string }>;
}) {
  return (
    <section className={styles.section}>
      <div className="container">
        <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
          <Link href="/" className={styles.crumbLink}>
            Home
          </Link>
          {parentBreadcrumb ? (
            <>
              <span aria-hidden="true">/</span>
              <Link href={parentBreadcrumb.href} className={styles.crumbLink}>
                {parentBreadcrumb.label}
              </Link>
            </>
          ) : null}
          <span aria-hidden="true">/</span>
          <span>{breadcrumbLabel}</span>
        </nav>

        <div className={styles.card}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.desc}>{description}</p>

          <div className={styles.actions}>
            <CallButton
              display={site.phone.display}
              e164={site.phone.e164}
              location={`stub-${breadcrumbLabel.toLowerCase().replace(/\s+/g, "-")}`}
              size="lg"
            />
            <Link href="/" className="btn-ghost">
              ← Back to homepage
            </Link>
          </div>

          {links && links.length > 0 ? (
            <div className={styles.subDirectory}>
              {linksHeading ? <h2 className={styles.subHeading}>{linksHeading}</h2> : null}
              <ul className={styles.subGrid}>
                {links.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className={styles.subLink}>
                      {item.label} →
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <p className={styles.note}>
            Licensed Arizona Contractor · {site.licensee.legalName} · ROC #{site.licensee.rocNumber}.
            Full page content is scheduled for a future phase (currently marked <code>noindex</code>).
          </p>
        </div>
      </div>
    </section>
  );
}
