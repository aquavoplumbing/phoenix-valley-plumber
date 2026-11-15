import Link from "next/link";
import Image from "next/image";
import type { Post, Author } from "@/lib/post-schema";
import { CATEGORY_LABELS } from "@/lib/post-schema";
import styles from "./PostHeader.module.css";

interface PostHeaderProps {
  post: Post;
  authors: Author[];
  readingTimeMinutes: number;
}

export function PostHeader({ post, authors, readingTimeMinutes }: PostHeaderProps) {
  const primaryAuthor = authors[0];
  const hasRealAuthor = Boolean(primaryAuthor && primaryAuthor.consentOn);
  const categoryLabel = CATEGORY_LABELS[post.category] || post.category;

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.categoryRow}>
        <Link href={`/blog/category/${post.category}/`} className={styles.categoryChip}>
          {categoryLabel}
        </Link>
        <span className={styles.readingTime}>{readingTimeMinutes} min read</span>
      </div>

      <h1 className={styles.title}>{post.seo.h1}</h1>

      <div className={styles.metaRow}>
        <div className={styles.authorGroup}>
          {hasRealAuthor && primaryAuthor ? (
            <>
              <div className={styles.avatarWrap}>
                <Image
                  src={primaryAuthor.photo}
                  alt={primaryAuthor.name}
                  width={44}
                  height={44}
                  className={styles.avatar}
                />
              </div>
              <div className={styles.authorText}>
                <span className={styles.byLabel}>Written by</span>
                <Link href={`/blog/author/${primaryAuthor.slug}/`} className={styles.authorName}>
                  {primaryAuthor.name}
                </Link>
                <span className={styles.authorRole}>{primaryAuthor.role}</span>
              </div>
            </>
          ) : (
            <div className={styles.authorText}>
              <span className={styles.byLabel}>Published by</span>
              <span className={styles.orgName}>Phoenix Valley Plumber Editorial Team</span>
            </div>
          )}
        </div>

        {post.reviewer && (
          <div className={styles.reviewerBadge}>
            <span className={styles.reviewerCheck} aria-hidden="true">✓</span>
            <span>
              Technically reviewed by <strong>{post.reviewer.author}</strong> on {formatDate(post.reviewer.reviewedOn)}
            </span>
          </div>
        )}

        <div className={styles.dateRow}>
          <span>Published {formatDate(post.datePublished)}</span>
          {post.dateModified && post.changelog && post.changelog.length > 0 && (
            <>
              <span className={styles.dot} aria-hidden="true">·</span>
              <span>Updated {formatDate(post.dateModified)}</span>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
