/* ==========================================================================
   STYLE: BLUEPRINT. The drawing at the top of the home page: a flange in
   two views, with dimensions, a hatched section, and a part number made
   from your initials and SITE.revision.
   Its colors are in css/themes/blueprint.css. If you remove the blueprint
   style, delete this file and its STYLE: Blueprint line in index.html.
   ========================================================================== */
(function () {
  "use strict";

  const P = window.Portfolio;
  const { esc, initials } = P.util;
  P.art = P.art || {};

  // A full circle as a path, so it can be drawn on like a line
  function circle(cx, cy, r) {
    return `M${cx + r} ${cy}A${r} ${r} 0 1 1 ${cx - r} ${cy}A${r} ${r} 0 1 1 ${cx + r} ${cy}Z`;
  }

  P.art.blueprint = function (site, animate) {
    const part = esc(`${initials(site.name)}-001`);
    const rev = esc(String(site.revision || "A").toUpperCase());

    // Six bolt holes, 60 degrees apart, on a bolt circle of radius 72
    const holes = [0, 60, 120, 180, 240, 300]
      .map((degrees) => {
        const a = (degrees * Math.PI) / 180;
        const x = (170 + 72 * Math.cos(a)).toFixed(2);
        const y = (190 + 72 * Math.sin(a)).toFixed(2);
        return `<circle class="thick" cx="${x}" cy="${y}" r="9"/>`;
      })
      .join("");

    // The section view: the flange cut in half, with the hub on the right
    const top = "M400 90H426V144H458V160H400Z";
    const bottom = "M400 220H458V236H426V290H400Z";

    return `<svg class="art part${animate ? " is-drawing" : ""}" viewBox="0 0 560 380" aria-hidden="true" focusable="false">
      <defs>
        <pattern id="bp-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <path class="hatch" d="M0 0V7"/>
        </pattern>
      </defs>

      <g class="fade" style="--d:.3s">
        <path class="center" d="M54 190H286M170 76V304M388 190H472"/>
        <path class="center" d="${circle(170, 190, 72)}"/>
      </g>
      <path class="thick draw" pathLength="1" d="${circle(170, 190, 100)}"/>
      <path class="thick draw" pathLength="1" style="--d:.25s" d="${circle(170, 190, 46)}"/>
      <path class="thick draw" pathLength="1" style="--d:.35s" d="${circle(170, 190, 30)}"/>
      <g class="fade" style="--d:.75s">${holes}</g>

      <g class="fade" style="--d:1s"><path class="hatched" d="${top}${bottom}"/></g>
      <path class="thick draw" pathLength="1" style="--d:.6s" d="${top}"/>
      <path class="thick draw" pathLength="1" style="--d:.6s" d="${bottom}"/>

      <g class="fade" style="--d:.95s">
        <path class="cut" d="M170 58V72M170 308V322"/>
        <path class="thin" d="M170 58H188M170 322H188"/>
        <path class="fill" d="M196 58l-9-4v8zM196 322l-9-4v8z"/>
        <text x="202" y="63">A</text>
        <text x="202" y="327">A</text>
      </g>

      <g class="fade" style="--d:1.05s">
        <path class="thin" d="M148 90H34M148 290H34M44 90V290"/>
        <path class="fill" d="M44 90l-3.5 10h7zM44 290l-3.5-10h7z"/>
        <rect class="gap" x="35" y="166" width="18" height="48"/>
        <text transform="translate(49 190) rotate(-90)" text-anchor="middle">Ø200</text>

        <path class="thin" d="M400 86V60M458 140V60M400 68H458"/>
        <path class="fill" d="M400 68l10-3.5v7zM458 68l-10-3.5v7z"/>
        <text x="429" y="62" text-anchor="middle">58</text>

        <path class="thin" d="M462 144H492M462 236H492M484 144V236"/>
        <path class="fill" d="M484 144l-3.5 10h7zM484 236l-3.5-10h7z"/>
        <rect class="gap" x="475" y="168" width="18" height="44"/>
        <text transform="translate(489 190) rotate(-90)" text-anchor="middle">Ø92</text>

        <path class="thin" d="M212.4 121.3L246 86H292"/>
        <text x="250" y="81">6× Ø18</text>
      </g>

      <g class="fade" style="--d:1.15s">
        <text class="label" x="429" y="322" text-anchor="middle">SECTION A–A</text>
        <text x="429" y="344" text-anchor="middle">${part}  REV ${rev}</text>
      </g>
    </svg>`;
  };
})();
