import type { Metadata } from "next";
import { getSiteConfigResult } from "@/lib/config";
import { getSiteUrl } from "@/lib/routes";
import { computeOpenStatus } from "@/lib/hours";
import { getEditorialPolicy } from "@/lib/blog-data";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/service/Breadcrumbs";
import { FinalCta } from "@/components/sections/FinalCta";
import { PhoneLink } from "@/components/ui/PhoneLink";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbSchema } from "@/lib/schema";
import styles from "./EditorialPolicy.module.css";

export const dynamic = "force-static";

export function generateMetadata(): Metadata {
  const { config: site } = getSiteConfigResult();
  const siteUrl = getSiteUrl(site);

  return {
    title: {
      absolute: `Editorial Policy & Standards | ${site.brand}`,
    },
    description:
      "Editorial guidelines, technical accuracy standards, AI disclosures, and licensed reviewer oversight for Phoenix Valley Plumber content.",
    alternates: {
      canonical: `${siteUrl}/editorial-policy/`,
    },
    openGraph: {
      title: `Editorial Policy & Sourcing Standards | ${site.brand}`,
      description:
        "Our rigorous standards for technical accuracy, primary sourcing, plumber reviews, and editorial transparency.",
      url: `${siteUrl}/editorial-policy/`,
      siteName: site.brand,
    },
  };
}

export default async function EditorialPolicyPage() {
  const { config: site } = getSiteConfigResult();
  const siteUrl = getSiteUrl(site);
  const policy = getEditorialPolicy();
  const initialStatus = computeOpenStatus(site.hours);

  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: "Editorial Policy" },
  ];

  const breadcrumbSchemaItems = [
    { name: "Home", url: `${siteUrl}/` },
    { name: "Editorial Policy", url: `${siteUrl}/editorial-policy/` },
  ];

  const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbSchemaItems);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />

      <main className={styles.main}>
        <div className="container">
          <div className={styles.breadcrumbsWrap}>
            <Breadcrumbs items={breadcrumbs} />
          </div>

          <article className={styles.article}>
            <header className={styles.header}>
              <span className={styles.eyebrow}>Trust &amp; Transparency</span>
              <h1 className={styles.title}>Editorial Standards &amp; Review Policy</h1>
              <p className={styles.lead}>{policy.mission}</p>
            </header>

            <div className={styles.sectionList}>
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>{policy.topicSelection.title}</h2>
                <p className={styles.sectionText}>{policy.topicSelection.description}</p>
              </section>

              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>{policy.factCheckingAndSources.title}</h2>
                <p className={styles.sectionText}>{policy.factCheckingAndSources.description}</p>
              </section>

              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>{policy.plumberReview.title}</h2>
                <p className={styles.sectionText}>{policy.plumberReview.description}</p>
              </section>

              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>{policy.aiDisclosure.title}</h2>
                <p className={styles.sectionText}>{policy.aiDisclosure.description}</p>
              </section>

              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>{policy.correctionsAndUpdates.title}</h2>
                <p className={styles.sectionText}>{policy.correctionsAndUpdates.description}</p>
              </section>

              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>{policy.reportingErrors.title}</h2>
                <p className={styles.sectionText}>{policy.reportingErrors.description}</p>
                <div className={styles.contactBlock}>
                  <span>Report a technical correction by calling:</span>
                  <PhoneLink
                    display={site.phone.display}
                    e164={site.phone.e164}
                    location="editorial-policy"
                    className={styles.phoneLink}
                  />
                </div>
              </section>
            </div>
          </article>
        </div>
      </main>

      <FinalCta site={site} initialStatus={initialStatus} />
    </>
  );
}
