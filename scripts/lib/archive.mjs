// Works out the years, topics and groups shown on a list page.

import { formatNumber, monthYear } from './dates.mjs';

export function buildFacets(entries) {
  const years = new Map();
  const tags = new Map();
  const months = Array(12).fill(0);

  for (const entry of entries) {
    years.set(entry.date.year, (years.get(entry.date.year) ?? 0) + 1);
    months[entry.date.month - 1] += 1;
    for (const tag of entry.tags) {
      const known = tags.get(tag.key) ?? { ...tag, count: 0 };
      known.count += 1;
      tags.set(tag.key, known);
    }
  }

  return {
    months,
    years: [...years]
      .sort((a, b) => b[0] - a[0])
      .map(([year, count]) => ({ year, count })),
    tags: [...tags.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)),
  };
}

// 'contents' groups entries by year, 'diary' groups them by month.
export function groupEntries(entries, listStyle, language) {
  const groups = [];
  for (const entry of entries) {
    const { year, month } = entry.date;
    const key = listStyle === 'diary' ? `${year}-${month}` : `${year}`;
    let group = groups.at(-1);
    if (!group || group.key !== key) {
      group = {
        key,
        label: listStyle === 'diary' ? monthYear(year, month, language) : formatNumber(year, language),
        entries: [],
      };
      groups.push(group);
    }
    group.entries.push(entry);
  }
  return groups;
}
