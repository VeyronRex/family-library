// ─────────────────────────────────────────────────────────────────────────────
//  THE BOOKS ON YOUR SHELF
//
//  Every item in the list below becomes:
//    • a 3D book on the shelf in the library room,
//    • a link in the menu at the top of every page,
//    • its own pages on the website.
//
//  TO ADD A NEW BOOK (it takes about two minutes):
//    1. Copy one of the blocks below and paste it after the last one.
//    2. Give it a new id, title, path and source.
//    3. Create the matching folder inside /content and put a .md file in it.
//    4. Save. The new book appears on the shelf by itself.
//  The full walk-through is in docs/ADD-A-BOOK.md.
// ─────────────────────────────────────────────────────────────────────────────

// How many real books stand on one shelf before the next shelf is used.
export const shelf = {
  booksPerShelf: 4,
};

export const books = [
  {
    id: 'about',
    title: 'About Me',
    tagline: 'Who I am, and where I come from',

    // 'page'       = a single page, written in one file  (content/about.md)
    // 'collection' = many dated entries, one file each   (content/blog/…)
    kind: 'page',
    source: 'about.md',

    // The web address of this book: yourname.github.io/about/
    path: 'about',

    // How its pages look: 'parchment' (old paper) or 'journal' (lighter).
    theme: 'parchment',

    // How the book looks on the shelf.
    //   leather: oxblood, emerald, navy, umber, plum, onyx, teal
    //   emblem:  crest, compass, quill
    spine: { leather: 'oxblood', emblem: 'crest', width: 60, height: 190 },
  },

  {
    id: 'blog',
    title: 'Blog',
    tagline: 'Travels, lessons and things I have learned',
    kind: 'collection',
    source: 'blog',
    path: 'blog',
    theme: 'parchment',

    // 'contents' = a table of contents, grouped by year (best for the old look)
    // 'diary'    = day-by-day entries, grouped by month
    listStyle: 'contents',

    // What one entry is called. Used in sentences like "Showing 3 of 9 posts."
    noun: { one: 'post', many: 'posts' },

    spine: { leather: 'emerald', emblem: 'compass', width: 68, height: 196 },
  },

  {
    id: 'journal',
    title: 'Journal',
    tagline: 'My days, as they come',
    kind: 'collection',
    source: 'journal',
    path: 'journal',
    theme: 'journal',
    listStyle: 'diary',
    noun: { one: 'entry', many: 'entries' },
    spine: { leather: 'navy', emblem: 'quill', width: 56, height: 186 },
  },
];
