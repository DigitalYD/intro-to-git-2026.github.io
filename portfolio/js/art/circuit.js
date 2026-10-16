/* ==========================================================================
   STYLE: CIRCUIT BOARD. The drawing at the top of the home page: an
   oscilloscope showing two signals, with your name and SITE.revision on
   the screen. The traces sweep across when the page opens.
   Its colors are in css/themes/circuit.css. If you remove the circuit
   board style, delete this file and its STYLE: Circuit board line in
   index.html.
   ========================================================================== */
(function () {
  "use strict";

  const P = window.Portfolio;
  const { esc, initials } = P.util;
  P.art = P.art || {};

  P.art.circuit = function (site, animate) {
    const name = String(site.name || "");
    const label = esc(name.length <= 24 ? name.toUpperCase() : initials(name));
    const rev = esc(String(site.revision || "A").toUpperCase());

    // The screen grid: 10 divisions across (36 units each), 8 down (28 each)
    const grid =
      [80, 116, 152, 188, 260, 296, 332, 368].map((x) => `M${x} 78V302`).join("") +
      [106, 134, 162, 218, 246, 274].map((y) => `M44 ${y}H404`).join("");

    // Small ticks along the two center lines, five per division
    let ticks = "";
    for (let x = 44; x <= 404.01; x += 7.2) ticks += `M${x.toFixed(1)} 187v6`;
    for (let y = 78; y <= 302.01; y += 5.6) ticks += `M221 ${y.toFixed(1)}h6`;

    return `<svg class="art scope${animate ? " is-drawing" : ""}" viewBox="0 0 560 380" aria-hidden="true" focusable="false">
      <rect class="case fade" style="--d:0s" x="20" y="30" width="520" height="320" rx="16"/>
      <rect class="screen fade" style="--d:.1s" x="44" y="54" width="360" height="272" rx="3"/>
      <rect class="bar fade" style="--d:.15s" x="45" y="55" width="358" height="23"/>
      <rect class="bar fade" style="--d:.15s" x="45" y="302" width="358" height="23"/>
      <path class="grid fade" style="--d:.25s" d="${grid}"/>
      <path class="axis fade" style="--d:.3s" d="M224 78V302M44 190H404${ticks}"/>

      <path class="ch1 draw draw--sweep" pathLength="1" style="--d:.45s" d="M44 134Q80 66 116 134T188 134T260 134T332 134T404 134"/>
      <path class="ch2 draw draw--sweep" pathLength="1" style="--d:.6s" d="M44 270H62V226H98V270H134V226H170V270H206V226H242V270H278V226H314V270H350V226H386V270H404"/>

      <g class="fade" style="--d:1.6s">
        <path class="ch1-fill" d="M44 128l8 6-8 6z"/>
        <path class="ch2-fill" d="M44 242l8 6-8 6z"/>
        <path class="ch1-fill" d="M404 128l-8 6 8 6z"/>
      </g>
      <g class="fade" style="--d:1.7s">
        <text class="t-label" x="54" y="71">${label}</text>
        <text x="394" y="71" text-anchor="end">REV ${rev}</text>
        <text class="t-ch1" x="54" y="319">CH1 1.00 kHz</text>
        <text class="t-ch2" x="188" y="319">CH2 3.30 Vpp</text>
        <text x="394" y="319" text-anchor="end">1 ms/div</text>
      </g>

      <g class="fade" style="--d:.2s">
        <circle class="knob" cx="473" cy="104" r="24"/><circle class="knob-cap" cx="473" cy="104" r="16"/><path class="tick" d="M473 104V86"/>
        <circle class="knob" cx="473" cy="176" r="20"/><circle class="knob-cap" cx="473" cy="176" r="13"/><path class="tick" d="M473 176l11-11"/>
        <circle class="knob" cx="449" cy="242" r="13"/><path class="tick" d="M449 242v-9"/>
        <circle class="knob" cx="497" cy="242" r="13"/><path class="tick" d="M497 242l7-6"/>
        <text x="449" y="270" text-anchor="middle">CH1</text>
        <text x="497" y="270" text-anchor="middle">CH2</text>
        <rect class="key" x="434" y="282" width="30" height="12" rx="2"/>
        <rect class="key" x="482" y="282" width="30" height="12" rx="2"/>
        <circle class="bnc" cx="449" cy="322" r="10"/><circle class="bnc-pin" cx="449" cy="322" r="3"/>
        <circle class="bnc" cx="497" cy="322" r="10"/><circle class="bnc-pin" cx="497" cy="322" r="3"/>
      </g>
    </svg>`;
  };
})();
