// The list page of a collection (for example the Blog): title page, filters,
// and every entry grouped by year or month.

import { html, fill } from '../lib/html.mjs';
import { buildFacets, groupEntries } from '../lib/archive.mjs';
import { shell } from './shell.mjs';
import { emblem } from './components/emblem.mjs';
import { ornament } from './components/ornament.mjs';
import { entryCard } from './components/entry-card.mjs';
import { filterBar } from './components/filter-bar.mjs';

export function sectionIndexPage(ctx) {
  const { site, text, urls, section } = ctx;
  const { entries } = section;
  const facets = buildFacets(entries);
  const groups = groupEntries(entries, section.listStyle, site.language);

  const content = html`
    <header class="titlepage">
      <div class="titlepage__seal">${emblem(section.spine.emblem, 'emblem seal')}</div>
      <h1 class="titlepage__title">${section.title}</h1>
      <p class="titlepage__tagline">${section.tagline}</p>
      ${ornament()}
    </header>

    ${
      entries.length
        ? html`
    ${filterBar({ site, text, section, facets, total: entries.length })}
    <div class="entries entries--${section.listStyle}" data-entries>
      ${groups.map(
        (group) => html`
      <section class="group" data-group aria-labelledby="group-${group.key}">
        <h2 class="group__title" id="group-${group.key}">${group.label}</h2>
        <ul class="group__list">${group.entries.map((entry) => entryCard({ entry, site, text, urls, section }))}</ul>
      </section>`,
      )}
      <p class="empty" data-empty hidden>${fill(text.filters.nothing, { noun: section.noun.many })}</p>
    </div>`
        : html`<p class="empty">${text.noEntriesYet}</p>`
    }`;

  return shell({
    ctx,
    section,
    title: section.title,
    description: section.tagline,
    content,
    styles: ['filters'],
    scripts: entries.length ? ['filters'] : [],
  });
}
