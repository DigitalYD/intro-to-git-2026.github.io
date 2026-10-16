/* ==========================================================================
   Section type "skills": each group is drawn as a chip in a DIP package,
   with one skill on each pin. Pins alternate sides: the first half of
   the list goes down the left, the rest down the right.
   Fields: groups: [{ name, skills: [...] }]   (or just skills: [...])
   ========================================================================== */
(function () {
  "use strict";

  const { esc } = window.Portfolio.util;

  // U1 is the chip in the hybrid style's drawing, so these start at U2.
  let nextChip = 2;

  window.Portfolio.sections.skills = function (section) {
    const groups = Array.isArray(section.groups)
      ? section.groups
      : Array.isArray(section.skills) ? [{ name: section.title, skills: section.skills }] : [];
    if (section.firstChip) nextChip = Number(section.firstChip) || nextChip;
    return `<div class="chips">${groups.map((group) => chip(group || {}, nextChip++)).join("")}</div>`;
  };

  function chip(group, number) {
    const skills = (group.skills || []).filter(Boolean);
    const half = Math.ceil(skills.length / 2);
    const id = `chip-u${number}`;
    const side = (list, where) =>
      `<ul class="dip__pins dip__pins--${where}">${list.map((name) => `<li class="dip__pin"><span>${esc(name)}</span></li>`).join("")}</ul>`;

    return `<figure class="dip" style="--rows:${Math.max(half, 1)}" aria-labelledby="${id}">
      ${side(skills.slice(0, half), "left")}
      <div class="dip__body">
        <span class="dip__des" aria-hidden="true">U${number}</span>
        <span class="dip__val" id="${id}">${esc(group.name || "Skills")}</span>
      </div>
      ${side(skills.slice(half), "right")}
    </figure>`;
  }
})();
