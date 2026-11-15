import Image from "next/image";
import type { ImageKind } from "@/lib/post-schema";
import styles from "./Figure.module.css";

interface FigureProps {
  src: string;
  alt: string;
  caption?: string;
  width?: number | string;
  height?: number | string;
  kind?: ImageKind;
  credit?: string;
  priority?: boolean;
}

export function Figure({
  src,
  alt,
  caption,
  width,
  height,
  kind = "illustration",
  credit,
  priority = false,
}: FigureProps) {
  const label = kind === "photo" ? "Photo" : kind === "diagram" ? "Diagram" : "Illustration";

  const parsedW = typeof width === "number" ? width : width ? parseInt(String(width), 10) : NaN;
  const parsedH = typeof height === "number" ? height : height ? parseInt(String(height), 10) : NaN;
  const finalWidth = !isNaN(parsedW) && parsedW > 0 ? parsedW : 800;
  const finalHeight = !isNaN(parsedH) && parsedH > 0 ? parsedH : 520;
  const isSvg = typeof src === "string" && src.toLowerCase().endsWith(".svg");

  return (
    <figure className={styles.figure}>
      <div className={styles.imgContainer}>
        <Image
          src={src}
          alt={alt || ""}
          width={finalWidth}
          height={finalHeight}
          priority={priority}
          unoptimized={isSvg}
          className={styles.image}
          sizes="(max-width: 768px) 100vw, 720px"
        />
        <span className={styles.badge}>{label}</span>
      </div>
      {caption && (
        <figcaption className={styles.caption}>
          <span className={styles.captionText}>{caption}</span>
          {credit && <span className={styles.credit}>Source / Credit: {credit}</span>}
        </figcaption>
      )}
    </figure>
  );
}
