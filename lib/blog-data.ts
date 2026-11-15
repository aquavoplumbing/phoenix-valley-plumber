import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import {
  authorSchema,
  postSchema,
  type Author,
  type PostCategory,
  type PostParsed,
  type PostTocItem,
} from "./post-schema";
import editorialData from "@/data/editorial.json";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const COST_GUIDES_DIR = path.join(process.cwd(), "content", "cost-guides");
const AUTHORS_FILE = path.join(process.cwd(), "data", "authors.json");

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function extractTocAndWordCount(markdown: string): {
  toc: PostTocItem[];
  wordCount: number;
} {
  const lines = markdown.split(/\r?\n/);
  const toc: PostTocItem[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("## ")) {
      const title = trimmed.replace(/^##\s+/, "").replace(/#.*$/, "").trim();
      toc.push({
        id: slugify(title),
        title,
        level: 2,
      });
    } else if (trimmed.startsWith("### ")) {
      const title = trimmed.replace(/^###\s+/, "").replace(/#.*$/, "").trim();
      toc.push({
        id: slugify(title),
        title,
        level: 3,
      });
    }
  }

  // Count words excluding MDX tags and code blocks
  const cleanedText = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#*`_~[\]()]/g, " ")
    .trim();

  const words = cleanedText ? cleanedText.split(/\s+/).filter(Boolean).length : 0;

  return { toc, wordCount: words };
}

function parsePostFile(filePath: string): PostParsed | null {
  try {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);
    const parsedFrontmatter = postSchema.safeParse(data);

    if (!parsedFrontmatter.success) {
      console.warn(`[blog-data] Validation failed for ${filePath}:`, parsedFrontmatter.error.issues);
      return null;
    }

    const { toc, wordCount } = extractTocAndWordCount(content);
    const readingTimeMinutes = Math.max(1, Math.round(wordCount / 220));

    return {
      frontmatter: parsedFrontmatter.data,
      content,
      readingTimeMinutes,
      wordCount,
      toc,
    };
  } catch (err) {
    console.error(`[blog-data] Failed to parse post file: ${filePath}`, err);
    return null;
  }
}

let cachedPosts: PostParsed[] | null = null;

export function getAllPosts(includeDrafts = false): PostParsed[] {
  if (process.env.NODE_ENV === "production" && cachedPosts && !includeDrafts) {
    return cachedPosts.filter((p) => p.frontmatter.status === "published");
  }

  const posts: PostParsed[] = [];

  if (fs.existsSync(BLOG_DIR)) {
    const blogFiles = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));
    for (const file of blogFiles) {
      const parsed = parsePostFile(path.join(BLOG_DIR, file));
      if (parsed) posts.push(parsed);
    }
  }

  if (fs.existsSync(COST_GUIDES_DIR)) {
    const costGuideFiles = fs.readdirSync(COST_GUIDES_DIR).filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));
    for (const file of costGuideFiles) {
      const parsed = parsePostFile(path.join(COST_GUIDES_DIR, file));
      if (parsed) posts.push(parsed);
    }
  }

  // Sort by datePublished descending
  posts.sort((a, b) => {
    return new Date(b.frontmatter.datePublished).getTime() - new Date(a.frontmatter.datePublished).getTime();
  });

  if (process.env.NODE_ENV === "production") {
    cachedPosts = posts;
  }

  if (includeDrafts) {
    return posts;
  }

  return posts.filter((p) => p.frontmatter.status === "published");
}

export function getPublishedPosts(): PostParsed[] {
  return getAllPosts(false);
}

export function getPostBySlug(slug: string, includeDrafts = false): PostParsed | undefined {
  const posts = getAllPosts(includeDrafts);
  return posts.find((p) => p.frontmatter.slug === slug);
}

export function getPostsByCategory(category: PostCategory, includeDrafts = false): PostParsed[] {
  const posts = getAllPosts(includeDrafts);
  return posts.filter((p) => p.frontmatter.category === category);
}

export function getPublishedCostGuides(): PostParsed[] {
  return getPublishedPosts().filter(
    (p) => p.frontmatter.type === "cost-guide" || p.frontmatter.category === "costs"
  );
}

export function getAllAuthors(): Author[] {
  if (!fs.existsSync(AUTHORS_FILE)) return [];
  try {
    const raw = fs.readFileSync(AUTHORS_FILE, "utf-8");
    const json = JSON.parse(raw);
    const parsed = authorSchema.array().safeParse(json);
    if (!parsed.success) return [];
    // Only return authors with real consent
    return parsed.data.filter((a) => Boolean(a.consentOn && a.consentOn.trim()));
  } catch {
    return [];
  }
}

export function getAuthorBySlug(slug: string): Author | undefined {
  return getAllAuthors().find((a) => a.slug === slug);
}

export function getEditorialPolicy() {
  return editorialData;
}
