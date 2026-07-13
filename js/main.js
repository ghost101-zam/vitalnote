/* ============================================================
   main.js — site-wide behavior, loaded on every page.
   Bootstraps header/footer, theme, nav, search, and then calls
   window.pageInit(SiteData) if the page defines one (each HTML
   page's inline script sets this to render its own content).
   ============================================================ */

const Motion = (() => {
  let observer;
  function init() {
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
    }
  }
  function observe(nodeList) {
    if (!nodeList) return;
    nodeList.forEach(el => {
      if (observer) observer.observe(el);
      else el.classList.add("in-view");
    });
  }
  return { init, observe };
})();

/* ---------- Theme ---------- */
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  document.querySelectorAll("#theme-toggle-label").forEach(el => {
    el.textContent = theme === "dark" ? "Light mode" : "Dark mode";
  });
  try { localStorage.setItem("vitalnote-theme", theme); } catch (e) { /* ignore */ }
}

function initTheme() {
  let saved = "light";
  try { saved = localStorage.getItem("vitalnote-theme") || "light"; } catch (e) { /* ignore */ }
  if (saved === "auto" || !saved) {
    saved = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  applyTheme(saved);

  function toggle() {
    const current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    applyTheme(current === "dark" ? "light" : "dark");
  }
  document.addEventListener("click", (e) => {
    if (e.target.closest("#theme-toggle-header") || e.target.closest("#theme-toggle-footer")) {
      toggle();
    }
  });
}

/* ---------- Mobile nav ---------- */
function initMobileNav() {
  document.addEventListener("click", (e) => {
    const toggle = e.target.closest("#menu-toggle");
    const scrim = e.target.closest("#nav-scrim");
    const nav = document.getElementById("site-nav");
    if (!nav) return;
    if (toggle) {
      const open = nav.classList.toggle("open");
      document.getElementById("nav-scrim")?.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
    } else if (scrim) {
      nav.classList.remove("open");
      scrim.classList.remove("open");
      document.getElementById("menu-toggle")?.setAttribute("aria-expanded", "false");
    }
  });
}

/* ---------- Search ---------- */
function initSearch() {
  document.addEventListener("click", (e) => {
    const toggle = e.target.closest("#search-toggle");
    const panel = document.getElementById("search-panel");
    if (!panel) return;
    if (toggle) {
      const open = panel.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      if (open) setTimeout(() => document.getElementById("search-input")?.focus(), 50);
    } else if (!e.target.closest("#search-panel")) {
      panel.classList.remove("open");
      document.getElementById("search-toggle")?.setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("input", (e) => {
    if (e.target.id !== "search-input") return;
    const results = document.getElementById("search-results");
    if (!results) return;
    const q = e.target.value;
    if (!q.trim()) { results.innerHTML = ""; return; }
    const matches = SiteData.search(q).slice(0, 6);
    if (!matches.length) {
      results.innerHTML = `<li class="search-empty">No articles match "${Render.escapeAttr(q)}".</li>`;
      return;
    }
    results.innerHTML = matches.map(a => `
      <li><a href="article.html?slug=${a.slug}">
        <span class="sr-cat">${SiteData.categoryName(a.category)}</span>
        <span>${a.title}</span>
      </a></li>`).join("");
  });

  document.addEventListener("keydown", (e) => {
    if (e.target.id === "search-input" && e.key === "Enter") {
      window.location.href = "search.html?q=" + encodeURIComponent(e.target.value);
    }
    if (e.key === "Escape") {
      document.getElementById("search-panel")?.classList.remove("open");
    }
  });
}

/* ---------- Reading progress + back to top ---------- */
function initScrollUI() {
  const progress = document.getElementById("reading-progress");
  const backToTop = document.getElementById("back-to-top");
  function onScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progress) progress.style.width = pct + "%";
    if (backToTop) backToTop.classList.toggle("visible", scrollTop > 600);
  }
  document.addEventListener("scroll", onScroll, { passive: true });
  document.addEventListener("click", (e) => {
    if (e.target.closest("#back-to-top")) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });
  onScroll();
}

/* ---------- Newsletter (frontend only) ---------- */
function initNewsletter() {
  document.addEventListener("submit", (e) => {
    if (!e.target.matches(".newsletter-form, .comment-form")) return;
    e.preventDefault();
    if (e.target.classList.contains("newsletter-form")) {
      const status = e.target.parentElement.querySelector(".form-status") || e.target.querySelector(".form-status");
      const input = e.target.querySelector("input[type=email]");
      if (status) {
        status.textContent = "Thanks — check your inbox to confirm your subscription.";
        status.classList.add("success");
      }
      if (input) input.value = "";
    }
    if (e.target.classList.contains("comment-form")) {
      const nameInput = e.target.querySelector("input[type=text]");
      const textarea = e.target.querySelector("textarea");
      const list = document.getElementById("comment-list");
      if (list && textarea && textarea.value.trim()) {
        const name = (nameInput && nameInput.value.trim()) || "Anonymous";
        const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
        const item = document.createElement("div");
        item.className = "comment-item";
        item.innerHTML = `
          <div class="avatar">${initials}</div>
          <div>
            <span class="c-name">${Render.escapeAttr(name)}</span>
            <span class="c-date">just now</span>
            <p>${Render.escapeAttr(textarea.value.trim())}</p>
          </div>`;
        list.prepend(item);
        textarea.value = "";
        if (nameInput) nameInput.value = "";
      }
    }
  });
}

/* ---------- Bootstrap ---------- */
document.addEventListener("DOMContentLoaded", () => {
  Motion.init();
  initTheme();
  initMobileNav();
  initSearch();
  initScrollUI();
  initNewsletter();

  SiteData.load().then(() => {
    if (typeof window.pageInit === "function") {
      window.pageInit(SiteData);
    }
    document.querySelectorAll(".reveal").forEach(el => Motion.observe([el]));
  }).catch(err => {
    console.error(err);
    const main = document.querySelector("main");
    if (main) {
      const notice = document.createElement("div");
      notice.className = "container";
      notice.style.padding = "40px 24px";
      notice.style.color = "var(--muted)";
      notice.textContent = "Articles couldn't be loaded. If you're viewing this file directly, run it through a local server (see README.md) rather than opening the HTML file straight from disk.";
      main.prepend(notice);
    }
  });
});
