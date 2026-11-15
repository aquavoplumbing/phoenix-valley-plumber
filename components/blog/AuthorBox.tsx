import Link from "next/link";
import Image from "next/image";
import type { Author } from "@/lib/post-schema";
import styles from "./AuthorBox.module.css";

interface AuthorBoxProps {
  author?: Author;
}

export function AuthorBox({ author }: AuthorBoxProps) {
  if (author && author.consentOn) {
    return (
      <aside className={styles.container} aria-label="About the Author">
        <div className={styles.avatarWrap}>
          <Image
            src={author.photo}
            alt={author.name}
            width={72}
            height={72}
            className={styles.avatar}
          />
        </div>
        <div className={styles.info}>
          <span className={styles.label}>About the Author</span>
          <h3 className={styles.name}>
            <Link href={`/blog/author/${author.slug}/`} className={styles.link}>
              {author.name}
            </Link>
          </h3>
          <span className={styles.role}>{author.role}</span>
          <p className={styles.bio}>{author.bio}</p>
          {author.credentials && author.credentials.length > 0 && (
            <div className={styles.creds}>
              {author.credentials.map((c, idx) => (
                <span key={idx} className={styles.credBadge}>
                  {c}
                </span>
              ))}
            </div>
          )}
        </div>
      </aside>
    );
  }

  return (
    <aside className={styles.container} aria-label="About the Publisher">
      <div className={styles.info}>
        <span className={styles.label}>Editorial Team</span>
        <h3 className={styles.name}>Phoenix Valley Plumber Editorial Desk</h3>
        <p className={styles.bio}>
          Written, curated, and fact-checked by our Phoenix-based residential plumbing editorial staff. All procedural recommendations, cost ranges, and water quality statistics are cross-referenced with municipal water reports and Arizona Registrar of Contractors standards.
        </p>
        <Link href="/editorial-policy/" className={styles.policyLink}>
          Read our complete Editorial Standards & Review Process →
        </Link>
      </div>
    </aside>
  );
}
