import { html, fill } from '../../lib/html.mjs';
import { formatNumber, weekdayName } from '../../lib/dates.mjs';

// The topics of an entry. Each one opens the list page with that topic chosen.
export function tagList({ entry, listUrl, className = 'tags' }) {
  if (!entry.tags.length) return '';
  return html`<ul class="${className}">${entry.tags.map(
    (tag) =>
      html`<li><a class="tag" href="${listUrl}?tag=${encodeURIComponent(tag.key)}" data-tag="${tag.key}">${tag.name}</a></li>`,
  )}</ul>`;
}

// One line in a list of entries. Two looks share the same markup:
//   contents → "Title ........ date" like the contents page of an old book
//   diary    → a big day number on the left, like a diary page
export function entryCard({ entry, site, text, urls, section }) {
  const diary = section.listStyle === 'diary';
  const search = [entry.title, entry.summary, entry.tags.map((t) => t.name).join(' ')].join(' ').toLowerCase();
  const day = formatNumber(entry.date.day, site.language).padStart(2, '0');

  return html`
      <li class="entry entry--${section.listStyle}" data-entry data-year="${entry.date.year}" data-month="${entry.date.month}"
          data-tags="${entry.tags.map((t) => t.key).join('|')}" data-search="${search}">
        ${
          diary
            ? html`<time class="entry__day" datetime="${entry.date.iso}"><span class="entry__daynum">${day}</span><span class="entry__weekday">${weekdayName(entry.date, site.language)}</span></time>`
            : ''
        }
        <div class="entry__main">
          <div class="entry__row">
            <h3 class="entry__heading"><a class="entry__link" href="${entry.href}">${entry.title}</a></h3>
            ${
              diary
                ? ''
                : html`<span class="entry__leader" aria-hidden="true"></span><time class="entry__date" datetime="${entry.date.iso}">${entry.dateLabel}</time>`
            }
          </div>
          <p class="entry__summary">${entry.summary}</p>
          <div class="entry__foot">
            ${tagList({ entry, listUrl: urls.page(section.path) })}
            <span class="entry__read">${fill(text.minutesToRead, { minutes: entry.minutes })}</span>
          </div>
        </div>
      </li>`;
}
