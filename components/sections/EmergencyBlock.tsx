import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import Link from "next/link";
import type { SiteConfig } from "@/lib/config";
import { CallButton } from "@/components/ui/CallButton";
import { ScrollReveal } from "@/components/ui/Reveal";
import { TiltCard } from "@/components/ui/TiltCard";
import styles from "./EmergencyBlock.module.css";

function findEmergencyImage(): string | null {
  const candidates = ["emergency-plumbing.avif", "emergency-plumbing.webp", "emergency-plumbing.jpg", "emergency-plumbing.png"];
  for (const name of candidates) {
    if (fs.existsSync(path.join(process.cwd(), "public", "img", name))) {
      return `/img/${name}`;
    }
  }
  return null;
}

export function EmergencyBlock({ site }: { site: SiteConfig }) {
  const emergencyImg = findEmergencyImage();

  return (
    <section className={styles.section} aria-labelledby="emergency-heading">
      <div className="container">
        <ScrollReveal>
          <div className={styles.card}>
            <div className={styles.left}>
              <div className={styles.kickerRow}>
                <span className={styles.urgentDot} aria-hidden="true" />
                <p className={styles.kicker}>Plumbing emergency? Do this, then call</p>
              </div>
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

              <div className={styles.actionsRow}>
                <CallButton
                  display={site.phone.display}
                  e164={site.phone.e164}
                  location="emergency-block"
                  label="Call Now"
                  size="lg"
                  className={styles.callBtn}
                />
                <Link href="/how-to-find-main-shutoff-valve/" className={styles.guideLink}>
                  How to find your main shut-off valve →
                </Link>
              </div>

              {site.claims.expectationNotice ? (
                <p className={styles.expectation}>
                  {/* CLAIM: claims.expectationNotice */}
                  We will tell you what to expect before anyone is sent.
                </p>
              ) : null}
            </div>

            {emergencyImg ? (
              <div className={styles.rightVisual}>
                <TiltCard maxTilt={6} className={styles.visualTilt}>
                  <div className={styles.visualFrame}>
                    <Image
                      src={emergencyImg}
                      alt="3D brass main shut-off valve and copper plumbing fitting"
                      width={1200}
                      height={900}
                      sizes="(max-width: 899px) 100vw, 38vw"
                      className={styles.emergencyImage}
                    />
                    <div className={styles.valvePill}>Shut off main valve first</div>
                  </div>
                </TiltCard>
              </div>
            ) : null}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
