import type { SiteConfig } from "@/lib/config";
import type { OpenStatus } from "@/lib/hours";
import { CallButton } from "@/components/ui/CallButton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ShieldIcon } from "@/components/icons/Icons";
import styles from "./AboutHero.module.css";

interface AboutHeroProps {
  site: SiteConfig;
  initialStatus: OpenStatus;
}

export function AboutHero({ site, initialStatus }: AboutHeroProps) {
  const isPartner = site.operatingModel === "partner";
  const answerFirst = isPartner
    ? `This website connects Phoenix homeowners with licensed plumbing contractor ${site.licensee.legalName} (ROC #${site.licensee.rocNumber}).`
    : `${site.brand} is operated by ${site.licensee.legalName}, a licensed Arizona plumbing contractor (ROC #${site.licensee.rocNumber}).`;

  return (
    <section className={styles.hero} aria-labelledby="about-hero-heading">
      <div className="container">
        <div className={styles.eyebrow}>
          <ShieldIcon size={16} />
          <span>Licensed Arizona Plumbing · ROC #{site.licensee.rocNumber}</span>
        </div>

        <h1 id="about-hero-heading" className={styles.title}>
          About {site.brand}
        </h1>

        <p className={styles.answerFirst}>{answerFirst}</p>

        <div className={styles.actions}>
          <CallButton
            display={site.phone.display}
            e164={site.phone.e164}
            location="about-hero"
            size="lg"
          />
          <StatusBadge hours={site.hours} initialStatus={initialStatus} variant="dark" />
          <a href="#license" className={styles.ghostLink}>
            Verify our license ↓
          </a>
        </div>
      </div>
    </section>
  );
}
