/* ==========================================================================
   js/modes/parts.js: drawings of real circuit board parts for the MCU style
   (resistors, chips, capacitors, a crystal, an LED, headers...), plus the
   seven-segment display in its top bar. Each part is an SVG string whose
   colors come from css/themes/mcu.css.

   STYLE: MCU. Delete this file only if you delete the MCU style too.
   ========================================================================== */
var Parts = (function () {
  "use strict";
  function n(v) { return Math.round(v * 100) / 100; }

  function wrap(x, y, o, cls, inner) {
    o = o || {};
    var t = "translate(" + n(x) + " " + n(y) + ")" + (o.rot ? " rotate(" + o.rot + ")" : "") + (o.scale ? " scale(" + o.scale + ")" : "");
    var out = '<g class="pt ' + cls + (o.cls ? " " + o.cls : "") + '" transform="' + t + '"' + (o.attrs || "") + ">" + inner + "</g>";
    if (o.name) {
      out += '<text class="pt-label" x="' + n(x + (o.lx || 0)) + '" y="' + n(y + (o.ly || 0)) + '" text-anchor="' + (o.anchor || "middle") + '">' + o.name + "</text>";
    }
    return out;
  }

  // A plated through-hole: copper ring with a drilled hole
  function ring(x, y, r, square) {
    var hole = '<circle class="pt-hole" cx="' + x + '" cy="' + y + '" r="' + n(r * 0.4) + '"/>';
    if (square) {
      return '<rect class="pt-pad" x="' + n(x - r) + '" y="' + n(y - r) + '" width="' + n(2 * r) + '" height="' + n(2 * r) + '" rx="1"/>' + hole;
    }
    return '<circle class="pt-pad" cx="' + x + '" cy="' + y + '" r="' + r + '"/>' + hole;
  }

  // Resistor color codes: first digit, second digit, multiplier
  var BANDS = {
    "220": ["#d63a2a", "#d63a2a", "#7a4a1f"],
    "1k": ["#7a4a1f", "#161616", "#d63a2a"],
    "4k7": ["#e7c62f", "#8a3fd1", "#d63a2a"],
    "10k": ["#7a4a1f", "#161616", "#e07a1f"],
    "100k": ["#7a4a1f", "#161616", "#e7c62f"]
  };

  var P = {};

  // Axial resistor with color bands. Pads 64 apart, along x.
  P.resistor = function (x, y, o) {
    o = o || {};
    var b = BANDS[o.value] || BANDS["10k"];
    var inner =
      '<path class="pt-lead" d="M-29 0H-15M15 0H29"/>' +
      '<rect class="pt-res" x="-15" y="-5.5" width="30" height="11" rx="4.5"/>' +
      '<rect x="-10" y="-5.5" width="3" height="11" fill="' + b[0] + '"/>' +
      '<rect x="-5" y="-5.5" width="3" height="11" fill="' + b[1] + '"/>' +
      '<rect x="0" y="-5.5" width="3" height="11" fill="' + b[2] + '"/>' +
      '<rect x="7" y="-5.5" width="3" height="11" fill="#c9a43a"/>' +
      ring(-32, 0, 3.6) + ring(32, 0, 3.6);
    return wrap(x, y, o, "pt-r", inner);
  };

  // TO-92 transistor (like a 2N3904). Pads E, B, C sit on y = 0 so the
  // part drops straight onto a trace; the half-round body is above them.
  P.transistor = function (x, y, o) {
    o = o || {};
    var inner =
      '<path class="pt-on" d="M-8 0H8"/>' +
      ring(-8, 0, 3.1) + ring(0, 0, 3.1) + ring(8, 0, 3.1) +
      '<path class="pt-body" d="M-11.5 -4.5H11.5A12.5 12.5 0 1 0 -11.5 -4.5Z"/>' +
      '<text class="pt-mark" x="0" y="-10.5" text-anchor="middle">' + (o.part || "3904") + "</text>";
    return wrap(x, y, o, "pt-q", inner);
  };

  // 5 mm LED from above: silkscreen circle with the cathode flat, and the dome
  P.led = function (x, y, o) {
    var inner =
      '<circle class="pt-led-halo" r="17"/>' +
      '<path class="pt-silk" d="M8.6 -6.2A10.6 10.6 0 1 0 8.6 6.2Z"/>' +
      '<circle class="pt-led-dome" r="7.4"/>' +
      '<circle class="pt-led-shine" cx="-2.6" cy="-2.6" r="2"/>';
    return wrap(x, y, o, "pt-led", inner);
  };

  // Electrolytic capacitor from above: sleeve, minus stripe, scored aluminum top
  P.ecap = function (x, y, o) {
    var inner =
      '<circle class="pt-ecap-sleeve" r="13"/>' +
      '<path class="pt-ecap-stripe" d="M8.4 -9.9A13 13 0 0 1 8.4 9.9"/>' +
      '<circle class="pt-ecap-top" r="10.4"/>' +
      '<path class="pt-ecap-vent" d="M-4.6 -4.6L4.6 4.6M4.6 -4.6L-4.6 4.6"/>';
    return wrap(x, y, o, "pt-ce", inner);
  };

  // Ceramic disc capacitor
  P.ccap = function (x, y, o) {
    var inner =
      '<path class="pt-lead" d="M-13 0H-6M6 0H13"/>' + ring(-15, 0, 3.1) + ring(15, 0, 3.1) +
      '<ellipse class="pt-ccap" rx="8.5" ry="6.5"/>' +
      '<text class="pt-mark pt-mark--cap" x="0" y="2.2" text-anchor="middle">104</text>';
    return wrap(x, y, o, "pt-cc", inner);
  };

  // Axial diode: black body, silver band on the cathode end
  P.diode = function (x, y, o) {
    var inner =
      '<path class="pt-lead" d="M-25 0H-12M12 0H25"/>' +
      '<rect class="pt-body" x="-12" y="-5" width="24" height="10" rx="2"/>' +
      '<rect class="pt-band" x="6" y="-5" width="3.5" height="10"/>' +
      ring(-28, 0, 3.4) + ring(28, 0, 3.4);
    return wrap(x, y, o, "pt-d", inner);
  };

  // Surface-mount 0805 resistor (black) or capacitor (tan)
  P.smd = function (x, y, o) {
    o = o || {};
    var inner =
      '<rect class="pt-smdpad" x="-8.5" y="-3.6" width="4.8" height="7.2" rx="0.6"/>' +
      '<rect class="pt-smdpad" x="3.7" y="-3.6" width="4.8" height="7.2" rx="0.6"/>' +
      '<rect class="' + (o.cap ? "pt-smd-c" : "pt-smd-r") + '" x="-4.4" y="-3.2" width="8.8" height="6.4"/>';
    return wrap(x, y, o, "pt-s", inner);
  };

  // DIP chip: black body, notch, pin-1 dot, pins down both long sides
  P.dip = function (x, y, o) {
    o = o || {};
    var half = (o.pins || 8) / 2, len = half * 10 + 6, inner = "";
    for (var i = 0; i < half; i++) {
      var px = -len / 2 + 8 + i * 10;
      inner += '<rect class="pt-pin" x="' + (px - 2) + '" y="-17" width="4" height="5.5"/>' +
        '<rect class="pt-pin" x="' + (px - 2) + '" y="11.5" width="4" height="5.5"/>';
    }
    inner +=
      '<rect class="pt-body" x="' + (-len / 2) + '" y="-12" width="' + len + '" height="24" rx="2"/>' +
      '<circle class="pt-notch" cx="' + (-len / 2) + '" cy="0" r="4.2"/>' +
      '<circle class="pt-dot" cx="' + (-len / 2 + 7) + '" cy="6.5" r="1.6"/>' +
      '<text class="pt-mark" x="0" y="2.2" text-anchor="middle">' + (o.part || "NE555") + "</text>";
    return wrap(x, y, o, "pt-u", inner);
  };

  // TO-220 voltage regulator: metal tab with a hole, body, three legs
  P.to220 = function (x, y, o) {
    o = o || {};
    var inner =
      '<rect class="pt-tab" x="-15" y="-28" width="30" height="16" rx="1.5"/>' +
      '<circle class="pt-hole" cx="0" cy="-20" r="4.2"/>' +
      '<path class="pt-lead" d="M-9 10V19M0 10V19M9 10V19"/>' +
      ring(-9, 22, 3.2) + ring(0, 22, 3.2) + ring(9, 22, 3.2) +
      '<rect class="pt-body" x="-15" y="-12" width="30" height="22" rx="1.5"/>' +
      '<text class="pt-mark" x="0" y="-2" text-anchor="middle">' + (o.part || "LD1117") + "</text>" +
      '<text class="pt-mark" x="0" y="5" text-anchor="middle">' + (o.sub || "3V3") + "</text>";
    return wrap(x, y, o, "pt-reg", inner);
  };

  // Pin header (2.54 mm pitch)
  P.header = function (x, y, o) {
    o = o || {};
    var pins = o.pins || 2, w = pins * 10;
    var inner = '<rect class="pt-hdr" x="' + (-w / 2) + '" y="-5" width="' + w + '" height="10" rx="1"/>';
    for (var i = 0; i < pins; i++) inner += '<rect class="pt-pinsq" x="' + (-w / 2 + 3 + i * 10) + '" y="-2" width="4" height="4"/>';
    return wrap(x, y, o, "pt-j", inner);
  };

  // HC-49 crystal: an oblong metal can over two leads
  P.crystal = function (x, y, o) {
    o = o || {};
    var inner = ring(-12, 0, 3) + ring(12, 0, 3) +
      '<rect class="pt-can" x="-17" y="-8" width="34" height="16" rx="8"/>' +
      '<rect class="pt-can-hi" x="-12" y="-5" width="24" height="3.5" rx="1.75"/>' +
      '<text class="pt-mark pt-mark--can" x="0" y="5" text-anchor="middle">' + (o.part || "8.000") + "</text>";
    return wrap(x, y, o, "pt-x", inner);
  };

  // SOIC-8 chip, like a flash memory
  P.soic = function (x, y, o) {
    o = o || {};
    var inner = "";
    for (var i = 0; i < 4; i++) {
      var px = -7.5 + i * 5;
      inner += '<rect class="pt-pin" x="' + (px - 1.2) + '" y="-11" width="2.4" height="4"/>' +
        '<rect class="pt-pin" x="' + (px - 1.2) + '" y="7" width="2.4" height="4"/>';
    }
    inner += '<rect class="pt-body" x="-11" y="-7" width="22" height="14" rx="1"/>' +
      '<circle class="pt-dot" cx="-8" cy="4" r="1.2"/>' +
      '<text class="pt-mark" x="0" y="1.8" text-anchor="middle">' + (o.part || "W25Q") + "</text>";
    return wrap(x, y, o, "pt-soic", inner);
  };

  P.hole = function (x, y, r) {
    r = r || 8;
    return '<g class="pt pt-mh"><circle class="pt-pad" cx="' + n(x) + '" cy="' + n(y) + '" r="' + r + '"/>' +
      '<circle class="pt-hole" cx="' + n(x) + '" cy="' + n(y) + '" r="' + n(r * 0.52) + '"/></g>';
  };

  P.via = function (x, y) {
    return '<g class="pt pt-via"><circle class="pt-pad" cx="' + n(x) + '" cy="' + n(y) + '" r="2.8"/>' +
      '<circle class="pt-hole" cx="' + n(x) + '" cy="' + n(y) + '" r="1.1"/></g>';
  };

  return P;
})();

