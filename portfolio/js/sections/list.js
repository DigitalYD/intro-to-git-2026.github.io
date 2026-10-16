/* ==========================================================================
   Section type "list": a simple list for awards, coursework,
   publications, clubs, certifications...
   Item fields: title, subtitle, date, text, url, hidden
   ========================================================================== */
(function () {
  "use strict";

  const { esc, md, safeUrl, linkAttrs } = window.Portfolio.util;

  window.Portfolio.sections.list = function (section) {
    const items = (section.items || []).filter((entry) => entry && !entry.hidden);
    return `<ul class="items">${items.map(item).join("")}</ul>`;
  };

  function item(entry) {
    const title = entry.url
      ? `<a href="${esc(safeUrl(entry.url))}"${linkAttrs(entry.url)}>${esc(entry.title || entry.url)}</a>`
      : esc(entry.title || "");
    return `<li class="item">
      <div class="item__main">
        <h3 class="item__title">${title}</h3>
        ${entry.subtitle ? `<p class="item__sub">${esc(entry.subtitle)}</p>` : ""}
        ${entry.text ? `<div class="prose item__text">${md(entry.text)}</div>` : ""}
      </div>
      ${entry.date ? `<p class="item__date">${esc(entry.date)}</p>` : ""}
    </li>`;
  }
})();
