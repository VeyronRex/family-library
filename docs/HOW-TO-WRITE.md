# How to write and publish

Every post is one text file. You write it in **Markdown**, which is just normal writing with a few simple marks. You do not need any design skills: the library decides how everything looks.

---

## The quickest way (in your browser, on GitHub)

1. Open your repository on GitHub.
2. Open the folder **content**, then **blog** (or **journal**).
3. Press **Add file**, then **Create new file**.
4. In the name box type a file name, for example: `2026-11-20-my-first-post.md`
5. Write the details and your story (see below).
6. Press **Commit changes**, then **Commit changes** again.
7. Wait one or two minutes. Your post is live and it appears in the list.

You can do exactly the same from a phone browser. If the buttons do not show, choose **Desktop site** in the browser menu.

---

## The file name

```
2026-11-20-my-first-post.md
```

- It starts with the date: **year-month-day**.
- Then a few words joined with dashes. Use only letters, numbers and dashes.
- It ends with `.md`.

The words after the date become part of the web address of the post (`/blog/my-first-post/`). Two posts cannot have the same words. If they do, the build tells you.

---

## The top of every post

Every post begins with a small block of details between two lines of `---`:

```
---
title: "My first post"
date: 2026-11-20
tags: [travel, family]
summary: A short line shown in the list. (Optional.)
---

Now write your story here.
```

| Detail | What it does |
| --- | --- |
| `title` | The big name of the post. Put it in quotes. |
| `date` | Decides the year and the month filters, and the order of the list. Write it as **year-month-day**. If you leave it out, the date in the file name is used. |
| `tags` | The **topics**. Written in square brackets with commas. They become the topic buttons in the filter. |
| `summary` | The short line shown under the title in the list. If you leave it out, the first sentences of the post are used. |
| `draft` | Write `draft: true` to keep the post **hidden** while you are still working on it. Remove the line (or write `false`) to publish. |

### About topics (tags)

- Keep them short and use the **same word every time**: `travel`, not sometimes `travel` and sometimes `trips`.
- Two or three topics for each post is plenty.
- Small letters are best.
- Click a topic on a post and the Blog list opens, already filtered to that topic.

---

## Writing with Markdown

```
## A big heading
### A smaller heading

Some words in *italic* and some in **bold**.

- a list
- of things

1. a numbered list
2. when the order matters

> A quote starts with this sign.

A [link](https://example.com) has brackets, then round brackets.

---
```

The line with three dashes makes a pretty divider.

Leave an **empty line** between paragraphs.

---

## Special boxes for the things that matter most

Some words are worth being noticed one day by your sons. Put them in a box:

```
::: lesson
Never stop asking why.
:::
```

You can use four kinds. The word after `:::` chooses the box and its title.

| Write | The box is titled |
| --- | --- |
| `::: lesson` | A lesson learned |
| `::: letter` | A letter to my sons |
| `::: memory` | A memory |
| `::: note` | A note |

You can write your own title after the word: `::: lesson What my father taught me`.

To make a new kind of box, see [CHANGE-THE-LOOK.md](CHANGE-THE-LOOK.md).

---

## Pictures

A post that has pictures needs its **own folder**, so the pictures stay with the story.

1. Create the post as a folder with the file `index.md` inside. On GitHub, in the name box type:
   `2026-11-20-my-trip/index.md`
   (Each `/` makes a folder.) Write your post and commit.
2. Open the new folder `2026-11-20-my-trip`. Press **Add file**, then **Upload files**, and add your pictures.
3. In `index.md`, show a picture like this:

```
![A sunrise over the river](sunrise.jpg "Dawn, the second morning")
```

- The words in square brackets describe the picture (this helps people who cannot see it).
- The words in quotes at the end become the **caption** under the picture. They are optional.

**Before you upload photos,** make them smaller. A phone photo can be 5 MB or more, which makes the page slow. Aim for **about 1600 pixels wide** and **under 500 KB**. Any free photo app can do this ("resize" or "export smaller").

---

## Keeping a post hidden until it is ready

Add `draft: true` to the top:

```
---
title: "Something not finished"
date: 2026-11-20
draft: true
---
```

Drafts are **not published**. On your own computer, `npm run dev` (see the README) shows them so you can read your work.

---

## Fixing and deleting

- **To fix a typo:** open the file on GitHub, press the **pencil**, change it, **Commit changes**.
- **To delete a post:** open the file, press the **trash** icon, **Commit changes**.
- **If you make a mistake in the top block,** the website does not break. The build stops and tells you the file and the line to fix; the old website stays online until the problem is fixed. Look at the red cross in the **Actions** tab.

---

## The Journal

The Journal works exactly the same, in the folder `content/journal`. Only the look is different: lighter paper, and entries shown day by day.

A nice habit: one short file for each day you want to remember, with the date in the file name. Even three lines are worth keeping.

---

## Writing in Bangla (বাংলা)

You can write in Bangla in any post. Save the file as normal; it works.

For nicer Bangla dates and month names, open `config/site.mjs` and set `language: 'bn'`.

The old-style English fonts have no Bangla letters, so a reader's device chooses a Bangla font by itself. To choose one yourself (for example *Noto Serif Bengali*), see [CHANGE-THE-LOOK.md](CHANGE-THE-LOOK.md).

---

## A short checklist before you press Commit

- [ ] The file name starts with the date and ends with `.md`.
- [ ] The top block starts and ends with `---`.
- [ ] There is a `title` and a `date`.
- [ ] I would be happy for **anyone** to read this (see "Keep it safe" in the README).
