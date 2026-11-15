import Link from "next/link";
import Image from "next/image";
import type { PostParsed } from "@/lib/post-schema";
import { CATEGORY_LABELS } from "@/lib/post-schema";
import styles from "./PostCard.module.css";

interface PostCardProps {
  post: PostParsed;
  priority?: boolean;
}

export function PostCard({ post, priority = false }: PostCardProps) {
  const { frontmatter, readingTimeMinutes } = post;
  const categoryLabel = CATEGORY_LABELS[frontmatter.category] || frontmatter.category;
  const href = frontmatter.type === "cost-guide" ? `/cost-guides/${frontmatter.slug}/` : `/blog/${frontmatter.slug}/`;

  // Format date
  const dateStr = (() => {
    try {
      return new Date(frontmatter.datePublished).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return frontmatter.datePublished;
    }
  })();

  return (
    <article className={styles.card}>
      <Link href={href} className={styles.imageLink} tabIndex={-1} aria-hidden="true">
        <div className={styles.imageWrap}>
          <Image
            src={frontmatter.hero.src}
            alt={frontmatter.hero.alt}
            width={frontmatter.hero.width}
            height={frontmatter.hero.height}
            priority={priority}
            className={styles.image}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
          />
          <span className={styles.categoryBadge}>{categoryLabel}</span>
        </div>
      </Link>

      <div className={styles.content}>
        <div className={styles.metaRow}>
          <time dateTime={frontmatter.datePublished} className={styles.date}>
            {dateStr}
          </time>
          <span className={styles.dot} aria-hidden="true">·</span>
          <span className={styles.time}>{readingTimeMinutes} min read</span>
        </div>

        <h3 className={styles.title}>
          <Link href={href} className={styles.titleLink}>
            {frontmatter.seo.title}
          </Link>
        </h3>

        <p className={styles.excerpt}>{frontmatter.seo.metaDescription}</p>

        <div className={styles.footerRow}>
          <Link href={href} className={styles.readMore}>
            Read guide <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
