import { raw } from '../../lib/html.mjs';

// A thin line, a diamond and two beads: the divider printers used between sections.
export const ornament = (className = 'ornament') =>
  raw(
    `<svg class="${className}" viewBox="0 0 240 20" aria-hidden="true" focusable="false">` +
      `<path d="M6 10 H96" fill="none" stroke="currentColor" stroke-width="1"/>` +
      `<path d="M144 10 H234" fill="none" stroke="currentColor" stroke-width="1"/>` +
      `<path d="M120 3 L127 10 L120 17 L113 10 Z" fill="currentColor"/>` +
      `<circle cx="104" cy="10" r="2.2" fill="currentColor"/>` +
      `<circle cx="136" cy="10" r="2.2" fill="currentColor"/>` +
      `</svg>`,
  );
