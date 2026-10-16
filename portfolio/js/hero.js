/* ==========================================================================
   js/hero.js: the top of the home page: your name, intro, status light,
   and buttons, plus one drawing per style from js/art/. Only the current
   style's drawing shows; switching styles shows (and redraws) another.
   ========================================================================== */
(function () {
  "use strict";

  const P = window.Portfolio;
  const { esc, md, safeUrl, linkAttrs, img } = P.util;
  P.art = P.art || {};

  P.hero = function (site) {
    const buttons = (site.buttons || []).filter((button) => button && button.label && button.url);
    const art = site.heroImage
      ? `<figure class="hero__photo">${img({ src: site.heroImage, alt: site.heroImageAlt || "", tint: true, eager: true })}</figure>`
      : drawings(site);

    const tagline = site.tagline
      ? `<p class="dim"><span class="dim__line" aria-hidden="true"></span>` +
        `<span class="dim__text">${esc(site.tagline)}</span>` +
        `<span class="dim__line" aria-hidden="true"></span></p>`
      : "";

    return `<section class="hero wrap" aria-labelledby="hero-name">
      <div class="hero__text">
        <div class="hero__measure">
          ${tagline}
          <h1 class="hero__name" id="hero-name">${esc(site.name)}</h1>
        </div>
        ${site.intro ? `<div class="hero__intro">${md(site.intro)}</div>` : ""}
        ${site.status ? `<p class="status"><span class="status__led" aria-hidden="true"></span>${esc(site.status)}</p>` : ""}
        ${buttons.length ? `<div class="pads">${buttons.map((button, i) => pad(button, i === 0)).join("")}</div>` : ""}
      </div>
      <div class="hero__art">${art}</div>
    </section>`;
  };

  // One drawing for each style that has one in js/art/
  function drawings(site) {
    const theme = P.theme || { list: [], current: () => "" };
    const animate = site.animateHero !== false;
    return theme.list
      .filter((name) => typeof P.art[name] === "function")
      .map((name) => `<div class="hero__drawing" data-for-theme="${esc(name)}"${name === theme.current() ? "" : " hidden"}>` +
        `${P.art[name](site, animate)}</div>`)
      .join("");
  }

  function pad(button, primary) {
    const url = safeUrl(button.url);
    return `<a class="pad${primary ? " pad--primary" : ""}" href="${esc(url)}"${linkAttrs(url)}>${esc(button.label)}</a>`;
  }
})();
