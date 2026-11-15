import { getSiteConfigResult } from "@/lib/config";
import { getSiteUrl } from "@/lib/routes";
import { getPublishedPosts } from "@/lib/blog-data";

export async function GET() {
  const { config: site } = getSiteConfigResult();
  const siteUrl = getSiteUrl(site);
  const posts = getPublishedPosts();

  const escapeXml = (unsafe: string) => {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  };

  const itemsXml = posts
    .map((post) => {
      const url =
        post.frontmatter.type === "cost-guide"
          ? `${siteUrl}/cost-guides/${post.frontmatter.slug}/`
          : `${siteUrl}/blog/${post.frontmatter.slug}/`;

      const pubDate = new Date(post.frontmatter.datePublished).toUTCString();

      return `    <item>
      <title>${escapeXml(post.frontmatter.seo.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(post.frontmatter.seo.metaDescription)}</description>
      <category>${escapeXml(post.frontmatter.category)}</category>
    </item>`;
    })
    .join("\n");

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2000/svg">
  <channel>
    <title>${escapeXml(site.brand)} Plumbing Advice &amp; Guides</title>
    <link>${siteUrl}/blog/</link>
    <description>Expert plumbing advice, troubleshooting, and verified cost guides for Phoenix, Arizona homeowners.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
${itemsXml}
  </channel>
</rss>`;

  return new Response(rssXml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
