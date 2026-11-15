import type { PostParsed, Author } from "@/lib/post-schema";
import type { SiteConfig } from "@/lib/config";
import type { ServiceItem } from "@/lib/routes";
import { computeOpenStatus } from "@/lib/hours";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/service/Breadcrumbs";
import { CallCard } from "@/components/service/CallCard";
import { FinalCta } from "@/components/sections/FinalCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBlogPostSchema, buildBreadcrumbSchema } from "@/lib/schema";
import { PostHeader } from "./PostHeader";
import { QuickAnswer } from "./QuickAnswer";
import { KeyTakeaways } from "./KeyTakeaways";
import { Figure } from "./Figure";
import { Toc } from "./Toc";
import { TocActive } from "./TocActive";
import { ReadingProgress } from "./ReadingProgress";
import { SourcesList } from "./SourcesList";
import { AuthorBox } from "./AuthorBox";
import { ReviewerBox } from "./ReviewerBox";
import { HowWeWrite } from "./HowWeWrite";
import { UpdateLog } from "./UpdateLog";
import { RelatedServicesStrip } from "./RelatedServicesStrip";
import { RelatedPosts } from "./RelatedPosts";
import { createMdxComponents } from "./MdxComponents";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import styles from "./PostTemplate.module.css";
import Link from "next/link";

interface PostTemplateProps {
  post: PostParsed;
  authors: Author[];
  site: SiteConfig;
  siteUrl: string;
  relatedServices: ServiceItem[];
  relatedPosts: PostParsed[];
  variant?: "blog" | "cost-guide";
}

