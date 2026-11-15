import type { ReactNode } from "react";
import Image from "next/image";
import styles from "./Steps.module.css";

interface StepItem {
  title: string;
  text: string;
  image?: {
    src: string;
    alt: string;
    width: number;
    height: number;
    caption?: string;
  };
}

interface StepsProps {
  steps?: StepItem[];
  children?: ReactNode;
}

export function Steps({ steps, children }: StepsProps) {
  if (children) {
    return <div className={styles.stepsContainer}>{children}</div>;
  }

  if (!steps || steps.length === 0) return null;

  return (
    <ol className={styles.stepList}>
      {steps.map((step, idx) => (
        <li key={idx} className={styles.stepItem}>
          <div className={styles.numberBadge} aria-hidden="true">
            {idx + 1}
          </div>
          <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>{step.title}</h3>
            <p className={styles.stepText}>{step.text}</p>
            {step.image && (
              <figure className={styles.stepFigure}>
                <Image
                  src={step.image.src}
                  alt={step.image.alt}
                  width={step.image.width}
                  height={step.image.height}
                  className={styles.stepImg}
                />
                {step.image.caption && (
                  <figcaption className={styles.stepCaption}>
                    {step.image.caption}
                  </figcaption>
                )}
              </figure>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

interface StepProps {
  number: number;
  title: string;
  children: ReactNode;
}

export function Step({ number, title, children }: StepProps) {
  return (
    <div className={styles.stepItem}>
      <div className={styles.numberBadge} aria-hidden="true">
        {number}
      </div>
      <div className={styles.stepContent}>
        <h3 className={styles.stepTitle}>{title}</h3>
        <div className={styles.stepText}>{children}</div>
      </div>
    </div>
  );
}
