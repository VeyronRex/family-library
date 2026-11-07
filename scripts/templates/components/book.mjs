import { html } from '../../lib/html.mjs';
import { emblem } from './emblem.mjs';

// A spine holds about 8 letters in a line at full size. A title with several
// words may use two lines; a longer one is written a little smaller so it fits.
// (The full title is always shown in the caption and read out by screen readers.)
function titleFit(title) {
  const words = title.trim().split(/\s+/);
  const length = [...title.trim()].length;
  if (words.length < 2 || length <= 8) {
    return { fit: Math.max(0.5, Math.min(1, 8 / length)), lines: 1 };
  }
  const letters = [...words.join('')].length;
  const longest = Math.max(...words.map((word) => [...word].length));
  const perLine = Math.max(longest, Math.ceil(letters / 2));
  return { fit: Math.max(0.5, Math.min(1, 8 / perLine)), lines: 2 };
}

// One real, clickable book on the shelf.
// It is built like a box: a spine facing you, a front cover on its right side
// and a top. The CSS turns it with the mouse (see public/css/books.css).
export function book({ section, urls }) {
  const { spine } = section;
  const { fit, lines } = titleFit(section.title);
  return html`<a class="book" href="${urls.page(section.path)}"
      data-leather="${spine.leather}" data-title="${section.title}" data-tagline="${section.tagline}"
      style="--w:${spine.width};--h:${spine.height};--d:${spine.depth};--fit:${fit.toFixed(2)}"
      aria-label="${section.title}. ${section.tagline}">
    <span class="book__shadow" aria-hidden="true"></span>
    <span class="book__body" aria-hidden="true">
      <span class="book__face book__spine">
        <span class="spine__emblem">${emblem(spine.emblem)}</span>
        <span class="spine__label"><span class="spine__title" data-lines="${lines}">${section.title}</span></span>
      </span>
      <span class="book__face book__cover">
        <span class="cover__frame">
          <span class="cover__emblem">${emblem(spine.emblem)}</span>
          <span class="cover__title">${section.title}</span>
          <span class="cover__rule"></span>
          <span class="cover__tagline">${section.tagline}</span>
        </span>
      </span>
      <span class="book__face book__top"></span>
    </span>
  </a>`;
}
