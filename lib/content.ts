import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface ContentFrontmatter {
  title: string;
  description: string;
  province?: string;
  state?: string;
  form?: string;
  topic?: string;
  year?: number;
  publishedAt: string;
  updatedAt: string;
  reviewed?: boolean;    // human-reviewed flag
  disclaimer?: boolean;  // show tax disclaimer
  keywords?: string[];
  relatedForms?: string[];
  schema?: "faq" | "howto" | "article"; // JSON-LD schema type
}

export interface ContentPage {
  slug: string;
  frontmatter: ContentFrontmatter;
  content: string;
  category: "guides" | "forms" | "topics" | "exchange-rate";
}

const CONTENT_DIR = path.join(process.cwd(), "content");

export function getContentByPath(category: string, ...slugParts: string[]): ContentPage | null {
  const filePath = path.join(CONTENT_DIR, category, ...slugParts) + ".mdx";
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  return {
    slug: slugParts.join("/"),
    frontmatter: data as ContentFrontmatter,
    content,
    category: category as ContentPage["category"],
  };
}

export function getAllContentSlugs(category: string): string[][] {
  const dir = path.join(CONTENT_DIR, category);
  if (!fs.existsSync(dir)) return [];

  const slugs: string[][] = [];
  function walk(currentDir: string, parts: string[]) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        walk(path.join(currentDir, entry.name), [...parts, entry.name]);
      } else if (entry.name.endsWith(".mdx")) {
        slugs.push([...parts, entry.name.replace(".mdx", "")]);
      }
    }
  }
  walk(dir, []);
  return slugs;
}
