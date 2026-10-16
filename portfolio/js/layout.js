/* ==========================================================================
   js/layout.js: the parts every page shares: page setup, the header with
   its menu and style switch, the title block at the bottom, and the
   full-page error message.
   ========================================================================== */
(function () {
  "use strict";

  const P = window.Portfolio;
  const { esc, safeUrl, linkAttrs, initials, slug, errorBox, problemWith } = P.util;

  // Sets the browser tab title, the page description, and a favicon
  // drawn from your initials in the site's colors.
  function setup(site, pageTitle) {
    document.title = pageTitle || `${site.name} | Portfolio`;
    const description = document.querySelector('meta[name="description"]');
    if (description && site.intro) description.setAttribute("content", String(site.intro));
    setFavicon(initials(site.name));
  }

  function setFavicon(letters) {
    const css = getComputedStyle(document.documentElement);
    const color = (name, fallback) => css.getPropertyValue(name).trim() || fallback;
    const ink = color("--ink", "#eaf2ff");
    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">` +
      `<rect width="64" height="64" rx="12" fill="${color("--paper", "#143f72")}"/>` +
      `<path d="M7 22h8M7 32h8M7 42h8M49 22h8M49 32h8M49 42h8" stroke="${color("--copper", "#d9ad5c")}" stroke-width="4"/>` +
      `<rect x="15" y="13" width="34" height="38" fill="none" stroke="${ink}" stroke-width="3"/>` +
      `<text x="32" y="38" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="15" fill="${ink}">${esc(letters)}</text>` +
      `</svg>`;
    let link = document.querySelector('link[rel="icon"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.type = "image/svg+xml";
    link.href = "data:image/svg+xml," + encodeURIComponent(svg);
  }

  // A section's web address: its `id`, or one made from its title.
  function sectionId(section) {
    return section.id || slug(section.title || section.type);
  }

  // The top bar: your name and a menu with one link per section.
  // `base` is "" on the home page and "index.html" on project pages.
  function header(site, options) {
    const base = options.base || "";
    const items = (options.sections || [])
      .filter((section) => section.nav !== false)
      .map((section) =>
        `<li><a href="${base}#${esc(sectionId(section))}">${esc(section.navLabel || section.title || section.type)}</a></li>`)
      .join("");
    return `<header class="site-header" id="top">
      <div class="wrap site-header__inner">
        <a class="brand" href="${base || "#top"}">
          <span class="brand__mark" aria-hidden="true">${esc(initials(site.name))}</span>
          <span class="brand__name">${esc(site.name)}</span>
        </a>
        <div class="site-header__end">
          ${items ? `<nav aria-label="Sections"><ul class="nav">${items}</ul></nav>` : ""}
          ${themeSwitch()}
        </div>
      </div>
    </header>`;
  }

  // The style switch, SW1: one position per style in SITE.themes.
  // It's left out when there's only one style or SITE.themeSwitcher is false.
  function themeSwitch() {
    const theme = P.theme;
    if (!theme || !theme.canSwitch) return "";
    const current = theme.current();
    const options = theme.list
      .map((name) =>
        `<label class="switch__option${name === current ? " is-active" : ""}">` +
        `<input type="radio" name="page-style" value="${esc(name)}"${name === current ? " checked" : ""}>` +
        `<span>${esc(theme.label(name))}</span></label>`)
      .join("");
    return `<div class="switch-wrap">
      <span class="switch__ref" aria-hidden="true">SW1</span>
      <fieldset class="switch" style="--count:${theme.list.length};--index:${Math.max(0, theme.list.indexOf(current))}">
        <legend class="sr-only">Page style</legend>
        <span class="switch__thumb" aria-hidden="true"></span>
        ${options}
      </fieldset>
    </div>`;
  }

  // The home page is sheet 1. Each project with its own page adds a sheet.
  function totalSheets() {
    const projects = Array.isArray(window.PROJECTS) ? window.PROJECTS : [];
    return 1 + projects.filter((project) => project && !project.hidden && project.details).length;
  }

  // The title block: the box in the corner of every engineering drawing.
  function footer(site, options) {
    const sheet = options && options.sheet != null ? options.sheet : 1;
    const repo = site.repo ? safeUrl(site.repo) : "";
    const source = repo
      ? `<div class="tb tb--src"><span class="tb__k">Source</span>` +
        `<a class="tb__v" href="${esc(repo)}"${linkAttrs(repo)}>${esc(repo.replace(/^https?:\/\/(www\.)?/, ""))}</a></div>`
      : "";
    return `<footer class="site-footer">
      <div class="wrap">
        <div class="title-block">
          <div class="tb tb--title"><span class="tb__k">Title</span><span class="tb__v">${esc(site.name)}, portfolio</span></div>
          <div class="tb"><span class="tb__k">Rev</span><span class="tb__v">${esc(site.revision || "A")}</span></div>
          <div class="tb"><span class="tb__k">Drawn by</span><span class="tb__v">${esc(site.name)}</span></div>
          <div class="tb"><span class="tb__k">Date</span><span class="tb__v">${esc(site.updated || "")}</span></div>
          <div class="tb"><span class="tb__k">Sheet</span><span class="tb__v">${typeof sheet === "number" ? `${sheet} of ${totalSheets()}` : esc(String(sheet))}</span></div>
          ${source}
        </div>
      </div>
    </footer>`;
  }

  // Shown instead of the page when a content file is broken or missing.
  function fatal(file) {
    const problem = problemWith(file);
    let title;
    let detail;
    if (problem && problem.missing) {
      title = `${file} couldn't be found.`;
      detail = "Check that the file exists and that its name matches exactly, including capital letters.";
    } else {
      const where = problem && problem.line ? ` on line ${problem.line}` : "";
      title = `${file} has a typo${where}, so the page can't be built.`;
      detail =
        "Most often it's a missing comma at the end of the line above, or a quote that was opened and never closed." +
        (problem && problem.message ? ` The browser says: <code>${esc(problem.message)}</code>.` : "") +
        " To see the exact spot, open the browser console: press F12, then choose Console.";
    }
    return `<main id="main" class="wrap fatal">${errorBox(title, detail)}</main>`;
  }

  // Runs after the page is built.
  function enhance() {
    // The page is built after the browser tries to jump to #section,
    // so jump again now that the section exists.
    if (location.hash.length > 1) {
      const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (target) {
        const root = document.documentElement;
        const before = root.style.scrollBehavior;
        root.style.scrollBehavior = "auto";
        target.scrollIntoView();
        root.style.scrollBehavior = before;
      }
    }
    highlightMenu();
    wireSwitch();
    if (P.theme) P.theme.sync();
  }

  // Flipping the switch changes the style, slides the thumb over,
  // and recolors the favicon to match.
  function wireSwitch() {
    document.querySelectorAll(".switch input").forEach((input) => {
      input.addEventListener("change", () => {
        if (input.checked) P.theme.set(input.value, true);
      });
    });
    document.addEventListener("portfolio:theme", (event) => {
      showSwitch(event.detail.theme);
      if (window.SITE) setFavicon(initials(window.SITE.name));
    });
  }

  function showSwitch(name) {
    document.querySelectorAll(".switch").forEach((fieldset) => {
      const inputs = Array.from(fieldset.querySelectorAll("input"));
      const index = inputs.findIndex((input) => input.value === name);
      fieldset.style.setProperty("--index", String(Math.max(0, index)));
      inputs.forEach((input) => {
        input.checked = input.value === name;
        input.parentElement.classList.toggle("is-active", input.checked);
      });
    });
  }

  // Underlines the menu link for the section you're reading.
  function highlightMenu() {
    const links = Array.from(document.querySelectorAll('.nav a[href^="#"]'));
    if (!links.length || !("IntersectionObserver" in window)) return;
    const byId = new Map(links.map((link) => [decodeURIComponent(link.getAttribute("href").slice(1)), link]));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => link.removeAttribute("aria-current"));
        byId.get(entry.target.id).setAttribute("aria-current", "true");
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    byId.forEach((link, id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
  }

  P.layout = { setup, header, footer, fatal, enhance, sectionId, totalSheets };
})();
