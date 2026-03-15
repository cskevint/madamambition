import fs from "fs";
import path from "path";

export interface Article {
  slug: string;
  fullSlug: string;
  title: string;
  url: string;
  filename: string;
  mainImage: string;
  content: string;
  category: string;
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

  const contentLines: string[] = [];

  const commentRegex = /^\[\/\/\]: # \((.*?):\s*(.*)\)$/;

  for (const line of lines) {
    const match = line.match(commentRegex);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      if (key === "title") title = value;
      else if (key === "url") url = value;
      else if (key === "filename") filename = value;
      else if (key === "main_image") mainImage = value;
    } else {
      contentLines.push(line);
    }
  }

  const content = contentLines.join("\n").trim();

  return {
    slug: path.basename(fullPath, ".md"),
    fullSlug: relativePath,
    title,
    url,
    filename,
    mainImage,
    content,
    category,
  };
}

export function getAllArticles(categoryFilter?: string): Article[] {
  const slugs = getArticleSlugs();
  const articles = slugs
    .map((slug) => getArticleBySlug(slug))
    .filter((a): a is Article => a !== null);

  if (categoryFilter) {
    return articles.filter((a) => a.category === categoryFilter);
  }

  return articles;
}
