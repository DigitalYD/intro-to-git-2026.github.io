/* ==========================================================================
   Section type "contact": your links, drawn as a connector with one pin
   per link. Uses SITE.links unless the section has its own `links`.
   Fields: text, links: [{ label, text, url }]
   ========================================================================== */
(function () {
  "use strict";

  const { esc, md, safeUrl, linkAttrs } = window.Portfolio.util;

  window.Portfolio.sections.contact = function (section, site) {
    const links = (section.links || site.links || []).filter((link) => link && link.url);
    // J1 is on the board drawing at the top of the page, so this is J2.
    const connector = links.length
      ? `<figure class="connector">
          <figcaption class="connector__ref">J2</figcaption>
          <ul class="connector__pins">${links.map((link, i) => pin(link, i + 1)).join("")}</ul>
        </figure>`
      : "";

    return `<div class="contact">
      ${section.text ? `<div class="prose">${md(section.text)}</div>` : ""}
      ${connector}
    </div>`;
  };

  function pin(link, number) {
    const url = safeUrl(link.url);
    const shown = link.text || url.replace(/^mailto:|^https?:\/\/(www\.)?/i, "");
    return `<li><a class="pin-link" href="${esc(url)}"${linkAttrs(url)}>
      <span class="pin-link__num" aria-hidden="true">${number}</span>
      <span class="pin-link__leg" aria-hidden="true"></span>
      <span class="pin-link__label">${esc(link.label || "")}</span>
      <span class="pin-link__value">${esc(shown)}</span>
    </a></li>`;
  }
})();
