// The outer frame shared by every page: <head>, fonts, stylesheets, scripts.

import { html, raw } from '../lib/html.mjs';

// The gold-leaf colour used on the book emblems. Defined once, used everywhere.
const FOIL = raw(
  `<svg class="defs" width="0" height="0" aria-hidden="true" focusable="false"><defs>` +
    `<linearGradient id="foil" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="100" y2="100">` +
    `<stop offset="0" stop-color="#f7e6a8"/><stop offset=".28" stop-color="#dcb862"/>` +
    `<stop offset=".52" stop-color="#a6792a"/><stop offset=".74" stop-color="#ecd48e"/>` +
    `<stop offset="1" stop-color="#b78a30"/></linearGradient></defs></svg>`,
);

const BROWSER_COLOR = { room: '#1d0b0f', parchment: '#e3cf9f', journal: '#f6f1e6' };

export function layout({ site, urls, title, description, theme, page, styles = [], scripts = [], body }) {
  const pageTitle = title && title !== site.title ? `${title} | ${site.title}` : site.title;
  const about = description || site.description;
  const keepOut = !site.searchEngines;

  return html`<!doctype html>
<html lang="${site.language}" class="no-js" data-theme="${theme}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${pageTitle}</title>
  <meta name="description" content="${about}">
  ${keepOut ? html`<meta name="robots" content="noindex, nofollow">` : ''}
  <meta name="theme-color" content="${BROWSER_COLOR[theme] ?? '#1d0b0f'}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${site.title}">
  <meta property="og:title" content="${pageTitle}">
  <meta property="og:description" content="${about}">
  <link rel="icon" href="${urls.asset('favicon.svg')}" type="image/svg+xml">
  ${
    site.fontsUrl
      ? html`<link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="${site.fontsUrl}">`
      : ''
  }
  ${styles.map((name) => html`<link rel="stylesheet" href="${urls.asset(`css/${name}.css`)}?v=${urls.version}">
  `)}
  <script>document.documentElement.className = 'js';</script>
</head>
<body data-page="${page}">
${FOIL}
${body}
${scripts.map((name) => html`<script src="${urls.asset(`js/${name}.js`)}?v=${urls.version}" defer></script>
`)}
</body>
</html>
`;
}
