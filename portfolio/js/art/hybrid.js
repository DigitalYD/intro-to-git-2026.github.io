/* ==========================================================================
   STYLE: HYBRID. The drawing at the top of the home page: a fab drawing
   of a small circuit board, with your initials on the chip, your name on
   the silkscreen, and SITE.revision on the corner.
   Its colors are in css/themes/hybrid.css. If you remove the hybrid style,
   delete this file and its STYLE: Hybrid line in index.html.
   ========================================================================== */
(function () {
  "use strict";

  const P = window.Portfolio;
  const { esc, initials } = P.util;
  P.art = P.art || {};

  // Coordinates are in a 560 x 350 box. Each part has a delay (--d) so the
  // board appears first, then its parts, then the copper traces get routed.
  const OUTLINE = "M94 70H466A14 14 0 0 1 480 84V316A14 14 0 0 1 466 330H94A14 14 0 0 1 80 316V84A14 14 0 0 1 94 70Z";

  const TRACES = [
    "M273 168.5H290L298.5 160H414", // chip to connector J1
    "M273 177.5H300L302.5 180H414",
    "M273 195.5H310L314.5 200H414",
    "M273 213.5H320L326.5 220H414",
    "M273 231.5H330L338.5 240H414",
    "M167 195.5H146L141.5 191H129", // chip to crystal Y1
    "M167 204.5H146L141.5 209H129",
    "M251.5 253V272L275.5 296H296", // chip to resistor R1
    "M326 296H358", //                  R1 to the LED D1
    "M388 296H426",
    "M215.5 147V121", //                chip to vias
    "M233.5 147V130L245.5 118H330",
  ];

  P.art.hybrid = function (site, animate) {
    const name = String(site.name || "");
    const silkscreen = esc(name.length <= 30 ? name.toUpperCase() : initials(name));
    const mark = esc(initials(name));
    const rev = esc(String(site.revision || "A").toUpperCase());

    // 8 pins on each side of the chip, 9 units apart
    const offsets = [-31.5, -22.5, -13.5, -4.5, 4.5, 13.5, 22.5, 31.5];
    const pins = offsets
      .map((o) => `M167 ${200 + o}h11M262 ${200 + o}h11M${220 + o} 147v11M${220 + o} 242v11`)
      .join("");

    const holes = [[104, 94], [456, 94], [104, 306], [456, 306]]
      .map(([x, y]) => `<circle class="cu-ring" cx="${x}" cy="${y}" r="9"/><circle class="hole" cx="${x}" cy="${y}" r="4.5"/>`)
      .join("");

    const headerPads = [160, 180, 200, 220, 240]
      .map((y, i) => (i === 0
        ? `<rect class="cu-pad" x="414" y="${y - 6}" width="12" height="12"/>`
        : `<circle class="cu-pad" cx="420" cy="${y}" r="6"/>`) +
        `<circle class="hole" cx="420" cy="${y}" r="2.2"/>`)
      .join("");

    const traces = TRACES
      .map((d, i) => `<path class="cu-trace draw draw--fast" pathLength="1" style="--d:${(1.25 + i * 0.05).toFixed(2)}s" d="${d}"/>`)
      .join("");

    const vias = [[215.5, 117], [334, 118], [430, 296]]
      .map(([x, y]) => `<circle class="cu-ring cu-ring--via" cx="${x}" cy="${y}" r="4"/><circle class="hole" cx="${x}" cy="${y}" r="1.6"/>`)
      .join("");

    return `<svg class="art board${animate ? " is-drawing" : ""}" viewBox="0 0 560 350" aria-hidden="true" focusable="false">
      <path class="board-fill fade" style="--d:.3s" d="${OUTLINE}"/>
      <path class="ln draw" pathLength="1" d="${OUTLINE}"/>
      <g class="fade" style="--d:.7s">${holes}</g>

      <path class="dim-ln draw" pathLength="1" style="--d:.5s" d="M80 62V26"/>
      <path class="dim-ln draw" pathLength="1" style="--d:.5s" d="M480 62V26"/>
      <path class="dim-ln draw" pathLength="1" style="--d:.6s" d="M80 40H480"/>
      <path class="dim-ln draw" pathLength="1" style="--d:.5s" d="M72 70H36"/>
      <path class="dim-ln draw" pathLength="1" style="--d:.5s" d="M72 330H36"/>
      <path class="dim-ln draw" pathLength="1" style="--d:.6s" d="M50 70V330"/>
      <path class="dim-ln draw" pathLength="1" style="--d:.8s" d="M462.4 87.6L492 58H548"/>
      <g class="fade" style="--d:.95s">
        <path class="dim-fill" d="M80 40l10-3.5v7zM480 40l-10-3.5v7zM50 70l-3.5 10h7zM50 330l-3.5-10h7z"/>
        <rect class="gap" x="253" y="31" width="54" height="18"/>
        <text x="280" y="45" text-anchor="middle">60.0</text>
        <rect class="gap" x="41" y="174" width="18" height="52"/>
        <text transform="translate(55 200) rotate(-90)" text-anchor="middle">39.0</text>
        <text x="495" y="52">4× Ø3.2</text>
      </g>

      <path class="ln draw" pathLength="1" style="--d:.65s" d="M178 158H262V242H178Z"/>
      <path class="silk-ln draw" pathLength="1" style="--d:.75s" d="M118 180h12a10 10 0 0 1 10 10v20a10 10 0 0 1-10 10h-12a10 10 0 0 1-10-10v-20a10 10 0 0 1 10-10Z"/>
      <path class="silk-ln draw" pathLength="1" style="--d:.75s" d="M408 148H432V252H408Z"/>
      <path class="silk-ln draw" pathLength="1" style="--d:.8s" d="M290 286H332V306H290Z"/>
      <path class="silk-ln draw" pathLength="1" style="--d:.8s" d="M389 296A16 16 0 1 1 357 296A16 16 0 1 1 389 296Z"/>

      <g class="fade" style="--d:1s">
        <path class="cu-pin" d="${pins}"/>
        <rect class="cu-pad" x="119" y="186.5" width="10" height="9"/>
        <rect class="cu-pad" x="119" y="204.5" width="10" height="9"/>
        ${headerPads}
        <rect class="cu-pad" x="296" y="291" width="8" height="10"/>
        <rect class="cu-pad" x="318" y="291" width="8" height="10"/>
        <rect class="cu-pad" x="358" y="291" width="8" height="10"/>
        <rect class="cu-pad" x="380" y="291" width="8" height="10"/>
        <circle class="ink-dot" cx="187" cy="167" r="2.6"/>
      </g>

      ${traces}
      <g class="fade" style="--d:1.9s">${vias}</g>

      <g class="fade" style="--d:1.05s">
        <text class="silk" x="128" y="104">${silkscreen}</text>
        <text class="silk" x="128" y="320">REV ${rev}</text>
        <text class="silk" x="166" y="140">U1</text>
        <text class="silk" x="408" y="140">J1</text>
        <text class="silk" x="108" y="172">Y1</text>
        <text class="silk" x="290" y="279">R1</text>
        <text class="silk" x="352" y="272">D1</text>
        <text class="chip-mark" x="220" y="209" text-anchor="middle">${mark}</text>
      </g>

      <circle class="led${site.status ? "" : " led--off"} fade" style="--d:2.1s" cx="373" cy="296" r="5"/>
    </svg>`;
  };
})();
