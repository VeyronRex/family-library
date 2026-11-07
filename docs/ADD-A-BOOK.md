# Add a new book

The shelf in the library room is built from one list. **Every item in that list becomes a book on the shelf, a link in the menu at the top of every page, and its own pages.** To add a book you only add to the list. You do not change any code.

The list is in **`config/books.mjs`**.

---

## The short way: a new collection (like the Blog)

Example: a book called **Recipes**, with one page for each recipe.

### 1. Make a folder for the writing

Create the folder `content/recipes` and put one file in it, for example `content/recipes/2026-11-20-grandmas-rice.md`:

```
---
title: "Grandma's rice"
date: 2026-11-20
tags: [family, food]
---

Write the recipe here.
```

(On GitHub: open **content**, press **Add file**, **Create new file**, and type `recipes/2026-11-20-grandmas-rice.md`.)

### 2. Add the book to the list

Open **`config/books.mjs`**. Copy the whole Blog block (from `{` to `},`), paste it after the last book, and change the words:

```js
  {
    id: 'recipes',
    title: 'Recipes',
    tagline: 'Food that tastes like home',
    kind: 'collection',
    source: 'recipes',
    path: 'recipes',
    theme: 'parchment',
    listStyle: 'contents',
    noun: { one: 'recipe', many: 'recipes' },
    spine: { leather: 'umber', emblem: 'compass' },
  },
```

### 3. Save

Commit the change. After a minute or two a new **Recipes** book stands on the shelf, and **Recipes** appears in the menu. The Blog's filters (year, month, topic, search) work on it too.

---

## What each line means

| Line | Meaning |
| --- | --- |
| `id` | A short name for the book. Small letters, numbers and dashes only. Every book needs a different one. |
| `title` | The name on the spine, in the menu and at the top of the page. **Short is best** (see below). |
| `tagline` | One line shown under the book's name when you point at it. |
| `kind` | `'collection'` = many dated entries, one file each (like the Blog). `'page'` = one single page (like About Me). |
| `source` | For a collection: the **folder** inside `content`. For a page: the **file** inside `content`, for example `'about.md'`. |
| `path` | The web address of the book: `yourname.github.io/recipes/`. |
| `theme` | How its pages look: `'parchment'` (old paper) or `'journal'` (lighter and plainer). |
| `listStyle` | How the list of entries looks: `'contents'` (a table of contents, grouped by year) or `'diary'` (day by day, grouped by month). |
| `noun` | What one entry is called. Used in sentences like "Showing 3 of 9 recipes." |
| `spine` | How the book looks on the shelf (see next). |

### The spine (how the book looks)

```js
spine: { leather: 'umber', emblem: 'compass', width: 62, height: 190, depth: 132 },
```

| Setting | Choices |
| --- | --- |
| `leather` | `oxblood` (dark red), `emerald` (green), `navy` (blue), `umber` (brown), `plum` (purple), `onyx` (near black), `teal` |
| `emblem` | `crest`, `compass`, `quill` |
| `width` | About 52 to 72. A fatter number is a thicker book. |
| `height` | About 180 to 198. |
| `depth` | How deep the cover is when the book slides out. Leave it as it is (132). |

**You can leave the whole `spine` line out.** The library then picks a colour, an emblem and a size for you.

### Choose a short title

The title is written along the spine. About **eight letters** fit on one line at full size. A title with several words may use two lines (for example *Family Recipes*). A very long title is written smaller, and then gets cut. The full title is always shown in the caption when someone points at the book.

Short titles look best: *Recipes*, *Letters*, *Travels*.

---

## A single page (like About Me)

Use `kind: 'page'` and point `source` at a file:

```js
  {
    id: 'family',
    title: 'Family',
    tagline: 'The people I come from',
    kind: 'page',
    source: 'family.md',
    path: 'family',
    theme: 'parchment',
    spine: { leather: 'plum', emblem: 'crest' },
  },
```

Then create `content/family.md` and write the page. It needs no date.

---

## What happens to the room

- **Four real books stand on one shelf.** The fifth starts a new shelf. (Change this with `booksPerShelf` at the top of `config/books.mjs`.)
- The bookcase **grows taller** with each new shelf, and the whole room shrinks a little to keep it on the screen. You do not have to do anything.
- The rest of each shelf is filled with old books and small objects (a candle, a brass globe of rings, a scroll), so it always looks complete.
- Up to about **eight books** looks best. More still works. The books just become smaller.

---

## If you see an error

The website will not be published until the problem is fixed, and your old website stays online. The message tells you exactly what to change, and it starts with where the problem is, for example `config/books.mjs — book 4 ("Recipes"): …`. The most common ones:

- `the id "blog" is used twice. Every book needs its own id.` : two books have the same `id`.
- `content/recipes/ — this folder does not exist. Create it, then add a .md file inside.` : create the folder, or fix `source`.
- `spine leather "pink" is not known. Choose from: …` : choose one from the table above.
- `"theme" must be one of 'parchment', 'journal'.` : check the spelling of `theme`.

---

## Adding a new leather colour or emblem (for later)

**Colour.** Open `public/css/books.css`. At the top, in "Leather colours", copy one block and change the three shades (a highlight, a main colour, a shadow). Then add the new name to the list `LEATHERS` in `scripts/lib/books.mjs`.

**Emblem.** Open `scripts/lib/emblems.mjs`. Add a new entry that draws shapes on a 100 by 100 square. Look at the three that exist. Its name is then ready to use in `config/books.mjs`.
