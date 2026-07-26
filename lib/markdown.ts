import fs from "fs";
import path from "path";
import { isHiddenCategory } from "./features";

export interface Article {
  slug: string;
  fullSlug: string;
  title: string;
  url: string;
  filename: string;
  mainImage: string;
  content: string;
  category: string;
  date?: string;
  excerpt: string;
}

const articlesDirectory = path.join(process.cwd(), "articles");

function getFilesRecursively(dir: string): string[] {
  let results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFilesRecursively(filePath));
    } else {
      if (file.endsWith(".md")) {
        results.push(filePath);
      }
    }
  });
  return results;
}

export function getArticleSlugs() {
  const files = getFilesRecursively(articlesDirectory);
  return files.map((f) => path.relative(articlesDirectory, f).replace(/\.md$/, ""));
}

export function getArticleBySlug(slug: string): Article | null {
  // Try direct path first
  let fullPath = path.join(articlesDirectory, `${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    // Search recursively for the filename
    const allFiles = getFilesRecursively(articlesDirectory);
    const found = allFiles.find((f) => path.basename(f, ".md") === slug);
    if (found) {
      fullPath = found;
    } else {
      return null;
    }
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const relativePath = path.relative(articlesDirectory, fullPath).replace(/\.md$/, "");
  const category = path.dirname(relativePath);

  // parse the lines
  const lines = fileContents.split("\n");
  let title = "";
  let url = "";
  let filename = "";
  let mainImage = "";
  let date = "";

  const contentLines: string[] = [];

  // Matches either [//]: # "key: value" or [//]: # (key: value). The delimiters must be
  // matched as a pair — an earlier version required a closing double quote, so paren-style
  // comments silently fell through to the body and left title/main_image empty.
  // Both captures are greedy and end-anchored so values may contain quotes or nested parens
  // (e.g. "title: Yue (Lulu) Liu").
  const commentRegex = /^\[\/\/\]: # (?:"(.*)"|\((.*)\))\s*$/;

  for (const line of lines) {
    const match = line.match(commentRegex);
    // Split on the first colon only — values such as `url: https://…` contain their own.
    const pair = match ? (match[1] ?? match[2]).match(/^(.*?):\s*([\s\S]*)$/) : null;
    if (pair) {
      const key = pair[1].trim();
      const value = pair[2].trim();
      if (key === "title") title = value;
      else if (key === "url") url = value;
      else if (key === "filename") filename = value;
      else if (key === "main_image") mainImage = value;
    } else {
      contentLines.push(line);
    }
  }

  // Extract date from the first few lines of content if it looks like a date (e.g. Month Day, Year)
  const dateRegex =
    /^(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}$/;

  // Look at lines 5-15 of the original file (which are now at the start of contentLines after stripping comments)
  for (let i = 0; i < Math.min(15, contentLines.length); i++) {
    const trimmedLine = contentLines[i].trim();
    if (dateRegex.test(trimmedLine)) {
      date = trimmedLine;
      // Optionally remove the date line from content to avoid duplication
      contentLines.splice(i, 1);
      break;
    }
  }

  // Also remove category links, h1 titles, and top-level images from the top of the content
  while (contentLines.length > 0) {
    const line = contentLines[0].trim();
    if (
      line === "" ||
      line.startsWith("# ") ||
      (line.startsWith("[") && line.includes("madamambition.com/category/")) ||
      line.startsWith("![") ||
      line.startsWith("![]")
    ) {
      contentLines.shift();
      continue;
    }
    break;
  }

  const content = contentLines.join("\n").trim();

  // Generate a clean excerpt for previews
  const excerpt = content
    .replace(/!\[.*?\]\(.*?\)/g, "") // Remove images
    .replace(/\[(.*?)\]\(.*?\)/g, "$1") // Remove links but keep text
    .replace(/[#*`_~]/g, "") // Remove common markdown symbols
    .replace(/\s+/g, " ") // Collapse whitespace
    .trim()
    .substring(0, 200);

  return {
    slug: path.basename(fullPath, ".md"),
    fullSlug: relativePath,
    title,
    url,
    filename,
    mainImage,
    content,
    category,
    date,
    excerpt: excerpt + (excerpt.length >= 200 ? "..." : ""),
  };
}

/** Newest first, matching the live blog grids. Undated articles sort last, then by title. */
function byDateDesc(a: Article, b: Article): number {
  const ta = a.date ? new Date(a.date).getTime() : Number.NaN;
  const tb = b.date ? new Date(b.date).getTime() : Number.NaN;
  const va = Number.isNaN(ta);
  const vb = Number.isNaN(tb);
  if (va && vb) return a.title.localeCompare(b.title);
  if (va) return 1;
  if (vb) return -1;
  return tb - ta;
}

/**
 * Articles that are servable under the current feature flags, newest first.
 *
 * Disabled categories are filtered out here so that every consumer — listings, the RSS feed,
 * `generateStaticParams` — is consistent without each having to remember. Use
 * `getArticleBySlug` directly if you need an article regardless of flags.
 */
export function getAllArticles(categoryFilter?: string): Article[] {
  const slugs = getArticleSlugs();
  const articles = slugs
    .map((slug) => getArticleBySlug(slug))
    .filter((a): a is Article => a !== null)
    .filter((a) => !isHiddenCategory(a.category))
    .sort(byDateDesc);

  if (categoryFilter) {
    return articles.filter((a) => a.category === categoryFilter);
  }

  return articles;
}
