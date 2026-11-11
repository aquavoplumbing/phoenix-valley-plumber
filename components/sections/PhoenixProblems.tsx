import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ScrollReveal } from "@/components/ui/Reveal";
import { TiltCard } from "@/components/ui/TiltCard";
import { ProblemsTabs, type ProblemItem } from "./ProblemsTabs";
import styles from "./PhoenixProblems.module.css";

function findProblemsImage(): string | null {
  const candidates = ["phoenix-problems.avif", "phoenix-problems.webp", "phoenix-problems.jpg", "phoenix-problems.png"];
  for (const name of candidates) {
    if (fs.existsSync(path.join(process.cwd(), "public", "img", name))) {
      return `/img/${name}`;
    }
  }
  return null;
}

const PROBLEMS: ProblemItem[] = [
  {
    id: "hard-water",
    label: "Hard Water & Scale",
    title: "Hard Water & Mineral Scale Buildup",
    body: "The Phoenix Valley has some of the hardest municipal water in the United States. Dissolved calcium and magnesium gradually collect inside water heater tanks, tankless heat exchangers, aerators, and supply valves. Over time, mineral buildup reduces hot water capacity, causes popping noises in tanks, leaves white crust on fixtures, and wears down appliance seals faster than expected.",
    links: [
      { label: "Water Softener & Filtration", href: "/water-softener-installation/" },
      { label: "Water Heater Services", href: "/water-heater/" },
    ],
  },
  {
    id: "monsoon",
    label: "Monsoon & Heavy Rain",
    title: "Monsoon Season & Heavy Rain Stress",
    body: "Sudden desert monsoon storms drop heavy rain onto dry ground that absorbs water slowly. Yard drains, area grates, sump basins, and older main sewer lines can quickly be overwhelmed by storm runoff and debris. Checking cleanouts, clearing main line obstructions, and testing sump pumps ahead of storm season helps reduce the risk of messy backups.",
    links: [
      { label: "Drain Cleaning", href: "/drain-cleaning/" },
      { label: "Sump Pump Service", href: "/sump-pump/" },
    ],
  },
  {
    id: "summer-heat",
    label: "Summer Heat Stress",
    title: "Extreme Summer Heat & Pipe Wear",
    body: "Extended triple-digit Phoenix summers put extra strain on plumbing systems, especially lines routed through hot attics or garage water heaters. Elevated incoming water temperatures, thermal expansion, and dried rubber washers or supply hoses can trigger sudden leaks when valves or cartridges fail. Periodic pressure checks and shut-off valve inspections catch weak points early.",
    links: [
      { label: "Water Heater Repair", href: "/water-heater-repair/" },
      { label: "Leak Detection", href: "/leak-detection/" },
    ],
  },
  {
    id: "slab-leaks",
    label: "Slab Leaks & Caliche",
    title: "Slab Leaks & Underground Line Shifts",
    body: "Most Valley homes sit on concrete slab foundations over dense, shifting caliche soil. Ground movement, pipe friction against concrete, and aging copper lines can create pinhole leaks beneath your floor. Watch for unexplained spikes in your water bill, warm spots on tile or carpet, damp baseboards, or the faint sound of water running when fixtures are shut off.",
    links: [
      { label: "Slab & Leak Detection", href: "/slab-leak-repair/" },
      { label: "Whole-Home Repiping", href: "/repiping/" },
    ],
  },
  {
    id: "roots-drains",
    label: "Clogged Drains & Roots",
    title: "Clogged Drains & Sewer Root Intrusion",
    body: "Desert trees and landscaping search aggressively for moisture, often sending fine roots into tiny joints along older underground sewer laterals. Combined with kitchen grease and soap residue, root intrusion causes slow drains, gurgling toilets, and recurring main line clogs. A fiber-optic camera inspection pinpoints the exact blockage before hydro jetting or repair.",
    links: [
      { label: "Sewer Camera Inspection", href: "/sewer-camera-inspection/" },
      { label: "Hydro Jetting", href: "/hydro-jetting/" },
    ],
  },
];

export function PhoenixProblems() {
  const problemsImg = findProblemsImage();

  return (
    <section className={styles.section} aria-labelledby="problems-heading">
      <div className="container">
        <SectionHeading
          id="problems-heading"
          eyebrow="Local Phoenix Plumbing Conditions"
          title="Common Plumbing Problems in Phoenix Homes"
          subtitle="Desert heat, mineral-heavy water, caliche soil, and monsoon storms affect Valley plumbing differently."
        />

        <div className={styles.workbenchGrid}>
          <ProblemsTabs items={PROBLEMS} />

          {problemsImg ? (
            <ScrollReveal variant="right" className={styles.dioramaCol}>
              <TiltCard maxTilt={6} className={styles.dioramaTilt}>
                <div className={styles.dioramaFrame}>
                  <Image
                    src={problemsImg}
                    alt="3D cross-section of Phoenix desert slab plumbing and underground sewer lines"
                    width={1200}
                    height={900}
                    sizes="(max-width: 1099px) 100vw, 34vw"
                    className={styles.dioramaImg}
                  />
                  <div className={styles.dioramaBadge}>
                    Slab &amp; Desert Pipe Diagnostics
                  </div>
                </div>
              </TiltCard>
            </ScrollReveal>
          ) : null}
        </div>
      </div>
    </section>
  );
}
