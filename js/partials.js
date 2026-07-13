/* ============================================================
   partials.js — shared header + footer markup.
   Injected into every page via #site-header-mount / #site-footer-mount.
   Edit the nav links or footer columns here once; every page updates.
   ============================================================ */

const SITE_CATEGORIES_NAV = [
  ["nutrition", "Nutrition"],
  ["fitness", "Fitness"],
  ["mental-health", "Mental Health"],
  ["heart-health", "Heart Health"],
  ["diabetes", "Diabetes"],
  ["womens-health", "Women's Health"],
  ["mens-health", "Men's Health"],
  ["childrens-health", "Children's Health"],
  ["pregnancy", "Pregnancy"],
  ["skin-care", "Skin Care"],
  ["healthy-living", "Healthy Living"],
  ["diseases", "Diseases"],
  ["medicines", "Medicines"],
  ["medical-research", "Medical Research"],
  ["public-health", "Public Health"]
];

function renderHeader(activePage) {
  const mount = document.getElementById("site-header-mount");
  if (!mount) return;

  const navLinks = SITE_CATEGORIES_NAV.map(([slug, name]) =>
    `<li><a href="category.html?cat=${slug}" data-cat="${slug}">${name}</a></li>`
  ).join("");

  mount.innerHTML = `
  <div class="reading-progress" id="reading-progress"></div>
  <header class="site-header">
    <div class="header-top">
      <button class="icon-btn menu-toggle" id="menu-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="site-nav">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
      </button>
      <a class="logo" href="index.html">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h4l2 6 4-14 2 8h6"/></svg>
        <span>VitalNote<span class="tag">Health &amp; Medicine</span></span>
      </a>
      <div class="header-actions">
        <div class="search-wrap">
          <button class="icon-btn" id="search-toggle" aria-label="Open search" aria-expanded="false" aria-controls="search-panel">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
          </button>
          <div class="search-panel" id="search-panel" role="dialog" aria-label="Site search">
            <label for="search-input" class="visually-hidden">Search articles</label>
            <input type="search" id="search-input" placeholder="Search articles, topics, symptoms…" autocomplete="off">
            <ul class="search-results" id="search-results"></ul>
          </div>
        </div>
        <button class="icon-btn" id="theme-toggle-header" aria-label="Toggle dark mode">
          <svg id="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
        </button>
      </div>
    </div>
    <nav class="site-nav" id="site-nav" aria-label="Category navigation">
      <div class="container">
        <ul class="nav-list">
          <li><a href="index.html" data-cat="home">Home</a></li>
          ${navLinks}
        </ul>
      </div>
    </nav>
  </header>
  <div class="nav-scrim" id="nav-scrim"></div>
  `;

  if (activePage) {
    const link = mount.querySelector(`[data-cat="${activePage}"]`);
    if (link) link.setAttribute("aria-current", "page");
  }
}

function renderFooter() {
  const mount = document.getElementById("site-footer-mount");
  if (!mount) return;

  const catCols = SITE_CATEGORIES_NAV.slice(0, 7).map(([slug, name]) =>
    `<li><a href="category.html?cat=${slug}">${name}</a></li>`
  ).join("");

  mount.innerHTML = `
  <footer class="site-footer">
    <div class="container footer-top">
      <div class="footer-brand">
        <a class="logo" href="index.html">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h4l2 6 4-14 2 8h6"/></svg>
          <span>VitalNote</span>
        </a>
        <p>Clear, evidence-informed health journalism. VitalNote explains the research behind everyday health decisions, without the hype.</p>
        <div class="footer-social">
          <a href="#" aria-label="VitalNote on X"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 2H22l-7.6 8.7L23 22h-6.9l-5.4-6.6L4.4 22H1.2l8.1-9.3L1 2h7.1l4.9 6.1L18.9 2Zm-1.2 18h1.9L7.4 4H5.4l12.3 16Z"/></svg></a>
          <a href="#" aria-label="VitalNote on Facebook"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 21v-8h2.7l.4-3.1h-3.1V8c0-.9.3-1.5 1.6-1.5h1.6V3.7C15.9 3.6 15 3.5 14 3.5c-2.6 0-4.3 1.6-4.3 4.4v2h-2.7v3.1h2.7v8h3.8Z"/></svg></a>
          <a href="#" aria-label="VitalNote on Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg></a>
        </div>
      </div>
      <div class="footer-col">
        <h5>Categories</h5>
        <ul>${catCols}</ul>
      </div>
      <div class="footer-col">
        <h5>Company</h5>
        <ul>
          <li><a href="about.html">About Us</a></li>
          <li><a href="contact.html">Contact</a></li>
          <li><a href="about.html#authors">Our Authors</a></li>
          <li><a href="search.html">Search</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h5>Legal</h5>
        <ul>
          <li><a href="privacy.html">Privacy Policy</a></li>
          <li><a href="terms.html">Terms and Conditions</a></li>
          <li><a href="disclaimer.html">Medical Disclaimer</a></li>
        </ul>
      </div>
    </div>
    <div class="ad-slot footer-banner container" style="margin-bottom:16px;">Footer banner ad placeholder — 728×90</div>
    <div class="container footer-bottom">
      <span>© <span id="footer-year"></span> VitalNote. All rights reserved. For informational purposes only — see our <a href="disclaimer.html" style="text-decoration:underline;">medical disclaimer</a>.</span>
      <button class="theme-toggle" id="theme-toggle-footer">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
        <span id="theme-toggle-label">Dark mode</span>
      </button>
    </div>
  </footer>
  <button class="back-to-top" id="back-to-top" aria-label="Back to top">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
  </button>
  `;

  const yearEl = document.getElementById("footer-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}
