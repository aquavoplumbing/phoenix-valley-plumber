import Link from "next/link";
import styles from "./ServicesGridAbout.module.css";

interface ServiceHub {
  title: string;
  href: string;
  description: string;
}

const SERVICE_HUBS: ServiceHub[] = [
  {
    title: "Water Heater Repair & Replacement",
    href: "/water-heater/",
    description: "Diagnostics, element/valve repairs, tank flushing, and complete tank or tankless installations.",
  },
  {
    title: "Drain Cleaning & Rooter",
    href: "/drain-cleaning/",
    description: "Clog clearing for main sewer lines, kitchen stacks, bathroom branches, and outdoor yard drains.",
  },
  {
    title: "Sewer Line Repair & Replacement",
    href: "/sewer-line-repair/",
    description: "In-line video camera inspections, spot repairs, trenchless pipe relining, and full line replacements.",
  },
  {
    title: "Leak Detection & Slab Leaks",
    href: "/leak-detection/",
    description: "Acoustic and electronic underground leak locating for residential concrete foundation slabs.",
  },
  {
    title: "Water Softeners & Filtration",
    href: "/water-softener-installation/",
    description: "Whole-home ion-exchange softeners and reverse osmosis drinking water systems designed for Valley water.",
  },
  {
    title: "Commercial & Emergency Plumbing",
    href: "/commercial-plumbing/",
    description: "Commercial plumbing maintenance, restaurant grease line service, and emergency water shutoff repairs.",
  },
];

export function ServicesGridAbout() {
  return (
    <section className={styles.section} aria-labelledby="about-services-heading">
      <div className="container">
        <div className={styles.header}>
          <span className={styles.badge}>Core Trade Scope</span>
          <h2 id="about-services-heading" className={styles.title}>
            What We Do
          </h2>
          <p className={styles.subtitle}>
            Comprehensive residential and commercial plumbing services across the Phoenix metropolitan area:
          </p>
        </div>

        <div className={styles.grid}>
          {SERVICE_HUBS.map((hub) => (
            <article key={hub.href} className={styles.card}>
              <h3 className={styles.cardTitle}>
                <Link href={hub.href} className={styles.cardLink}>
                  {hub.title}
                </Link>
              </h3>
              <p className={styles.cardDesc}>{hub.description}</p>
              <Link href={hub.href} className={styles.arrowLink}>
                Learn more →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
