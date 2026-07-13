# VitalNote — Health News & Education Website

A static, vanilla HTML/CSS/JS health publishing site. No build step, no framework,
no backend — content is driven entirely by `data/articles.json`.

## Project structure

```
index.html            Homepage
article.html           Generic article template (reads ?slug=...)
category.html          Generic category template (reads ?cat=...)
author.html             Generic author profile template (reads ?author=...)
search.html            Search results page
about.html, contact.html, privacy.html, terms.html, disclaimer.html, 404.html
css/style.css           All styles (light + dark mode)
js/data.js              Loads and queries the JSON data
js/render.js            Turns article data into HTML markup
js/partials.js          Shared header + footer (edit nav/footer here once)
js/main.js              Theme toggle, mobile nav, search, scroll effects
data/articles.json      Every article — this is what you edit to publish
data/authors.json       Author bios
data/categories.json    Category names, descriptions, colors
images/articles/        Article hero images (SVG placeholders — replace with real photos)
images/authors/         Author avatars
assets/                 Favicon, social share image
sitemap.xml, robots.txt SEO files (regenerate sitemap.xml if you add many articles)
```

## Running it locally

Browsers block `fetch()` of local JSON files opened directly as `file://`.
Serve the folder instead of double-clicking `index.html`:

```bash
# Python (built into most systems)
cd vitalnote
python3 -m http.server 8000
# then open http://localhost:8000
```

Or use VS Code's "Live Server" extension, or `npx serve`. Any static file
server works — GitHub Pages (below) handles this automatically once deployed.

## Publishing a new article (edit only articles.json)

Open `data/articles.json` and add a new object to the `"articles"` array.
Every field below is required except where noted:

```json
{
  "id": 17,
  "title": "Your Article Title",
  "slug": "your-article-title",
  "author": "priya-nair",
  "date": "2026-07-15",
  "category": "nutrition",
  "tags": ["trending"],
  "description": "One or two sentences used on cards, search, and meta tags.",
  "keywords": ["keyword one", "keyword two"],
  "image": "images/articles/your-image.svg",
  "imageCaption": "Optional caption shown under the featured image.",
  "readingTime": 5,
  "content": [
    { "type": "paragraph", "text": "Opening paragraph…" },
    { "type": "heading", "text": "A subheading" },
    { "type": "paragraph", "text": "More text…" },
    { "type": "quote", "text": "A pull quote." },
    { "type": "list", "items": ["Point one", "Point two"] }
  ],
  "references": ["Source or citation one.", "Source or citation two."]
}
```

Notes:
- `id` — any unique number, one higher than your last article.
- `slug` — lowercase, hyphenated, must be unique; this becomes the URL: `article.html?slug=your-article-title`.
- `author` — must match a `"slug"` in `data/authors.json`. Add a new author there first if needed.
- `category` — must match a `"slug"` in `data/categories.json`.
- `tags` — optional. Recognized values: `"breaking"`, `"trending"`, `"popular"`, `"editors-pick"`. These control which homepage section the article can appear in.
- `image` — path to a hero image. Drop a real photo into `images/articles/` (JPEG/PNG/WebP all work) and point to it, or reuse the SVG placeholder style — see `images/placeholder.svg` for the fallback used automatically if an image fails to load.
- `content` — an array of blocks rendered top to bottom. Supported types: `paragraph`, `heading` (also builds the table of contents), `quote` (pull quote), `list`, and `image` (`{ "type": "image", "src": "...", "alt": "...", "caption": "..." }` for an inline photo mid-article).

Save the file. That's it — the article will automatically appear on:

- **Homepage** — in "Latest Articles," and in "Breaking," "Trending," "Popular," or "Editor's Picks" if you gave it that tag.
- **Its category page** (`category.html?cat=nutrition`, etc.)
- **Search** — title, category, description, and keywords are all searched.
- **Related articles** on other articles in the same category.
- **sitemap.xml** — regenerate this manually (see below) before your next deploy so search engines see the new URL.

### Regenerating sitemap.xml

`sitemap.xml` is a static file, not auto-generated at runtime, so re-run this
whenever you add articles (requires Python 3, included on macOS/Linux; on
Windows use WSL or adjust the script to plain JS if preferred):

```bash
python3 - << 'EOF'
import json
d = json.load(open('data/articles.json'))['articles']
cats = json.load(open('data/categories.json'))['categories']
base = 'https://YOUR-DOMAIN.com'
urls = [f'{base}/{p}' for p in
        ['index.html','about.html','contact.html','privacy.html','terms.html','disclaimer.html','search.html']]
urls += [f'{base}/category.html?cat={c["slug"]}' for c in cats]
urls += [f'{base}/article.html?slug={a["slug"]}' for a in d]
xml = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
xml += [f'  <url><loc>{u}</loc></url>' for u in urls]
xml.append('</urlset>')
open('sitemap.xml', 'w').write('\n'.join(xml) + '\n')
EOF
```

## Publishing on GitHub Pages

1. Create a new GitHub repository (public repos get free Pages hosting).
2. Push this folder's contents to the repository root:
   ```bash
   git init
   git add .
   git commit -m "Initial site"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
   git push -u origin main
   ```
3. In the repo on GitHub: **Settings → Pages → Source**, choose the `main`
   branch and `/ (root)` folder, then save.
4. GitHub will publish the site at `https://YOUR-USERNAME.github.io/YOUR-REPO/`
   within a minute or two.
5. Before/after this step, update every `https://www.vitalnote.example/...`
   canonical/OG URL in the HTML files (and in `sitemap.xml`, `robots.txt`) to
   your real GitHub Pages or custom domain URL — search-and-replace across
   the project.

## Connecting a custom domain (for Google AdSense)

AdSense generally expects a site on its own domain rather than a `github.io`
subdomain, though github.io subdomains can also be approved in some cases.

1. Buy a domain from any registrar (Namecheap, Google Domains successor,
   Cloudflare, etc.).
2. In the repo, add a file named `CNAME` (no extension) at the project root
   containing just your domain, e.g. `www.yourdomain.com`.
3. At your domain registrar, add DNS records pointing to GitHub Pages:
   - For an apex domain (`yourdomain.com`): four `A` records pointing to
     GitHub's IPs (`185.199.108.153`, `.109.153`, `.110.153`, `.111.153`).
   - For a `www` subdomain: a `CNAME` record pointing to
     `YOUR-USERNAME.github.io`.
4. Back in **Settings → Pages**, enter your custom domain and enable
   "Enforce HTTPS" once it's available (can take a few hours after DNS
   propagates).
5. Once your domain is live with real, original content (this template ships
   with placeholder articles — replace them with your own writing first) and
   the required legal pages (already included: Privacy Policy, Terms,
   Medical Disclaimer, About, Contact), apply for **Google AdSense** with
   that domain. When approved, ad code goes into the marked placeholders in
   the HTML (`.ad-slot` elements in `index.html`, `article.html`,
   `category.html`, `search.html`, `404.html`, and the footer banner in
   `js/partials.js`) — this template intentionally ships without any
   AdSense script.

## A note on the placeholder content

Every article, author bio, and image in this project is original placeholder
content written for demonstration. Replace it with your own writing and
real photography (with permission/license, plus alt text) before publishing.
