import { html } from '../../lib/html.mjs';
import { book } from './book.mjs';
import { objectFor, tome } from './filler.mjs';

function renderPart(part, urls) {
  if (part.type === 'books') return part.books.map((section) => book({ section, urls }));
  if (part.type === 'tomes') return html`<span class="shelf__group" aria-hidden="true">${part.items.map(tome)}</span>`;
  return objectFor(part.name);
}

// The tall wooden bookcase: a carved top with the brass name plate, shelves, and a base.
export function bookcase({ plan, site, text, urls }) {
  return html`
    <div class="bookcase" style="--case-h:${plan.caseHeight};--crown-h:${plan.crown};--plinth-h:${plan.plinth};--board-h:${plan.board}">
      <div class="bookcase__crown">
        <div class="plate">
          <h1 class="plate__title">${site.title}</h1>
          <p class="plate__tagline">${site.tagline}</p>
        </div>
      </div>
      <nav class="bookcase__frame" aria-label="${text.booksMenu}">
        <div class="bookcase__inside">
          ${plan.shelves.map(
            (shelf) => html`
          <div class="shelf shelf--${shelf.kind}" style="--shelf-h:${shelf.height}">
            <div class="shelf__row">${shelf.parts.map((part) => renderPart(part, urls))}</div>
            <div class="shelf__board" aria-hidden="true"></div>
          </div>`,
          )}
        </div>
      </nav>
      <div class="bookcase__plinth" aria-hidden="true"></div>
    </div>`;
}
