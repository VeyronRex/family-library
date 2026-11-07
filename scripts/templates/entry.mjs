// One post or journal entry.

import { html, raw, fill } from '../lib/html.mjs';
import { shell } from './shell.mjs';
import { ornament } from './components/ornament.mjs';
import { tagList } from './components/entry-card.mjs';

export function entryPage(ctx) {
  const { text, urls, section, entry } = ctx;

  const neighbour = (link, label, side) =>
    link
      ? html`<a class="entry-nav__${side}" href="${link.href}"><span class="entry-nav__label">${label}</span><span class="entry-nav__title">${link.title}</span></a>`
      : html`<span class="entry-nav__${side}"></span>`;

  const content = html`
    <article class="entry-page">
      <header class="entry-head">
        <h1 class="entry-head__title">${entry.title}</h1>
        <p class="entry-head__meta">
          <time datetime="${entry.date.iso}">${entry.dateLabel}</time>
          <span class="entry-head__read">${fill(text.minutesToRead, { minutes: entry.minutes })}</span>
        </p>
        ${tagList({ entry, listUrl: urls.page(section.path), className: 'tags tags--head' })}
        ${ornament()}
      </header>

      <div class="prose">${raw(entry.html)}</div>

      ${ornament()}
      <nav class="entry-nav" aria-label="${section.title}">
        ${neighbour(entry.older, text.olderEntry, 'older')}
        <a class="entry-nav__all" href="${urls.page(section.path)}">${fill(text.moreIn, { book: section.title })}</a>
        ${neighbour(entry.newer, text.newerEntry, 'newer')}
      </nav>
    </article>`;

  return shell({ ctx, section, title: entry.title, description: entry.summary, content });
}
