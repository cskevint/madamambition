import requests
from bs4 import BeautifulSoup

from markdownify import markdownify
import os
import pprint

ARTICLE_FOLDER = os.path.abspath(os.path.join(os.path.dirname(__file__), 'articles'))
IMAGES_FOLDER = os.path.abspath(os.path.join(ARTICLE_FOLDER, 'images'))

BASE_DOMAIN = "madamambition.com"
ARTICLE_LIST_PAGES = [
    "https://madamambition.com/career-stories/page/1/",
    "https://madamambition.com/career-stories/page/2/",
]


def find_all_articles(url):
    print(f"Crawling {url} for articles...")
    response = requests.get(url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser')
        articles = soup.select('.entry-title a')
        print(f"Found {len(articles)} articles on {url}")
        links = [article.attrs['href'] for article in articles]
        return links
    else:
        print(f"Failed to retrieve {url}: {response.status_code}")
        return []

def download_article_data(url):
    print(f"Downloading article from {url}...")
    response = requests.get(url)
    if response.status_code == 200:
        path = url.replace("https://madamambition.com/", "").strip("/")
        soup = BeautifulSoup(response.content, 'html.parser')
        title_elem = soup.select_one('h1')
        title = title_elem.get_text(strip=True) if title_elem else "TITLE NOT FOUND"
        main_image_elem = soup.select_one('.et-last-child .et_pb_image img')
        main_image = main_image_elem['src'] if main_image_elem else None
        content_elem = soup.select_one('.entry-content')
        content = markdownify(str(content_elem)) if content_elem else "CONTENT NOT FOUND"
        images = []
        if content_elem:
            for img in content_elem.find_all('img'):
                src = img.get('src')
                filename = src.split('/')[-1]
                alt = img.get('alt', '')
            if src:
                images.append({'src': src, 'filename':filename, 'alt': alt})
        return {
            'url': url,
            'filename': f"{path}.md",
            'title': title,
            'main_image': main_image,
            'content': content,
            'images': images,
        }
    else:
        print(f"Failed to retrieve article {url}: {response.status_code}")
        return None

def process_article(article_data):
    print(f"Processing article: {article_data['title']}")
    os.makedirs(ARTICLE_FOLDER, exist_ok=True)
    os.makedirs(IMAGES_FOLDER, exist_ok=True)

    filename = os.path.join(ARTICLE_FOLDER, article_data['filename'])
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(f"# {article_data['title']}\n\n")
        f.write(f"![{article_data['title']}]({article_data['main_image']})\n\n")
        f.write(article_data['content'])

    for img in article_data['images']:
        img_response = requests.get(img['src'])
        if img_response.status_code == 200:
            img_filename = os.path.join(IMAGES_FOLDER, os.path.basename(img['src']))
            if os.path.exists(img_filename):
                continue
            with open(img_filename, 'wb') as img_file:
                img_file.write(img_response.content)
            print(f"Downloaded image {img['src']} to {img_filename}")
        else:
            print(f"Failed to download image {img['src']}: {img_response.status_code}")

def debug_article(article_data):
    article_copy = dict(article_data)
    article_copy.pop('content', None)
    pprint.pprint(article_copy)
    print(article_data['content'])

def reset_downloaded_data():
    if os.path.exists(ARTICLE_FOLDER):
        for filename in os.listdir(ARTICLE_FOLDER):
            file_path = os.path.join(ARTICLE_FOLDER, filename)
            if os.path.isfile(file_path):
                os.remove(file_path)
    if os.path.exists(IMAGES_FOLDER):
        for filename in os.listdir(IMAGES_FOLDER):
            file_path = os.path.join(IMAGES_FOLDER, filename)
            if os.path.isfile(file_path):
                os.remove(file_path)

def main():
    articles_found = []
    for page in ARTICLE_LIST_PAGES:
        articles = find_all_articles(page)
        articles_found.extend(articles)

    for article_url in articles_found:
        article = download_article_data(article_url)
        process_article(article)
    

if __name__ == "__main__":
    main()
