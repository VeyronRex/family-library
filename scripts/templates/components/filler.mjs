// The decorative things on the shelves: old books that are not links, and a few
// objects. They exist only to make the room feel real, so they are hidden from
// screen readers.

import { html } from '../../lib/html.mjs';

export function tome(t) {
  return html`<span class="tome" data-tone="${t.tone}" style="--w:${t.w};--h:${t.h}">${
    t.bands >= 1 ? html`<i class="tome__band tome__band--top"></i>` : ''
  }${t.bands >= 2 ? html`<i class="tome__band tome__band--bottom"></i>` : ''}${
    t.plate ? html`<i class="tome__plate"></i>` : ''
  }</span>`;
}

const flat = (tone, w, h) => html`<i data-tone="${tone}" style="--w:${w};--h:${h}"></i>`;

const OBJECTS = {
  'candle-stack': () => html`<span class="object object--candle" aria-hidden="true">
      <span class="flatbooks">${flat('oxblood', 100, 18)}${flat('forest', 92, 16)}${flat('umber', 98, 15)}</span>
      <span class="candle">
        <i class="candle__glow"></i><i class="candle__dish"></i><i class="candle__stem"></i>
        <i class="candle__wax"></i><i class="candle__flame"></i>
      </span>
    </span>`,

  armillary: () => html`<span class="object object--armillary" aria-hidden="true">
      <svg viewBox="0 0 80 100" focusable="false">
        <g fill="none" stroke="url(#foil)" stroke-linecap="round">
          <path d="M24 98 H56 M40 98 V82 M29 82 H51" stroke-width="3"/>
          <circle cx="40" cy="46" r="34" stroke-width="2.6"/>
          <ellipse cx="40" cy="46" rx="34" ry="11" stroke-width="2"/>
          <ellipse cx="40" cy="46" rx="13" ry="34" stroke-width="1.8"/>
          <ellipse cx="40" cy="46" rx="25" ry="34" stroke-width="1.6" transform="rotate(26 40 46)"/>
          <path d="M40 8 V84" stroke-width="1.4"/>
        </g>
        <circle cx="40" cy="46" r="7.5" fill="url(#foil)"/>
      </svg>
    </span>`,

  stack: () => html`<span class="object object--stack" aria-hidden="true">
      <span class="flatbooks">${flat('navy', 100, 17)}${flat('oxblood', 94, 15)}${flat('olive', 98, 16)}${flat('umber', 88, 14)}</span>
      <i class="scroll"></i>
    </span>`,
};

export const objectFor = (name) => (OBJECTS[name] ?? (() => ''))();
