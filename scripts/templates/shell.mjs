// The frame around every inner page (About, Blog, Journal, posts, 404):
// header, a main area, and a footer. The look comes from the book's theme.

import { html } from '../lib/html.mjs';
import { layout } from './layout.mjs';
import { siteHeader } from './components/site-header.mjs';
import { siteFooter } from './components/site-footer.mjs';

export function shell({ ctx, section = null, theme, title, description, content, scripts = [], styles = [] }) {
  const { site, text, urls, sections } = ctx;
  const look = theme ?? section?.theme ?? 'parchment';

  const body = html`
<a class="skip-link" href="#main">${text.skipToContent}</a>
<div class="sheet">
  ${siteHeader({ text, urls, sections, current: section?.id })}
  <main id="main" class="sheet__main">
    ${content}
  </main>
  ${siteFooter({ site, text, urls })}
</div>`;

  return layout({
    site,
    urls,
    title,
    description,
    theme: look,
    page: section?.id ?? 'page',
    styles: ['tokens', 'base', 'textures', 'page', 'prose', `theme-${look}`, ...styles],
    scripts,
    body,
  });
}
