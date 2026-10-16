/* ==========================================================================
   Section type "timeline": experience, education, leadership, and so on,
   drawn as a drawing's revision table. List the newest first; revision
   letters are filled in for you, oldest = A.
   Item fields: date, title, org, url (makes org a link), text, rev, hidden
   ========================================================================== */
(function () {
  "use strict";

  const { esc, md, safeUrl, linkAttrs, revLetter } = window.Portfolio.util;

  window.Portfolio.sections.timeline = function (section) {
    const items = (section.items || []).filter((item) => item && !item.hidden);
    const rows = items.map((item, i) => row(item, revLetter(items.length - 1 - i), i === 0));
    return `<ol class="revs">${rows.join("")}</ol>`;
  };

  function row(item, letter, latest) {
    const org = item.org
      ? (item.url ? `<a href="${esc(safeUrl(item.url))}"${linkAttrs(item.url)}>${esc(item.org)}</a>` : esc(item.org))
      : "";
    return `<li class="rev${latest ? " rev--latest" : ""}">
      <span class="rev__mark" aria-hidden="true">
        <svg viewBox="0 0 34 30"><path d="M17 2.5 31.5 27.5H2.5Z"/><text x="17" y="23" text-anchor="middle">${esc(item.rev || letter)}</text></svg>
      </span>
      <p class="rev__date">${esc(item.date || "")}</p>
      <div class="rev__main">
        <h3 class="rev__title">${esc(item.title || "")}</h3>
        ${org ? `<p class="rev__org">${org}</p>` : ""}
        ${item.text ? `<div class="prose rev__text">${md(item.text)}</div>` : ""}
      </div>
    </li>`;
  }
})();
