import { html, fill } from '../../lib/html.mjs';
import { ornament } from './ornament.mjs';

export function siteFooter({ site, text, urls }) {
  const year = new Date().getFullYear();
  return html`
  <footer class="site-footer">
    ${ornament()}
    <p class="site-footer__note">${site.footerNote}</p>
    <p class="site-footer__copy">${fill(text.copyright, { year, owner: site.owner })}</p>
    <p class="site-footer__links">
      <a href="#main">${text.backToTop}</a>
      <a href="${urls.page('')}">${text.backToLibraryLong}</a>
    </p>
  </footer>`;
}
