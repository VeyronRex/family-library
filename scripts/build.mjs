// Builds the whole website into the /dist folder.
//
//   npm run build            build the site
//   npm run build -- --drafts   also include posts marked  draft: true
//
// Nothing here needs installing. It only uses what comes with Node.js.

import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { DEFAULT_OUT, PUBLIC_DIR, ROOT } from './lib/paths.mjs';
import { FriendlyError } from './lib/errors.mjs';
import { createUrls } from './lib/urls.mjs';
import { createMarkdown } from './lib/markdown.mjs';
import { normalizeBooks } from './lib/books.mjs';
import { loadCollection, loadPage } from './lib/content.mjs';

import { homePage } from './templates/home.mjs';
import { sectionIndexPage } from './templates/section-index.mjs';
import { entryPage } from './templates/entry.mjs';
import { singlePage } from './templates/single-page.mjs';
import { notFoundPage } from './templates/not-found.mjs';

const loadConfig = (file) => import(pathToFileURL(path.join(ROOT, 'config', file)).href);

async function write(file, content) {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, content.toString());
}

export async function build({ includeDrafts = false, base = '/', outDir = DEFAULT_OUT } = {}) {
  const started = Date.now();

  const [siteModule, textModule, booksModule] = await Promise.all([
    loadConfig('site.mjs'),
    loadConfig('text.mjs'),
    loadConfig('books.mjs'),
  ]);
  const site = { language: 'en', callouts: {}, ...siteModule.default };
  const text = textModule.default;
  const books = normalizeBooks(booksModule.books);

  const urls = createUrls(base, String(started));
  const md = createMarkdown({ urls, callouts: site.callouts });
  const problems = [];
  const warnings = [];

  const sections = [];
  for (const book of books) {
    if (book.kind === 'collection') {
      const entries = await loadCollection(book, { md, site, urls, includeDrafts, problems, warnings });
      sections.push({ ...book, entries });
    } else {
      sections.push({ ...book, page: await loadPage(book, { md, problems }) });
    }
  }
  if (problems.length) throw new FriendlyError(problems);

  const ctx = { site, text, urls, sections, shelf: booksModule.shelf ?? {} };

  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });
  await cp(PUBLIC_DIR, outDir, { recursive: true });

  const pages = [];
  const emit = async (urlPath, content, lastmod) => {
    await write(path.join(outDir, urlPath, 'index.html'), content);
    pages.push({ path: urlPath, lastmod });
  };

  await emit('', homePage(ctx));

  for (const section of sections) {
    if (section.kind === 'page') {
      await emit(section.path, singlePage({ ...ctx, section }));
      continue;
    }
    await emit(section.path, sectionIndexPage({ ...ctx, section }));
    for (const entry of section.entries) {
      const folder = `${section.path}/${entry.slug}`;
      await emit(folder, entryPage({ ...ctx, section, entry }), entry.date.iso);
      for (const asset of entry.assets) {
        await mkdir(path.dirname(path.join(outDir, folder, asset.to)), { recursive: true });
        await cp(asset.from, path.join(outDir, folder, asset.to));
      }
    }
  }

  await write(path.join(outDir, '404.html'), notFoundPage(ctx));
  await write(path.join(outDir, '.nojekyll'), '');
  await write(path.join(outDir, 'robots.txt'), robotsTxt(site, urls));
  if (site.searchEngines && site.url) await write(path.join(outDir, 'sitemap.xml'), sitemapXml(site, urls, pages));

  return { pages, sections, warnings, ms: Date.now() - started };
}

function robotsTxt(site, urls) {
  if (!site.searchEngines) return 'User-agent: *\nDisallow: /\n';
  const sitemap = site.url ? `Sitemap: ${site.url.replace(/\/+$/, '')}${urls.asset('sitemap.xml')}\n` : '';
  return `User-agent: *\nAllow: /\n${sitemap}`;
}

function sitemapXml(site, urls, pages) {
  const origin = site.url.replace(/\/+$/, '');
  const items = pages
    .map(
      ({ path: p, lastmod }) =>
        `  <url><loc>${origin}${urls.page(p)}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`,
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</urlset>\n`;
}

// ── Running from the command line ───────────────────────────────────────────
const isMain = process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;

if (isMain) {
  const flags = process.argv.slice(2);
  const option = (name) => flags.find((f) => f.startsWith(`--${name}=`))?.split('=').slice(1).join('=');

  try {
    const result = await build({
      includeDrafts: flags.includes('--drafts'),
      base: option('base') ?? process.env.SITE_BASE ?? '/',
      outDir: option('out') ? path.resolve(option('out')) : DEFAULT_OUT,
    });

    const summary = result.sections
      .map((s) => (s.kind === 'page' ? `${s.title}: 1 page` : `${s.title}: ${s.entries.length} ${s.entries.length === 1 ? s.noun.one : s.noun.many}`))
      .join('   ');
    console.log(`\n✔ Built ${result.pages.length + 1} pages in ${result.ms} ms.`);
    console.log(`  ${summary}`);
    for (const warning of result.warnings) console.log(`  ⚠ ${warning}`);
    console.log('');
  } catch (error) {
    if (error instanceof FriendlyError) {
      console.error('\n✖ The site could not be built. Please fix this:\n');
      for (const problem of error.problems) console.error(`  • ${problem}`);
      console.error('');
    } else {
      console.error('\n✖ Something unexpected went wrong:\n');
      console.error(error);
    }
    process.exit(1);
  }
}
