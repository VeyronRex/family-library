// Decides what stands on each shelf of the library room: your real books, plus
// old decorative books and a few objects so the shelves look lived-in.
//
// Everything here comes from a fixed seed, so rebuilding the site never changes
// how the shelves look. All sizes are "design units"; the CSS turns them into
// pixels so the whole room scales to any screen.

const INTERIOR = 508; // usable width of one shelf
const CROWN = 86; // height of the carved top of the bookcase
const PLINTH = 46; // height of its base
const BOARD = 16; // thickness of a shelf board

const SHELF_HEIGHT = { hero: 216, top: 136, middle: 152, bottom: 148 };
const TONES = ['umber', 'oxblood', 'forest', 'navy', 'plum', 'olive', 'ink', 'tan'];
const OBJECT_WIDTH = { 'candle-stack': 104, armillary: 86, stack: 104 };

// A small, repeatable random number generator.
function seeded(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeTomes(rand, width, minH, maxH) {
  const items = [];
  let used = 0;
  for (;;) {
    const w = Math.round(20 + rand() * 24);
    if (used + w > width) break;
    items.push({
      w,
      h: Math.round(minH + rand() * (maxH - minH)),
      tone: TONES[Math.floor(rand() * TONES.length)],
      bands: Math.floor(rand() * 3),
      plate: rand() > 0.55,
    });
    used += w + 1;
  }
  return items;
}

function heroShelf(index, row) {
  const rand = seeded(9100 + index * 31);
  const realWidth = row.reduce((sum, book) => sum + book.spine.width, 0) + (row.length - 1) * 3;
  const free = Math.max(0, INTERIOR - realWidth - 22);
  const left = Math.round(free * (0.44 + rand() * 0.12));
  return {
    kind: 'hero',
    height: SHELF_HEIGHT.hero,
    parts: [
      { type: 'tomes', items: makeTomes(rand, left, 108, 160) },
      { type: 'books', books: row },
      { type: 'tomes', items: makeTomes(rand, free - left, 108, 160) },
    ],
  };
}

function decorShelf(index, total) {
  const rand = seeded(4400 + index * 57);
  const isTop = index === 0;
  const isBottom = index === total - 1;
  const kind = isTop ? 'top' : isBottom ? 'bottom' : 'middle';
  const height = SHELF_HEIGHT[kind];
  const object = isTop ? 'candle-stack' : isBottom ? 'armillary' : 'stack';
  const maxH = height - BOARD - 14;
  const free = INTERIOR - OBJECT_WIDTH[object] - 22;
  const left = Math.round(free * (isTop ? 0.3 + rand() * 0.15 : 0.4 + rand() * 0.2));
  return {
    kind,
    height,
    parts: [
      { type: 'tomes', items: makeTomes(rand, left, maxH - 30, maxH) },
      { type: 'object', name: object },
      { type: 'tomes', items: makeTomes(rand, free - left, maxH - 30, maxH) },
    ],
  };
}

export function planShelves(books, { booksPerShelf = 4 } = {}) {
  const rows = [];
  for (let i = 0; i < books.length; i += booksPerShelf) rows.push(books.slice(i, i + booksPerShelf));

  // Your books sit in the middle of the case, at eye level.
  const total = Math.max(3, rows.length + 2);
  const first = Math.floor((total - rows.length) / 2);

  const shelves = [];
  for (let index = 0; index < total; index++) {
    const row = rows[index - first];
    shelves.push(row ? heroShelf(index, row) : decorShelf(index, total));
  }

  const caseHeight = CROWN + PLINTH + shelves.reduce((sum, shelf) => sum + shelf.height, 0);
  return { shelves, caseHeight, crown: CROWN, plinth: PLINTH, board: BOARD };
}
