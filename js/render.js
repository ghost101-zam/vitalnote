/* ============================================================
   render.js — pure HTML-building helpers.
   Every function here takes data and returns a string of markup;
   none of them touch the DOM directly except the mount* helpers
   at the bottom, which just set innerHTML on a container.
   ============================================================ */

const Render = (() => {

  function vitalsLineSVG(animated) {
    return `<svg class="vitals-line" viewBox="0 0 300 22" preserveAspectRatio="none" aria-hidden="true">
      <path class="${animated ? "vitals-pulse" : ""}" d="M0,11 L60,11 L72,11 L80,2 L90,20 L100,4 L108,11 L120,11 L180,11 L192,11 L200,2 L210,20 L220,4 L228,11 L300,11" />
    </svg>`;
  }

  function eyebrow(article) {
    const cat = SiteData.categoryName(article.category);
    const label = (article.tags || []).includes("breaking") ? "Breaking · " + cat : cat;
    return `<a class="eyebrow" href="category.html?cat=${article.category}" style="--cat-color:${SiteData.getCategory(article.category)?.color || ""}">${label}</a>`;
  }

  function articleCard(article) {
    const cat = SiteData.getCategory(article.category);
    return `
    <article class="article-card reveal">
      <a class="thumb" href="article.html?slug=${article.slug}" aria-label="${escapeAttr(article.title)}">
        <img src="${article.image}" alt="${escapeAttr(article.title)}" loading="lazy" width="400" height="300"
             onerror="this.onerror=null;this.src='images/placeholder.svg';">
      </a>
      <div class="eyebrow" style="--cat-color:${cat?.color || ""}">${SiteData.categoryName(article.category)}</div>
      <h3><a href="article.html?slug=${article.slug}">${article.title}</a></h3>
      <p class="card-desc">${article.description}</p>
      <div class="card-meta">
        <span>${SiteData.formatDate(article.date)}</span>
        <span>·</span>
        <span>${article.readingTime} min read</span>
      </div>
    </article>`;
  }

  function listCard(article, rank) {
    return `
    <div class="list-card reveal">
      ${rank ? `<div class="rank">${String(rank).padStart(2, "0")}</div>` : ""}
      <a class="thumb" href="article.html?slug=${article.slug}">
        <img src="${article.image}" alt="${escapeAttr(article.title)}" loading="lazy" width="96" height="72"
             onerror="this.onerror=null;this.src='images/placeholder.svg';">
      </a>
      <div>
        <div class="eyebrow" style="--cat-color:${SiteData.getCategory(article.category)?.color || ""}">${SiteData.categoryName(article.category)}</div>
        <h4><a href="article.html?slug=${article.slug}">${article.title}</a></h4>
      </div>
    </div>`;
  }

  function sideStory(article) {
    return `
    <div class="side-story reveal">
      <img src="${article.image}" alt="${escapeAttr(article.title)}" loading="lazy" width="84" height="64"
           onerror="this.onerror=null;this.src='images/placeholder.svg';">
      <div>
        <div class="eyebrow" style="--cat-color:${SiteData.getCategory(article.category)?.color || ""}">${SiteData.categoryName(article.category)}</div>
        <h4><a href="article.html?slug=${article.slug}">${article.title}</a></h4>
      </div>
    </div>`;
  }

  function categoryChip(cat, articleCount) {
    return `
    <a class="category-chip reveal" href="category.html?cat=${cat.slug}" style="--chip-color:${cat.color}">
      <span class="cat-name">${cat.name}</span>
      <span class="cat-desc">${cat.description}</span>
      <span class="eyebrow" style="--cat-color:${cat.color}">${articleCount} article${articleCount === 1 ? "" : "s"}</span>
    </a>`;
  }

  function escapeAttr(str) {
    return String(str).replace(/"/g, "&quot;");
  }

  function mountCards(containerId, articles) {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = articles.map(articleCard).join("");
    Motion.observe(el.querySelectorAll(".reveal"));
  }

  function mountList(containerId, articles, ranked) {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = articles.map((a, i) => listCard(a, ranked ? i + 1 : null)).join("");
    Motion.observe(el.querySelectorAll(".reveal"));
  }

  function mountSideStories(containerId, articles) {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = articles.map(sideStory).join("");
    Motion.observe(el.querySelectorAll(".reveal"));
  }

  function mountCategoryGrid(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const cats = SiteData.data.categories;
    el.innerHTML = cats.map(c => categoryChip(c, SiteData.getArticlesByCategory(c.slug).length)).join("");
    Motion.observe(el.querySelectorAll(".reveal"));
  }

  return {
    vitalsLineSVG, eyebrow, articleCard, listCard, sideStory, categoryChip,
    mountCards, mountList, mountSideStories, mountCategoryGrid, escapeAttr
  };
})();
