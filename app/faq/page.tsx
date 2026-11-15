import type { Metadata } from "next";
import Link from "next/link";
import { getSiteConfigResult } from "@/lib/config";
import { getSiteUrl } from "@/lib/routes";
import { computeOpenStatus } from "@/lib/hours";
import { Breadcrumbs } from "@/components/service/Breadcrumbs";
import { CallButton } from "@/components/ui/CallButton";
import { PhoneLink } from "@/components/ui/PhoneLink";
import { FinalCta } from "@/components/sections/FinalCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbSchema, buildFaqSchema } from "@/lib/schema";
import { SirenIcon, ArrowRightIcon } from "@/components/icons/Icons";
import faqHubData from "@/data/faq-hub.json";
import styles from "./FAQHub.module.css";

interface FaqHubItem {
  id: string;
  category: string;
  categoryLabel: string;
  question: string;
  answer: string;
  fromPage: {
    title: string;
    href: string;
  };
}

const CATEGORIES = [
  { id: "emergencies", label: "Emergencies" },
  { id: "costs", label: "Costs & Pricing" },
  { id: "water-heaters", label: "Water Heaters" },
  { id: "drains-sewer", label: "Drains & Sewer" },
  { id: "leaks-pipes", label: "Leaks & Pipes" },
  { id: "fixtures-water", label: "Fixtures & Softeners" },
  { id: "licensing-service", label: "Licensing & Service" },
];

export async function generateMetadata(): Promise<Metadata> {
  const { config: site } = getSiteConfigResult();
  const siteUrl = getSiteUrl(site);
  const title = `Phoenix Plumbing FAQ & Answers | ${site.brand}`;
  const description =
    "Frequently asked questions about Phoenix plumbing repairs, water heater failures, slab leaks, drain clearing, pricing, permits, and Arizona ROC licensing.";

  return {
    title: {
      absolute: title,
    },
    description,
    alternates: {
      canonical: `${siteUrl}/faq/`,
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/faq/`,
      type: "website",
      siteName: site.brand,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function FaqPage() {
  const { config: site } = getSiteConfigResult();
  const siteUrl = getSiteUrl(site);
  const initialStatus = computeOpenStatus(site.hours);
  const items = faqHubData as FaqHubItem[];

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Plumbing FAQ", href: "/faq/" },
  ];

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: `${siteUrl}/` },
    { name: "Plumbing FAQ", url: `${siteUrl}/faq/` },
  ]);

  // Schema FAQs
  const faqSchema = buildFaqSchema(
    items.map((item) => ({
      id: item.id,
      question: item.question,
      answer: item.answer,
    }))
  );

  return (
    <div className={styles.page}>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />

      <section className={styles.hero}>
        <div className="container">
          <Breadcrumbs items={breadcrumbItems} />

          <div className={styles.heroInner}>
            <div className={styles.urgentNotice}>
              <SirenIcon size={16} />
              <span>Active Plumbing Emergency? Call Directly</span>
            </div>

            <h1 className={styles.h1}>Frequently Asked Plumbing Questions</h1>
            <p className={styles.lead}>
              Straightforward, local answers to homeowner questions about plumbing costs, hard
              water damage, slab leaks, sewer diagnostics, and Arizona licensing standards across
              the Phoenix metropolitan area.
            </p>

            <div className={styles.heroCallWrap}>
              <CallButton
                display={site.phone.display}
                e164={site.phone.e164}
                location="faq-hero"
                size="lg"
              />
              <PhoneLink
                display={site.phone.display}
                e164={site.phone.e164}
                location="faq-hero-inline"
              />
            </div>
          </div>
        </div>
      </section>

      <nav className={styles.categoryNav} aria-label="FAQ Topics">
        <div className={`container ${styles.categoryNavInner}`}>
          {CATEGORIES.map((cat) => (
            <a key={cat.id} href={`#${cat.id}`} className={styles.categoryPill}>
              {cat.label}
            </a>
          ))}
        </div>
      </nav>

      <div className="container">
        <div className={styles.contentWrapper}>
          {CATEGORIES.map((category, index) => {
            const categoryItems = items.filter((item) => item.category === category.id);
            if (categoryItems.length === 0) return null;
            const categoryLabel = categoryItems[0]?.categoryLabel ?? category.label;

            return (
              <section
                key={category.id}
                id={category.id}
                className={styles.categorySection}
                aria-labelledby={`heading-${category.id}`}
              >
                <div className={styles.categoryHeader}>
                  <h2 id={`heading-${category.id}`} className={styles.categoryTitle}>
                    {categoryLabel}
                  </h2>
                </div>

                <div className={styles.faqList}>
                  {categoryItems.map((item) => (
                    <article key={item.id} className={styles.faqItem}>
                      <h3 className={styles.faqQuestion}>{item.question}</h3>
                      <p className={styles.faqAnswer}>{item.answer}</p>
                      <Link href={item.fromPage.href} className={styles.sourceLink}>
                        <span>Explore full details: {item.fromPage.title}</span>
                        <ArrowRightIcon size={14} />
                      </Link>
                    </article>
                  ))}
                </div>

                {index === 2 ? (
                  <aside className={styles.midPageCta} aria-label="Quick phone consultation">
                    <div>
                      <h3 className={styles.midPageCtaTitle}>Have a question about your specific home?</h3>
                      <p className={styles.midPageCtaText}>
                        Speak directly with our local dispatch team for honest guidance and scheduling.
                      </p>
                    </div>
                    <CallButton
                      display={site.phone.display}
                      e164={site.phone.e164}
                      location="faq-midpage"
                      size="md"
                    />
                  </aside>
                ) : null}

                {index === 4 ? (
                  <aside className={styles.midPageCta} aria-label="Emergency pipe leak guidance">
                    <div>
                      <h3 className={styles.midPageCtaTitle}>Suspect a slab leak or sewer line backup?</h3>
                      <p className={styles.midPageCtaText}>
                        Don&apos;t wait for structural flooding. Call our priority response line right now.
                      </p>
                    </div>
                    <CallButton
                      display={site.phone.display}
                      e164={site.phone.e164}
                      location="faq-midpage-emergency"
                      size="md"
                    />
                  </aside>
                ) : null}
              </section>
            );
          })}
        </div>
      </div>

      <FinalCta site={site} initialStatus={initialStatus} />
    </div>
  );
}
