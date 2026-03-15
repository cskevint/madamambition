import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import os


BASE_URL = "https://www.madamambition.com/"

# List of URLs to exclude from crawling
EXCLUDE_URLS = [
    # Wordpress and XML documents
    "https://madamambition.com/sign-in/",
    "https://madamambition.com/comments/feed/",
    "https://madamambition.com/feed/",
    # Author and category pages
    "https://madamambition.com/author/maribel/",
    "https://madamambition.com/author/maribel/page/2/",
    "https://madamambition.com/author/maribel/page/3/",
    "https://madamambition.com/author/maribel/page/4/",
    "https://madamambition.com/author/maribel/page/5/",
    "https://madamambition.com/author/maribel/page/6/",
    "https://madamambition.com/author/selenawp/",
    "https://madamambition.com/author/selenawp/page/2/",
    "https://madamambition.com/author/selenawp/page/3/",
    "https://madamambition.com/author/selenawp/page/4/",
    "https://madamambition.com/author/selenawp/page/5/",
    "https://madamambition.com/author/selenawp/page/6/",
    "https://madamambition.com/author/selenawp/page/7/",
    "https://madamambition.com/author/selenawp/page/8/",
    "https://madamambition.com/category/career-stories/",
    "https://madamambition.com/category/career-stories/all-careers/",
    "https://madamambition.com/category/career-stories/all-careers/page/2/",
    "https://madamambition.com/category/career-stories/all-careers/page/3/",
    "https://madamambition.com/category/career-stories/careers-in-finance-and-tech/",
    "https://madamambition.com/category/career-stories/careers-in-finance-and-tech/page/2/",
    "https://madamambition.com/category/career-stories/careers-in-finance-and-tech/page/3/",
    "https://madamambition.com/category/career-stories/page/10/",
    "https://madamambition.com/category/career-stories/page/2/",
    "https://madamambition.com/category/career-stories/page/3/",
    "https://madamambition.com/category/career-stories/page/4/",
    "https://madamambition.com/category/career-stories/page/5/",
    "https://madamambition.com/category/career-stories/page/6/",
    "https://madamambition.com/category/career-stories/page/7/",
    "https://madamambition.com/category/career-stories/page/8/",
    "https://madamambition.com/category/career-stories/page/9/",
    "https://madamambition.com/category/thoughts-on-finance-and-executive-coaching/",
    "https://madamambition.com/category/thoughts-on-finance-and-executive-coaching/page/2/",
    "https://madamambition.com/category/uncategorized/",
    # Month pages
    "https://madamambition.com/2024/08/",
    "https://madamambition.com/2024/02/",
    "https://madamambition.com/2023/11/",
    "https://madamambition.com/2023/10/",
    "https://madamambition.com/2023/09/",
    "https://madamambition.com/2023/08/",
    "https://madamambition.com/2023/07/",
    "https://madamambition.com/2023/06/",
    "https://madamambition.com/2023/05/",
    "https://madamambition.com/2023/04/",
    "https://madamambition.com/2023/03/",
    "https://madamambition.com/2023/02/",
    "https://madamambition.com/2023/01/",
    "https://madamambition.com/2022/10/",
    "https://madamambition.com/2022/09/",
    "https://madamambition.com/2022/08/",
    "https://madamambition.com/2022/07/",
    "https://madamambition.com/2022/06/",
    "https://madamambition.com/2022/05/",
    "https://madamambition.com/2022/04/",
    "https://madamambition.com/2022/02/",
    "https://madamambition.com/2022/01/",
    "https://madamambition.com/2021/12/",
    "https://madamambition.com/2021/02/",
    "https://madamambition.com/2021/01/",
    # Article pages
    "https://madamambition.com/azucena-ramos-md-phd/",
    "https://madamambition.com/tracy-borreson/",
    "https://madamambition.com/yikee-adje/",
    "https://madamambition.com/ariane-bertrand/",
    "https://madamambition.com/amanda-estiverne-colas/",
    "https://madamambition.com/marcia-tal/",
    "https://madamambition.com/laxmi-ramanath/",
    "https://madamambition.com/tejal-shah/",
    "https://madamambition.com/rochelle-gorey/",
    "https://madamambition.com/amy-schultz-co-founder-of-bolder-money/",
    "https://madamambition.com/jenna-nicholas-investor-entrepreneur-board-member-in-social-investments/",
    "https://madamambition.com/sibby-thomsen-maker-of-cupcake-magic/",
    "https://madamambition.com/kelsi-taylor-medical-editor/",
    "https://madamambition.com/yue-lulu-liu/",
    "https://madamambition.com/sofia-yuen/",
    "https://madamambition.com/kimberly-kwon/",
    "https://madamambition.com/genevieve-dozier/",
    "https://madamambition.com/eliza-kosoy/",
    "https://madamambition.com/alyssa-phillips-careers-in-wealth-management/",
    "https://madamambition.com/amodhi-weeresinghe-ceo-of-hcl-designs-marketing-agency/",
    "https://madamambition.com/rachel-pereya-fractional-business-systems-expertise/",
    "https://madamambition.com/maribel-aburto-founder-in-branding-and-web-design/",
    "https://madamambition.com/ebony-holden-lawyer-and-entrepreneur/",
    "https://madamambition.com/trinetta-powell-licensed-professional-counselor-personal-development-coach-speaker-best-selling-author/",
    "https://madamambition.com/hoda-toloui-wallace-project-manager-digital-strategy-innovation-at-lululemon/",
    "https://madamambition.com/chrysta-wilson-founder-dei-coach-and-consultant/",
    "https://madamambition.com/pam-kriangkum-entrepreneur-brand-photographer-and-business-development-leader/",
    "https://madamambition.com/sr-manager-of-learning-development-and-customer-experience-at-vision-insurance-company-california/",
    "https://madamambition.com/technical-program-manager-supply-chain-sustainability-phd/",
    "https://madamambition.com/head-of-business-and-sales-channels-for-insurance-switzerland/",
    "https://madamambition.com/3d-pattern-apparel-expert-minnesota/",
    "https://madamambition.com/electrical-engineer-peru-to-california/",
    "https://madamambition.com/ceo-and-producer-at-a-media-production-company-california/",
    "https://madamambition.com/life-alignment-and-menstrual-coach-germany/",
    "https://madamambition.com/jamie-higgins/",
    "https://madamambition.com/phd-sr-director-in-clinical-science/",
    "https://madamambition.com/social-worker-full-time-mother/",
    "https://madamambition.com/executive-director-fundaec-colombia/",
    "https://madamambition.com/elementary-school-teacher-in-the-us-from-argentina/",
    "https://madamambition.com/communication-systems-manager-at-att/",
    "https://madamambition.com/genetic-consultant-at-ucsf/",
    "https://madamambition.com/clinical-research-supervisor-at-ucsf/",
    "https://madamambition.com/research-practice-director-at-the-wiseman-group/",
    "https://madamambition.com/physician-family-doctor-south-africa/",
    "https://madamambition.com/dance-teacher-at-sfusd/",
    "https://madamambition.com/elizabeth-herth-national-statistics-officer-mba/",
    "https://madamambition.com/global-marketing-and-brand-executive-education-and-learning-technology-leader/",
    "https://madamambition.com/associate-chair-of-administration-and-finance-at-ucsf/",
    "https://madamambition.com/finance-data-and-systems-architect-at-google/",
    "https://madamambition.com/director-of-law-school-admissions/",
    "https://madamambition.com/middle-school-band-teacher/",
    "https://madamambition.com/stay-at-home-mom-homeschooler-parent-and-tech-support/",
    "https://madamambition.com/internal-medicine-physician/",
    "https://madamambition.com/anna-roussanova-senior-technical-architect-at-zendesk/",
    "https://madamambition.com/dental-hygentist/",
    # New
    "https://madamambition.com/about/",
    "https://madamambition.com/executive-coaching/",
    "https://madamambition.com/career-stories/",
    "https://madamambition.com/insights/",
    "https://madamambition.com/journal/",
    "https://madamambition.com/contact/",
    "https://madamambition.com/what-are-the-kpi-for-executive-coaching/",
    "https://madamambition.com/executive-level-interview-questions/",
    "https://madamambition.com/growth-mindset-in-leadership/",
    "https://madamambition.com/working-mom-hacks/",
    "https://madamambition.com/what-is-a-leadership-mindset-how-to-create-resilient-space-for-you-and-your-team/",
    "https://madamambition.com/difference-between-executive-and-leadership-coaching/",
    "https://madamambition.com/purpose-of-executive-coaching-women/",
    "https://madamambition.com/how-to-choose-an-executive-coach/",
    "https://madamambition.com/getting-more-girls-into-stem-careers-thoughts/",
    "https://madamambition.com/career-stories/page/2/",
]

