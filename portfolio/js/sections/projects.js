/* ==========================================================================
   Section type "projects": cards built from content/projects.js.
   Optional section fields:
     show   ["project-id", ...]   only these projects, in this order
     limit  3                     at most this many cards
   ========================================================================== */
(function () {
  "use strict";

  const P = window.Portfolio;
  const { esc, safeUrl, linkAttrs, img, errorBox, problemWith } = P.util;

  P.sections.projects = function (section) {
    if (!Array.isArray(window.PROJECTS)) {
      const problem = problemWith("content/projects.js");
      const where = problem && problem.line ? `Look near line ${problem.line}.` : "Open the browser console (F12) to see where.";
      return errorBox("Your projects couldn't be loaded.", `<code>content/projects.js</code> is missing or has a typo. ${where}`);
    }

    let projects = window.PROJECTS.filter((project) => project && !project.hidden);
    if (Array.isArray(section.show)) {
      projects = section.show.map((id) => projects.find((project) => project.id === id)).filter(Boolean);
    }
    if (section.limit) projects = projects.slice(0, Number(section.limit));

    if (!projects.length) {
      return `<p class="empty">No projects yet. Add your first one in <code>content/projects.js</code>.</p>`;
    }
    return `<div class="sheets">${projects.map(card).join("")}</div>`;
  };

  function card(project) {
    const hasPage = Boolean(project.details);
    const href = `project.html?id=${encodeURIComponent(project.id || "")}`;
    const title = hasPage
      ? `<a class="sheet__link" href="${esc(href)}">${esc(project.title)}</a>`
      : esc(project.title);

    const figure = project.image
      ? img({ src: project.image, alt: project.imageAlt || "", tint: true })
      : `<span class="void" role="img" aria-label="No image yet"></span>`;

    const tags = (project.tags || []).length
      ? `<ul class="tags" aria-label="Tools">${project.tags.map((tag) => `<li>${esc(tag)}</li>`).join("")}</ul>`
      : "";

    const meta = [["Date", project.date], ["Role", project.role]].filter(([, value]) => value);
    const block = meta.length
      ? `<dl class="sheet__block">${meta.map(([label, value]) => `<div><dt>${label}</dt><dd>${esc(value)}</dd></div>`).join("")}</dl>`
      : "";

    const links = (project.links || []).filter((item) => item && item.url).map(link).join("");
    const more = hasPage ? `<span class="sheet__more" aria-hidden="true">View project</span>` : "";

    return `<article class="sheet${hasPage ? " sheet--linked" : ""}">
      <div class="sheet__figure${project.imageFit === "contain" ? " sheet__figure--contain" : ""}">${figure}</div>
      <div class="sheet__body">
        <h3 class="sheet__title">${title}</h3>
        ${project.summary ? `<p class="sheet__summary">${esc(project.summary)}</p>` : ""}
        ${tags}
      </div>
      ${links || more ? `<p class="sheet__links">${links}${more}</p>` : ""}
      ${block}
    </article>`;
  }

  function link(item) {
    const url = safeUrl(item.url);
    return `<a href="${esc(url)}"${linkAttrs(url)}>${esc(item.label || url)}</a>`;
  }
})();
