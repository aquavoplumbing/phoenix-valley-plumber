import type { PostParsed } from "@/lib/post-schema";
import { PostCard } from "./PostCard";
import styles from "./RelatedPosts.module.css";

interface RelatedPostsProps {
  posts: PostParsed[];
  heading?: string;
}

export function RelatedPosts({
  posts,
  heading = "Related Plumbing Advice & Guides",
}: RelatedPostsProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <section className={styles.section} aria-label="Related Articles">
      <div className={styles.header}>
        <h2 className={styles.heading}>{heading}</h2>
        <p className={styles.subhead}>
          Explore related diagnostic guides, cost explainers, and maintenance recommendations:
        </p>
      </div>
      <div className={styles.grid}>
        {posts.map((post) => (
          <PostCard key={post.frontmatter.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
