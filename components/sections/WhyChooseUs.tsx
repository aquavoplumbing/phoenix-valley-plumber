import type { ReactNode } from "react";
import { isPlaceholderValue, type SiteConfig } from "@/lib/config";
import { AwardIcon, CheckIcon, ClockIcon, MapPinIcon, PhoneIcon, ShieldIcon } from "@/components/icons/Icons";
import { ScrollReveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TiltCard } from "@/components/ui/TiltCard";
import styles from "./WhyChooseUs.module.css";

interface BenefitTile {
  key: string;
  icon: ReactNode;
  title: string;
  description: string;
  claimComment?: string;
}

export function WhyChooseUs({ site }: { site: SiteConfig }) {
  const isDev = process.env.NODE_ENV !== "production";
  const tiles: BenefitTile[] = [
    {
      key: "roc",
      icon: <ShieldIcon size={24} />,
      title: `Licensed Arizona Contractor (ROC #${site.licensee.rocNumber})`,
      description: `Operated by ${site.licensee.legalName} under active Arizona Registrar of Contractors licensing.`,
    },
    {
      key: "local",
      icon: <MapPinIcon size={24} />,
      title: "Local to the Phoenix Valley",
      description: "Focused on Valley homes, local hard-water challenges, slab foundations, and municipal requirements.",
    },
    {
      key: "phone-clarity",
      icon: <PhoneIcon size={24} />,
      title: "Clear Communication by Phone",
      description: "Call directly to describe the issue, get practical shut-off guidance, and arrange service without forms.",
    },
  ];

  if (site.claims.sameDayService) {
    tiles.push({
      key: "same-day",
      icon: <ClockIcon size={24} />,
      title: "Same-Day Service",
      description: "Same-day scheduling is available for urgent and routine plumbing calls across our Valley service area.",
      claimComment: "claims.sameDayService",
    });
  }

  if (site.claims.upfrontPricing) {
    tiles.push({
      key: "upfront",
      icon: <CheckIcon size={24} />,
      title: "Upfront Pricing",
      description: "Your plumber reviews the scope and explains pricing clearly before repair work begins.",
      claimComment: "claims.upfrontPricing",
    });
  }

  if (site.claims.warranty && site.claims.warranty.trim()) {
    tiles.push({
      key: "warranty",
      icon: <AwardIcon size={24} />,
      title: `Warranty: ${site.claims.warranty}`,
      description: "Backed workmanship and part coverage as stated on your service invoice.",
      claimComment: "claims.warranty",
    });
  }

  if (site.claims.seniorMilitaryDiscount) {
    tiles.push({
      key: "discount",
      icon: <AwardIcon size={24} />,
      title: "Senior & Military Discounts",
      description: "Ask on the phone about available senior and military service discounts.",
      claimComment: "claims.seniorMilitaryDiscount",
    });
  }

  if (site.claims.financing) {
    tiles.push({
      key: "financing",
      icon: <CheckIcon size={24} />,
      title: "Financing Available",
      description: "Flexible payment options available for qualified larger repairs and replacements.",
      claimComment: "claims.financing",
    });
  }

  const fewTiles = tiles.length < 4;

  return (
    <section className={styles.section} aria-labelledby="why-choose-heading">
      <div className="container">
        <SectionHeading
          id="why-choose-heading"
          eyebrow="Built on Trust"
          title="Why Phoenix Homeowners Call Us First"
          subtitle="Verified licensing, local Valley experience, and straightforward answers from the first phone call."
          tone="dark"
        />

        <ScrollReveal>
          <div className={`${styles.grid} ${fewTiles ? styles.gridThree : styles.gridSix}`}>
            {tiles.map((tile) => (
              <TiltCard key={tile.key} maxTilt={6} className={styles.tileTilt}>
                <article className={styles.tile}>
                  <div className={styles.iconWrap} aria-hidden="true">
                    {tile.icon}
                  </div>
                  <h3 className={styles.tileTitle}>
                    {tile.title}
                    {tile.key === "roc" && isPlaceholderValue(site.licensee.rocNumber) && isDev ? (
                      <>
                        {" "}
                        <span className="todo-badge">TODO</span>
                      </>
                    ) : null}
                  </h3>
                  <p className={styles.tileDesc}>{tile.description}</p>
                </article>
              </TiltCard>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
