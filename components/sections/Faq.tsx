import type { SiteConfig } from "@/lib/config";
import type { FaqItem } from "@/lib/routes";
import { ChevronDownIcon, PhoneIcon } from "@/components/icons/Icons";
import { PhoneLink } from "@/components/ui/PhoneLink";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./Faq.module.css";

export function Faq({
  site,
  faqs,
}: {
  site: SiteConfig;
  faqs: FaqItem[];
}) {
  return (
    <section className={styles.section} aria-labelledby="faq-heading">
      <div className="container">
        <SectionHeading
          id="faq-heading"
          eyebrow="Common Questions"
          title="Phoenix Plumbing FAQ"
          subtitle="Clear answers about scheduling, licensing, hard water, permits, and urgent repairs."
        />

        <div className={styles.list}>
          {faqs.map((faq) => (
            <details key={faq.id} className={styles.item} data-faq-id={faq.id}>
              <summary className={styles.summary}>
                <span className={styles.question}>{faq.question}</span>
                <ChevronDownIcon size={20} className={styles.chevron} />
              </summary>
              <div className={styles.answer}>
                <p>{faq.answer}</p>
              </div>
            </details>
          ))}
        </div>

        <div className={styles.ctaRow}>
          <p className={styles.stillText}>
            Still have a question?{" "}
            <PhoneLink
              display={site.phone.display}
              e164={site.phone.e164}
              location="faq"
              className={styles.faqPhoneLink}
            >
              <PhoneIcon size={16} />
              <span>
                Call <span data-phone-display="">{site.phone.display}</span>
              </span>
            </PhoneLink>
          </p>
        </div>
      </div>
    </section>
  );
}

