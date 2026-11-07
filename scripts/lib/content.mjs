// Reads your writing from the /content folder.
//
//   content/about.md              → a single page
//   content/blog/my-trip.md       → one entry of a collection
//   content/blog/my-trip/index.md → an entry that keeps its photos beside it

import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

import { CONTENT_DIR, relative } from './paths.mjs';
import { parseFrontmatter } from './frontmatter.mjs';
import { parseDate, formatLong } from './dates.mjs';
import { slugify } from './markdown.mjs';

const DATE_PREFIX = /^(\d{4}-\d{1,2}-\d{1,2})[-_ ]+(.+)$/;

const isFile = async (file) => {
  try {
    return (await stat(file)).isFile();
  } catch {
    return false;
  }
};

const prettify = (slug) => slug.replace(/-+/g, ' ').replace(/^./u, (c) => c.toUpperCase());

function normalizeTags(value) {
  const list = Array.isArray(value) ? value : typeof value === 'string' && value ? value.split(',') : [];
  const seen = new Set();
  const tags = [];
  for (const item of list) {
    const name = String(item).trim();
    if (!name) continue;
    const key = slugify(name) || name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    tags.push({ name, key });
  }
  return tags;
}

async function listAssets(dir) {
  const found = [];
  async function walk(current) {
    for (const item of await readdir(current, { withFileTypes: true })) {
      if (item.name.startsWith('.') || item.name.startsWith('_')) continue;
      const full = path.join(current, item.name);
      if (item.isDirectory()) await walk(full);
      else if (!(current === dir && item.name === 'index.md')) {
        found.push({ from: full, to: path.relative(dir, full) });
      }
    }
  }
  await walk(dir);
  return found;
}

export async function loadCollection(book, { md, site, urls, includeDrafts, problems, warnings }) {
  const dir = path.join(CONTENT_DIR, book.source);
  let items;
  try {
    items = await readdir(dir, { withFileTypes: true });
  } catch {
    problems.push(`content/${book.source}/ — this folder does not exist. Create it, then add a .md file inside.`);
    return [];
  }

  const entries = [];
  const slugs = new Map();

  for (const item of items.sort((a, b) => a.name.localeCompare(b.name))) {
    if (item.name.startsWith('.') || item.name.startsWith('_')) continue;

    let file;
    let assetDir = null;
    let baseName;
    if (item.isFile() && /\.md$/i.test(item.name)) {
      file = path.join(dir, item.name);
      baseName = item.name.replace(/\.md$/i, '');
    } else if (item.isDirectory() && (await isFile(path.join(dir, item.name, 'index.md')))) {
      file = path.join(dir, item.name, 'index.md');
      assetDir = path.join(dir, item.name);
      baseName = item.name;
    } else {
      continue;
    }

    const where = relative(file);
    let parsed;
    try {
      parsed = parseFrontmatter(await readFile(file, 'utf8'));
    } catch (error) {
      problems.push(`${where} — ${error.message}`);
      continue;
    }
    const { data, body } = parsed;

    if (data.draft === true && !includeDrafts) continue;

    const prefix = DATE_PREFIX.exec(baseName);
    const slug = slugify(prefix ? prefix[2] : baseName);
    if (!slug) {
      problems.push(`${where} — the file name needs some letters or numbers in it.`);
      continue;
    }
    if (slugs.has(slug)) {
      problems.push(`${where} — has the same name as ${slugs.get(slug)}. Give one of them a different file name.`);
      continue;
    }
    slugs.set(slug, where);

    const date = parseDate(data.date ?? (prefix ? prefix[1] : ''));
    if (!date) {
      problems.push(
        data.date
          ? `${where} — the date "${data.date}" is not a real date. Write it like 2026-11-05 (year-month-day).`
          : `${where} — add a date at the top, like   date: 2026-11-05`,
      );
      continue;
    }

    let title = String(data.title ?? '').trim();
    if (!title) {
      title = prettify(slug);
      warnings.push(`${where} — has no title, so "${title}" is used. Add  title: "…"  at the top.`);
    }

    const html = md.render(body);
    const text = md.toText(html);
    const words = text ? text.split(/\s+/).length : 0;

    entries.push({
      kind: 'entry',
      sectionId: book.id,
      slug,
      href: urls.page(`${book.path}/${encodeURIComponent(slug)}`),
      title,
      date,
      dateLabel: formatLong(date, site.language),
      tags: normalizeTags(data.tags),
      summary: String(data.summary ?? data.description ?? '').trim() || md.summarize(html),
      html,
      words,
      minutes: Math.max(1, Math.round(words / 200)),
      draft: data.draft === true,
      assets: assetDir ? await listAssets(assetDir) : [],
    });
  }

  entries.sort((a, b) => b.date.date - a.date.date || a.title.localeCompare(b.title));
  entries.forEach((entry, i) => {
    const link = (other) => (other ? { title: other.title, href: other.href } : null);
    entry.newer = link(entries[i - 1]);
    entry.older = link(entries[i + 1]);
  });
  return entries;
}

export async function loadPage(book, { md, problems }) {
  const file = path.join(CONTENT_DIR, book.source);
  if (!(await isFile(file))) {
    problems.push(`content/${book.source} — this file does not exist. Create it and write your page inside.`);
    return null;
  }
  try {
    const { data, body } = parseFrontmatter(await readFile(file, 'utf8'));
    const html = md.render(body);
    return {
      title: String(data.title ?? '').trim() || book.title,
      summary: String(data.summary ?? data.description ?? '').trim() || md.summarize(html),
      html,
    };
  } catch (error) {
    problems.push(`${relative(file)} — ${error.message}`);
    return null;
  }
}