INSIGHTS = [
    "https://madamambition.com/what-are-the-kpi-for-executive-coaching/",
    "https://madamambition.com/working-mom-hacks/",
    "https://madamambition.com/purpose-of-executive-coaching-women/",
    "https://madamambition.com/executive-level-interview-questions/",
    "https://madamambition.com/what-is-a-leadership-mindset-how-to-create-resilient-space-for-you-and-your-team/",
    "https://madamambition.com/how-to-choose-an-executive-coach/",
    "https://madamambition.com/growth-mindset-in-leadership/",
    "https://madamambition.com/difference-between-executive-and-leadership-coaching/",
    "https://madamambition.com/getting-more-girls-into-stem-careers-thoughts/",
]


def crawl_all_links(start_url):
    visited = set()
    to_visit = [start_url]
    found_links = set()

    while to_visit:
        url = to_visit.pop()
        if url in visited:
            continue
        visited.add(url)
        try:
            response = requests.get(url, timeout=10)
        except Exception as e:
            print(f"Failed to fetch {url}: {e}")
            continue
        if response.status_code != 200:
            continue
        soup = BeautifulSoup(response.content, "html.parser")
        for a in soup.find_all("a", href=True):
            link = urljoin(url, a["href"])
            parsed = urlparse(link)
            if (
                parsed.scheme.startswith("http")
                and parsed.hostname
                and parsed.hostname.startswith("madamambition.com")
            ):
                clean_link = parsed.scheme + "://" + parsed.hostname + parsed.path
                # Exclude URLs in EXCLUDE_URLS
                if clean_link.rstrip("/") in [u.rstrip("/") for u in EXCLUDE_URLS]:
                    continue
                if clean_link not in found_links:
                    found_links.add(clean_link)
                    print(clean_link)
                    if clean_link not in visited:
                        to_visit.append(clean_link)
    return sorted(found_links)



