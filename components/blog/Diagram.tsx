import { Figure } from "./Figure";
import styles from "./Diagram.module.css";

interface DiagramProps {
  src: string;
  alt: string;
  caption: string;
  width?: number | string;
  height?: number | string;
  description: string;
  credit?: string;
  priority?: boolean;
}

export function Diagram({
  src,
  alt,
  caption,
  width,
  height,
  description,
  credit,
  priority = false,
}: DiagramProps) {
  return (
    <div className={styles.diagramWrapper}>
      <Figure
        src={src}
        alt={alt}
        caption={caption}
        width={width}
        height={height}
        kind="diagram"
        credit={credit}
        priority={priority}
      />
      <details className={styles.accessibleDesc}>
        <summary className={styles.summary}>
          Text description of this diagram (for screen readers & accessibility)
        </summary>
        <div className={styles.descContent}>
          <p>{description}</p>
        </div>
      </details>
    </div>
  );
}
