// Builds web addresses that work wherever the site is placed.
//
// A site at  yourname.github.io        has the base  "/"
// A site at  yourname.github.io/diary  has the base  "/diary/"
// The deploy workflow works the base out by itself, so you never set it by hand.

export function createUrls(base = '/', version = '') {
  let b = String(base || '/').trim();
  if (!b.startsWith('/')) b = `/${b}`;
  if (!b.endsWith('/')) b = `${b}/`;
  const prefix = b.slice(0, -1);

  const isLocal = (url) => typeof url === 'string' && url.startsWith('/') && !url.startsWith('//');

  return {
    base: b,
    version,
    // A file such as css/base.css
    asset: (file) => `${prefix}/${String(file).replace(/^\/+/, '')}`,
    // A page such as blog/my-trip  →  /blog/my-trip/
    page: (path = '') => {
      const clean = String(path).replace(/^\/+|\/+$/g, '');
      return `${prefix}/${clean ? `${clean}/` : ''}`;
    },
    // Used inside posts: /images/photo.jpg becomes /<base>/images/photo.jpg
    rewrite: (url) => (isLocal(url) ? `${prefix}${url}` : url),
  };
}
