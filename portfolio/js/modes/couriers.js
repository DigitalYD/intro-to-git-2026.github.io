/* ==========================================================================
   js/modes/couriers.js: the Couriers style.

   The page opens like a normal portfolio: your photo, your intro, and your
   about section. Pick a section and a courier brings it: a drone, an RC
   car, a robot, or a radio tower. The courier drops off the new page and
   carries the old one away, so visitors can go back and forth, including
   with the browser's back and forward buttons.

   Everything comes from content/site.js and content/projects.js. To pick
   who delivers a section, give it a `courier` in site.js:
     courier: "drone"   flies in and lowers the package onto the dock
     courier: "car"     drives in and tosses the package onto the dock
     courier: "robot"   rolls in carrying the package
     courier: "radio"   beams the package in with a radio signal
   More settings are in SITE.couriers in site.js.

   STYLE: Couriers. Its colors are in css/themes/couriers.css.
   ========================================================================== */
(function () {
  "use strict";

  const P = window.Portfolio;
  const { esc, md, img, safeUrl, linkAttrs, initials } = P.util;

  // ---- Who delivers what -------------------------------------------------------
  const NAMES = { drone: "Drone D1", car: "RC car C1", robot: "Robot B1", radio: "Radio RF1" };
  const BY_TYPE = { timeline: "drone", projects: "car", skills: "robot", gallery: "drone", list: "robot", text: "radio", contact: "radio" };

  // ---- Sizes: packages and couriers grow on big screens and shrink on phones -----
  const SIZE = {
    crate: { w: 104, h: 68 }, bigCrate: { w: 122, h: 80 }, phoneCrate: { w: 80, h: 52 },
    bigScale: 1.2, phoneScale: 0.72, bigWidth: 1200, phoneWidth: 700,
  };

  // ---- Drawings: the couriers, and the menu icons ----------------------------------
  //   w and h are each drawing's size on a laptop screen
  const ART = {
    drone: { w: 160, h: 72, svg:
      '<svg viewBox="0 0 160 72">' +
      '<ellipse class="d-prop" cx="26" cy="8" rx="24" ry="2.6"/><ellipse class="d-prop d-prop--2" cx="134" cy="8" rx="24" ry="2.6"/>' +
      '<rect class="d-motor" x="21" y="9" width="10" height="12" rx="2"/><rect class="d-motor" x="129" y="9" width="10" height="12" rx="2"/>' +
      '<rect class="d-cap" x="20" y="8" width="12" height="3" rx="1.5"/><rect class="d-cap" x="128" y="8" width="12" height="3" rx="1.5"/>' +
      '<path class="d-arm" d="M26 21H134"/>' +
      '<rect class="d-body" x="50" y="15" width="60" height="25" rx="9"/><rect class="d-stripe" x="50" y="26" width="60" height="3"/>' +
      '<circle class="d-led" cx="58" cy="21" r="2.2"/><circle class="d-cam" cx="100" cy="42" r="6"/><circle class="d-lens" cx="98.5" cy="42" r="2.4"/>' +
      '<path class="d-skid" d="M64 40L56 56M96 40L104 56M46 56H74M86 56H114"/>' +
      '<rect class="d-winch" x="74" y="40" width="12" height="6" rx="2"/><path class="d-cable" d="M80 46V62"/><path class="d-hook" d="M80 61v3a3 3 0 0 1-3 3"/>' +
      "</svg>" },
    car: { w: 176, h: 83, svg:
      '<svg viewBox="0 0 176 83">' +
      '<g class="c-ant"><path class="c-whip" d="M100 26L92 3"/><circle class="c-tip" cx="92" cy="3" r="3"/></g>' +
      '<path class="c-rail" d="M14 40V32M92 40V32"/><rect class="c-bed" x="10" y="40" width="86" height="8" rx="2"/>' +
      '<path class="c-cab" d="M94 48V28Q94 22 100 22H132Q139 22 144 28L160 42Q165 46 165 51V56H94Z"/>' +
      '<path class="c-glass" d="M106 27H131Q136 27 139 31L147 41H106Z"/>' +
      '<rect class="c-chassis" x="6" y="48" width="162" height="11" rx="5"/><rect class="c-stripe" x="6" y="52" width="162" height="2"/>' +
      '<rect class="c-light" x="162" y="45" width="6" height="4" rx="1"/>' +
      '<g class="wheel"><circle class="c-tire" cx="40" cy="64" r="16"/><circle class="c-hub" cx="40" cy="64" r="6.5"/><path class="c-spoke" d="M40 58.5V69.5M34.5 64H45.5"/></g>' +
      '<g class="wheel"><circle class="c-tire" cx="134" cy="64" r="16"/><circle class="c-hub" cx="134" cy="64" r="6.5"/><path class="c-spoke" d="M134 58.5V69.5M128.5 64H139.5"/></g>' +
      "</svg>" },
    robot: { w: 124, h: 131, svg:
      '<svg viewBox="0 0 124 131">' +
      '<path class="r-ant" d="M76 18V7"/><circle class="r-tip" cx="76" cy="6" r="3"/>' +
      '<rect class="r-head" x="50" y="18" width="50" height="32" rx="9"/><rect class="r-visor" x="54" y="26" width="30" height="15" rx="6"/>' +
      '<circle class="r-eye" cx="62" cy="33.5" r="2.6"/><circle class="r-eye" cx="74" cy="33.5" r="2.6"/>' +
      '<rect class="r-neck" x="69" y="50" width="12" height="7" rx="2"/><rect class="r-body" x="46" y="57" width="58" height="44" rx="7"/>' +
      '<path class="r-panel" d="M56 68H94M56 76H82"/><circle class="r-led" cx="92" cy="89" r="3"/>' +
      '<path class="r-arm" d="M54 70L38 58H26"/><path class="r-claw" d="M20 52H30M20 52V58M30 52V58"/>' +
      '<rect class="r-track" x="38" y="102" width="78" height="28" rx="14"/>' +
      '<circle class="r-wheel" cx="52" cy="116" r="8"/><circle class="r-wheel" cx="77" cy="116" r="8"/><circle class="r-wheel" cx="102" cy="116" r="8"/>' +
      '<rect class="r-tread" x="38" y="102" width="78" height="28" rx="14"/>' +
      "</svg>" },
    radio: { w: 84, h: 176, svg:
      '<svg viewBox="0 0 84 176">' +
      '<path class="t-leg" d="M28 176L39 44M56 176L45 44"/>' +
      '<path class="t-brace" d="M29.5 160L54 136M54.5 160L30 136M31.5 132L52 108M52.5 132L32 108M33.5 104L50 80M50.5 104L34 80M35.5 76L48 56M48.5 76L36 56"/>' +
      '<rect class="t-box" x="33" y="32" width="18" height="13" rx="2"/><path class="t-dish" d="M26 44Q12 32 26 18"/><path class="t-feed" d="M26 31H33"/>' +
      '<path class="t-whip" d="M42 32V6"/><circle class="t-beacon" cx="42" cy="5" r="3.5"/>' +
      "</svg>" },
  };
  const ICONS = {
    home: '<svg class="cr-ico" viewBox="0 0 20 14" aria-hidden="true"><path d="M3.5 7L10 1.5L16.5 7M5.5 5.5V12.5H14.5V5.5"/></svg>',
    drone: '<svg class="cr-ico" viewBox="0 0 20 14" aria-hidden="true"><path d="M1 2.5H8M12 2.5H19M4.5 2.5V5M15.5 2.5V5M4.5 5H15.5"/><rect x="7" y="4" width="6" height="4.5" rx="1.6"/><path d="M8 8.5L6.5 12M12 8.5L13.5 12"/></svg>',
    car: '<svg class="cr-ico" viewBox="0 0 20 14" aria-hidden="true"><path d="M1.5 9.5V7L4 5H9V3.5H12.5L15 7H18Q18.8 7 18.8 8V9.5Z"/><circle cx="5" cy="10.5" r="2"/><circle cx="15" cy="10.5" r="2"/></svg>',
    robot: '<svg class="cr-ico" viewBox="0 0 20 14" aria-hidden="true"><rect x="5.5" y="2.5" width="9" height="6" rx="2"/><path d="M10 2.5V0.8M3.5 12.5H16.5M10 8.5V10.5"/><circle cx="8.3" cy="5.5" r="0.8"/><circle cx="11.7" cy="5.5" r="0.8"/></svg>',
    radio: '<svg class="cr-ico" viewBox="0 0 20 14" aria-hidden="true"><path d="M10 6.5V13.5M7.5 13.5L10 7.5L12.5 13.5"/><path d="M6.6 2.6A4.8 4.8 0 0 0 6.6 10M13.4 2.6A4.8 4.8 0 0 1 13.4 10"/><circle cx="10" cy="6" r="1.2"/></svg>',
  };

  let S = null;   // the running style; null while another style is on

  // ---- Starting and stopping ------------------------------------------------------
  function start(site) {
    const settings = site.couriers || {};
    S = {
      site: site, settings: settings, pages: {}, order: [], homeParts: [], current: "home",
      busy: false, pending: null, trips: 0, timers: [], off: [],
      speed: Number(settings.speed) > 0 ? Number(settings.speed) : 1,
      on: settings.deliveries !== false && !P.modeKit.reduceMotion(),
    };
    S.el = buildShell(site);
    document.body.appendChild(S.el);
    S.main = S.el.querySelector(".cr-main");
    S.dock = S.el.querySelector(".cr-dock");
    S.transit = S.el.querySelector(".cr-transit");
    S.announce = S.el.querySelector(".cr-announce");
    buildPages(site);
    buildMenu();
    bind();
    showToggle();
    // The page opens on whatever the address asks for, with no delivery
    const target = fromHash();
    S.current = target.page;
    S.pages[S.current].panel.hidden = false;
    setActive(S.current);
    if (target.part) later(() => scrollToPart(target.part, true), 250);
  }

  function stop() {
    if (!S) return;
    S.timers.forEach(clearTimeout);
    S.off.forEach((undo) => undo());
    S.el.remove();
    S = null;
  }

  P.modes = P.modes || {};
  P.modes.couriers = { start: start, stop: stop };

  // ---- Small helpers -----------------------------------------------------------
  function later(fn, ms) { S.timers.push(setTimeout(() => { if (S) fn(); }, ms)); }
  function listen(target, type, fn) {
    target.addEventListener(type, fn);
    S.off.push(() => target.removeEventListener(type, fn));
  }
  function valid(kind) { return ART[kind] ? kind : ""; }
  function courierFor(section) { return valid(section.courier) || BY_TYPE[section.type] || "drone"; }
  function pad(item, primary) {
    const url = safeUrl(item.url);
    return `<a class="pad${primary ? " pad--primary" : ""}" href="${esc(url)}"${linkAttrs(url)}>${esc(item.label || url)}</a>`;
  }

  // ---- The page -----------------------------------------------------------------
  function buildShell(site) {
    const el = document.createElement("div");
    el.className = "cr-mode";
    el.innerHTML = `
      <a class="skip-link" href="#cr-main">Skip to content</a>
      <header class="cr-top">
        <div class="cr-top__row">
          <a class="brand" href="#home"><span class="brand__mark" aria-hidden="true">${esc(initials(site.name))}</span><span class="brand__name">${esc(site.name)}</span></a>
          <div class="cr-top__tools">
            <button class="cr-deliveries" type="button" aria-pressed="true"><span class="cr-deliveries__dot" aria-hidden="true"></span><span class="cr-deliveries__text">Deliveries on</span></button>
            ${P.layout.themeSwitch("page-style-couriers")}
          </div>
        </div>
        <nav class="cr-menu" aria-label="Sections"><ul></ul></nav>
      </header>
      <main class="cr-main" id="cr-main" tabindex="-1">
        <p class="cr-transit" hidden aria-hidden="true"><span class="cr-transit__icon"></span><span class="cr-transit__text"></span><span class="cr-transit__dots"></span></p>
      </main>
      <p class="sr-only cr-announce" role="status" aria-live="polite"></p>
      <div class="cr-dock" aria-hidden="true"><div class="cr-floor"><span class="cr-floor__pad"></span></div></div>`;
    return el;
  }

  // Home is your photo, intro, and about section. Every other menu section is
  // a page of its own. Sections kept out of the menu sit at the bottom of home.
  function buildPages(site) {
    const K = P.modeKit, all = K.sections(site);
    const about = all.find((section) => section.type === "about");
    const extras = all.filter((section) => section.nav === false && section !== about);
    const menu = all.filter((section) => section.nav !== false && section !== about);
    S.chips = K.skillChips(site);
    addPage("home", "Home", valid(S.settings.home) || "robot", homePage(site, about, extras, menu));
    S.homeParts = [about].concat(extras).filter(Boolean).map((section) => P.layout.sectionId(section));
    menu.forEach((section) => {
      const id = P.layout.sectionId(section), kind = courierFor(section);
      addPage(id, section.navLabel || section.title || section.type, kind,
        `<p class="cr-tag">${ICONS[kind]}Delivered by ${NAMES[kind]}</p>` +
        `<h2 class="cr-title" id="cr-title-${esc(id)}" tabindex="-1">${esc(section.title || "")}</h2>` +
        K.body(section, site, S.chips));
    });
  }

  function homePage(site, about, extras, menu) {
    const K = P.modeKit;
    const photo = about && about.photo;
    const buttons = (site.buttons || []).filter((button) => button && button.label && button.url);
    const crew = menu.map((section) => {
      const kind = courierFor(section);
      return `<li><a href="#${esc(P.layout.sectionId(section))}">${ICONS[kind]}<span>${esc(section.navLabel || section.title || section.type)}` +
        `<small>by ${NAMES[kind]}</small></span></a></li>`;
    }).join("");
    const part = (section, body) => {
      const id = esc(P.layout.sectionId(section));
      return `<section class="cr-part" id="cr-part-${id}" aria-labelledby="cr-part-title-${id}">` +
        `<h2 class="cr-part__title" id="cr-part-title-${id}">${esc(section.title || "")}</h2>${body}</section>`;
    };
    const aboutBody = about && (about.text || (about.facts || []).length) ? part(about, K.body(Object.assign({}, about, { photo: "" }), site, S.chips)) : "";
    return `<div class="cr-home${photo ? "" : " cr-home--no-photo"}">
        ${photo ? `<figure class="cr-home__photo frame">${img({ src: about.photo, alt: about.photoAlt || "", tint: true, eager: true })}</figure>` : ""}
        <div>
          <p class="cr-hello">Hi, I'm</p>
          <h1 class="cr-name" id="cr-title-home" tabindex="-1">${esc(site.name)}</h1>
          ${site.tagline ? `<p class="cr-tagline">${esc(site.tagline)}</p>` : ""}
          ${site.intro ? `<div class="prose cr-intro">${md(site.intro)}</div>` : ""}
          ${site.status ? `<p class="status"><span class="status__led" aria-hidden="true"></span>${esc(site.status)}</p>` : ""}
          ${buttons.length ? `<div class="pads">${buttons.map((button, i) => pad(button, i === 0)).join("")}</div>` : ""}
          ${crew ? `<div class="cr-crew"><p class="cr-crew__title">Pick a section and one of my couriers brings it to you.</p><ul>${crew}</ul></div>` : ""}
        </div>
      </div>
      <div class="cr-more">${aboutBody}${extras.map((section) => part(section, K.body(section, site, S.chips))).join("")}</div>`;
  }

  function addPage(id, label, courier, html) {
    const panel = document.createElement("section");
    panel.className = "cr-page";
    panel.hidden = true;
    panel.setAttribute("aria-labelledby", "cr-title-" + id);
    panel.innerHTML = html;
    S.main.appendChild(panel);
    S.pages[id] = { id: id, label: label, courier: courier, panel: panel, number: S.order.length, heading: panel.querySelector("#cr-title-" + CSS.escape(id)) };
    S.order.push(id);
  }

  function buildMenu() {
    S.el.querySelector(".cr-menu ul").innerHTML = S.order.map((id) => {
      const page = S.pages[id];
      return `<li><a href="#${esc(id)}" data-id="${esc(id)}">${id === "home" ? ICONS.home : ICONS[page.courier]}${esc(page.label)}</a></li>`;
    }).join("");
  }

  // ---- Animation helpers -------------------------------------------------------
  //   Every position is {x, y}: a thing's top-left corner, in pixels from the
  //   top-left of the screen.
  const at = (p) => `translate(${p.x}px, ${p.y}px)`;
  const ms = (t) => t / (S ? S.speed : 1);
  const EASE_IN = "cubic-bezier(0.5, 0, 0.9, 0.5)";
  const EASE_OUT = "cubic-bezier(0.15, 0.6, 0.3, 1)";
  const anim = {
    wait: (t) => new Promise((done) => setTimeout(done, ms(t))),
    place(el, p) { el.style.transform = at(p); el.style.opacity = "1"; },
    async play(el, frames, t, easing, end) {
      const a = el.animate(frames, { duration: ms(t), easing: easing || "ease-in-out", fill: "forwards" });
      await a.finished;
      if (end) el.style.transform = at(end);
      a.cancel();
    },
    move(el, from, to, t, easing) { return anim.play(el, [{ transform: at(from) }, { transform: at(to) }], t, easing, to); },
    // Toss something along an arc. Height is how high the arc goes.
    hop(el, from, to, t, height, spin) {
      const frames = [];
      for (let i = 0; i <= 10; i++) {
        const k = i / 10;
        const p = { x: from.x + (to.x - from.x) * k, y: from.y + (to.y - from.y) * k - 4 * height * k * (1 - k) };
        frames.push({ transform: `${at(p)} rotate(${(spin || 0) * Math.sin(Math.PI * k)}deg)` });
      }
      return anim.play(el, frames, t, "ease-in-out", to);
    },
    both: (...list) => Promise.all(list),
  };

  // ---- The couriers -------------------------------------------------------------
  //   Each courier gets a trip and:
  //     1. brings the new package (trip.newCrate) to the dock,
  //     2. waits for trip.oldReady, then swaps: the new package goes onto the
  //        dock and the old one (trip.oldCrate) gets picked up,
  //     3. calls trip.delivered() so the page opens, then leaves with the old one.
  //   trip.W and trip.H are the screen size, trip.G the floor line, trip.C the
  //   middle of the dock, trip.s the drawing scale, trip.cw and trip.ch the
  //   package size, and trip.dockSpot where a package sits on the dock.
  const COURIERS = {
    // Drone: flies in, lowers the new package, hooks the old one
    drone: async function (trip) {
      const d = trip.spawn("drone"), s = trip.s;
      const hang = (p) => ({ x: p.x + 80 * s - trip.cw / 2, y: p.y + 64 * s });
      const stop = { x: trip.C + trip.cw + 22 - 80 * s, y: trip.G - 4 - trip.ch - 64 * s };
      const begin = { x: trip.W + 40, y: Math.max(10, stop.y - 240) };
      const exit = { x: trip.W + 80, y: -200 };
      anim.place(d.el, begin); anim.place(trip.newCrate, hang(begin));
      d.el.classList.add("tilt-left");
      await anim.both(anim.move(d.el, begin, stop, 900, EASE_OUT), anim.move(trip.newCrate, hang(begin), hang(stop), 900, EASE_OUT));
      d.el.classList.remove("tilt-left");
      await trip.oldReady;
      await anim.both(anim.hop(trip.newCrate, hang(stop), trip.dockSpot, 560, 36, -8), anim.hop(trip.oldCrate, trip.dockSpot, hang(stop), 560, 120, 10));
      trip.delivered();
      d.el.classList.add("tilt-right");
      await anim.both(anim.move(d.el, stop, exit, 850, EASE_IN), anim.move(trip.oldCrate, hang(stop), hang(exit), 850, EASE_IN));
    },

    // RC car: drives in, tosses the new package forward, catches the old one
    car: async function (trip) {
      const c = trip.spawn("car"), s = trip.s, y = trip.G - c.h;
      const bed = (x) => ({ x: x + 53 * s - trip.cw / 2, y: y + 40 * s - trip.ch });
      const stopX = Math.max(trip.C - trip.cw / 2 - 12 - 166 * s, 4), startX = -c.w - 60;
      anim.place(c.el, { x: startX, y: y }); anim.place(trip.newCrate, bed(startX));
      c.el.classList.add("is-driving");
      await anim.both(anim.move(c.el, { x: startX, y: y }, { x: stopX, y: y }, 900, EASE_OUT), anim.move(trip.newCrate, bed(startX), bed(stopX), 900, EASE_OUT));
      c.el.classList.remove("is-driving");
      c.el.firstChild.animate([{ transform: "translateY(0)" }, { transform: "translateY(3px)" }, { transform: "translateY(0)" }], ms(260));
      await trip.oldReady;
      await anim.both(anim.hop(trip.newCrate, bed(stopX), trip.dockSpot, 600, 90, 14), anim.hop(trip.oldCrate, trip.dockSpot, bed(stopX), 600, 150, -14));
      trip.delivered();
      c.el.classList.add("is-reversing");
      await anim.both(anim.move(c.el, { x: stopX, y: y }, { x: startX, y: y }, 750, EASE_IN), anim.move(trip.oldCrate, bed(stopX), bed(startX), 750, EASE_IN));
    },

    // Robot: rolls in holding the new package, sets it down, takes the old one
    robot: async function (trip) {
      const r = trip.spawn("robot"), s = trip.s, y = trip.G - r.h;
      const arms = (x) => ({ x: x + 30 * s - trip.cw, y: y + 52 * s });
      const stopX = Math.min(trip.C + trip.cw / 2 + 16 + trip.cw - 30 * s, trip.W - r.w - 4), startX = trip.W + 40;
      anim.place(r.el, { x: startX, y: y }); anim.place(trip.newCrate, arms(startX));
      r.el.classList.add("is-driving");
      await anim.both(anim.move(r.el, { x: startX, y: y }, { x: stopX, y: y }, 1000, EASE_OUT), anim.move(trip.newCrate, arms(startX), arms(stopX), 1000, EASE_OUT));
      r.el.classList.remove("is-driving");
      await trip.oldReady;
      await anim.both(anim.hop(trip.newCrate, arms(stopX), trip.dockSpot, 560, 46, 8), anim.hop(trip.oldCrate, trip.dockSpot, arms(stopX), 560, 110, -8));
      trip.delivered();
      r.el.classList.add("is-reversing");
      await anim.both(anim.move(r.el, { x: stopX, y: y }, { x: startX, y: y }, 850, EASE_IN), anim.move(trip.oldCrate, arms(stopX), arms(startX), 850, EASE_IN));
    },

    // Radio: a tower rises, beams the old package away and the new one in
    radio: async function (trip) {
      const t = trip.spawn("radio"), s = trip.s;
      const x = trip.W - t.w - (trip.phone ? 4 : 28), y = trip.G - t.h;
      const dish = { x: x + 18 * s, y: y + 31 * s };
      anim.place(t.el, { x: x, y: trip.H });
      await anim.move(t.el, { x: x, y: trip.H }, { x: x, y: y }, 420, EASE_OUT);
      await trip.oldReady;
      signal(dish, trip.dock);
      await anim.wait(120);
      await beamOut(trip.oldCrate);
      signal(dish, trip.dock);
      anim.place(trip.newCrate, trip.dockSpot);
      await beamIn(trip.newCrate);
      trip.delivered();
      await anim.wait(250);
      await anim.move(t.el, { x: x, y: y }, { x: x, y: trip.H }, 420, EASE_IN);
    },
  };

  // Radio waves leaving the dish
  function signal(from, dock) {
    for (let i = 0; i < 3; i++) {
      const w = document.createElement("span");
      w.className = "cr-wave";
      w.style.left = from.x + "px";
      w.style.top = from.y + "px";
      dock.appendChild(w);
      w.animate([{ transform: "scale(0.2)", opacity: 1 }, { transform: "scale(4.2)", opacity: 0 }],
        { duration: ms(800), delay: ms(i * 140), easing: "ease-out", fill: "both" }).finished.then(() => w.remove(), () => w.remove());
    }
  }
  function beamOut(el) {
    return el.animate([{ clipPath: "inset(0 0 0 0)", opacity: 1, filter: "brightness(1)" }, { opacity: 0.4, filter: "brightness(2)", offset: 0.3 },
      { opacity: 0.9, offset: 0.45 }, { clipPath: "inset(100% 0 0 0)", opacity: 0, filter: "brightness(3)" }], { duration: ms(560), fill: "forwards" }).finished;
  }
  function beamIn(el) {
    return el.animate([{ clipPath: "inset(0 0 100% 0)", filter: "brightness(3)" }, { clipPath: "inset(0 0 0 0)", filter: "brightness(1)" }], { duration: ms(600) }).finished;
  }

  // ---- Deliveries: packing up one page and opening the next ---------------------------
  function makeCrate(page, trip) {
    const el = document.createElement("div");
    el.className = "cr-crate";
    el.style.width = trip.cw + "px";
    el.style.height = trip.ch + "px";
    el.innerHTML = `<span class="cr-crate__label">${esc(page.label)}</span><span class="cr-crate__code"></span><span class="cr-crate__id">PKG ${String(page.number).padStart(2, "0")}</span>`;
    S.dock.appendChild(el);
    return el;
  }

  function makeTrip(from, to) {
    const W = innerWidth, H = innerHeight, phone = W < SIZE.phoneWidth, big = W >= SIZE.bigWidth;
    const size = phone ? SIZE.phoneCrate : big ? SIZE.bigCrate : SIZE.crate;
    const floor = parseFloat(getComputedStyle(S.el).getPropertyValue("--cr-floor-h")) || 28;
    const trip = { W: W, H: H, phone: phone, s: phone ? SIZE.phoneScale : big ? SIZE.bigScale : 1, cw: size.w, ch: size.h, G: H - floor, C: W / 2, parts: [] };
    trip.dockSpot = { x: trip.C - trip.cw / 2, y: trip.G - trip.ch };
    trip.dock = S.dock;
    trip.oldCrate = makeCrate(from, trip);
    trip.newCrate = makeCrate(to, trip);
    trip.parts.push(trip.oldCrate, trip.newCrate);
    trip.spawn = function (kind) {
      const el = document.createElement("div"), art = ART[kind];
      el.className = "cr-courier cr-courier--" + kind;
      el.style.width = art.w * trip.s + "px";
      el.style.height = art.h * trip.s + "px";
      el.innerHTML = art.svg;
      S.dock.appendChild(el);
      trip.parts.push(el);
      return { el: el, w: art.w * trip.s, h: art.h * trip.s };
    };
    return trip;
  }

  // The page shrinks into a package on the dock
  async function fold(panel, trip) {
    const r = panel.getBoundingClientRect();
    const cx = trip.C - r.left, cy = trip.G - trip.ch / 2 - r.top, R = Math.hypot(r.width, r.height + innerHeight);
    await panel.animate([{ clipPath: `circle(${R}px at ${cx}px ${cy}px)`, opacity: 1 }, { clipPath: `circle(0px at ${cx}px ${cy}px)`, opacity: 0.4 }],
      { duration: ms(450), easing: "ease-in" }).finished;
    panel.hidden = true;
    anim.place(trip.oldCrate, trip.dockSpot);
    await trip.oldCrate.animate([{ transform: at(trip.dockSpot) + " scale(0.3)", opacity: 0 }, { transform: at(trip.dockSpot) + " scale(1)", opacity: 1 }],
      { duration: ms(220), easing: EASE_OUT }).finished;
  }

  // The new package pops open into the page
  async function open(panel, trip) {
    trip.newCrate.animate([{ transform: at(trip.dockSpot) + " scale(1)", opacity: 1 }, { transform: at(trip.dockSpot) + " scale(1.3)", opacity: 0 }],
      { duration: ms(280), fill: "forwards" });
    panel.hidden = false;
    const r = panel.getBoundingClientRect();
    const cx = trip.C - r.left, cy = trip.G - trip.ch / 2 - r.top, R = Math.hypot(r.width, r.height + innerHeight);
    await panel.animate([{ clipPath: `circle(0px at ${cx}px ${cy}px)`, opacity: 0.4 }, { clipPath: `circle(${R}px at ${cx}px ${cy}px)`, opacity: 1 }],
      { duration: ms(560), easing: EASE_OUT }).finished;
  }

  function say(text) { if (S) S.announce.textContent = text; }
  function showTransit(page) {
    if (!S) return;
    S.transit.hidden = !page;
    if (page) {
      S.transit.querySelector(".cr-transit__icon").innerHTML = ICONS[page.courier];
      S.transit.querySelector(".cr-transit__text").textContent = `${NAMES[page.courier]} is bringing ${page.label}`;
    }
  }

  async function deliver(fromId, toId) {
    const state = S;
    state.busy = true;
    const from = state.pages[fromId], to = state.pages[toId], name = NAMES[to.courier];
    window.scrollTo(0, 0);
    const trip = makeTrip(from, to);
    let markDelivered, markOldReady;
    const delivered = new Promise((done) => (markDelivered = done));
    trip.delivered = () => markDelivered();
    trip.oldReady = new Promise((done) => (markOldReady = done));
    state.trips++;
    state.dock.classList.add("is-active");
    say(`${name} is bringing ${to.label}.`);
    const run = COURIERS[to.courier](trip).catch((error) => { if (S === state) console.error(error); }).finally(markDelivered);
    await fold(from.panel, trip);
    if (S !== state) return;          // the visitor switched styles mid-delivery
    showTransit(to);
    markOldReady();
    await delivered;
    if (S !== state) return;
    showTransit(null);
    await open(to.panel, trip);
    if (S !== state) return;
    say(`${to.label}, delivered by ${name}.`);
    if (to.heading) to.heading.focus({ preventScroll: true });
    state.busy = false;
    run.then(() => {
      trip.parts.forEach((part) => part.remove());
      if (--state.trips === 0) state.dock.classList.remove("is-active");
    });
    if (state.pending && state.pending !== state.current) {
      const next = state.pending;
      state.pending = null;
      go(next);
    } else {
      state.pending = null;
    }
  }

  function swapInstant(fromId, toId) {
    S.pages[fromId].panel.hidden = true;
    S.pages[toId].panel.hidden = false;
    window.scrollTo(0, 0);
    if (S.pages[toId].heading) S.pages[toId].heading.focus({ preventScroll: true });
    say(S.pages[toId].label);
  }

  // ---- Menu, back, and forward -------------------------------------------------
  //   Menu items and buttons are links like #projects. The script catches each
  //   click and sends the courier itself, so the links work everywhere, even in
  //   previews that block normal page jumps. Where the browser allows it, the
  //   address updates too, so back and forward send couriers as well.
  function setActive(id) {
    S.el.querySelectorAll(".cr-menu a").forEach((a) => {
      if (a.getAttribute("data-id") === id) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  }

  // Which page (and which part of home) the address points to
  function fromHash() {
    const id = decodeURIComponent(location.hash.slice(1));
    if (S.pages[id]) return { page: id, part: "" };
    if (S.homeParts.indexOf(id) !== -1) return { page: "home", part: id };
    return { page: "home", part: "" };
  }

  function go(id) {
    if (!S.pages[id]) id = "home";
    if (S.busy) { S.pending = id; return; }
    if (id === S.current) return;
    const from = S.current;
    S.current = id;
    setActive(id);
    if (S.on) deliver(from, id);
    else swapInstant(from, id);
  }

  function visit(id) {
    if (id !== S.current || S.busy) {
      try { history.pushState({ page: id }, "", location.href.split("#")[0] + "#" + id); }
      catch (error) { /* this preview can't change the address; the page still changes */ }
    }
    go(id);
  }

  function scrollToPart(id, instant) {
    const target = S.el.querySelector("#cr-part-" + CSS.escape(id));
    if (target) target.scrollIntoView({ block: "start", behavior: instant || P.modeKit.reduceMotion() ? "auto" : "smooth" });
  }

  function showToggle() {
    const toggle = S.el.querySelector(".cr-deliveries");
    toggle.setAttribute("aria-pressed", String(S.on));
    toggle.querySelector(".cr-deliveries__text").textContent = S.on ? "Deliveries on" : "Deliveries off";
  }

  function bind() {
    S.el.querySelector(".cr-deliveries").addEventListener("click", () => { S.on = !S.on; showToggle(); });
    S.el.addEventListener("click", (e) => {
      const link = e.target.closest("a[href]");
      if (!link || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const href = link.getAttribute("href");
      if (href === "#") { e.preventDefault(); return; }
      if (href === "#cr-main") { e.preventDefault(); S.main.focus(); return; }
      const id = P.modeKit.hashTarget(link);
      if (!id) return;                               // another page or site: the browser opens it
      e.preventDefault();
      if (S.pages[id]) { visit(id); return; }
      if (S.homeParts.indexOf(id) !== -1) {          // part of home, like Education
        const wait = S.current === "home" ? 0 : S.on ? 2600 : 60;
        visit("home");
        later(() => scrollToPart(id), wait);
      }
    });
    const follow = () => {
      const target = fromHash();
      go(target.page);
      if (target.part) later(() => scrollToPart(target.part), S.on ? 2600 : 60);
    };
    listen(window, "popstate", follow);
    listen(window, "hashchange", follow);
  }
})();
