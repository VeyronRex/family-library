// Shown by GitHub Pages whenever someone opens an address that does not exist.

import { html } from '../lib/html.mjs';
import { shell } from './shell.mjs';
import { ornament } from './components/ornament.mjs';

export function notFoundPage(ctx) {
  const { text, urls } = ctx;

  const content = html`
    <article class="single">
      <header class="titlepage">
        <h1 class="titlepage__title">${text.notFoundTitle}</h1>
        <p class="titlepage__tagline">${text.notFoundText}</p>
        ${ornament()}
        <p class="titlepage__action"><a href="${urls.page('')}">${text.backToLibraryLong}</a></p>
      </header>
    </article>`;

  return shell({ ctx, theme: 'parchment', title: text.notFoundTitle, content });
}
