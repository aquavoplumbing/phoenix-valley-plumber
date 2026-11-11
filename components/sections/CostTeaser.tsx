import Link from "next/link";
import type { SiteConfig } from "@/lib/config";
import type { ServiceItem } from "@/lib/routes";
import { ServiceIcon } from "@/components/icons/Icons";
import { CallButton } from "@/components/ui/CallButton";
import { ScrollReveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TiltCard } from "@/components/ui/TiltCard";
import styles from "./CostTeaser.module.css";

export function CostTeaser({
  site,
  costGuides,
}: {
  site: SiteConfig;
  costGuides: ServiceItem[];
}) {
  const featuredGuides = costGuides.filter((g) => g.featured);
  const displayGuides = (featuredGuides.length > 0 ? featuredGuides : costGuides).slice(0, 3);

  return (
    <section className={styles.section} aria-labelledby="cost-teaser-heading">
      <div className="container">
        <SectionHeading
          id="cost-teaser-heading"
          eyebrow="Transparent Cost Factors"
          title="What Does a Plumber Cost in Phoenix?"
          subtitle="Every home and pipe layout is different. Review the main factors that shape pricing before you call."
        />

        <ScrollReveal>
          <div className={styles.grid}>
            {displayGuides.map((guide) => (
              <TiltCard key={guide.slug} maxTilt={6} className={styles.cardTilt}>
                <article className={styles.card}>
                  <div className={styles.iconWrap} aria-hidden="true">
                    <ServiceIcon name={guide.icon} size={22} />
                  </div>
                  <h3 className={styles.cardTitle}>
                    <Link href={`/${guide.slug}/`} className={styles.cardLink}>
                      {guide.name.replace(" in Phoenix", "")}
                    </Link>
                  </h3>
                  <p className={styles.cardDesc}>{guide.description}</p>
                  <p className={styles.priceFactor}>
                    {guide.priceRange ? guide.priceRange : "See what affects the price →"}
                  </p>
                </article>
              </TiltCard>
            ))}
          </div>
        </ScrollReveal>

        <div className={styles.bottomRow}>
          <p className={styles.statement}>
            The fastest way to get an accurate price is to call.
          </p>
          <CallButton
            display={site.phone.display}
            e164={site.phone.e164}
            location="cost-teaser"
            size="lg"
          />
        </div>
      </div>
    </section>
  );
}
