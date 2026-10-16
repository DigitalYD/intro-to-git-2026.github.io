/* ==========================================================================
   Section type "about": a photo, your story, and a few quick facts.
   Fields: photo, photoAlt, text, facts: [["Label", "Value"], ...]
   ========================================================================== */
(function () {
  "use strict";

  const { esc, md, img } = window.Portfolio.util;

  window.Portfolio.sections.about = function (section) {
    const photo = section.photo
      ? `<figure class="about__photo frame">${img({ src: section.photo, alt: section.photoAlt || "", tint: true })}</figure>`
      : "";
    const facts = (section.facts || []).map(toPair).filter(Boolean);
    const table = facts.length
      ? `<dl class="spec">${facts.map(([label, value]) =>
          `<div class="spec__row"><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`).join("")}</dl>`
      : "";

    return `<div class="about${photo ? "" : " about--text-only"}">
      ${photo}
      <div class="about__body">
        ${section.text ? `<div class="prose">${md(section.text)}</div>` : ""}
        ${table}
      </div>
    </div>`;
  };

  // Accepts ["Label", "Value"] or { label: "Label", value: "Value" }.
  function toPair(fact) {
    if (Array.isArray(fact)) return [fact[0], fact[1]];
    if (fact && typeof fact === "object") return [fact.label, fact.value];
    return null;
  }
})();