export function PostTemplate({
  post,
  authors,
  site,
  siteUrl,
  relatedServices,
  relatedPosts,
  variant = "blog",
}: PostTemplateProps) {
  const { frontmatter, content, readingTimeMinutes, wordCount, toc } = post;
  const isCostGuide = variant === "cost-guide" || frontmatter.type === "cost-guide";
  const initialStatus = computeOpenStatus(site.hours);

  const canonicalPath = isCostGuide
    ? `/cost-guides/${frontmatter.slug}/`
    : `/blog/${frontmatter.slug}/`;
  const canonicalUrl = `${siteUrl}${canonicalPath}`;

  const primaryAuthor = authors.find((a) => frontmatter.authors.includes(a.slug));

  // Breadcrumbs
  const breadcrumbItems: BreadcrumbItem[] = isCostGuide
    ? [
        { label: "Home", href: "/" },
        { label: "Cost Guides", href: "/cost-guides/" },
        { label: frontmatter.seo.h1 },
      ]
    : [
        { label: "Home", href: "/" },
        { label: "Blog", href: "/blog/" },
        {
          label: frontmatter.category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
          href: `/blog/category/${frontmatter.category}/`,
        },
        { label: frontmatter.seo.h1 },
      ];

  const breadcrumbSchemaItems = isCostGuide
    ? [
        { name: "Home", url: `${siteUrl}/` },
        { name: "Cost Guides", url: `${siteUrl}/cost-guides/` },
        { name: frontmatter.seo.h1, url: canonicalUrl },
      ]
    : [
        { name: "Home", url: `${siteUrl}/` },
        { name: "Blog", url: `${siteUrl}/blog/` },
        {
          name: frontmatter.category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
          url: `${siteUrl}/blog/category/${frontmatter.category}/`,
        },
        { name: frontmatter.seo.h1, url: canonicalUrl },
      ];

  // Schema
  const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbSchemaItems);
  const { blogPostingSchema, faqSchema } = buildBlogPostSchema({
    site,
    siteUrl,
    post: frontmatter,
    wordCount,
    author: primaryAuthor,
    canonicalUrl,
    relatedServiceNames: relatedServices.map((s) => s.name),
  });

  const mdxComponents = createMdxComponents(site);

  // TOC items formatted for CallCard
  const callCardTocItems = toc.map((t) => ({
    id: t.id,
    label: t.title,
    level: t.level,
  }));

  return (
    <>
      <ReadingProgress />
      <TocActive />
      <JsonLd data={blogPostingSchema} />
      <JsonLd data={breadcrumbSchema} />
      {faqSchema && <JsonLd data={faqSchema} />}

      <div className={styles.pageWrapper}>
        <div className="container">
          {/* Breadcrumbs */}
          <div className={styles.breadcrumbsWrapper}>
            <Breadcrumbs items={breadcrumbItems} />
          </div>

          <div className={styles.layoutGrid}>
            {/* Main Article Column */}
            <article className={styles.articleCol}>
              <PostHeader
                post={frontmatter}
                authors={authors}
                readingTimeMinutes={readingTimeMinutes}
              />

              {/* Quick Answer */}
              <QuickAnswer
                answer={frontmatter.quickAnswer}
                relatedServiceSlug={relatedServices[0]?.slug}
                relatedServiceLabel={relatedServices[0]?.shortName}
                site={site}
              />

              {/* Key Takeaways */}
              <KeyTakeaways takeaways={frontmatter.takeaways} />

              {/* Hero Image (LCP) */}
              <div className={styles.heroWrap}>
                <Figure
                  src={frontmatter.hero.src}
                  alt={frontmatter.hero.alt}
                  caption={frontmatter.hero.caption}
                  width={frontmatter.hero.width}
                  height={frontmatter.hero.height}
                  kind={frontmatter.hero.kind}
                  credit={frontmatter.hero.credit}
                  priority={true}
                />
              </div>

              {/* Mobile TOC */}
              <div className={styles.mobileToc}>
                <Toc items={toc} variant="inline" />
              </div>

              {/* Article MDX Body */}
              <div className={styles.bodyContent}>
                <MDXRemote
                  source={content}
                  components={mdxComponents}
                  options={{
                    mdxOptions: {
                      remarkPlugins: [remarkGfm],
                      rehypePlugins: [
                        rehypeSlug,
                        [
                          rehypeAutolinkHeadings,
                          {
                            behavior: "wrap",
                            properties: {
                              className: [styles.headingAnchor],
                            },
                          },
                        ],
                      ],
                    },
                  }}
                />
              </div>

              {/* FAQ Section */}
              {frontmatter.faqs && frontmatter.faqs.length > 0 && (
                <section className={styles.faqSection} aria-label="Frequently Asked Questions">
                  <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
                  <div className={styles.faqList}>
                    {frontmatter.faqs.map((faq, idx) => (
                      <details key={idx} className={styles.faqItem}>
                        <summary className={styles.faqQuestion}>
                          <span>{faq.q}</span>
                          <span className={styles.faqChevron} aria-hidden="true">▾</span>
                        </summary>
                        <div className={styles.faqAnswer}>
                          <p>{faq.a}</p>
                        </div>
                      </details>
                    ))}
                  </div>
                </section>
              )}

              {/* Sources & Primary Documentation */}
              <SourcesList sources={frontmatter.sources} />

              {/* Author & Reviewer Attribution */}
              <AuthorBox author={primaryAuthor} />
              {frontmatter.reviewer && <ReviewerBox reviewer={frontmatter.reviewer} />}
              <HowWeWrite production={frontmatter.production} />

              {/* Changelog & Update History */}
              <UpdateLog
                dateModified={frontmatter.dateModified}
                changelog={frontmatter.changelog}
              />

              {/* Related Services */}
              <RelatedServicesStrip
                services={relatedServices}
                postSlug={frontmatter.slug}
              />

              {/* Related Posts */}
              <RelatedPosts posts={relatedPosts} />
            </article>

            {/* Desktop Sticky Aside */}
            <aside className={styles.asideCol}>
              <div className={styles.stickyAside}>
                <CallCard site={site} initialStatus={initialStatus} tocItems={callCardTocItems} />
                <Toc items={toc} variant="aside" />

                {relatedServices && relatedServices.length > 0 && (
                  <div className={styles.asideServiceCard}>
                    <h3 className={styles.asideServiceTitle}>Valley Services</h3>
                    <ul className={styles.asideServiceList}>
                      {relatedServices.map((svc) => (
                        <li key={svc.slug}>
                          <Link href={`/${svc.slug}/`} className={styles.asideServiceLink}>
                            {svc.name} →
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Final CTA Band */}
      <FinalCta site={site} initialStatus={initialStatus} />
    </>
  );
}
