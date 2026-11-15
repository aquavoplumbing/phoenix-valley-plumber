import Link from "next/link";
import type { SiteConfig } from "@/lib/config";
import { getServiceBySlug } from "@/lib/routes";
import type { ServiceContent } from "@/lib/service-schema";
import { WrenchIcon } from "@/components/icons/Icons";
import { CallButton } from "@/components/ui/CallButton";
import styles from "./CostFactors.module.css";

export function CostFactors({
  site,
  heading,
  costFactors,
  costGuideSlug,
}: {
  site: SiteConfig;
  heading: string;
  costFactors: NonNullable<ServiceContent["costFactors"]>;
  costGuideSlug?: string;
}) {
  const costGuide = costGuideSlug ? getServiceBySlug(costGuideSlug) : undefined;

  return (
    <section id="cost-factors" aria-labelledby="cost-factors-heading">
      <h2 id="cost-factors-heading">{heading}</h2>
      <p className={styles.intro}>{costFactors.intro}</p>

      <ul className={styles.list}>
        {costFactors.factors.map((factor) => (
          <li key={factor.title} className={styles.row}>
            <WrenchIcon size={20} className={styles.icon} />
            <div>
              <h3 className={styles.title}>{factor.title}</h3>
              <p className={styles.text}>{factor.text}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className={styles.callout}>
        <div>
          {costFactors.priceRange ? (
            <>
              <p className={styles.calloutText}>
                Typical range: ${costFactors.priceRange.low.toLocaleString()}–$
                {costFactors.priceRange.high.toLocaleString()} {costFactors.priceRange.unit}
              </p>
              <p className={styles.sourceNote}>{costFactors.priceRange.sourceNote}</p>
            </>
          ) : (
            <p className={styles.calloutText}>
              The fastest way to get an accurate price is to call.
            </p>
          )}
        </div>

        <CallButton
          display={site.phone.display}
          e164={site.phone.e164}
          location="svc-cost"
        />
      </div>

      {costGuide ? (
        <p className={styles.guideRow}>
          Read more:{" "}
          <Link href={`/${costGuide.slug}/`} className={styles.guideLink}>
            {costGuide.name} →
          </Link>
        </p>
      ) : null}
    </section>
  );
}

