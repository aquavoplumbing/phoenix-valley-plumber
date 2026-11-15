import Link from "next/link";
import type { SiteConfig } from "@/lib/config";
import { SirenIcon, AlertCircleIcon } from "@/components/icons/Icons";
import { PhoneLink } from "@/components/ui/PhoneLink";
import styles from "./EmergencyWarningStrip.module.css";

export function EmergencyWarningStrip({ site }: { site: SiteConfig }) {
  return (
    <section className={styles.strip} aria-label="Plumbing and Gas Safety Guidance">
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.item}>
            <div className={styles.iconWrapWater} aria-hidden="true">
              <SirenIcon size={20} />
            </div>
            <div className={styles.content}>
              <h3 className={styles.title}>Water Pouring Out or Flooding?</h3>
              <p className={styles.text}>
                Shut off your main water valve immediately to stop water entering the home, then call our dispatch team at{" "}
                <PhoneLink
                  display={site.phone.display}
                  e164={site.phone.e164}
                  location="contact-emergency"
                />.
              </p>
              <Link href="/emergency-plumbing/" className={styles.link}>
                View Emergency Plumbing Steps →
              </Link>
            </div>
          </div>

          <div className={`${styles.item} ${styles.gasItem}`}>
            <div className={styles.iconWrapGas} aria-hidden="true">
              <AlertCircleIcon size={20} />
            </div>
            <div className={styles.content}>
              <h3 className={styles.titleGas}>Smell Natural Gas (Sulfur or Rotten Eggs)?</h3>
              <p className={styles.text}>
                Evacuate the home immediately. Do not flip light switches or use phones indoors. Call Southwest Gas at 877-860-6020 or dial 911. <strong>Do not call a plumber first.</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
