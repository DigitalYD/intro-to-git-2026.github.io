/* ==========================================================================
   Section type "gallery": a grid of pictures with captions. Pictures keep
   their real colors here. Project pages use this for their `gallery` too.
   Fields: images: [{ src, alt, caption }]
   ========================================================================== */
(function () {
  "use strict";

  const { esc, img } = window.Portfolio.util;

  window.Portfolio.sections.gallery = function (section) {
    const images = (section.images || []).filter((image) => image && image.src);
    const figures = images.map((image, i) => `<figure class="fig">
        <div class="fig__media">${img({ src: image.src, alt: image.alt || image.caption || "" })}</div>
        <figcaption><span class="fig__num">Fig. ${i + 1}</span>${esc(image.caption || "")}</figcaption>
      </figure>`);
    return `<div class="gallery">${figures.join("")}</div>`;
  };
})();