IMAGE_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "articles", "images")


def download_images_from_excluded_urls():
    """Download images from all EXCLUDE_URLS to public/articles/images if they don't exist."""
    if not os.path.exists(IMAGE_DIR):
        os.makedirs(IMAGE_DIR)

    for url in EXCLUDE_URLS:
        if "/feed/" in url or url.endswith(".xml") or "/comments/feed/" in url:
            continue
            
        print(f"Checking images on: {url}")
        try:
            response = requests.get(url, timeout=15)
            if response.status_code != 200:
                continue
            soup = BeautifulSoup(response.content, "html.parser")
            for img in soup.find_all("img"):
                src = img.get("src")
                if not src:
                    continue
                
                # Resolve full image URL
                img_url = urljoin(url, src)
                # Clean URL (remove query params)
                clean_img_url = img_url.split("?")[0]
                img_name = os.path.basename(urlparse(clean_img_url).path)
                
                if not img_name or "." not in img_name:
                    continue
                
                target_path = os.path.join(IMAGE_DIR, img_name)
                if os.path.exists(target_path):
                    continue
                
                print(f"Downloading {img_name} from {url}...")
                img_response = requests.get(img_url, timeout=15)
                if img_response.status_code == 200:
                    with open(target_path, "wb") as f:
                        f.write(img_response.content)
                else:
                    print(f"  Failed to download {img_name}: {img_response.status_code}")
        except Exception as e:
            print(f"Error processing {url}: {e}")


if __name__ == "__main__":
    print("Downloading images from excluded URLs...")
    download_images_from_excluded_urls()
    print("\nCrawling links...")
    crawl_all_links(BASE_URL)
