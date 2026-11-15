import Link from "next/link";
import Image from "next/image";
import type { CityContent } from "@/lib/city-schema";
import styles from "./RecentJobs.module.css";

interface RecentJobsProps {
  jobs?: CityContent["jobs"];
}

export function RecentJobs({ jobs }: RecentJobsProps) {
  if (!jobs || jobs.length === 0) {
    return null;
  }

  return (
    <section className={styles.wrapper} aria-labelledby="recent-jobs-heading">
      <h2 id="recent-jobs-heading" className="section-title">
        Recent Plumbing Work
      </h2>
      <div className={styles.grid}>
        {jobs.map((job) => (
          <article key={`${job.neighborhood}-${job.month}`} className={styles.jobCard}>
            {job.photo ? (
              <div style={{ position: "relative", width: "100%", height: "200px", marginBottom: "12px", borderRadius: "8px", overflow: "hidden" }}>
                <Image
                  src={job.photo.src}
                  alt={job.photo.alt}
                  width={job.photo.width}
                  height={job.photo.height}
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                  loading="lazy"
                />
              </div>
            ) : null}

            <div className={styles.jobMeta}>
              <span>{job.neighborhood}</span>
              <span>{job.month}</span>
            </div>

            <h3 className={styles.jobTitle}>{job.title}</h3>

            <p className={styles.jobSummary}>{job.summary}</p>

            <div style={{ marginTop: "12px" }}>
              <Link
                href={`/${job.serviceSlug}/`}
                style={{ fontSize: "0.8125rem", color: "var(--water-700)", fontWeight: 700, textDecoration: "underline" }}
              >
                View service details →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
