import Link from "next/link";
import type { SiteConfig } from "@/lib/config";
import { CallButton } from "@/components/ui/CallButton";
import { ScrollReveal } from "@/components/ui/Reveal";
import styles from "./EmergencyBlock.module.css";

export function EmergencyBlock({ site }: { site: SiteConfig }) {
  return (
    <section className={styles.section} aria-labelledby="emergency-heading">
      <div className="container">
        <ScrollReveal>
          <div className={styles.card}>
            <div className={styles.left}>
              <p className={styles.kicker}>Plumbing emergency? Do this, then call</p>
              <h2 id="emergency-heading" className={styles.title}>
                Burst pipe or flooding? Act fast.
              </h2>

              <ol className={styles.steps}>
                <li>
                  <span className={styles.stepNum}>1</span>
                  <span>Shut off the main water valve to stop water entering your home.</span>
                </li>
                <li>
                  <span className={styles.stepNum}>2</span>
                  <span>Turn off your water heater if it is leaking (power breaker or gas valve).</span>
                </li>
                <li>
                  <span className={styles.stepNum}>3</span>
                  <span>Call us and tell us what you see so we can guide your next step.</span>
                </li>
              </ol>

              <p className={styles.guideLinkWrap}>
                <Link href="/how-to-find-main-shutoff-valve/" className={styles.guideLink}>
                  How to find your main shut-off valve →
                </Link>
              </p>
            </div>

            <div className={styles.right}>
              <CallButton
                display={site.phone.display}
                e164={site.phone.e164}
                location="emergency-block"
                label="Call Now"
                size="lg"
                className={styles.callBtn}
              />
              {site.claims.expectationNotice ? (
                <p className={styles.expectation}>
                  {/* CLAIM: claims.expectationNotice */}
                  We will tell you what to expect before anyone is sent.
                </p>
              ) : null}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
