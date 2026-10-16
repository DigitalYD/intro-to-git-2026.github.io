/* ==========================================================================
   js/project-page.js: builds project.html?id=... from content/projects.js.
   Shows the project's summary, details, links, gallery, and links to the
   previous and next projects that have pages of their own.
   ========================================================================== */
(function () {
  "use strict";

  const P = window.Portfolio;
  const { esc, md, img, safeUrl, linkAttrs, errorBox } = P.util;
  const app = document.getElementById("app");

  if (!window.SITE) {
    app.innerHTML = P.layout.fatal("content/site.js");
    return;
  }

  const site = window.SITE;
  const sections = (site.sections || []).filter((section) => section && !section.hidden);
  const header = P.layout.header(site, { sections, base: "index.html" });

  if (!Array.isArray(window.PROJECTS)) {
    P.layout.setup(site);
    app.innerHTML = header + P.layout.fatal("content/projects.js");
    return;
  }

  const id = new URLSearchParams(location.search).get("id") || "";
  const projects = window.PROJECTS.filter((project) => project && !project.hidden);
  const project = projects.find((item) => item.id === id);
  const withPages = projects.filter((item) => item.details);

  if (!project) {
    P.layout.setup(site, `Project not found | ${site.name}`);
    app.innerHTML = `${header}
      <main id="main" class="wrap project">
        ${errorBox(`There's no project with the id "${id}".`, `It may have been renamed or hidden. <a href="index.html#projects">See all projects</a>.`)}
      </main>
      ${P.layout.footer(site, { sheet: "–" })}`;
    P.layout.enhance();
    return;
  }

  P.layout.setup(site, `${project.title} | ${site.name}`);

  const index = withPages.indexOf(project);
  const previous = index > 0 ? withPages[index - 1] : null;
  const next = index >= 0 && index < withPages.length - 1 ? withPages[index + 1] : null;

  const meta = [
    ["Date", project.date],
    ["Role", project.role],
    ["Tools", (project.tags || []).join(", ")],
  ].filter(([, value]) => value);

  const links = (project.links || []).filter((item) => item && item.url);
  const gallery = (project.gallery || []).length ? P.sections.gallery({ images: project.gallery }) : "";

  app.innerHTML = `${header}
    <main id="main" class="wrap project">
      <p class="back"><a href="index.html#projects">All projects</a></p>

      <header class="project__head">
        <h1 class="project__title">${esc(project.title)}</h1>
        ${project.summary ? `<p class="project__summary">${esc(project.summary)}</p>` : ""}
        ${meta.length ? `<dl class="spec spec--strip">${meta.map(([label, value]) =>
          `<div class="spec__row"><dt>${label}</dt><dd>${esc(value)}</dd></div>`).join("")}</dl>` : ""}
        ${links.length ? `<div class="pads">${links.map((item, i) => pad(item, i === 0)).join("")}</div>` : ""}
      </header>

      ${project.image ? `<figure class="project__figure">${img({ src: project.image, alt: project.imageAlt || "", eager: true })}</figure>` : ""}
      ${project.details ? `<div class="prose project__body">${md(project.details, { heading: "h2" })}</div>` : ""}
      ${gallery ? `<section class="project__gallery" aria-label="Pictures">${gallery}</section>` : ""}

      ${previous || next ? `<nav class="pager" aria-label="More projects">
        ${previous ? pagerLink(previous, "Previous project", "prev") : ""}
        ${next ? pagerLink(next, "Next project", "next") : ""}
      </nav>` : ""}
    </main>
    ${P.layout.footer(site, { sheet: index >= 0 ? index + 2 : "–" })}`;

  P.layout.enhance();

  function pad(item, primary) {
    const url = safeUrl(item.url);
    return `<a class="pad${primary ? " pad--primary" : ""}" href="${esc(url)}"${linkAttrs(url)}>${esc(item.label || url)}</a>`;
  }

  function pagerLink(item, label, direction) {
    return `<a class="pager__link pager__link--${direction}" href="project.html?id=${encodeURIComponent(item.id)}">
      <span class="pager__label">${label}</span>
      <span class="pager__title">${esc(item.title)}</span>
    </a>`;
  }
})();
