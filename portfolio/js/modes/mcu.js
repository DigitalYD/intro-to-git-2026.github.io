/* ==========================================================================
   js/modes/mcu.js: the MCU style.

   You're the microcontroller (U1) in the middle of a circuit board. Every
   section in the menu becomes a module floating around you, and each
   project gets a module of its own. Click a module and a copper trace
   routes to it, it powers up, and its datasheet opens with that section's
   content. Click the chip to read your own datasheet: your intro, your
   about section, and any sections you keep out of the menu.

   Everything comes from content/site.js and content/projects.js, so
   there's nothing to edit here. Settings are in SITE.mcu in site.js.

   STYLE: MCU. Its colors are in css/themes/mcu.css; js/modes/parts.js
   draws the parts.
   ========================================================================== */
(function () {
  "use strict";

  const P = window.Portfolio;
  const { esc, md, img, safeUrl, linkAttrs, initials } = P.util;
  const NS = "http://www.w3.org/2000/svg";
  const root = document.documentElement;
  const MASKS = { black: "#0c0f0e", green: "#0f4d2e", purple: "#3a1c5c" };

  // ---- What each section type becomes on the board -----------------------------
  //   ref   designator prefix (U3, CAM1, RF1...)    art  the drawing on the module
  //   sub   what the part is                         bus  how it connects to you
  const KINDS = {
    timeline: { ref: "U", art: "flash", sub: "Flash memory", bus: "QSPI", note: "It stores my history." },
    gallery: { ref: "CAM", art: "camera", sub: "Camera module", bus: "CSI" },
    contact: { ref: "RF", art: "antenna", sub: "2.4 GHz radio", bus: "UART" },
    skills: { ref: "U", art: "qfn", sub: "Coprocessor", bus: "I2C" },
    list: { ref: "U", art: "eeprom", sub: "EEPROM", bus: "I2C" },
    text: { ref: "DS", art: "display", sub: "Display", bus: "SPI" },
    projects: { ref: "U", art: "dip", sub: "Project hub", bus: "SPI" },
    other: { ref: "J", art: "header", sub: "Expansion board", bus: "GPIO" },
  };
  const PROJECT_BUSES = ["PWM", "SPI", "I2C", "ADC", "CAN", "GPIO"];

  let S = null;   // the running board; null while another style is on

  // ---- Starting and stopping ------------------------------------------------------
  function start(site) {
    const settings = site.mcu || {};
    S = { site: site, settings: settings, mods: [], G: {}, raf: 0, timers: [], off: [], opener: null, current: null, said: false };
    root.setAttribute("data-mask", MASKS[settings.mask] ? settings.mask : "black");
    S.el = buildPage(site, settings);
    document.body.appendChild(S.el);
    S.svg = S.el.querySelector(".mcu-svg");
    S.fixed = S.svg.querySelector(".mcu-fixed");
    S.wires = S.svg.querySelector(".mcu-wires");
    S.chip = S.el.querySelector(".mcu-chip");
    S.ds = S.el.querySelector(".mcu-ds");
    S.hint = S.el.querySelector(".mcu-hint");
    S.reset = S.el.querySelector(".mcu-reset");
    S.bar = S.el.querySelector(".mcu-bar");
    S.seg = S.el.querySelector(".mcu-seg");
    buildModules();
    bind();
    layout();
    updateCount();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (S) layout(); });
    if (!P.modeKit.reduceMotion()) S.raf = requestAnimationFrame(tick);
    // Arriving at index.html#something opens that part of the board
    const id = decodeURIComponent(location.hash.slice(1));
    if (id) later(() => navigate(id), 350);
  }

  function stop() {
    if (!S) return;
    cancelAnimationFrame(S.raf);
    S.timers.forEach(clearTimeout);
    S.off.forEach((undo) => undo());
    S.el.remove();
    root.removeAttribute("data-mask");
    S = null;
  }

  P.modes = P.modes || {};
  P.modes.mcu = { start: start, stop: stop };

  // ---- Small helpers ----------------------------------------------------------
  function later(fn, ms) { S.timers.push(setTimeout(() => { if (S) fn(); }, ms)); }
  function listen(target, type, fn, options) {
    target.addEventListener(type, fn, options);
    S.off.push(() => target.removeEventListener(type, fn, options));
  }
  function make(name, attrs) {
    const el = document.createElementNS(NS, name);
    Object.keys(attrs).forEach((key) => el.setAttribute(key, attrs[key]));
    return el;
  }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function reduce() { return P.modeKit.reduceMotion(); }
  function pad(item, primary) {
    const url = safeUrl(item.url);
    return `<a class="pad${primary ? " pad--primary" : ""}" href="${esc(url)}"${linkAttrs(url)}>${esc(item.label || url)}</a>`;
  }

  // ---- The page ----------------------------------------------------------------
  function buildPage(site, settings) {
    const el = document.createElement("div");
    el.className = "mcu-mode";
    const mask = root.getAttribute("data-mask");
    const picker = settings.maskPicker === false ? "" :
      `<fieldset class="mcu-mask"><legend class="sr-only">Board color</legend><span class="mcu-mask__label" aria-hidden="true">Board</span>` +
      Object.keys(MASKS).map((name) => `<label style="--sw:${MASKS[name]}" title="${name.charAt(0).toUpperCase() + name.slice(1)}">` +
        `<input type="radio" name="mcu-mask" value="${name}"${name === mask ? " checked" : ""}><span class="sr-only">${name}</span></label>`).join("") +
      "</fieldset>";
    el.innerHTML = `
      <svg class="mcu-svg" aria-hidden="true"><g class="mcu-fixed"></g><g class="mcu-wires"></g></svg>
      <div class="mcu-chip">
        <svg class="mcu-chip__svg" aria-hidden="true"></svg>
        <div class="mcu-mark">
          <p class="mcu-ref">U1</p>
          <h1 class="mcu-name">${esc(site.name)}</h1>
          ${site.tagline ? `<p class="mcu-tag">${esc(site.tagline)}</p>` : ""}
          <button class="mcu-open" type="button">Read my datasheet</button>
        </div>
      </div>
      <div class="mcu-mods"></div>
      <button class="mcu-reset" type="button" aria-label="Reset: disconnect every module"><span class="mcu-reset__cap"></span>SW2 RESET</button>
      <header class="mcu-bar">
        <p class="mcu-bar__name">${esc(initials(site.name))}-MB1 mainboard, rev ${esc(site.revision || "A")}</p>
        <p class="mcu-online"><span class="mcu-online__glass"><svg class="mcu-seg" aria-hidden="true"></svg></span><span><span class="mcu-online__count">0</span> of <span class="mcu-online__total">0</span> <span class="mcu-online__label">modules online</span></span></p>
        <button class="mcu-btn" type="button" data-autoroute>Autoroute all</button>
        <button class="mcu-btn" type="button" data-reset>Reset</button>
        ${picker}
        ${P.layout.themeSwitch("page-style-mcu")}
      </header>
      <p class="mcu-hint" role="status"></p>
      <aside class="mcu-ds" aria-labelledby="mcu-ds-title" inert>
        <header class="mcu-ds__head">
          <p class="mcu-ds__ref"></p>
          <div class="mcu-ds__actions"><button class="mcu-btn" type="button" data-unplug>Unplug</button><button class="mcu-btn mcu-btn--fill" type="button" data-close>Close</button></div>
          <h2 class="mcu-ds__title" id="mcu-ds-title" tabindex="-1"></h2>
          <p class="mcu-ds__sub"></p>
        </header>
        <div class="mcu-ds__body"></div>
      </aside>`;
    return el;
  }

  // ---- One module per menu section, and one per project ------------------------------
  function buildModules() {
    const K = P.modeKit, site = S.site, wrap = S.el.querySelector(".mcu-mods");
    const counts = {};
    const ref = (prefix) => { counts[prefix] = (counts[prefix] || (prefix === "U" ? 2 : 0)) + 1; return prefix + counts[prefix]; };
    const most = Math.max(1, Number(S.settings.projectModules) || 4);
    const plan = [];

    K.sections(site).filter((section) => section.nav !== false && section.type !== "about").forEach((section) => {
      const id = P.layout.sectionId(section);
      const projects = section.type === "projects" ? K.projects(section) : null;
      if (projects && projects.length && projects.length <= most) {
        projects.forEach((project, i) => plan.push({
          kind: "project", id: id, section: section, project: project, ref: ref("U"),
          title: project.title, sub: project.role || "Project", bus: PROJECT_BUSES[i % PROJECT_BUSES.length],
        }));
        return;
      }
      const kind = KINDS[section.type] ? section.type : "other", k = KINDS[kind];
      plan.push({
        kind: kind, id: id, section: section, ref: ref(k.ref), count: projects ? projects.length : 0,
        title: section.navLabel || section.title || section.type,
        sub: projects ? `${projects.length} project${projects.length === 1 ? "" : "s"}` : k.sub, bus: k.bus,
      });
    });

    S.mods = plan.map((m, i) => {
      const el = document.createElement("button");
      el.type = "button";
      el.className = "mcu-mod";
      el.innerHTML = `<span class="mcu-mod__body"><span class="mcu-mod__top"><span>${esc(m.ref)}</span><span class="mcu-mod__led"></span></span>` +
        `<span class="mcu-mod__mid"><span class="mcu-mod__art" aria-hidden="true">${art(m)}</span>` +
        `<span><span class="mcu-mod__title">${esc(m.title)}</span><span class="mcu-mod__sub">${esc(m.sub)}</span></span></span>` +
        `<span class="mcu-mod__state" data-bus="${esc(m.bus)}"></span><span class="mcu-mod__hdr"></span></span>`;
      wrap.appendChild(el);
      Object.assign(m, { el: el, i: i, on: false, x: 0, y: 0, hdr: el.querySelector(".mcu-mod__hdr") });
      m.rat = make("path", { class: "mcu-rat" });
      m.trace = make("path", { class: "mcu-trace", pathLength: "1" });
      m.flow = make("path", { class: "mcu-flow" });
      m.label = make("text", { class: "mcu-bus" });
      m.label.textContent = m.bus;
      [m.rat, m.trace, m.flow, m.label].forEach((node) => S.wires.appendChild(node));
      el.style.setProperty("--ph", -i * 1.3 + "s");
      el.style.setProperty("--bx", [4, -5, 3, -4, 5, -3][i % 6] + "px");
      el.style.setProperty("--by", [-6, 5, -5, 6, -4, 5][i % 6] + "px");
      describe(m);
      bindDrag(m);
      return m;
    });
    S.chips = K.skillChips(site, (counts.U || 2) + 1);   // skill chips are numbered after the modules
    S.el.querySelector(".mcu-online__total").textContent = String(S.mods.length);
    P.sevenSeg.create(S.seg, S.mods.length >= 10 ? 2 : 1);
  }

  // The little drawing on each module
  function art(m) {
    const Parts = P.parts;
    const k = m.kind === "project" ? "photo" : (KINDS[m.kind] || KINDS.other).art;
    const box = (inner) => `<svg viewBox="-29 -21 58 42">${inner}</svg>`;
    if (k === "photo") {
      return m.project.image ? `<img src="${esc(safeUrl(m.project.image))}" alt="" loading="lazy">` : box(Parts.dip(0, 0, { pins: 8, part: "PROJ" }));
    }
    if (k === "flash") return box(Parts.soic(0, 0, { part: "W25Q", scale: 1.6 }));
    if (k === "eeprom") return box(Parts.soic(0, 0, { part: "24C02", scale: 1.6 }));
    if (k === "dip") return box(Parts.dip(0, 0, { pins: Math.min(16, Math.max(6, m.count * 2)), part: "HUB" }));
    if (k === "header") return box(Parts.header(0, 0, { pins: 4, scale: 1.4 }));
    if (k === "camera") {
      return '<svg viewBox="0 0 58 42"><rect class="mcu-art-board" x="10" y="2" width="38" height="38" rx="3"/><circle class="mcu-art-lens1" cx="29" cy="21" r="14"/>' +
        '<circle class="mcu-art-lens2" cx="29" cy="21" r="8.5"/><circle class="mcu-art-shine" cx="26" cy="18" r="2.5"/></svg>';
    }
    if (k === "antenna") {
      return '<svg viewBox="0 0 58 42"><path class="mcu-art-ant" d="M6 34V8H14V30H22V8H30V30H38V8H46V30H52"/><rect class="mcu-art-board" x="40" y="30" width="14" height="10" rx="1"/></svg>';
    }
    if (k === "display") {
      return '<svg viewBox="0 0 58 42"><rect class="mcu-art-board" x="3" y="3" width="52" height="36" rx="3"/><rect class="mcu-art-screen" x="8" y="8" width="42" height="24" rx="1.5"/>' +
        '<path class="mcu-art-text" d="M13 15H36M13 21H44M13 27H30"/></svg>';
    }
    let pads = "";
    for (let i = 0; i < 6; i++) {
      const p = 12 + i * 4;
      pads += `<rect class="pt-pin" x="${p - 1}" y="2" width="2" height="5"/><rect class="pt-pin" x="${p - 1}" y="37" width="2" height="5"/>` +
        `<rect class="pt-pin" x="2" y="${p - 1}" width="5" height="2"/><rect class="pt-pin" x="37" y="${p - 1}" width="5" height="2"/>`;
    }
    return `<svg viewBox="0 0 44 44">${pads}<rect class="pt-body" x="7" y="7" width="30" height="30" rx="2"/><circle class="pt-dot" cx="12" cy="12" r="1.8"/>` +
      `<text class="pt-mark" x="22" y="24" text-anchor="middle">${esc(m.ref)}</text></svg>`;
  }

  // ---- Datasheets -----------------------------------------------------------------
  function sheetFor(m) {
    if (m.kind === "project") {
      return { ref: m.ref, title: m.project.title, sub: `${m.sub} on the ${m.bus} bus`, html: projectSheet(m.project) };
    }
    const k = KINDS[m.kind] || KINDS.other;
    return { ref: m.ref, title: m.section.title || m.title, sub: `${k.sub} on the ${m.bus} bus.${k.note ? " " + k.note : ""}`, html: P.modeKit.body(m.section, S.site, S.chips) };
  }

  function projectSheet(project) {
    const meta = [["Date", project.date], ["Role", project.role]].filter((pair) => pair[1]);
    const links = (project.links || []).filter((item) => item && item.url);
    const page = project.details ? `<a class="pad" href="project.html?id=${encodeURIComponent(project.id || "")}">Full project page</a>` : "";
    return (project.image ? `<figure class="mcu-ds__figure">${img({ src: project.image, alt: project.imageAlt || "", tint: true })}</figure>` : "") +
      (project.summary ? `<p class="mcu-ds__lead">${esc(project.summary)}</p>` : "") +
      (meta.length ? `<dl class="spec spec--strip">${meta.map((pair) => `<div class="spec__row"><dt>${pair[0]}</dt><dd>${esc(pair[1])}</dd></div>`).join("")}</dl>` : "") +
      ((project.tags || []).length ? `<ul class="tags" aria-label="Tools">${project.tags.map((tag) => `<li>${esc(tag)}</li>`).join("")}</ul>` : "") +
      (links.length || page ? `<div class="pads">${links.map((item, i) => pad(item, i === 0)).join("")}${page}</div>` : "") +
      (project.details ? `<div class="prose">${md(project.details, { heading: "h3" })}</div>` : "");
  }

  // Your own datasheet: intro, about section, and the sections kept out of the menu
  function aboutSheet() {
    const K = P.modeKit, site = S.site, all = K.sections(site);
    const about = all.find((section) => section.type === "about");
    const extras = all.filter((section) => section.nav === false && section !== about);
    const buttons = (site.buttons || []).filter((button) => button && button.label && button.url);
    return (site.tagline ? `<p class="mcu-ds__tagline">${esc(site.tagline)}</p>` : "") +
      (site.intro ? `<div class="prose mcu-ds__intro">${md(site.intro)}</div>` : "") +
      (site.status ? `<p class="status"><span class="status__led" aria-hidden="true"></span>${esc(site.status)}</p>` : "") +
      (buttons.length ? `<div class="pads">${buttons.map((button, i) => pad(button, i === 0)).join("")}</div>` : "") +
      (about ? `<div class="mcu-ds__part" id="mcu-part-${esc(P.layout.sectionId(about))}">${K.body(about, site, S.chips)}</div>` : "") +
      extras.map((section) => `<section class="mcu-ds__part" id="mcu-part-${esc(P.layout.sectionId(section))}">` +
        `<h3 class="mcu-ds__heading">${esc(section.title || "")}</h3>${K.body(section, site, S.chips)}</section>`).join("");
  }

  function openSheet(info, from, mod) {
    S.current = mod || null;
    S.opener = from || S.opener;
    S.ds.querySelector(".mcu-ds__ref").textContent = info.ref;
    S.ds.querySelector(".mcu-ds__title").textContent = info.title;
    S.ds.querySelector(".mcu-ds__sub").textContent = info.sub;
    S.ds.querySelector(".mcu-ds__body").innerHTML = info.html;
    S.ds.querySelector("[data-unplug]").hidden = !mod;
    S.ds.removeAttribute("inert");
    S.ds.classList.add("is-open");
    S.ds.scrollTop = 0;
    S.ds.querySelector(".mcu-ds__title").focus({ preventScroll: true });
  }
  function closeSheet() {
    if (!S.ds.classList.contains("is-open")) return;
    S.ds.classList.remove("is-open");
    S.ds.setAttribute("inert", "");
    if (S.opener && S.el.contains(S.opener)) S.opener.focus({ preventScroll: true });
  }
  function openAbout(part) {
    openSheet({ ref: "U1", title: S.site.name, sub: "My datasheet", html: aboutSheet() }, S.el.querySelector(".mcu-open"), null);
    const target = part && S.ds.querySelector("#mcu-part-" + CSS.escape(part));
    if (target) {
      const head = S.ds.querySelector(".mcu-ds__head").offsetHeight;
      later(() => S.ds.scrollTo({ top: target.offsetTop - head - 12, behavior: reduce() ? "auto" : "smooth" }), 380);
    }
  }

  // A link like #projects goes to that part of the board
  function navigate(id) {
    if (!S || !id || id === "top" || id === "main") return;
    const section = P.modeKit.sections(S.site).find((item) => P.layout.sectionId(item) === id);
    if (!section) return;
    if (section.type === "about") { openAbout(); return; }
    const matches = S.mods.filter((m) => m.id === id);
    if (matches.length > 1) { closeSheet(); autoroute(matches); return; }   // one module per project: wire them all up
    if (matches.length === 1) { connect(matches[0], true); return; }
    openAbout(id);                                                          // kept out of the menu: it's in your datasheet
  }

  // ---- Where everything goes ------------------------------------------------------
  function layout() {
    if (!S) return;
    const W = innerWidth, H = innerHeight, phone = W < 760, n = S.mods.length;
    let wide = !phone && W / H > 1.15, side = false;
    let mw = phone ? 118 : n > 6 ? 200 : 224, mh = phone ? 76 : 136;
    // The board runs from under the top bar to just above the hint at the bottom
    S.G = { phone: phone };
    if (!S.said) say("I'm the chip in the middle. Click a module to wire it to me, or drag it anywhere.", "I'm the chip in the middle. Tap a module.");
    const top = S.bar.getBoundingClientRect().bottom + 6;
    const bottom = Math.min(H - 8, S.hint.getBoundingClientRect().top - 10);
    const room = bottom - top;
    let size;
    if (wide) {
      size = Math.min(W * 0.22, room * 0.36);
      side = room < 2 * mh + 170;                     // too short for a ring
    } else {
      // Rows of modules above and below the chip, plus the gaps beside it
      const cols = Math.max(1, Math.floor((W - 12) / (mw + 6))), above = Math.ceil(n / 2);
      const rows = Math.ceil(above / cols) + Math.ceil((n - above) / cols);
      size = Math.min(W * 0.42, room - rows * (mh + 14) - 2 * 30 - 20);
      side = size < 120 && W > H;                     // a phone turned on its side
    }
    if (side) {
      // Short screens: compact modules in a column on each side of the chip
      const perColumn = Math.ceil(n / 2);
      mw = phone ? 132 : 172;
      mh = Math.max(40, Math.min(58, Math.floor((room - (perColumn - 1) * 8) / perColumn)));
      size = Math.min(room - 34, W - 2 * (mw + 44) - 30, 260);
      wide = false;
    }
    S.el.classList.toggle("is-compact", side);
    size = Math.round(clamp(size, side ? 90 : 120, 300));
    const G = (S.G = { W: W, H: H, phone: phone, wide: wide, side: side, mw: mw, mh: mh, S: size, L: Math.max(8, Math.round(size * 0.05)), cx: W / 2, cy: top + room / 2, top: top, bottom: bottom });
    G.span = G.S * 0.8;
    G.step = G.span / 15;
    S.el.style.setProperty("--mw", mw + "px");
    S.el.style.setProperty("--mh", mh + "px");
    spots(G, n).forEach((spot, k) => { const m = S.mods[k]; m.x = spot.x; m.y = spot.y; place(m); });
    S.chip.style.left = G.cx + "px";
    S.chip.style.top = G.cy + "px";
    drawChip();
    drawFixed();
    wireAll();
  }
  function place(m) { m.el.style.left = m.x + "px"; m.el.style.top = m.y + "px"; }

  // Wide screens: a ring around the chip. Tall screens: rows above and below.
  function spots(G, n) {
    const out = [];
    if (G.side) {
      const left = Math.ceil(n / 2), right = n - left;
      const y = (count, k) => G.cy + (k - (count - 1) / 2) * (G.mh + 8);
      const xl = Math.max(G.mw / 2 + 8, G.cx - G.S / 2 - G.L - 36 - G.mw / 2);
      const xr = Math.min(G.W - G.mw / 2 - 8, G.cx + G.S / 2 + G.L + 36 + G.mw / 2);
      for (let k = 0; k < left; k++) out.push({ x: xl, y: y(left, k) });
      for (let k = 0; k < right; k++) out.push({ x: xr, y: y(right, k) });
      return out;
    }
    if (G.wide) {
      const rx = Math.min(G.W * 0.36, G.W / 2 - G.mw / 2 - 14);
      const ry = (G.bottom - G.top) / 2 - G.mh / 2 - 8;
      const begin = -90 - (n % 2 === 0 ? 180 / n : 0), clear = G.S / 2 + G.L + 14;
      const yMin = G.top + G.mh / 2 + 8, yMax = G.bottom - G.mh / 2;
      for (let k = 0; k < n; k++) {
        const a = ((begin + (k * 360) / n) * Math.PI) / 180;
        let x = G.cx + rx * Math.cos(a), y = clamp(G.cy + ry * Math.sin(a), yMin, yMax);
        const needX = clear + G.mw / 2, needY = clear + G.mh / 2;
        if (Math.abs(x - G.cx) < needX && Math.abs(y - G.cy) < needY) {
          // Too close to the chip: move up or down if there's room, sideways if not
          const away = G.cy + (Math.sin(a) < 0 ? -needY : needY);
          if (away >= yMin && away <= yMax) y = away;
          else x = G.cx + (Math.cos(a) < 0 || (Math.abs(Math.cos(a)) < 0.01 && k % 2) ? -needX : needX);
        }
        out.push({ x: clamp(x, G.mw / 2 + 10, G.W - G.mw / 2 - 10), y: y });
      }
      return out;
    }
    const cols = Math.max(1, Math.floor((G.W - 12) / (G.mw + 6)));
    const above = Math.ceil(n / 2), below = n - above;
    const gap = Math.min(16, (G.W - Math.min(cols, above) * G.mw) / (Math.min(cols, above) + 1));
    const row = (count, index) => {
      const inRow = Math.min(cols, count - Math.floor(index / cols) * cols), col = index % cols;
      return G.cx + (col - (inRow - 1) / 2) * (G.mw + gap);
    };
    for (let k = 0; k < above; k++) {
      const r = Math.floor(k / cols);
      out.push({ x: row(above, k), y: Math.max(G.top + 10 + G.mh / 2, G.cy - G.S / 2 - G.L - 34 - G.mh / 2 - r * (G.mh + 14)) });
    }
    for (let k = 0; k < below; k++) {
      const r = Math.floor(k / cols);
      out.push({ x: row(below, k), y: G.cy + G.S / 2 + G.L + 34 + G.mh / 2 + r * (G.mh + 14) });
    }
    return out;
  }

  // The chip: a QFP package with 16 pins per side
  function drawChip() {
    const G = S.G, size = G.S, L = G.L, box = size + 2 * L, t = Math.max(2.4, size * 0.013);
    const svg = S.chip.querySelector(".mcu-chip__svg"), mark = S.chip.querySelector(".mcu-mark");
    let pins = "";
    for (let i = 0; i < 16; i++) {
      const p = L + (size - G.span) / 2 + i * G.step;
      pins += `<rect class="mcu-pin" x="${p - t / 2}" y="0" width="${t}" height="${L}"/><rect class="mcu-pin" x="${p - t / 2}" y="${L + size}" width="${t}" height="${L}"/>` +
        `<rect class="mcu-pin" x="0" y="${p - t / 2}" width="${L}" height="${t}"/><rect class="mcu-pin" x="${L + size}" y="${p - t / 2}" width="${L}" height="${t}"/>`;
    }
    const c = size * 0.07, e = L + size;
    svg.setAttribute("viewBox", `0 0 ${box} ${box}`);
    svg.setAttribute("width", box);
    svg.setAttribute("height", box);
    svg.innerHTML = pins +
      `<path class="mcu-body" d="M${L + c} ${L}H${e - 4}Q${e} ${L} ${e} ${L + 4}V${e - 4}Q${e} ${e} ${e - 4} ${e}H${L + 4}Q${L} ${e} ${L} ${e - 4}V${L + c}Z"/>` +
      `<rect class="mcu-ring" x="${L + size * 0.06}" y="${L + size * 0.06}" width="${size * 0.88}" height="${size * 0.88}" rx="3"/>` +
      `<circle class="mcu-dot" cx="${L + size * 0.14}" cy="${L + size * 0.14}" r="${size * 0.028}"/>`;
    Object.assign(mark.style, { left: L + size * 0.1 + "px", top: L + size * 0.1 + "px", width: size * 0.8 + "px", height: size * 0.8 + "px" });
    S.chip.style.setProperty("--tag-size", Math.max(9, Math.round(size * 0.038)) + "px");
    S.chip.style.setProperty("--chip-cover", Math.round(size * 0.6) + "px");
    S.chip.style.setProperty("--open-size", clamp(Math.round(size * 0.045), 10, 13) + "px");
    mark.querySelector(".mcu-open").textContent = size < 150 ? "Datasheet" : "Read my datasheet";
    // Long names: shrink the name until everything fits on the chip. If the
    // smallest size still doesn't fit, the tagline steps aside.
    const name = mark.querySelector(".mcu-name"), smallest = Math.max(11, Math.round(size * 0.075));
    // Measure the visible lines of text only (the button's click area covers
    // the whole chip on purpose, so it doesn't count)
    const fits = () => {
      const rects = Array.from(mark.children).map((el) => el.getBoundingClientRect()).filter((r) => r.height > 0);
      const used = Math.max.apply(null, rects.map((r) => r.bottom)) - Math.min.apply(null, rects.map((r) => r.top));
      return used <= mark.clientHeight + 1 && name.scrollWidth <= name.clientWidth + 1;
    };
    let px = Math.round(size * 0.115);
    mark.classList.remove("mcu-mark--tight");
    for (let tries = 0; tries < 40; tries++) {
      S.chip.style.setProperty("--name-size", px + "px");
      if (fits()) break;
      if (px <= smallest) {
        if (mark.classList.contains("mcu-mark--tight")) break;
        mark.classList.add("mcu-mark--tight");
        px = Math.round(size * 0.09);
        continue;
      }
      px = Math.max(smallest, px - Math.max(1, Math.round(size * 0.006)));
    }
  }

  // Where a pin's outer tip sits on the board
  function pinXY(side, i) {
    const G = S.G, half = G.S / 2 + G.L;
    const along = (side === "top" || side === "bottom" ? G.cx : G.cy) - G.span / 2 + i * G.step;
    if (side === "top") return { x: along, y: G.cy - half };
    if (side === "bottom") return { x: along, y: G.cy + half };
    if (side === "left") return { x: G.cx - half, y: along };
    return { x: G.cx + half, y: along };
  }

  // Parts that never move: mounting holes, crystal, caps, power LED, reset, power input
  function drawFixed() {
    const Parts = P.parts, G = S.G, W = G.W, H = G.H, k = G.S / 2 + G.L, top = G.top;
    let s = Parts.hole(22, top + 18, 8) + Parts.hole(W - 22, top + 18, 8) + Parts.hole(22, H - 22, 8) + Parts.hole(W - 22, H - 22, 8);
    if (!G.phone) {
      s += `<text class="mcu-silk" x="44" y="${H - 16}">${esc(String(S.site.name).toUpperCase())} MAINBOARD REV ${esc(S.site.revision || "A")}</text>`;
      s += `<text class="mcu-silk" x="${W - 44}" y="${H - 16}" text-anchor="end">2 layers, 1.6 mm, ENIG</text>`;
    }
    if (G.side) { S.fixed.innerHTML = s; return; }   // short screens: no room for the extra parts
    // Crystal and load caps on the two bottom pins of the left side
    const p13 = pinXY("left", 13), p14 = pinXY("left", 14), xx = p13.x - 44, my = (p13.y + p14.y) / 2;
    s += `<path class="mcu-tr" d="M${p13.x} ${p13.y}H${xx + 8}L${xx} ${my - 12}"/><path class="mcu-tr" d="M${p14.x} ${p14.y}H${xx + 8}L${xx} ${my + 12}"/>` +
      `<path class="mcu-tr" d="M${xx} ${my - 12}H${xx - 22}M${xx} ${my + 12}H${xx - 22}"/>` +
      Parts.crystal(xx, my, { rot: 90 }) + Parts.smd(xx - 30, my - 12, { cap: true }) + Parts.smd(xx - 30, my + 12, { cap: true }) +
      Parts.via(xx - 44, my - 12) + Parts.via(xx - 44, my + 12) + `<text class="pt-label" x="${xx + 14}" y="${my + 28}">Y1</text>`;
    // Decoupling caps at the top-left corner, power LED at the bottom-right
    s += Parts.smd(G.cx - k - 6, G.cy - k + 22, { rot: 90, cap: true }) + Parts.smd(G.cx - k + 22, G.cy - k - 6, { cap: true });
    s += Parts.led(G.cx + k + 18, G.cy + k + 18, { name: "D1 PWR", ly: 26 });
    // Reset switch on the third pin of the left side (NRST)
    const p3 = pinXY("left", 3), rx = G.cx - k - 40;
    s += `<path class="mcu-tr" d="M${p3.x} ${p3.y}H${rx + 13}"/>`;
    S.reset.style.left = rx + "px";
    S.reset.style.top = p3.y + 7 + "px";
    // Power in: J1, regulator U2, and C1, then a rail to the first pin on the left (VDD)
    if (G.wide) {
      const vdd = pinXY("left", 1), jx = 54, jy = top + 76;
      s += `<path class="mcu-tr" d="M${jx + 5} ${jy}H84V${jy - 36}H146V${jy + 32}H127V${jy + 25.2}"/>` +
        `<path class="mcu-tr" d="M118 ${jy + 25}V${vdd.y}H${vdd.x}"/><path class="mcu-rail-flow" d="M118 ${jy + 25}V${vdd.y}H${vdd.x}"/>` +
        `<path class="mcu-tr" d="M109 ${jy + 25}V${jy + 40}"/><path class="mcu-tr" d="M157 ${jy + 46}H118"/>` +
        Parts.header(jx, jy, { pins: 2, name: "J1 5V", ly: -12 }) +
        Parts.to220(118, jy, { part: "LD1117", sub: "3V3", name: "U2", ly: -42 }) +
        Parts.ecap(170, jy + 46, { name: "C1", lx: 20, ly: 4, anchor: "start" }) + Parts.via(109, jy + 43) +
        `<text class="mcu-bus is-on" x="${vdd.x - 8}" y="${vdd.y - 6}" text-anchor="end">3V3</text>`;
    }
    S.fixed.innerHTML = s;
  }

  // ---- Wiring --------------------------------------------------------------------
  function wireAll() {
    const G = S.G, used = { left1: true, left3: true, left13: true, left14: true };
    const EDGE = { top: "bottom", bottom: "top", left: "right", right: "left" };
    S.mods.forEach((m) => {
      const dx = m.x - G.cx, dy = m.y - G.cy;
      const side = Math.abs(dx) * (G.wide ? 0.75 : 1) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : dy > 0 ? "bottom" : "top";
      const vertical = side === "top" || side === "bottom";
      m.el.setAttribute("data-edge", EDGE[side]);
      const t = vertical ? m.x : m.y, c = vertical ? G.cx : G.cy;
      let i = clamp(Math.round((t - (c - G.span / 2)) / G.step), 1, 14), tries = 0;
      while (used[side + i] && tries < 16) { i = clamp(i + (i < 8 ? 1 : -1) * (1 + tries), 0, 15); tries++; }
      used[side + i] = true;
      m.side = side;
      m.vertical = vertical;
      m.pin = pinXY(side, i);
      let lx = m.pin.x, ly = m.pin.y, anchor = "start";
      if (side === "top") { lx += 6; ly -= 8; } else if (side === "bottom") { lx += 6; ly += 16; }
      else if (side === "right") { lx += 8; ly -= 7; } else { lx -= 8; ly -= 7; anchor = "end"; }
      m.label.setAttribute("x", lx);
      m.label.setAttribute("y", ly);
      m.label.setAttribute("text-anchor", anchor);
    });
    S.mods.forEach(wire);
  }

  // A board-style route: straight out of the pin, one 45-degree jog, straight in
  function route(a, b, vertical) {
    if (vertical) {
      const d = Math.abs(b.x - a.x), dy = b.y - a.y, ym = (a.y + b.y) / 2, sy = dy > 0 ? 1 : -1;
      if (Math.abs(dy) < d + 24) return `M${a.x} ${a.y}V${ym}H${b.x}V${b.y}`;
      return `M${a.x} ${a.y}V${ym - (sy * d) / 2}L${b.x} ${ym + (sy * d) / 2}V${b.y}`;
    }
    const d = Math.abs(b.y - a.y), dx = b.x - a.x, xm = (a.x + b.x) / 2, sx = dx > 0 ? 1 : -1;
    if (Math.abs(dx) < d + 24) return `M${a.x} ${a.y}H${xm}V${b.y}H${b.x}`;
    return `M${a.x} ${a.y}H${xm - (sx * d) / 2}L${xm + (sx * d) / 2} ${b.y}H${b.x}`;
  }

  function wire(m) {
    const r = m.hdr.getBoundingClientRect(), h = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    if (m.on) {
      const d = route(m.pin, h, m.vertical);
      m.trace.setAttribute("d", d);
      m.flow.setAttribute("d", d);
      m.rat.setAttribute("d", "");
    } else {
      m.rat.setAttribute("d", `M${m.pin.x} ${m.pin.y}L${h.x} ${h.y}`);
    }
    m.label.classList.toggle("is-on", m.on);
  }

  // Modules that aren't wired yet bob around; keep their ratsnest lines attached
  function tick() {
    if (!S) return;
    S.mods.forEach((m) => { if (!m.on) wire(m); });
    S.raf = requestAnimationFrame(tick);
  }

  // ---- Connecting -----------------------------------------------------------------
  function connect(m, openAfter) {
    if (m.on) { if (openAfter) openSheet(sheetFor(m), m.el, m); return; }
    m.on = true;
    m.el.classList.add("is-routing");
    wire(m);
    m.trace.getBoundingClientRect();
    m.trace.classList.add("is-drawn");
    m.flow.classList.add("is-on");
    later(() => { m.el.classList.add("is-on"); describe(m); updateCount(); }, reduce() ? 0 : 750);
    if (openAfter) later(() => openSheet(sheetFor(m), m.el, m), reduce() ? 0 : 900);
    S.said = true;
    say(`Routed on ${m.bus}. Close the datasheet to keep exploring, or autoroute the rest.`, `Routed on ${m.bus}.`);
  }

  function disconnect(m) {
    if (!m.on) return;
    m.on = false;
    m.el.classList.remove("is-on", "is-routing");
    m.trace.classList.remove("is-drawn");
    m.flow.classList.remove("is-on");
    describe(m);
    updateCount();
    wire(m);
  }

  function autoroute(list) {
    closeSheet();
    (list || S.mods).filter((m) => !m.on).forEach((m, n) => later(() => connect(m, false), reduce() ? 0 : n * 320));
  }

  function describe(m) {
    m.el.setAttribute("aria-label", `${m.title}, ${m.sub}. ` + (m.on ? `Connected on ${m.bus}. Press to open.` : "Not connected. Press to connect."));
  }

  function updateCount() {
    const n = S.mods.filter((m) => m.on).length;
    P.sevenSeg.show(S.seg, n);
    S.el.querySelector(".mcu-online__count").textContent = String(n);
    if (n && n === S.mods.length) say("Every module is online. Click any of them to read its datasheet.", "All modules online.");
  }

  // Short hints on phones, so the message never covers a module
  function say(long, short) { S.hint.textContent = S.G.phone ? short : long; }

  // ---- Dragging modules around ----------------------------------------------------
  function bindDrag(m) {
    let drag = null;
    m.el.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return;
      drag = { x: e.clientX, y: e.clientY, mx: m.x, my: m.y, moving: false };
      m.el.setPointerCapture(e.pointerId);
    });
    m.el.addEventListener("pointermove", (e) => {
      if (!drag) return;
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (!drag.moving && Math.hypot(dx, dy) < 6) return;
      drag.moving = true;
      m.el.classList.add("is-dragging");
      const G = S.G;
      m.x = clamp(drag.mx + dx, G.mw / 2 + 8, G.W - G.mw / 2 - 8);
      m.y = clamp(drag.my + dy, G.top + G.mh / 2 + 4, G.H - G.mh / 2 - 8);
      place(m);
      wireAll();
    });
    const end = () => {
      if (!drag) return;
      m.dragged = drag.moving;
      drag = null;
      m.el.classList.remove("is-dragging");
      setTimeout(() => { m.dragged = false; }, 0);
    };
    m.el.addEventListener("pointerup", end);
    m.el.addEventListener("pointercancel", end);
    m.el.addEventListener("click", () => { if (!m.dragged) connect(m, true); });
  }

  // ---- Buttons, keys, and links ---------------------------------------------------
  function bind() {
    const el = S.el;
    el.querySelector(".mcu-open").addEventListener("click", () => openAbout());
    el.querySelector("[data-close]").addEventListener("click", closeSheet);
    el.querySelector("[data-unplug]").addEventListener("click", () => {
      const m = S.current;
      closeSheet();
      if (m) disconnect(m);
    });
    el.querySelector("[data-autoroute]").addEventListener("click", () => autoroute());
    const resetAll = () => {
      closeSheet();
      S.mods.forEach(disconnect);
      say("Reset. Every module is unplugged again.", "Reset. All unplugged.");
    };
    S.reset.addEventListener("click", resetAll);
    el.querySelector("[data-reset]").addEventListener("click", resetAll);
    el.addEventListener("change", (e) => {
      if (e.target.name === "mcu-mask") root.setAttribute("data-mask", e.target.value);
    });
    // Links like #projects open that part of the board instead of jumping
    el.addEventListener("click", (e) => {
      const link = e.target.closest("a[href]");
      if (!link || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (link.getAttribute("href") === "#") { e.preventDefault(); return; }
      const id = P.modeKit.hashTarget(link);
      if (!id) return;
      e.preventDefault();
      navigate(id);
    });
    listen(document, "keydown", (e) => { if (e.key === "Escape") closeSheet(); });
    listen(window, "resize", layout);
  }
})();
