/* ==========================================================================
   Section type "text": a heading and some writing. Good for things like
   "Research interests" or "What I'm working on now".
   Fields: text
   ========================================================================== */
(function () {
  "use strict";

  const { md } = window.Portfolio.util;

  window.Portfolio.sections.text = function (section) {
    return `<div class="prose">${md(section.text)}</div>`;
  };
})();
