import type { CityContent } from "@/lib/city-schema";
import type { SiteConfig } from "@/lib/config";
import { ChevronDownIcon } from "@/components/icons/Icons";
import { PhoneLink } from "@/components/ui/PhoneLink";
import styles from "./CityFaq.module.css";

interface CityFaqProps {
  faqs: CityContent["faqs"];
  cityName: string;
  citySlug: string;
  site: SiteConfig;
}

export function CityFaq({ faqs, cityName, citySlug, site }: CityFaqProps) {
  return (
    <div className={styles.faqWrapper}>
      <div className={styles.header}>
        <span className={styles.badge}>Local Homeowner FAQs</span>
        <h2 id="faqs-heading" className={styles.title}>
          Frequently Asked Questions in {cityName}, AZ
        </h2>
        <p className={styles.subtitle}>
          Clear answers about dispatch times, water hardness, building permits, and plumbing repairs in {cityName}:
        </p>
      </div>

      <div className={styles.list}>
        {faqs.map((faq, idx) => {
          const faqId = `faq-${citySlug}-${idx + 1}`;
          return (
            <details
              key={faq.q}
              className={styles.item}
              data-faq-id={faqId}
              data-city-slug={citySlug}
            >
              <summary className={styles.summary}>
                <span className={styles.question}>{faq.q}</span>
                <ChevronDownIcon size={18} className={styles.chevron} />
              </summary>
              <div className={styles.answer}>
                <p>{faq.a}</p>
              </div>
            </details>
          );
        })}
      </div>

      <div className={styles.footerNote}>
        <p style={{ margin: 0 }}>
          Still have a plumbing question in {cityName}?{" "}
          <PhoneLink
            display={site.phone.display}
            e164={site.phone.e164}
            location="city-faq"
            className={styles.phoneLink}
          >
            <span>Call {site.phone.display}</span>
          </PhoneLink>{" "}
          to speak with our local dispatch team.
        </p>
      </div>
    </div>
  );
}
