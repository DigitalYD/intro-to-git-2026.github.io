/* ==========================================================================
   js/modes/modes.js: swaps between the normal page and the styles that are
   whole pages of their own.

   Most styles only change colors. Two styles also change how the page
   works: MCU (js/modes/mcu.js) and Couriers (js/modes/couriers.js). Each
   one builds its own page from content/site.js and content/projects.js,
   using the same section renderers as the normal page. This file starts
   the right one when the switch picks it, and brings the normal page back
   when the switch picks any other style.

   Load this file after the mode scripts. You don't need to edit it to add
   or remove styles.
   ========================================================================== */
(function () {
  "use strict";

  const P = window.Portfolio;
  const { esc, errorBox } = P.util;
  const root = document.documentElement;
  const app = document.getElementById("app");
  P.modes = P.modes || {};

  // ---- Helpers the modes share -----------------------------------------------
  P.modeKit = {
    // Every section that isn't hidden
    sections(site) {
      return (Array.isArray(site.sections) ? site.sections : []).filter((section) => section && !section.hidden);
    },

    // A section's content, built by the same renderer the normal page uses.
    // `chips` comes from skillChips() below.
    body(section, site, chips) {
      const render = P.sections[section.type];
      if (typeof render !== "function") {
        return errorBox(`There's no section type called "${section.type}".`,
          `Use one of these: <code>${Object.keys(P.sections).join("</code>, <code>")}</code>.`);
      }
      const data = chips && chips.has(section) && !section.firstChip ? Object.assign({}, section, { firstChip: chips.get(section) }) : section;
      try {
        return render(data, site);
      } catch (error) {
        console.error(error);
        return errorBox(`The "${section.title || section.id}" section couldn't be built.`,
          `Check this section in content/site.js. The browser says: <code>${esc(error.message)}</code>`);
      }
    },

    // Skill chips are numbered U2, U3, and so on down the normal page. The
    // copies a mode draws get fixed numbers of their own, starting at `first`
    // or after the normal page's, so they never repeat those numbers and don't
    // change each time a datasheet or page is drawn.
    skillChips(site, first) {
      const skills = this.sections(site).filter((section) => section.type === "skills");
      const count = (section) => (Array.isArray(section.groups) ? section.groups.length : Array.isArray(section.skills) ? 1 : 0);
      let next = Math.max(Number(first) || 0, 2 + skills.reduce((total, section) => total + count(section), 0));
      const chips = new Map();
      skills.forEach((section) => { chips.set(section, next); next += count(section); });
      return chips;
    },

    // The projects a projects section shows, by the same rules as its cards
    projects(section) {
      let list = (Array.isArray(window.PROJECTS) ? window.PROJECTS : []).filter((project) => project && !project.hidden);
      if (section && Array.isArray(section.show)) {
        list = section.show.map((id) => list.find((project) => project.id === id)).filter(Boolean);
      }
      if (section && section.limit) list = list.slice(0, Number(section.limit));
      return list;
    },

    // For a link like "#projects" or "index.html#projects", the section id.
    // Links to other pages and other sites give "".
    hashTarget(link) {
      const href = link.getAttribute("href") || "";
      const at = href.indexOf("#");
      if (at === -1) return "";
      const page = href.slice(0, at);
      if (page && !/(^|\/)index\.html$/i.test(page)) return "";
      return decodeURIComponent(href.slice(at + 1));
    },

    reduceMotion() {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    },
  };

  // ---- Switching -------------------------------------------------------------
  let active = null;

  function apply(name) {
    const next = P.modes[name] || null;
    if (next === active) return;
    const fromSwitch = document.activeElement && document.activeElement.closest && document.activeElement.closest(".switch");

    if (active) {
      try { active.stop(); } catch (error) { console.error(error); }
      active = null;
    }
    root.classList.remove("has-mode");
    app.hidden = false;

    if (next && window.SITE) {
      try {
        app.hidden = true;
        root.classList.add("has-mode");
        next.start(window.SITE);
        active = next;
      } catch (error) {
        // If a mode breaks, the normal page still works in that style's colors
        console.error(error);
        try { next.stop(); } catch (ignore) { /* nothing left to clean up */ }
        root.classList.remove("has-mode");
        app.hidden = false;
      }
    }

    // The normal page's skip link points into the normal page, so it rests
    // while a mode is on (the Couriers page has its own)
    const skip = document.querySelector("body > .skip-link");
    if (skip) skip.hidden = Boolean(active);

    if (!active) {
      // Back on the normal page: go to the section in the address, if any
      const id = decodeURIComponent(location.hash.slice(1));
      const target = id && document.getElementById(id);
      if (target && app.contains(target)) target.scrollIntoView();
    }

    // Keyboard users who flipped the switch keep their place on the new switch
    if (fromSwitch) {
      const visible = Array.from(document.querySelectorAll(".switch input:checked")).find((input) => input.offsetParent !== null);
      if (visible) visible.focus({ preventScroll: true });
    }
  }

  document.addEventListener("portfolio:theme", (event) => apply(event.detail.theme));
  if (P.theme) apply(P.theme.current());
})();
