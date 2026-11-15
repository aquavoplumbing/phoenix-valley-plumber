import type { ServiceContent } from "@/lib/service-schema";
import styles from "./MethodCards.module.css";

export function MethodCards({
  heading,
  methods,
}: {
  heading: string;
  methods: NonNullable<ServiceContent["methods"]>;
}) {
  return (
    <section id="methods" aria-labelledby="methods-heading">
      <h2 id="methods-heading">{heading}</h2>

      <div className={styles.grid}>
        {methods.map((method) => (
          <article key={method.title} className={styles.card}>
            <h3 className={styles.title}>{method.title}</h3>
            <p className={styles.fits}>When it fits: {method.whenItFits}</p>
            <p className={styles.text}>{method.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

