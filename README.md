# My Library

A personal website that looks like an old royal library. You walk into a room with a bookcase. Each book is a part of your website: **About Me**, **Blog** and **Journal**. Click a book and it opens.

It is made to be kept for a long time, so your sons can read it one day. It costs **nothing**: it is published for free on GitHub Pages, and you write your posts in simple text files.

**Not sure where to start? Follow Part 1 below, step by step. It takes about 30 minutes, once.**

---

## What you get

- A **library room** as the front page, with books you can point at and click.
- **About Me** and **Blog** pages on old paper, with old-style letters.
- A **Journal** on lighter, calmer paper for everyday writing.
- A **filter** on the Blog and Journal: by **year**, **month**, **topic** and by searching words.
- Easy to add a **new book** later (for example Recipes, Letters or Travels). See [docs/ADD-A-BOOK.md](docs/ADD-A-BOOK.md).
- Works on phones, tablets and computers.

## What you need

- A computer (a phone can do it too, but a computer is easier the first time).
- An email address.
- About 30 minutes.
- No money, and no programming.

---

## Part 1: Put your website on the internet (one time only)

### Step 1. Make a free GitHub account

1. Go to [github.com](https://github.com) and press **Sign up**.
2. Choose a username. **Think about it:** it will be part of your website address. If you choose `rahim`, your address will be `https://rahim.github.io`.
3. Confirm your email address.

### Step 2. Unzip the folder

Find the file `my-library.zip` that you downloaded. Open it (on Windows: right-click, **Extract All**). You now have a folder called `my-library` with many files inside.

### Step 3. Make a repository

A *repository* is just a folder for your website on GitHub.

1. On GitHub press the **+** at the top right, then **New repository**.
2. **Repository name:** type `yourusername.github.io`. Use your real username. For example `rahim.github.io`.
   - This gives you the short address `https://rahim.github.io`.
   - You can also use any other name, like `diary`. Then your address will be `https://rahim.github.io/diary/`. Everything still works.
3. Choose **Public**. (GitHub Pages is free only for public repositories. See "Keep it safe" below.)
4. Do **not** tick "Add a README file". We already have one.
5. Press **Create repository**.

### Step 4. Upload the files

1. On the new empty repository page, press the link **uploading an existing file**.
2. Open your unzipped `my-library` folder. Select **everything inside it** (press Ctrl+A) and drag it onto the GitHub page.
   Drag the things *inside* the folder, not the folder itself.
3. Wait until all the files finish uploading.
4. At the bottom, press **Commit changes**.

### Step 5. Check that the "publishing recipe" arrived

The website is published by a small recipe file called `deploy.yml`. It lives in a folder called `.github`.

1. On your repository page, look for a folder named **.github**.
2. **If you see it, go to Step 6.**
3. **If you do not see it** (some computers hide folders that start with a dot), make the file by hand:
   1. Press **Add file**, then **Create new file**.
   2. In the name box, type exactly: `.github/workflows/deploy.yml`
      (When you type each `/`, GitHub makes a folder.)
   3. Paste the text below into the big box, then press **Commit changes**.

<details>
<summary>Click to show the text to paste</summary>

```yaml
name: Publish the website

on:
  push:
    branches: [main, master]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Get the files
        uses: actions/checkout@v4

      - name: Install Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22

      - name: Find the website's address
        id: pages
        uses: actions/configure-pages@v5

      - name: Build the website
        run: node scripts/build.mjs
        env:
          SITE_BASE: ${{ steps.pages.outputs.base_path }}

      - name: Pack the website
        uses: actions/upload-pages-artifact@v4
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Publish
        id: deployment
        uses: actions/deploy-pages@v4
```

</details>

### Step 6. Turn on publishing

1. In your repository press **Settings** (the tab at the top).
2. In the left menu press **Pages**.
3. Under **Build and deployment**, find **Source**. Change it to **GitHub Actions**.

### Step 7. Wait, then visit your website

1. Press the **Actions** tab. You will see a job called **Publish the website** running (yellow circle).
2. After about one or two minutes it gets a **green tick**. Your website is live.
3. Go to `https://yourusername.github.io` (the address from Step 3). You should see your library room.

If the job got a **red cross**, go to "If something goes wrong" near the end of this page.

> If you made the site **before** you did Step 6, the first job fails. That is normal. Do Step 6, then open **Actions**, press **Publish the website**, then **Run workflow**.

### Step 8. Make it yours

Everything you may want to change first is in one small file.

1. On GitHub open the folder **config**, then the file **site.mjs**.
2. Press the **pencil** icon (Edit).
3. Change the words between the quotes: the **title** (carved on the brass plate), the **tagline**, your **name** (shown at the bottom of every page) and the **language**.
4. Press **Commit changes**. After a minute the website updates by itself.

Then, open **content/about.md** and write your own About page. It starts as a sample.

Finally, **delete the sample posts**. Every sample has *(sample)* in its title. Open the folders **content/blog** and **content/journal**, open a sample file, press the **trash** icon, and commit. Do this when you are ready to write your own.

**Part 1 is finished. You have a website.**

---

## Part 2: Write a post

The short version:

1. Open **content/blog** (or **content/journal**) on GitHub.
2. Press **Add file**, then **Create new file**.
3. Name it like `2026-11-20-my-first-post.md`.
4. Write at the top the title, date and topics, then your story below.
5. Press **Commit changes**. In about a minute it is live.

The full guide, with every trick (pictures, special boxes, topics, drafts, writing from your phone), is here: **[docs/HOW-TO-WRITE.md](docs/HOW-TO-WRITE.md)**.

---

## Part 3: See your changes on your own computer first (optional)

You do not have to do this. It is only useful if you want to look at a post privately before publishing, or if you want to change the design.

1. Install **Node.js** from [nodejs.org](https://nodejs.org) (choose the LTS button). Version 20 or newer.
2. Open a terminal in your `my-library` folder.
   - Windows: open the folder, click the address bar, type `cmd`, press Enter.
   - Mac: right-click the folder and choose **New Terminal at Folder**.
3. Type this and press Enter:

   ```
   npm run dev
   ```

4. Open **http://localhost:4321** in your browser.

The page refreshes by itself each time you save a file. To stop, press Ctrl+C.
No installing of extra tools is needed. In this preview, posts with `draft: true` are shown too, so you can read them before they are public.

---

## Part 4: Add a new book

Want a fourth book, for example **Recipes** or **Letters to my sons**? It takes about two minutes and you do not have to change any code. The shelves, the room and the menu at the top grow by themselves.

See **[docs/ADD-A-BOOK.md](docs/ADD-A-BOOK.md)**.

To change colours or letters, see **[docs/CHANGE-THE-LOOK.md](docs/CHANGE-THE-LOOK.md)**.

---

## Keep it safe

**Anyone with the link can read a free GitHub Pages website.** By default the site asks search engines (Google and others) not to list it, so strangers are unlikely to find it. But that is only a polite request, not a lock.

So, before you publish, think about what is OK for the whole world to read:

- Do not write phone numbers, home addresses, ID or bank numbers, passwords.
- Think carefully about your children: their full names, schools, photos and daily places.
- If a journal entry is very private, keep it on paper or on your computer instead.

Also: on the free plan the repository must be **Public**. That means the *files* (your posts) can be read on GitHub by anyone too, and not only on the website.

If you later want your website to be found on Google, open `config/site.mjs`, set `searchEngines: true` and put your address in `url`.

### Keep a copy

Your website lives on GitHub, but you should keep your own copy too, especially for the day your sons read it.

- On your repository page press the green **Code** button, then **Download ZIP**. Do this every few months and keep the file somewhere safe (a USB drive, or your email).
- Your writing is plain text files. They can be opened on any computer, in any year. That is the whole point of this design.

---

## If something goes wrong

**The job in "Actions" has a red cross.**
Click it, then click the red step. The message says what to fix. The most common ones:

| The message says | What to do |
| --- | --- |
| `Get Pages site failed` | Do Step 6: **Settings, Pages, Source: GitHub Actions**. Then **Actions, Run workflow**. |
| A file name like `content/blog/something.md` and a sentence | That post has a small mistake at the top. The sentence tells you what (for example a missing date). Fix it and commit. |
| `this folder does not exist` | A book in `config/books.mjs` points to a folder that is not in `content`. Create the folder or fix the name. |

**The website opens but looks plain, with no pictures and colours.**
Wait a minute and press Ctrl+F5. If it stays plain, open the **Actions** tab and check the last job has a green tick.

**I changed something but the website did not change.**
Check the **Actions** tab. The change is live only after the job gets a green tick (one or two minutes). Then press Ctrl+F5.

**The letters look different from the pictures I saw.**
The old-style fonts are loaded from Google Fonts. If a reader is offline or blocks it, their device uses a similar font instead. Everything stays readable. See [docs/CHANGE-THE-LOOK.md](docs/CHANGE-THE-LOOK.md) to change this.

---

## Where things are

```
my-library/
├── content/            YOUR WRITING lives here
│   ├── about.md          the About Me page
│   ├── blog/             one file per blog post
│   └── journal/          one file per journal entry
├── config/             SETTINGS
│   ├── site.mjs          title, your name, language
│   ├── books.mjs         the books on the shelf (add a book here)
│   └── text.mjs          the small words used on buttons and menus
├── public/             the look: colours, textures, small scripts, icon
├── scripts/            the program that builds the website
├── docs/               guides
└── .github/            the recipe that publishes the site for you
```

For everyday use you only ever touch **content** and, sometimes, **config**.

## Notes on what is inside

- **Fonts** (Cinzel, EB Garamond, IM Fell English, Lora, Caveat) come from Google Fonts and are free to use (SIL Open Font License). When a reader opens your site, their browser asks Google for the letters. If you prefer no outside requests, set `fontsUrl: ''` in `config/site.mjs`.
- **marked** (a small program that turns your text into web pages) is included in `scripts/vendor/` under the MIT licence. Its licence file is next to it.
- The rest of the code was written for this website. Nothing needs to be installed, so the site can still be built many years from now.
