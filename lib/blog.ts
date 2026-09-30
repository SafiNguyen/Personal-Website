import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const BLOG_DIRECTORY = path.join(process.cwd(), "assets", "blogs");

export type BlogPostSummary = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  readTime: string;
  thumbnail: string;
  thumbnailAlt: string;
};

export type BlogPost = BlogPostSummary & {
  content: string;
};

function requiredString(data: Record<string, unknown>, key: string, filename: string) {
  const value = data[key];
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Missing string frontmatter field "${key}" in ${filename}`);
  }
  return value.trim();
}

function optionalString(data: Record<string, unknown>, key: string) {
  const value = data[key];
  return typeof value === "string" && value.trim() !== "" ? value.trim() : undefined;
}

function requiredDate(data: Record<string, unknown>, filename: string) {
  const value = data.publishedAt ?? data.date;
  if (value instanceof Date && !Number.isNaN(value.valueOf())) {
    return value.toISOString().slice(0, 10);
  }
  if (typeof value === "string" && value.trim() !== "") return value.trim();
  throw new Error(`Missing date frontmatter field "publishedAt" in ${filename}`);
}

function getExcerpt(content: string) {
  const paragraph = content
    .split(/\r?\n\s*\r?\n/)
    .map((part) => part.replace(/[#*_`>\[\]!]/g, "").replace(/\([^)]*\)/g, "").trim())
    .find((part) => part && !part.startsWith("bundle ") && !part.startsWith("http"));

  return paragraph?.slice(0, 180) ?? "A note from the archive.";
}

function getCategory(data: Record<string, unknown>) {
  const category = optionalString(data, "category");
  if (category) return category;

  const tags = data.tags;
  if (Array.isArray(tags) && typeof tags[0] === "string") {
    return tags[0].replace(/[-_]/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  return "Notes";
}

function getReadTime(content: string, data: Record<string, unknown>) {
  const readTime = optionalString(data, "readTime");
  if (readTime) return readTime;
  return `${Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 200))} min`;
}

function getThumbnail(data: Record<string, unknown>) {
  const thumbnail = optionalString(data, "thumbnail") ?? optionalString(data, "cover");
  if (thumbnail?.startsWith("/")) {
    const publicFile = path.join(process.cwd(), "public", thumbnail.slice(1));
    if (fs.existsSync(publicFile)) return thumbnail;
  }

  return "/blogs/thumbs/small-starts.jpg";
}

function parsePost(filename: string): BlogPost {
  const filepath = path.join(BLOG_DIRECTORY, filename);
  const { data, content } = matter(fs.readFileSync(filepath, "utf8"));
  const frontmatter = data as Record<string, unknown>;
  const slug = path.basename(filename, ".md");

  return {
    slug,
    title: requiredString(frontmatter, "title", filename),
    excerpt: optionalString(frontmatter, "excerpt") ?? getExcerpt(content),
    category: getCategory(frontmatter),
    publishedAt: requiredDate(frontmatter, filename),
    readTime: getReadTime(content, frontmatter),
    thumbnail: getThumbnail(frontmatter),
    thumbnailAlt: optionalString(frontmatter, "thumbnailAlt") ?? requiredString(frontmatter, "title", filename),
    content: content.trim(),
  };
}

export function getBlogPosts(): BlogPostSummary[] {
  const posts = fs.readdirSync(BLOG_DIRECTORY)
    .filter((filename) => filename.endsWith(".md"))
    .map(parsePost)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  return posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    category: post.category,
    publishedAt: post.publishedAt,
    readTime: post.readTime,
    thumbnail: post.thumbnail,
    thumbnailAlt: post.thumbnailAlt,
  }));
}

export function getBlogPost(slug: string): BlogPost | null {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  const filename = `${slug}.md`;
  if (!fs.existsSync(path.join(BLOG_DIRECTORY, filename))) return null;
  return parsePost(filename);
}