import { html, raw } from '../../lib/html.mjs';
import { emblems } from '../../lib/emblems.mjs';

// The gold-leaf colour is set right on the drawing, so it works wherever the
// emblem is used. A stylesheet can still recolour it (page.css makes it ink).
export function emblem(name, className = 'emblem') {
  return html`<svg class="${className}" viewBox="0 0 100 100" fill="url(#foil)" stroke="url(#foil)" aria-hidden="true" focusable="false">${raw(emblems[name] ?? '')}</svg>`;
}
