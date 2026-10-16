/* ==========================================================================
   js/main.js: builds the home page from content/site.js, in this order:
   header, hero, every section in SITE.sections, then the title block.
   ========================================================================== */
(function () {
  "use strict";

  const P = window.Portfolio;
  const { esc, errorBox } = P.util;
  const app = document.getElementById("app");

  if (!window.SITE) {
    app.innerHTML = P.layout.fatal("content/site.js");
    return;
  }

  const site = window.SITE;
  const sections = (Array.isArray(site.sections) ? site.sections : []).filter((section) => section && !section.hidden);
  warnAboutDuplicateIds(sections);
  P.layout.setup(site);

  app.innerHTML = `
    ${P.layout.header(site, { sections })}
    <main id="main">
      ${P.hero(site)}
      <div class="wrap">
        <div class="circuit">
          <p class="rail-cap rail-cap--top" aria-hidden="true"></p>
          ${sections.map((section) => renderSection(section, site)).join("")}
          <span class="rail-cap rail-cap--bottom" aria-hidden="true"><svg viewBox="0 0 28 18"><path d="M2 2H26M7 9H21M11.5 16H16.5"/></svg></span>
        </div>
      </div>
    </main>
    ${P.layout.footer(site, { sheet: 1 })}
  `;

  P.layout.enhance();

  // One section: a heading wired to the copper rail, then its content.
  // The content comes from the renderer in js/sections/ that matches `type`.
  function renderSection(section, site) {
    const id = P.layout.sectionId(section);
    const render = P.sections[section.type];
    let body;

    if (typeof render !== "function") {
      body = errorBox(
        `There's no section type called "${section.type}".`,
        `Use one of these: <code>${Object.keys(P.sections).join("</code>, <code>")}</code>. ` +
        `To make your own type, see "Make a new section type" in README.md.`
      );
    } else {
      try {
        body = render(section, site);
      } catch (error) {
        console.error(error);
        body = errorBox(
          `The "${section.title || id}" section couldn't be built.`,
          `Check this section in content/site.js. The browser says: <code>${esc(error.message)}</code>`
        );
      }
    }

    return `<section class="section section--${esc(section.type || "unknown")}" id="${esc(id)}" aria-labelledby="${esc(id)}-title">
      <div class="section-head">
        <h2 class="section-title" id="${esc(id)}-title">${esc(section.title || "")}</h2>
      </div>
      ${body}
    </section>`;
  }

  // Two sections with the same id would make menu links jump to the wrong place.
  function warnAboutDuplicateIds(list) {
    const seen = new Set();
    list.forEach((section) => {
      const id = P.layout.sectionId(section);
      if (seen.has(id)) console.warn(`[portfolio] Two sections use the id "${id}". Give each section its own id.`);
      seen.add(id);
    });
  }
})();
