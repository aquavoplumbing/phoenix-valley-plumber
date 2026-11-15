import Image from "next/image";
import type { ServiceContent } from "@/lib/service-schema";
import { PhoenixAngleIllustration } from "@/components/icons/ServiceIllustration";
import { SourceLink } from "./SourceLink";
import styles from "./PhoenixAngle.module.css";

export function PhoenixAngle({
  slug,
  phoenixAngle,
  image,
}: {
  slug: string;
  phoenixAngle: ServiceContent["phoenixAngle"];
  image?: { src: string; alt: string; width: number; height: number };
}) {
  return (
    <section id="phoenix-angle" className={styles.panel} aria-labelledby="phoenix-angle-heading">
      <div className={styles.visualCol}>
        <div className={styles.visualBox}>
          {image ? (
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              sizes="(max-width: 899px) 100vw, 44vw"
              className={styles.photo}
            />
          ) : (
            <PhoenixAngleIllustration slug={slug} />
          )}
        </div>
      </div>

      <div className={styles.textCol}>
        <span className={styles.kicker}>Phoenix Valley Local Conditions</span>
        <h2 id="phoenix-angle-heading" className={styles.heading}>
          {phoenixAngle.heading}
        </h2>

        {phoenixAngle.paragraphs.map((p, idx) => (
          <p key={idx} className={styles.paragraph}>
            {p}
          </p>
        ))}

        {phoenixAngle.facts && phoenixAngle.facts.length > 0 ? (
          <ul className={styles.facts}>
            {phoenixAngle.facts.map((fact) => (
              <li key={fact.sourceUrl} className={styles.fact}>
                <span>{fact.text}</span>
                <SourceLink href={fact.sourceUrl} />
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
