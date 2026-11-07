import { html, raw } from '../../lib/html.mjs';

// A small bookcase icon: two upright books and one leaning.
const ICON = raw(
  `<svg class="site-header__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">` +
    `<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round">` +
    `<rect x="3.5" y="4" width="4.5" height="16" rx=".6"/><rect x="9.5" y="6.5" width="4.5" height="13.5" rx=".6"/>` +
    `<path d="M15.6 5.2 l3.9 -1.1 l3 15.4 l-3.9 1.1 z"/></g></svg>`,
);

export function siteHeader({ text, urls, sections, current }) {
  return html`
  <header class="site-header">
    <a class="site-header__home" href="${urls.page('')}">${ICON}<span>${text.backToLibrary}</span></a>
    <nav class="site-header__nav" aria-label="${text.booksMenu}">
      ${sections.map(
        (section) =>
          html`<a href="${urls.page(section.path)}"${section.id === current ? raw(' aria-current="page"') : ''}>${section.title}</a>`,
      )}
    </nav>
  </header>`;
}