/* ---- Seven-segment display ------------------------------------------------ */
var SevenSeg = (function () {
  "use strict";
  var MAP = { "0": "abcdef", "1": "bc", "2": "abged", "3": "abgcd", "4": "fgbc", "5": "afgcd",
              "6": "afgedc", "7": "abc", "8": "abcdefg", "9": "abcdfg", "-": "g", " ": "" };
  var W = 20, H = 36, T = 4.2, G = 1.3, STEP = 33;
  function hseg(x1, x2, y) { return [[x1, y], [x1 + T / 2, y - T / 2], [x2 - T / 2, y - T / 2], [x2, y], [x2 - T / 2, y + T / 2], [x1 + T / 2, y + T / 2]]; }
  function vseg(x, y1, y2) { return [[x, y1], [x + T / 2, y1 + T / 2], [x + T / 2, y2 - T / 2], [x, y2], [x - T / 2, y2 - T / 2], [x - T / 2, y1 + T / 2]]; }
  var SEGS = {
    a: hseg(G, W - G, 0), g: hseg(G, W - G, H / 2), d: hseg(G, W - G, H),
    f: vseg(0, G, H / 2 - G), b: vseg(W, G, H / 2 - G), e: vseg(0, H / 2 + G, H - G), c: vseg(W, H / 2 + G, H - G)
  };
  function points(list) { return list.map(function (p) { return p[0].toFixed(1) + "," + p[1].toFixed(1); }).join(" "); }

  // Fill an <svg> with `digits` slanted digits, all segments off
  function create(svg, digits) {
    var s = "";
    for (var i = 0; i < digits; i++) {
      s += '<g class="ss-digit" transform="translate(' + (10 + i * STEP) + ' 5) skewX(-8)">';
      for (var key in SEGS) s += '<polygon class="ss-seg" data-seg="' + key + '" points="' + points(SEGS[key]) + '"/>';
      s += "</g>";
    }
    svg.setAttribute("viewBox", "0 0 " + (10 + (digits - 1) * STEP + W + 10) + " " + (H + 10));
    svg.innerHTML = s;
  }

  // Light the segments for a number, right-aligned
  function show(svg, value) {
    var digits = svg.querySelectorAll(".ss-digit");
    var str = String(value);
    while (str.length < digits.length) str = " " + str;
    str = str.slice(-digits.length);
    Array.prototype.forEach.call(digits, function (digit, i) {
      var lit = MAP[str[i]] || "";
      Array.prototype.forEach.call(digit.querySelectorAll(".ss-seg"), function (seg) {
        seg.classList.toggle("on", lit.indexOf(seg.getAttribute("data-seg")) !== -1);
      });
    });
  }
  return { create: create, show: show };
})();

window.Portfolio = window.Portfolio || {};
window.Portfolio.parts = Parts;
window.Portfolio.sevenSeg = SevenSeg;
