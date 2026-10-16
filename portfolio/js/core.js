/* ==========================================================================
   js/core.js: small helpers that every page uses.
   You don't need to edit this file to change your content.
   ========================================================================== */
(function () {
  "use strict";

  const Portfolio = (window.Portfolio = window.Portfolio || {});

  // Section types add themselves to this object. See js/sections/.
  Portfolio.sections = Portfolio.sections || {};

  // Makes text safe to put inside HTML, so "<" and "&" show up as typed.
  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  // Allows normal links: https:, mailto:, tel:, #sections, and files in this
  // folder. Anything else (like javascript:) becomes a harmless "#".
  function safeUrl(url) {
    const value = String(url == null ? "" : url).trim();
    if (/^(https?:|mailto:|tel:)/i.test(value)) return value;
    if (/^[a-z][a-z0-9+.-]*:/i.test(value)) return "#";
    return value;
  }

  // Websites and PDFs open in a new tab. Sections and pages on this site don't.
  function linkAttrs(url) {
    const value = String(url || "");
    const external = /^https?:/i.test(value) || /\.pdf($|[?#])/i.test(value);
    return external ? ' target="_blank" rel="noopener"' : "";
  }

  // "My Cool Section!" becomes "my-cool-section"
  function slug(text) {
    return String(text || "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  // "Jordan Park" becomes "JP"
  function initials(name) {
    const words = String(name || "").trim().split(/\s+/).filter(Boolean);
    if (!words.length) return "?";
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }

  // Drawing revisions skip I, O, Q, S, X, and Z so they can't be mistaken
  // for numbers. 0 is "A", 1 is "B", and after "Y" comes "AA".
  const REV_LETTERS = "ABCDEFGHJKLMNPRTUVWY";
  function revLetter(index) {
    let n = Math.max(0, index);
    let out = "";
    do {
      out = REV_LETTERS[n % REV_LETTERS.length] + out;
      n = Math.floor(n / REV_LETTERS.length) - 1;
    } while (n >= 0);
    return out;
  }

  // Formatting inside one line of text that has already been escaped.
  function inline(text) {
    return text
      .replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (match, alt, src) =>
        `<img class="md-img" src="${safeUrl(src)}" alt="${alt}" loading="lazy" onerror="Portfolio.util.missingImage(this)">`)
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (match, label, url) =>
        `<a href="${safeUrl(url)}"${linkAttrs(url)}>${label}</a>`)
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/(^|[^*])\*([^*\s][^*]*)\*/g, "$1<em>$2</em>");
  }

  // A tiny Markdown-style formatter for the long text in your content files:
  //   **bold**   *italic*   `code`   [link text](https://...)   ![alt](path)
  //   A line starting with "- " is a list item, "## " is a small heading,
  //   an image alone on its line becomes a figure, and an empty line starts
  //   a new paragraph.
  function md(text, options) {
    const heading = (options && options.heading) || "h3";
    const lines = String(text == null ? "" : text).replace(/\r\n?/g, "\n").split("\n");
    const out = [];
    let paragraph = [];
    let list = [];

    const endParagraph = () => {
      if (paragraph.length) out.push(`<p>${inline(esc(paragraph.join(" ")))}</p>`);
      paragraph = [];
    };
    const endList = () => {
      if (list.length) out.push(`<ul>${list.map((item) => `<li>${inline(esc(item))}</li>`).join("")}</ul>`);
      list = [];
    };

    lines.forEach((raw) => {
      const line = raw.trim();
      let match;
      if (!line) {
        endParagraph();
        endList();
      } else if ((match = line.match(/^#{1,6}\s+(.*)$/))) {
        endParagraph();
        endList();
        out.push(`<${heading}>${inline(esc(match[1]))}</${heading}>`);
      } else if ((match = line.match(/^[-*]\s+(.*)$/))) {
        endParagraph();
        list.push(match[1]);
      } else if ((match = line.match(/^!\[([^\]]*)\]\(([^)\s]+)\)$/))) {
        endParagraph();
        endList();
        out.push(`<figure class="md-figure">${img({ src: match[2], alt: match[1] })}` +
          `${match[1] ? `<figcaption>${esc(match[1])}</figcaption>` : ""}</figure>`);
      } else {
        endList();
        paragraph.push(line);
      }
    });
    endParagraph();
    endList();
    return out.join("");
  }

  // An <img> for a path from your content files. When SITE.tintPhotos is on,
  // photos (jpg, png, webp...) get the blueprint tint; drawings (.svg) never do.
  function img(options) {
    const src = String(options.src || "");
    const site = window.SITE || {};
    const tint = Boolean(options.tint) && site.tintPhotos !== false && !/\.svg($|[?#])/i.test(src);
    const loading = options.eager ? "" : ' loading="lazy"';
    const tag = `<img src="${esc(safeUrl(src))}" alt="${esc(options.alt || "")}"${loading} decoding="async" onerror="Portfolio.util.missingImage(this)">`;
    return `<span class="media${tint ? " tint" : ""}">${tag}</span>`;
  }

  // Shown instead of an image whose file can't be found.
  function missingImage(el) {
    const path = el.getAttribute("src") || "";
    const box = document.createElement("span");
    box.className = "missing";
    box.setAttribute("role", "img");
    box.setAttribute("aria-label", el.getAttribute("alt") || "Missing image");
    box.innerHTML = `<span>Image not found</span><code>${esc(path)}</code>`;
    el.replaceWith(box);
    console.warn(`[portfolio] Image not found: "${path}". Check the path and the capital letters in the file name.`);
  }

  // A red box that says what went wrong and how to fix it.
  // `title` is plain text; `detail` may contain HTML you've already escaped.
  function errorBox(title, detail) {
    return `<div class="redline" role="alert"><p class="redline__title">${esc(title)}</p>` +
      `${detail ? `<p>${detail}</p>` : ""}</div>`;
  }

  // Did one of your files fail to load? Returns what the browser reported,
  // if anything. Errors are collected by the small script in index.html.
  function problemWith(file) {
    const list = window.__portfolioErrors || [];
    return list.find((entry) => entry.file && entry.file.indexOf(file) !== -1) || null;
  }

  Portfolio.util = {
    esc,
    safeUrl,
    linkAttrs,
    slug,
    initials,
    revLetter,
    inline,
    md,
    img,
    missingImage,
    errorBox,
    problemWith,
  };
})();
