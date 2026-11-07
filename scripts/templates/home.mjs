// The front door of the site: the royal library room with its books.

import { html } from '../lib/html.mjs';
import { planShelves } from '../lib/decor.mjs';
import { layout } from './layout.mjs';
import { bookcase } from './components/bookcase.mjs';
import { floor, scenery } from './components/scenery.mjs';

// Design units (see public/css/room.css): how much floor shows under the
// bookcase, and how much wall above it.
const FLOOR = 150;
const WALL_ABOVE = 54;

export function homePage({ site, text, urls, sections, shelf }) {
  const plan = planShelves(sections, shelf);
  const sceneHeight = Math.round(plan.caseHeight + FLOOR + WALL_ABOVE);
  // On phones the shelf your books stand on is drawn taller; the CSS needs to
  // know how much of the room that shelf is.
  const heroSum = plan.shelves.filter((s) => s.kind === 'hero').reduce((sum, s) => sum + s.height, 0);

  const body = html`
<a class="skip-link" href="#library">${text.skipToBooks}</a>
<div class="room" style="--scene-h:${sceneHeight};--floor-h:${FLOOR};--hero-sum:${heroSum}">
  <div class="room__wall" aria-hidden="true" data-depth="-6"></div>
  <div class="room__wainscot" aria-hidden="true" data-depth="-6"></div>
  <div class="room__cornice" aria-hidden="true"></div>
  ${floor()}
  <div class="room__stage" id="library">
    ${scenery()}
    ${bookcase({ plan, site, text, urls })}
    <p class="room__caption is-idle" data-caption data-default="${text.chooseABook}">
      <span class="caption__title">${text.chooseABook}</span>
      <span class="caption__tagline"></span>
    </p>
  </div>
  <div class="room__light" aria-hidden="true"></div>
  <div class="room__veil" aria-hidden="true"></div>
</div>`;

  return layout({
    site,
    urls,
    theme: 'room',
    page: 'home',
    description: site.description,
    styles: ['tokens', 'base', 'textures', 'room', 'bookcase', 'books'],
    scripts: ['room'],
    body,
  });
}
