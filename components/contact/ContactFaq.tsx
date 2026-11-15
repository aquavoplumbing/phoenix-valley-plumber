import type { SiteConfig } from "@/lib/config";
import styles from "./ContactFaq.module.css";

interface ContactFaqProps {
  site: SiteConfig;
}

export function ContactFaq({ site }: ContactFaqProps) {
  const roc = site.licensee.rocNumber;
  const phone = site.phone.display;

  const faqs = [
    {
      id: "need-to-fill-form",
      q: "Do I need to fill out the form before calling?",
      a: `No, you do not need to fill out this form. Calling ${phone} is always the fastest way to reach our local dispatchers and get a licensed plumber scheduled. The form is provided strictly as a convenient alternative if you are at work, hearing impaired, reaching out after hours, or dealing with a non-urgent future project.`,
    },
    {
      id: "areas-served",
      q: "What areas of the Phoenix Valley do you serve?",
      a: `We provide complete residential and commercial plumbing services across the entire Phoenix metropolitan area, including Phoenix, Scottsdale, Mesa, Chandler, Gilbert, Glendale, Peoria, Tempe, Surprise, Goodyear, Avondale, Queen Creek, and Buckeye. All technicians arrive directly in fully equipped service vehicles.`,
    },
    {
      id: "verify-license",
      q: `How do I verify your Arizona ROC contractor license?`,
      a: `You can verify our active contractor standing at any time on the Arizona Registrar of Contractors portal (roc.az.gov). Search by ROC #${roc} or by our legal business entity name, "${site.licensee.legalName}". Never hire any plumbing contractor in Arizona who cannot provide an active, verifiable ROC number.`,
    },
    {
      id: "what-to-have-ready",
      q: "What should I have ready when I call?",
      a: `To help our dispatch team diagnose your issue and send the appropriate technician, having a few key details ready makes the process smooth and quick:`,
      checklist: [
        "Your home address, nearest cross streets, and gate code if applicable.",
        "A brief description of what is happening (e.g., pooling water under water heater, slow main drain, rattling pipes).",
        "Whether you know where your main water shut-off valve is located.",
        "Photos or a short video of the fixture or leak if you are able to text or email them.",
      ],
    },
  ];

  return (
    <section className={styles.section} aria-labelledby="contact-faq-heading">
      <div className="container">
        <div className={styles.header}>
          <span className={styles.badge}>Helpful Information</span>
          <h2 id="contact-faq-heading" className={styles.title}>
            Frequently Asked Contact Questions
          </h2>
          <p className={styles.subtitle}>
            Clear answers on how we handle dispatch, licensing verification, and appointment scheduling:
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
                {faq.checklist ? (
                  <div className={styles.checklistCard}>
                    <strong className={styles.checklistTitle}>Quick Checklist for Callers:</strong>
                    <ul className={styles.checkUl}>
                      {faq.checklist.map((item, idx) => (
                        <li key={idx} className={styles.checkLi}>
                          <span className={styles.checkIcon} aria-hidden="true">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
