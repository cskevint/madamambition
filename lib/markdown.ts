import fs from 'fs';
import path from 'path';

export interface Article {
  slug: string;
  title: string;
  url: string;
  filename: string;
  mainImage: string;
  content: string;
}

const articlesDirectory = path.join(process.cwd(), 'articles');

export function getArticleSlugs() {
  const files = fs.readdirSync(articlesDirectory);
  return files.filter(f => f.endsWith('.md')).map(f => f.replace(/\.md$/, ''));
}

export function getArticleBySlug(slug: string): Article | null {
  const fullPath = path.join(articlesDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // parse the lines
  const lines = fileContents.split('\n');
  let title = '';
  let url = '';
  let filename = '';
  let mainImage = '';
  
  const contentLines: string[] = [];
  
  const commentRegex = /^\[\/\/\]: # \((.*?):\s*(.*)\)$/;
  
  for (const line of lines) {
    const match = line.match(commentRegex);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      if (key === 'title') title = value;
      else if (key === 'url') url = value;
      else if (key === 'filename') filename = value;
      else if (key === 'main_image') mainImage = value;
    } else {
      contentLines.push(line);
    }
  }

  const content = contentLines.join('\n').trim();

  return {
    slug,
    title,
    url,
    filename,
    mainImage,
    content,
  };
}

export function getAllArticles(): Article[] {
  const slugs = getArticleSlugs();
  const articles = slugs
    .map((slug) => getArticleBySlug(slug))
    .filter((a): a is Article => a !== null);
  
  return articles;
}
