// The room around the bookcase: window, wall lights, painting, floor and rug.
// All of it is decoration (hidden from screen readers) and drawn with CSS and
// SVG, so there are no pictures to download.

import { html, raw } from '../../lib/html.mjs';

const RUG = raw(`
<svg viewBox="0 0 640 230" preserveAspectRatio="none" focusable="false">
  <defs>
    <pattern id="rug-lattice" width="36" height="36" patternUnits="userSpaceOnUse">
      <path d="M18 0 L36 18 L18 36 L0 18 Z" fill="none" stroke="#e0b95a" stroke-opacity=".22" stroke-width="1.4"/>
      <circle cx="18" cy="18" r="2.4" fill="#e0b95a" fill-opacity=".25"/>
    </pattern>
  </defs>
  <g stroke="#d9c79a" stroke-width="2" stroke-opacity=".7">
    ${Array.from({ length: 40 }, (_, i) => `<path d="M0 ${8 + i * 5.5} h-9 M640 ${8 + i * 5.5} h9"/>`).join('')}
  </g>
  <rect x="2" y="2" width="636" height="226" rx="3" fill="#4d0f1c"/>
  <rect x="2" y="2" width="636" height="226" rx="3" fill="url(#rug-lattice)"/>
  <rect x="9" y="9" width="622" height="212" fill="none" stroke="#d7ae52" stroke-width="5"/>
  <rect x="25" y="25" width="590" height="180" fill="#173a2f"/>
  <rect x="25" y="25" width="590" height="180" fill="url(#rug-lattice)" opacity=".7"/>
  <rect x="25" y="25" width="590" height="180" fill="none" stroke="#d7ae52" stroke-width="2.5"/>
  <rect x="43" y="43" width="554" height="144" fill="#5e1424"/>
  <rect x="43" y="43" width="554" height="144" fill="url(#rug-lattice)"/>
  <rect x="43" y="43" width="554" height="144" fill="none" stroke="#d7ae52" stroke-width="2"/>
  <ellipse cx="320" cy="115" rx="132" ry="52" fill="#173a2f"/>
  <ellipse cx="320" cy="115" rx="118" ry="44" fill="none" stroke="#d7ae52" stroke-width="2.5"/>
  <ellipse cx="320" cy="115" rx="84" ry="30" fill="#5e1424" stroke="#d7ae52" stroke-width="1.5"/>
  <path d="M320 92 L327 112 L348 115 L327 118 L320 138 L313 118 L292 115 L313 112 Z" fill="#e3bf63"/>
  <path d="M232 115 L252 108 L252 122 Z M408 115 L388 108 L388 122 Z" fill="#d7ae52"/>
</svg>`);

export function floor() {
  return html`
    <div class="room__floor" aria-hidden="true">
      <div class="floor__plane">
        <div class="floor__boards"></div>
        <div class="floor__moon"></div>
        <div class="floor__rug">${RUG}</div>
      </div>
      <div class="floor__sheen"></div>
    </div>`;
}

const sconce = (side) => html`
      <div class="sconce sconce--${side}">
        <i class="sconce__glow"></i><i class="sconce__plate"></i><i class="sconce__arm"></i>
        <i class="sconce__cup"></i><i class="sconce__wax"></i><i class="sconce__flame"></i>
      </div>`;

// A handful of dust specks drifting in the candlelight.
const dust = html`<div class="dust">${Array.from(
  { length: 16 },
  (_, i) =>
    html`<i style="--x:${(i * 37 + 11) % 100};--y:${(i * 53 + 7) % 90};--s:${1 + (i % 3)};--t:${9 + ((i * 5) % 9)};--delay:-${(i * 3) % 11}"></i>`,
)}</div>`;

export function scenery() {
  return html`
    <div class="scenery" aria-hidden="true" data-depth="-6">
      <div class="window">
        <div class="window__valance"></div>
        <div class="window__drape window__drape--left"></div>
        <div class="window__drape window__drape--right"></div>
        <div class="window__frame">
          <div class="window__glass"><i class="window__moon"></i><i class="window__hills"></i></div>
          <i class="window__bar window__bar--v"></i><i class="window__bar window__bar--h"></i>
        </div>
        <div class="window__sill"></div>
      </div>
      ${sconce('left')}
      ${sconce('right')}
      <div class="painting">
        <div class="painting__frame"><div class="painting__canvas"><i class="painting__sun"></i><i class="painting__hills"></i></div></div>
        <div class="painting__plate"></div>
      </div>
    </div>
    ${dust}`;
}
