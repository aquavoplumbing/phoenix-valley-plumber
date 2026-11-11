import type { ReactNode } from "react";
import { isPlaceholderValue, type SiteConfig } from "@/lib/config";
import { AwardIcon, ClockIcon, ExternalLinkIcon, ShieldIcon, StarIcon } from "@/components/icons/Icons";
import { ScrollReveal } from "@/components/ui/Reveal";
import styles from "./TrustStrip.module.css";

interface TrustItem {
  key: string;
  icon: ReactNode;
  value: string;
  label: ReactNode;
}

export function TrustStrip({ site }: { site: SiteConfig }) {
  const isDev = process.env.NODE_ENV !== "production";
  const items: TrustItem[] = [
    {
      key: "roc",
      icon: <ShieldIcon size={24} />,
      value: `ROC #${site.licensee.rocNumber}`,
      label: (
        <span className={styles.rocLabel}>
          <span>Arizona licensed contractor · </span>
          <a
            href="https://roc.az.gov"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.rocLink}
          >
            Verify <ExternalLinkIcon size={12} />
          </a>
          {isPlaceholderValue(site.licensee.rocNumber) && isDev ? (
            <span className="todo-badge">TODO</span>
          ) : null}
        </span>
      ),
    },
  ];

  if (site.licensee.bonded && site.licensee.insured) {
    items.push({
      key: "bonded-insured",
      icon: <ShieldIcon size={24} />,
      value: "Bonded & Insured",
      label: "Active AZ contractor coverage",
    });
  } else if (site.licensee.insured) {
    items.push({
      key: "insured",
      icon: <ShieldIcon size={24} />,
      value: "Insured Contractor",
      label: "Active liability coverage",
    });
  }

  if (
    typeof site.rating.value === "number" &&
    typeof site.rating.count === "number" &&
    site.rating.count > 0
  ) {
    items.push({
      key: "rating",
      icon: <StarIcon size={22} />,
      value: `${site.rating.value.toFixed(1)} ★ (${site.rating.count})`,
      label: `Verified ${site.rating.source} reviews`,
    });
  }

  if (typeof site.claims.yearsInBusiness === "number" && site.claims.yearsInBusiness > 0) {
    items.push({
      key: "years",
      icon: <ClockIcon size={24} />,
      value: `${site.claims.yearsInBusiness}+ Years`,
      label: "Serving Phoenix & the Valley",
    });
  }

  if (site.claims.warranty && site.claims.warranty.trim()) {
    items.push({
      key: "warranty",
      icon: <AwardIcon size={24} />,
      value: site.claims.warranty,
      label: "Backed workmanship warranty",
    });
  }

  return (
    <section className={styles.wrapper} aria-label="License and verified credentials">
      <div className="container">
        <div
          className={styles.panel}
          style={{ ["--trust-cols" as string]: String(Math.max(items.length, 1)) }}
        >
          {items.map((item) => (
            <div key={item.key} className={styles.item}>
              <ScrollReveal variant="scale" className={styles.iconBox}>
                {item.icon}
              </ScrollReveal>
              <div className={styles.meta}>
                <p className={styles.value}>{item.value}</p>
                <p className={styles.label}>{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

