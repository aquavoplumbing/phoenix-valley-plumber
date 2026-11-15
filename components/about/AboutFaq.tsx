import type { SiteConfig } from "@/lib/config";
import styles from "./AboutFaq.module.css";

interface FaqItem {
  id: string;
  q: string;
  a: string;
}

export function getAboutFaqs(site: SiteConfig): FaqItem[] {
  const roc = site.licensee.rocNumber;
  const legalName = site.licensee.legalName;
  const isPartner = site.operatingModel === "partner";

  const whoArrivesAnswer = isPartner
    ? `A licensed, background-checked plumbing technician employed by our partner contractor, ${legalName} (ROC #${roc}), will arrive at your home in a marked service vehicle. The technician will be equipped with standard replacement parts, diagnostic equipment, and will confirm the scope of work before performing repairs.`
    : `A licensed, background-checked plumbing technician employed directly by ${legalName} (ROC #${roc}) will arrive at your property in a fully equipped service vehicle, verify your plumbing symptoms, and explain repair options before work begins.`;

  return [
    {
      id: "is-licensed",
      q: "Is this plumbing service licensed in Arizona?",
      a: `Yes. All plumbing services arranged through this website are performed by a licensed Arizona contractor holding an active Registrar of Contractors license under ROC #${roc} (Class CR-37, Commercial and Residential Plumbing). In Arizona, any plumbing project where total labor and materials exceed $1,000 legally requires a licensed contractor.`,
    },
    {
      id: "how-to-verify",
      q: "How do I independently verify your ROC license?",
      a: `You can verify the license status at any time by visiting the official Arizona Registrar of Contractors portal at roc.az.gov. Search for license number ${roc} or by the legal entity name, ${legalName}. The state database confirms our active standing, bond status, and that no disciplinary suspensions exist.`,
    },
    {
      id: "who-comes-to-home",
      q: "Who will actually arrive at my home for the service appointment?",
      a: whoArrivesAnswer,
    },
    {
      id: "areas-served",
      q: "What cities and areas across the Phoenix Valley do you cover?",
      a: `We service homeowners and commercial properties across the entire Phoenix metropolitan area. Regular service areas include Phoenix, Scottsdale, Mesa, Chandler, Gilbert, Glendale, Peoria, Tempe, Surprise, Goodyear, Avondale, Queen Creek, and Buckeye. Mobile service vehicles dispatch directly to your home.`,
    },
    {
      id: "how-to-give-feedback",
      q: "How do I give feedback or report a concern about a service call?",
      a: `We welcome direct feedback on all service visits. You can speak directly with our dispatch staff by calling ${site.phone.display} during regular business hours, or send written details through our online contact page. If you have questions regarding scope, pricing, or service quality, our management team investigates promptly.`,
    },
  ];
}

export function AboutFaq({ site }: { site: SiteConfig }) {
  const faqs = getAboutFaqs(site);

  return (
    <section className={styles.section} aria-labelledby="about-faq-heading">
      <div className="container">
        <div className={styles.header}>
          <span className={styles.badge}>Clear Answers</span>
          <h2 id="about-faq-heading" className={styles.title}>
            Frequently Asked Questions About Our Service
          </h2>
          <p className={styles.subtitle}>
            Factual disclosures regarding state licensing, technician dispatch, and service guarantees:
          </p>
        </div>

        <div className={styles.faqList}>
          {faqs.map((faq) => (
            <details key={faq.id} className={styles.item} data-faq-id={faq.id}>
              <summary className={styles.question}>
                <span>{faq.q}</span>
                <span className={styles.chevron} aria-hidden="true">▾</span>
              </summary>
              <div className={styles.answer}>
                <p>{faq.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
