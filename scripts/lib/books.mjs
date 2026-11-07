// Checks config/books.mjs and fills in anything you left out.

import { FriendlyError } from './errors.mjs';
import { emblemNames } from './emblems.mjs';

export const THEMES = ['parchment', 'journal'];
export const LEATHERS = ['oxblood', 'emerald', 'navy', 'umber', 'plum', 'onyx', 'teal'];
export const LIST_STYLES = ['contents', 'diary'];

export function normalizeBooks(list) {
  if (!Array.isArray(list) || list.length === 0) {
    throw new FriendlyError('config/books.mjs — the list of books is empty. Add at least one book.');
  }

  const problems = [];
  const ids = new Set();
  const paths = new Set();

  const books = list.map((input, index) => {
    const book = { ...input };
    const label = `config/books.mjs — book ${index + 1}${book.title ? ` ("${book.title}")` : ''}`;

    if (!book.id || !/^[a-z0-9-]+$/.test(book.id)) {
      problems.push(`${label}: "id" must be short, lowercase, with only letters, numbers or dashes. For example "travels".`);
    } else if (ids.has(book.id)) {
      problems.push(`${label}: the id "${book.id}" is used twice. Every book needs its own id.`);
    }
    ids.add(book.id);

    if (!book.title) problems.push(`${label}: "title" is missing.`);

    book.kind = book.kind ?? 'collection';
    if (!['page', 'collection'].includes(book.kind)) {
      problems.push(`${label}: "kind" must be 'page' or 'collection'.`);
    }

    book.path = String(book.path ?? book.id ?? '').replace(/^\/+|\/+$/g, '');
    if (!book.path) problems.push(`${label}: "path" is missing.`);
    if (paths.has(book.path)) problems.push(`${label}: the path "${book.path}" is used twice.`);
    paths.add(book.path);

    book.source = book.source ?? (book.kind === 'page' ? `${book.id}.md` : book.id);
    book.tagline = book.tagline ?? '';

    book.theme = book.theme ?? 'parchment';
    if (!THEMES.includes(book.theme)) {
      problems.push(`${label}: "theme" must be one of ${THEMES.map((t) => `'${t}'`).join(', ')}.`);
    }

    if (book.kind === 'collection') {
      book.listStyle = book.listStyle ?? (book.theme === 'journal' ? 'diary' : 'contents');
      if (!LIST_STYLES.includes(book.listStyle)) {
        problems.push(`${label}: "listStyle" must be 'contents' or 'diary'.`);
      }
      book.noun = { one: 'entry', many: 'entries', ...(book.noun ?? {}) };
    }

    // Spines get natural-looking differences in size unless you set them.
    const spine = { ...(book.spine ?? {}) };
    spine.leather = spine.leather ?? LEATHERS[index % LEATHERS.length];
    spine.emblem = spine.emblem ?? emblemNames[index % emblemNames.length];
    spine.width = Number(spine.width ?? 56 + ((index * 7) % 12));
    spine.height = Number(spine.height ?? 184 + ((index * 5) % 10));
    spine.depth = Number(spine.depth ?? 132);
    if (!LEATHERS.includes(spine.leather)) {
      problems.push(`${label}: spine leather "${spine.leather}" is not known. Choose from: ${LEATHERS.join(', ')}.`);
    }
    if (!emblemNames.includes(spine.emblem)) {
      problems.push(`${label}: spine emblem "${spine.emblem}" is not known. Choose from: ${emblemNames.join(', ')}.`);
    }
    book.spine = spine;

    return book;
  });

  if (problems.length) throw new FriendlyError(problems);
  return books;
}
