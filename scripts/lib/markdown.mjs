// Turns the Markdown you write into HTML.
//
// The heavy lifting is done by "marked" (a well-known, MIT-licensed Markdown
// converter that is bundled in scripts/vendor/ so nothing needs installing).
// This file is the ONLY place that talks to it. To use a different converter
// one day, change this file and nothing else.

import { Marked } from '../vendor/marked.mjs';
import { escape } from './html.mjs';

export const slugify = (text) =>
  String(text)
    .normalize('NFC')
    .toLowerCase()
    .replace(/<[^>]*>/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');

const ENTITIES = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&nbsp;': ' ' };

export function toText(html) {
  return String(html)
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&(?:amp|lt|gt|quot|#39|nbsp);/g, (m) => ENTITIES[m])
    .replace(/\s+/g, ' ')
    .trim();
}

export function summarize(html, max = 200) {
  const first = /<p>([\s\S]*?)<\/p>/.exec(html);
  const text = toText(first ? first[1] : html);
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(' '), max - 30)).replace(/[\s,.;:!?-]+$/, '')}…`;
}

export function createMarkdown({ urls, callouts = {} }) {
  const used = new Map();
  const uniqueId = (text) => {
    const base = slugify(text) || 'section';
    const count = used.get(base) ?? 0;
    used.set(base, count + 1);
    return count ? `${base}-${count}` : base;
  };

  const marked = new Marked({ gfm: true, breaks: false });

  marked.use({
    extensions: [calloutExtension(callouts)],
    renderer: {
      // Headings get an id so they can be linked to.
      heading({ tokens, depth, text }) {
        const inner = this.parser.parseInline(tokens);
        return `<h${depth} id="${escape(uniqueId(text))}">${inner}</h${depth}>\n`;
      },
      // Links that start with / still work when the site lives in a sub-folder.
      link({ href, title, tokens }) {
        const inner = this.parser.parseInline(tokens);
        const titleAttr = title ? ` title="${escape(title)}"` : '';
        return `<a href="${escape(urls.rewrite(href))}"${titleAttr}>${inner}</a>`;
      },
      // ![alt](photo.jpg "A caption")  →  picture with a caption underneath.
      image({ href, title, text }) {
        const img = `<img src="${escape(urls.rewrite(href))}" alt="${escape(text)}" loading="lazy" decoding="async">`;
        return title
          ? `<span class="figure">${img}<span class="figure__caption">${escape(title)}</span></span>`
          : img;
      },
    },
  });

  return {
    render(markdown) {
      used.clear();
      return marked.parse(markdown, { async: false });
    },
    toText,
    summarize,
  };
}

// ::: lesson
// Text inside a special box.
// :::
function calloutExtension(callouts) {
  return {
    name: 'callout',
    level: 'block',
    start(src) {
      const index = src.search(/^:::/m);
      return index < 0 ? undefined : index;
    },
    tokenizer(src) {
      const match = /^:::[ \t]*([\p{L}\p{N}_-]+)[ \t]*([^\n]*)\n([\s\S]*?)\n:::[ \t]*(?:\n|$)/u.exec(src);
      if (!match) return undefined;
      const token = {
        type: 'callout',
        raw: match[0],
        kind: match[1].toLowerCase(),
        title: match[2].trim(),
        tokens: [],
      };
      this.lexer.blockTokens(match[3], token.tokens);
      return token;
    },
    renderer(token) {
      const label = token.title || callouts[token.kind] || '';
      const kind = slugify(token.kind) || 'note';
      const heading = label ? `<p class="callout__label">${escape(label)}</p>` : '';
      return `<aside class="callout callout--${kind}">${heading}<div class="callout__body">${this.parser.parse(token.tokens)}</div></aside>\n`;
    },
  };
}
