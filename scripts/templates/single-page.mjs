// A book that is one single page, such as "About Me".

import { html, raw } from '../lib/html.mjs';
import { shell } from './shell.mjs';
import { emblem } from './components/emblem.mjs';
import { ornament } from './components/ornament.mjs';

export function singlePage(ctx) {
  const { section } = ctx;
  const { page } = section;

  const content = html`
    <article class="single">
      <header class="titlepage">
        <div class="titlepage__seal">${emblem(section.spine.emblem, 'emblem seal')}</div>
        <h1 class="titlepage__title">${page.title}</h1>
        <p class="titlepage__tagline">${section.tagline}</p>
        ${ornament()}
      </header>
      <div class="prose">${raw(page.html)}</div>
    </article>`;

  return shell({ ctx, section, title: page.title, description: page.summary || section.tagline, content });
}
