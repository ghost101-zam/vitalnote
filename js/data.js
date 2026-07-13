/* ============================================================
   data.js — single data-access layer for the whole site.
   Fetches data/articles.json, data/authors.json and
   data/categories.json once, caches them, and exposes small
   helper functions every page uses to read that data.

   HOW TO ADD A NEW ARTICLE:
   See the instructions at the bottom of README.md — in short,
   add one object to the "articles" array in data/articles.json
   and it will automatically appear on the homepage, its category
   page, search, trending and latest sections. No other file
   needs to change.
   ============================================================ */

const SiteData = (() => {
  let cache = null;
  let loadingPromise = null;

  // Paths are relative to the page loading this script, so every
  // HTML page must sit at the project root (article.html, category.html,
  // etc. all live at the root and use root-relative "data/..." paths).
  const PATHS = {
    articles: "data/articles.json",
    authors: "data/authors.json",
    categories: "data/categories.json"
  };

  async function fetchJSON(path) {
    const res = await fetch(path, { cache: "no-cache" });
    if (!res.ok) throw new Error("Failed to load " + path);
    return res.json();
  }

  async function load() {
    if (cache) return cache;
    if (loadingPromise) return loadingPromise;

    loadingPromise = Promise.all([
      fetchJSON(PATHS.articles),
      fetchJSON(PATHS.authors),
      fetchJSON(PATHS.categories)
    ]).then(([articlesData, authorsData, categoriesData]) => {
      cache = {
        articles: articlesData.articles.slice().sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        ),
        authors: authorsData.authors,
        categories: categoriesData.categories
      };
      return cache;
    });

    return loadingPromise;
  }

  function getAuthor(slug) {
    return cache ? cache.authors.find(a => a.slug === slug) : null;
  }

  function getCategory(slug) {
    return cache ? cache.categories.find(c => c.slug === slug) : null;
  }

  function getArticleBySlug(slug) {
    return cache ? cache.articles.find(a => a.slug === slug) : null;
  }

  function getArticlesByCategory(slug) {
    return cache ? cache.articles.filter(a => a.category === slug) : [];
  }

  function getArticlesByTag(tag) {
    return cache ? cache.articles.filter(a => (a.tags || []).includes(tag)) : [];
  }

  function getRelated(article, count) {
    if (!cache) return [];
    return cache.articles
      .filter(a => a.id !== article.id && a.category === article.category)
      .slice(0, count || 4);
  }

  function getAdjacent(article) {
    if (!cache) return { prev: null, next: null };
    const all = cache.articles;
    const idx = all.findIndex(a => a.id === article.id);
    return {
      prev: idx < all.length - 1 ? all[idx + 1] : null, // older
      next: idx > 0 ? all[idx - 1] : null // newer
    };
  }

  function search(query) {
    if (!cache || !query || !query.trim()) return [];
    const q = query.trim().toLowerCase();
    return cache.articles.filter(a => {
      const haystack = [
        a.title,
        a.category,
        a.description,
        ...(a.keywords || [])
      ].join(" ").toLowerCase();
      return haystack.includes(q);
    });
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  }

  function categoryName(slug) {
    const c = getCategory(slug);
    return c ? c.name : slug;
  }

  return {
    load,
    get data() { return cache; },
    getAuthor,
    getCategory,
    getArticleBySlug,
    getArticlesByCategory,
    getArticlesByTag,
    getRelated,
    getAdjacent,
    search,
    formatDate,
    categoryName
  };
})();
