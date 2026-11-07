// The search box and the Year / Month / Topic buttons above a list of entries.
// The buttons are drawn here; public/js/filters.js makes them work.
// Without JavaScript the bar stays hidden and every entry is simply listed.

import { html, fill } from '../../lib/html.mjs';
import { formatNumber, monthName } from '../../lib/dates.mjs';

// Show this many topics at first; the rest wait behind "Show all topics".
const TOPICS_SHOWN = 12;

const chip = ({ value, label, count, pressed = false, title = '', extra = false }) =>
  html`<button type="button" class="chip" data-value="${value}" aria-pressed="${pressed ? 'true' : 'false'}"${
    title ? html` title="${title}"` : ''
  }${extra ? html` data-extra` : ''}><span class="chip__label">${label}</span><span class="chip__count" data-count>${count}</span></button>`;

const group = ({ facet, label, chips, more = '' }) => html`
    <div class="filters__group" role="group" aria-labelledby="facet-${facet}" data-facet="${facet}">
      <span class="filters__label" id="facet-${facet}">${label}</span>
      <div class="chips">${chips}</div>
      ${more}
    </div>`;

export function filterBar({ site, text, section, facets, total }) {
  const f = text.filters;
  const lang = site.language;
  const all = (extra) => chip({ value: '', label: f.all, count: total, pressed: true, ...extra });

  const labels = {
    showingAll: f.showingAll,
    showing: f.showing,
    nounOne: section.noun.one,
    nounMany: section.noun.many,
    showAllTopics: f.moreTopics,
    showFewerTopics: f.fewerTopics,
  };

  const hasExtraTopics = facets.tags.length > TOPICS_SHOWN;

  return html`
  <section class="filters" data-filters data-labels="${JSON.stringify(labels)}" aria-label="${f.search}">
    <div class="filters__search">
      <label for="filter-q">${f.search}</label>
      <input id="filter-q" type="search" placeholder="${f.searchPlaceholder}" autocomplete="off" data-search-input>
    </div>

    ${group({
      facet: 'year',
      label: f.year,
      chips: [all(), facets.years.map((y) => chip({ value: y.year, label: formatNumber(y.year, lang), count: y.count }))],
    })}

    ${group({
      facet: 'month',
      label: f.month,
      chips: [
        all(),
        facets.months.map((count, i) =>
          chip({ value: i + 1, label: monthName(i + 1, lang, 'short'), title: monthName(i + 1, lang, 'long'), count }),
        ),
      ],
    })}

    ${
      facets.tags.length
        ? group({
            facet: 'tag',
            label: f.topic,
            chips: [
              all(),
              facets.tags.map((t, i) => chip({ value: t.key, label: t.name, count: t.count, extra: i >= TOPICS_SHOWN })),
            ],
            more: hasExtraTopics
              ? html`<button type="button" class="filters__more" data-more aria-expanded="false">${f.moreTopics}</button>`
              : '',
          })
        : ''
    }

    <div class="filters__status">
      <p class="filters__count" role="status" aria-live="polite" data-status>${fill(f.showingAll, {
        total,
        noun: total === 1 ? section.noun.one : section.noun.many,
      })}</p>
      <button type="button" class="filters__clear" data-clear hidden>${f.clear}</button>
    </div>
  </section>`;
}
