import styles from "./SectionHeading.module.css";

export function SectionHeading({
  id,
  eyebrow,
  title,
  subtitle,
  align = "center",
  tone = "light",
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
}) {
  return (
    <div
      className={`${styles.heading} ${align === "left" ? styles.left : styles.center} ${
        tone === "dark" ? styles.dark : ""
      }`}
    >
      {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
      <h2 id={id} className={styles.title}>
        {title}
      </h2>
      {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
    </div>
  );
}

