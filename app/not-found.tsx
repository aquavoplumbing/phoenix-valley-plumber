import Link from "next/link";
import { getSiteConfigResult } from "@/lib/config";
import { CallButton } from "@/components/ui/CallButton";
import styles from "@/components/sections/StubPage.module.css";

export default function NotFound() {
  const { config: site } = getSiteConfigResult();

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.card}>
          <p className={styles.eyebrow}>404 · Page Not Found</p>
          <h1 className={styles.title}>We Could Not Find That Page</h1>
          <p className={styles.desc}>
            Need plumbing help in Phoenix or anywhere in the Valley? Call us right now and speak
            with our team directly.
          </p>

          <div className={styles.actions}>
            <CallButton
              display={site.phone.display}
              e164={site.phone.e164}
              location="not-found"
              size="lg"
            />
            <Link href="/" className="btn-ghost">
              Go to homepage
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

