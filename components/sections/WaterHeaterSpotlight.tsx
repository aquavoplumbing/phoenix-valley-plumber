import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import Link from "next/link";
import type { SiteConfig } from "@/lib/config";
import { CheckIcon } from "@/components/icons/Icons";
import { CallButton } from "@/components/ui/CallButton";
import { ScrollReveal } from "@/components/ui/Reveal";
import { TiltCard } from "@/components/ui/TiltCard";
import styles from "./WaterHeaterSpotlight.module.css";

function findWaterHeaterImage(): string | null {
  const candidates = ["water-heater.avif", "water-heater.webp", "water-heater.jpg", "water-heater.png"];
  for (const name of candidates) {
    if (fs.existsSync(path.join(process.cwd(), "public", "img", name))) {
      return `/img/${name}`;
    }
  }
  return null;
}

const CHECKLIST = [
  "Gas, electric, and tankless water heater diagnostics",
  "Flush & descaling service for Phoenix hard-water mineral buildup",
  "Properly sized replacement tanks installed to current code",
  "Expansion tanks, shut-off valves, and pressure checks included",
];

export function WaterHeaterSpotlight({ site }: { site: SiteConfig }) {
  const imgSrc = findWaterHeaterImage();

  return (
    <section className={styles.section} aria-labelledby="water-heater-heading">
      <div className={`container ${styles.grid}`}>
        <ScrollReveal variant="left" className={styles.visualCol}>
          <TiltCard maxTilt={7} className={styles.mediaTilt}>
            <div className={styles.mediaCard}>
              {imgSrc ? (
                <Image
                  src={imgSrc}
                  alt="3D cutaway of a modern water heater and copper manifold for Phoenix homes"
                  width={1200}
                  height={900}
                  sizes="(max-width: 899px) 100vw, 46vw"
                  className={styles.photo}
                />
              ) : (
              <svg
                viewBox="0 0 480 360"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-label="Diagram showing hard-water mineral scale inside a Phoenix water heater tank"
                className={styles.diagramSvg}
              >
                <rect width="480" height="360" rx="20" fill="#0B2A4A" />
                <rect x="155" y="48" width="170" height="252" rx="22" fill="#123F6B" stroke="#56C4F5" strokeWidth="3" />
                {/* Pipes */}
                <path d="M195 48 V 18 H 140" stroke="#1E9BD7" strokeWidth="10" strokeLinecap="round" />
                <path d="M285 48 V 18 H 340" stroke="#FF7A1A" strokeWidth="10" strokeLinecap="round" />
                {/* Water interior */}
                <rect x="172" y="72" width="136" height="208" rx="14" fill="#0A233E" />
                {/* Heating element */}
                <path d="M240 120 V 210" stroke="#FF7A1A" strokeWidth="8" strokeLinecap="round" />
                {/* Mineral scale deposits at bottom */}
                <path
                  d="M174 252 Q 205 236 240 248 T 306 246 L 306 278 L 174 278 Z"
                  fill="#FAF6EF"
                  opacity="0.88"
                />
                <circle cx="204" cy="258" r="5" fill="#E8650A" opacity="0.7" />
                <circle cx="255" cy="264" r="6" fill="#E8650A" opacity="0.65" />
                <circle cx="282" cy="256" r="4" fill="#E8650A" opacity="0.7" />
              </svg>
            )}

              <div className={styles.annotation}>
                <span className={styles.annotationDot} aria-hidden="true" />
                <span>Scale buildup from hard Valley water</span>
              </div>
            </div>
          </TiltCard>
        </ScrollReveal>

        <ScrollReveal variant="right" className={styles.contentCol}>
          <p className={styles.eyebrow}>Most Requested Repair</p>
          <h2 id="water-heater-heading" className={styles.title}>
            Water Heater Repair &amp; Replacement in Phoenix
          </h2>

          <p className={styles.body}>
            Phoenix is consistently ranked among the hardest-water metro areas in the country.
            Dissolved minerals settle at the bottom of tank heaters and coat tankless heat
            exchangers, forcing units to run hotter and fail sooner.
          </p>

          <p className={styles.body}>
            Call if you notice lukewarm or no hot water, rusty water at the tap, rumbling or
            popping sounds from the tank, moisture around the base, or unexpected utility spikes.
          </p>

          <p className={styles.body}>
            {/* Verify permit rule with partner and local building department */}
            The City of Phoenix generally requires a plumbing permit for water heater replacement
            to confirm safe venting and connections. We walk you through repair vs. replacement
            options clearly on the call.
          </p>

          <ul className={styles.checklist}>
            {CHECKLIST.map((item) => (
              <li key={item}>
                <span className={styles.checkBadge} aria-hidden="true">
                  <CheckIcon size={15} />
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className={styles.actions}>
            <CallButton
              display={site.phone.display}
              e164={site.phone.e164}
              location="water-heater-spotlight"
            />
            <Link href="/water-heater-repair/" className="btn-ghost">
              Water heater repair details
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

