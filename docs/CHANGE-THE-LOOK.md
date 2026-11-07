# Change the look, and add features safely

This page is for when you want to change how the website looks, or want someone (or Claude) to add a new feature. Nothing here is needed to use the website every day.

---

## Where things live

| I want to change… | Open this file |
| --- | --- |
| The name on the brass plate, my name, the language | `config/site.mjs` |
| The books on the shelf | `config/books.mjs` |
| Words on buttons and menus ("Search", "Next entry"…) | `config/text.mjs` |
| The main colours and the fonts | `public/css/tokens.css` |
| How **About** and **Blog** pages look (old paper) | `public/css/theme-parchment.css` |
| How the **Journal** looks | `public/css/theme-journal.css` |
| The room (wall, floor, window, candles, painting) | `public/css/room.css` |
| The bookcase | `public/css/bookcase.css` |
| The books and what stands on the shelves | `public/css/books.css` |
| The paper, leather and wood textures | `public/css/textures.css` |
| The boxes inside posts (lesson, memory…) | `public/css/prose.css` |
| The filter buttons | `public/css/filters.css` |

---

## Colours

Open `public/css/tokens.css`.

- At the top are the room colours: `--wine-…` (the walls), `--walnut-…` (the wood), `--gold-…` (the gold). Change a colour here and it changes everywhere it is used.
- Lower down there is one block for each kind of paper:
  - `[data-theme='parchment']`: About and Blog.
  - `[data-theme='journal']`: the Journal.
  - Inside you will find `--paper` (the page colour), `--ink` (the text), `--accent` (links and headings).

**Keep the text easy to read.** Dark text on light paper, light text on dark. A quick check: if you squint and can still read it, it is fine.

---

## Letters (fonts)

The fonts are loaded from Google Fonts. Two places control them:

1. `config/site.mjs`, the line `fontsUrl`: the list of fonts to download.
2. `public/css/tokens.css`, the lines that start with `--font-`: which font is used for what.

To try another font:

1. Go to [fonts.google.com](https://fonts.google.com) and choose a font.
2. Press **Get font**, then **Get embed code**. Choose the "web" tab and **@import**/`<link>`. Copy the address that starts with `https://fonts.googleapis.com/css2…`.
3. Put it in `fontsUrl` (or add the new family to the existing address with `&family=…`).
4. In `tokens.css`, put the new name first in the right `--font-…` line. Keep the other names after it; they are a safety net.

**If you want no outside requests at all,** set `fontsUrl: ''`. The site then uses the fonts already on each reader's device. It still looks good, only a little different.

### Bangla fonts

The old-style fonts have no Bangla letters, so devices choose a Bangla font themselves. To choose one:

1. Add `&family=Noto+Serif+Bengali:wght@400;600` to `fontsUrl`.
2. In `tokens.css`, add `'Noto Serif Bengali'` at the end of `--font-old`, `--font-old-body`, `--font-modern` and `--font-caps` (before `serif`). Bangla letters will use it, English letters keep their own font.

---

## Words on the buttons

Everything the website says by itself ("Search", "Showing 3 of 9 posts", "Choose a book") is in `config/text.mjs`. Translate or reword anything there. Pieces in curly brackets, like `{shown}`, are filled in by the site: keep them.

---

## A new kind of box for posts

1. In `config/site.mjs`, add a line to `callouts`: `prayer: 'A prayer',`
2. In `public/css/prose.css`, copy the block `.callout--lesson` and rename it `.callout--prayer`. Change its colour.
3. In a post, write:

```
::: prayer
Keep them safe.
:::
```

---

## A new look for a book's pages

A theme only sets names such as `--paper`, `--ink` and `--accent`. The shared page styles use those names, so a new theme needs no layout code.

1. In `public/css/tokens.css`, copy the `[data-theme='journal']` block and rename it, for example `[data-theme='midnight']`. Change the colours.
2. Copy `public/css/theme-journal.css` to `public/css/theme-midnight.css`.
3. In `scripts/lib/books.mjs`, add `'midnight'` to the list `THEMES`.
4. In `scripts/templates/layout.mjs`, add a line for it in `BROWSER_COLOR`. (This is the colour of the browser bar on a phone.)
5. In `config/books.mjs`, use `theme: 'midnight'` for a book.

---

## How the code is organised

The rule is: **each part has one job**, so a change in one place does not break another.

```
config/              WHAT the site is (settings, books, words). Only data.
content/             WHAT you write. Only Markdown.
scripts/lib/         Small tools that read content, turn it into HTML,
                     format dates, make addresses, and plan the shelves.
scripts/templates/   The pages, written as small functions: data in, HTML out.
  components/        Reusable pieces (a book, the filter bar, a card…).
public/              The look and behaviour: CSS and small scripts,
                     copied to the website unchanged.
scripts/build.mjs    Puts it all together into the finished website (dist/).
```

How a page is made: `config` and `content` are read → turned into plain data → passed to a template → written as an `.html` file.

Good habits that keep it safe:

- A **new book** is only an edit of `config/books.mjs`.
- A **new colour or look** is only an edit of CSS. CSS files never need the content.
- **Words** live in `config/text.mjs`, never inside templates.
- Templates escape text automatically, so a `<` in a post cannot break a page.
- The build checks everything first and **stops with a plain message** when something is wrong. A half-finished website is never published.

### Adding a bigger feature later (for example, a photo gallery)

The cleanest way is a new *kind* of book. Today there are two: `'page'` and `'collection'`. A gallery would be a third. The places to touch, and nothing else:

1. `scripts/lib/books.mjs`: allow the new `kind`.
2. `scripts/lib/content.mjs`: a function that reads the photos.
3. `scripts/templates/`: a template that shows them.
4. `scripts/build.mjs`: one branch that uses the new loader and template.
5. `config/books.mjs`: a new book that uses the kind.

The room, the shelf, the menu and the pages of the other books do not change at all. When you are ready, ask a developer (or Claude) to add it, and give them this page.

---

## If the animations bother someone

The site respects the phone and computer setting "Reduce motion". When it is on, the books do not slide, the candles do not flicker and pages open straight away. Nothing to do.
