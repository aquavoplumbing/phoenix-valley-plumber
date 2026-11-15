import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSiteConfigResult } from "@/lib/config";
import { getSiteUrl } from "@/lib/routes";
import { computeOpenStatus } from "@/lib/hours";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/service/Breadcrumbs";
import { CallButton } from "@/components/ui/CallButton";
import { PhoneLink } from "@/components/ui/PhoneLink";
import { FinalCta } from "@/components/sections/FinalCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbSchema, buildFaqSchema } from "@/lib/schema";
import { ExternalLinkIcon } from "@/components/icons/Icons";
import styles from "./Financing.module.css";

export const dynamic = "force-static";

export function generateMetadata(): Metadata {
  const { config: site } = getSiteConfigResult();
  const siteUrl = getSiteUrl(site);
  const isEnabled =
    site.claims.financing &&
    site.financing &&
    site.financing.lenderName &&
    site.financing.applyUrl;

  if (!isEnabled) {
    return {
      title: "Financing Options | Phoenix Valley Plumber",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: {
      absolute: `Plumbing Financing Options | ${site.brand}`,
    },
    description: `Explore consumer financing options provided through ${site.financing?.lenderName} for major plumbing repairs and water heater installations in Phoenix.`,
    alternates: {
      canonical: `${siteUrl}/financing/`,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: `Plumbing Financing Options | ${site.brand}`,
      description: `Explore consumer financing options provided through ${site.financing?.lenderName} for major plumbing repairs in Phoenix.`,
      url: `${siteUrl}/financing/`,
      type: "website",
      siteName: site.brand,
    },
  };
}

export default async function FinancingPage() {
  const { config: site } = getSiteConfigResult();
  const siteUrl = getSiteUrl(site);
  const initialStatus = computeOpenStatus(site.hours);

  // Strict Gating: Renders only when claims.financing === true and financing config is complete
  const isEnabled =
    site.claims.financing &&
    site.financing &&
    site.financing.lenderName &&
    site.financing.applyUrl;

  if (!isEnabled) {
    notFound();
  }

  const financing = site.financing!;
  const lenderName = financing.lenderName || "Third-Party Lending Partner";
  const termsSummary = financing.termsSummary || "Terms vary based on creditworthiness and program availability.";
  const eligibilityNote = financing.eligibilityNote || "Available for qualified residential plumbing projects upon credit approval.";
  const disclosureText = financing.disclosureText || "Financing is provided directly through third-party lenders, not the plumbing contractor. All programs subject to credit approval.";

  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: "Financing Options" },
  ];

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: `${siteUrl}/` },
    { name: "Financing Options", url: `${siteUrl}/financing/` },
  ]);

  const faqs = [
    {
      id: "financing-qualifying-jobs",
      question: "What plumbing jobs qualify for financing?",
      answer:
        "Major residential installations and emergency repairs—including whole-home repiping, tankless or tank water heater replacements, trenchless sewer restorations, and commercial-grade water softener installations—typically meet lender project minimums.",
    },
    {
      id: "financing-credit-impact",
      question: "Does applying for financing affect my credit score?",
      answer:
        "Initial pre-qualification checks with our lending partner typically utilize a soft credit inquiry that does not impact your credit score. Formal loan submission and final underwriting will involve a standard hard credit inquiry as disclosed by the lender.",
    },
    {
      id: "financing-provider-identity",
      question: "Who provides the plumbing financing?",
      answer: `Financing is extended directly by ${lenderName}, an independent licensed financial institution. Phoenix Valley Plumber and its partner plumbing contractors do not make credit decisions, issue loans, or set APR interest rates.`,
    },
    {
      id: "financing-how-to-ask",
      question: "How do I ask about financing during my appointment?",
      answer:
        "When our technician provides your written diagnostic estimate, simply ask to review financing options. They will provide the secure application link directly from the lender so you can apply confidentially on your own device.",
    },
  ];

  const faqSchema = buildFaqSchema(faqs);

  const webpageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Plumbing Financing Options | ${site.brand}`,
    description: `Review consumer financing options available through ${lenderName} for major plumbing repairs.`,
    url: `${siteUrl}/financing/`,
  };

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />
      <JsonLd data={webpageSchema} />

      <main className={styles.page}>
        <div className="container">
          <div className={styles.breadcrumbsWrap}>
            <Breadcrumbs items={breadcrumbs} />
          </div>

          <header className={styles.header}>
            <span className={styles.eyebrow}>Flexible Payment Solutions</span>
            <h1 className={styles.title}>Plumbing Financing Options</h1>
            <p className={styles.lead}>
              Major plumbing emergencies—such as failed water heaters, mainline sewer breaks, or
              under-slab foundation leaks—often happen unexpectedly. Through our lending partner,{" "}
              <strong>{lenderName}</strong>, qualified homeowners can explore monthly payment
              plans to complete critical repairs without delaying necessary work.
            </p>

            <div className={styles.heroActions}>
              <CallButton
                display={site.phone.display}
                e164={site.phone.e164}
                location="financing-hero"
                size="lg"
              />
              <PhoneLink
                display={site.phone.display}
                e164={site.phone.e164}
                location="financing-hero-inline"
              />
            </div>
          </header>

          {/* How It Works (3 Steps) */}
          <section className={styles.stepsSection} aria-labelledby="heading-how-it-works">
            <h2 id="heading-how-it-works" className={styles.sectionHeading}>
              How Plumbing Financing Works
            </h2>
            <p className={styles.sectionLead}>
              We keep the financing process completely transparent and separate from physical plumbing work:
            </p>

            <div className={styles.stepsGrid}>
              <div className={styles.stepCard}>
                <span className={styles.stepNumber}>1</span>
                <h3 className={styles.stepTitle}>Get a Written Estimate</h3>
                <p className={styles.stepText}>
                  A licensed technician performs an on-site diagnostic inspection and gives you an itemized,
                  transparent estimate of the required plumbing work.
                </p>
              </div>

              <div className={styles.stepCard}>
                <span className={styles.stepNumber}>2</span>
                <h3 className={styles.stepTitle}>Apply Directly with Lender</h3>
                <p className={styles.stepText}>
                  If you choose to finance, submit an application directly through {lenderName}&apos;s secure
                  portal. Your financial data remains private between you and the lender.
                </p>
              </div>

              <div className={styles.stepCard}>
                <span className={styles.stepNumber}>3</span>
                <h3 className={styles.stepTitle}>Lender Makes the Decision</h3>
                <p className={styles.stepText}>
                  {lenderName} evaluates your application and presents available loan terms. If approved,
                  work can proceed immediately according to your schedule.
                </p>
              </div>
            </div>
          </section>

          {/* Verbatim Lender Terms & Disclosures */}
          <section className={styles.disclosureBlock} aria-labelledby="heading-disclosures">
            <h2 id="heading-disclosures" className={styles.disclosureTitle}>
              Lender Terms &amp; Regulatory Disclosures
            </h2>
            <p className={styles.disclosureText}>
              <strong>Program Summary:</strong> {termsSummary}
            </p>
            <p className={styles.disclosureText}>
              <strong>Eligibility:</strong> {eligibilityNote}
            </p>
            <p className={styles.disclosureText}>
              <strong>Mandatory Disclosure:</strong> {disclosureText} Subject to credit approval. Financing is
              provided directly by {lenderName}, an independent lending entity, and not by {site.brand} or its
              partner plumbing contractors.
            </p>

            <div className={styles.applyButtonWrap}>
              <a
                href={financing.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.btnApply}
              >
                <span>Apply on {lenderName}&apos;s Secure Portal</span>
                <ExternalLinkIcon size={16} />
              </a>
            </div>
          </section>

          {/* Short FAQ */}
          <section className={styles.faqSection} aria-labelledby="heading-financing-faq">
            <h2 id="heading-financing-faq" className={styles.sectionHeading}>
              Frequently Asked Questions About Financing
            </h2>

            <div className={styles.faqGrid}>
              {faqs.map((faq) => (
                <article key={faq.id} className={styles.faqCard}>
                  <h3 className={styles.faqQuestion}>{faq.question}</h3>
                  <p className={styles.faqAnswer}>{faq.answer}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>

      <FinalCta
        site={site}
        initialStatus={initialStatus}
        heading="Have Questions About Financing Plumbing Repairs?"
        btnLocation="financing-final"
      />
    </>
  );
}
