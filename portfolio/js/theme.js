/* ==========================================================================
   js/theme.js: picks the page style before anything is drawn.
   Loaded in <head>, right after content/site.js.

   - Offers the styles listed in `themes` in content/site.js, as long as
     their stylesheet (css/themes/<name>.css) is linked in the page.
   - Remembers the style a visitor picks with the switch, on every page.
   - Shows elements marked data-for-theme="name" only in that style.
   You don't need to edit this file to add or remove styles.
   ========================================================================== */
(function () {
  "use strict";

  const STORAGE_KEY = "portfolio-style";
  const LABELS = { circuit: "Circuit", hybrid: "Hybrid", blueprint: "Blueprint" };
  const site = window.SITE || {};
  const root = document.documentElement;

  // The styles whose stylesheets are linked in this page's <head>
  const linked = Array.from(document.querySelectorAll("link[data-style]"))
    .map((link) => link.getAttribute("data-style"));

  // The styles to offer: the `themes` list, minus any that aren't linked
  const wanted = Array.isArray(site.themes) && site.themes.length ? site.themes.map(String) : linked;
  const list = wanted.filter((name) => {
    if (linked.indexOf(name) !== -1) return true;
    console.warn(`[portfolio] "${name}" is in themes in content/site.js, but css/themes/${name}.css isn't linked in this page, so it was skipped.`);
    return false;
  });
  if (!list.length && linked.length) list.push(linked[0]);

  const fallback = list.indexOf(site.theme) !== -1 ? site.theme : list[0];
  const canSwitch = site.themeSwitcher !== false && list.length > 1;

  // A visitor's earlier pick, unless you've changed the default since then
  function saved() {
    if (!canSwitch) return null;
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (data && data.fallback === fallback && list.indexOf(data.theme) !== -1) return data.theme;
    } catch (error) {
      // Some browsers block storage for local files. The default still works.
    }
    return null;
  }

  function current() {
    return root.getAttribute("data-theme");
  }

  // Shows elements marked data-for-theme only while their style is on
  function sync() {
    const name = current();
    document.querySelectorAll("[data-for-theme]").forEach((el) => {
      el.hidden = el.getAttribute("data-for-theme") !== name;
    });
  }

  // Switches style. `remember` saves the choice for the visitor's next visit.
  function set(name, remember) {
    if (list.indexOf(name) === -1) return;
    root.setAttribute("data-theme", name);
    if (remember) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ theme: name, fallback: fallback }));
      } catch (error) {
        // Storage is off; the switch still works for this page.
      }
    }
    sync();
    document.dispatchEvent(new CustomEvent("portfolio:theme", { detail: { theme: name } }));
  }

  function label(name) {
    return LABELS[name] || name.charAt(0).toUpperCase() + name.slice(1);
  }

  root.setAttribute("data-theme", saved() || fallback || "");

  window.Portfolio = window.Portfolio || {};
  window.Portfolio.theme = { list, canSwitch, current, set, sync, label };
})();
