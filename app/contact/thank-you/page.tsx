import type { Metadata } from "next";
import Link from "next/link";
import { getSiteConfigResult } from "@/lib/config";
import { formatHoursSummary } from "@/lib/hours";
import { CallButton } from "@/components/ui/CallButton";
import { Breadcrumbs } from "@/components/service/Breadcrumbs";
import { CheckIcon } from "@/components/icons/Icons";
import styles from "./ThankYou.module.css";

export const metadata: Metadata = {
  title: "Thank You | Phoenix Valley Plumber",
  description: "Your message has been received. Our team will review it during posted service hours.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ThankYouPage() {
  const { config: site } = getSiteConfigResult();
  const hoursSummary = formatHoursSummary(site.hours);

  return (
    <div className={styles.wrapper}>
      <div className="container">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Contact", href: "/contact/" },
            { label: "Thank You" },
          ]}
        />

        <div className={styles.card}>
          <div className={styles.checkCircle} aria-hidden="true">
            <CheckIcon size={32} />
          </div>

          <h1 className={styles.title}>Message Received</h1>

          <p className={styles.lead}>
            Thank you for reaching out to {site.brand}. Our local dispatch team reviews incoming inquiries during regular business hours and will follow up using the contact details you provided.
          </p>

          <div className={styles.callBox}>
            <p className={styles.callBoxTitle}>Need Immediate Plumbing Help?</p>
            <p className={styles.callBoxSub}>
              For urgent plumbing repairs, active leaks, or immediate scheduling, calling is always faster than waiting for a message reply.
            </p>
            <div className={styles.btnWrap}>
              <CallButton
                display={site.phone.display}
                e164={site.phone.e164}
                location="thank-you-call"
                size="lg"
              />
            </div>
            <span className={styles.hoursNote}>
              Direct local dispatch · {hoursSummary || "Valley Service Hours"}
            </span>
          </div>

          <div className={styles.linksRow}>
            <Link href="/" className="btn-ghost">
              ← Return to Homepage
            </Link>
            <Link href="/locations/" className={styles.quietLink}>
              View Service Areas →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
