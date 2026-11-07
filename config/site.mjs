// ─────────────────────────────────────────────────────────────────────────────
//  YOUR SITE'S SETTINGS
//  Change the words between the quotes, save the file, and rebuild.
//  Nothing else in this file needs to be touched.
// ─────────────────────────────────────────────────────────────────────────────

export default {
  // The name of your library. It is carved on the brass plate above the shelves.
  title: 'My Library',

  // One line under the name.
  tagline: 'Stories, lessons and days worth remembering',

  // Your name. It appears in the footer of every page.
  owner: 'Your Name',

  // Language of the pages: 'en-GB' (18 November 2026), 'en' (November 18, 2026),
  // 'bn' for Bangla, and so on.
  // This also decides how month names are written (November / নভেম্বর).
  language: 'en-GB',

  // A short description. Used when someone shares a link to your site.
  description: 'A personal library of stories, lessons and daily notes, kept for my family.',

  // A line at the bottom of every page.
  footerNote: 'Written by hand, kept for the ones I love.',

  // Should search engines such as Google list this site?
  //   false = ask them to stay away (good for a private family library)
  //   true  = let anyone find it
  // This is only a polite request, not a lock. Anything on a free GitHub Pages
  // site can be read by someone who has the link.
  searchEngines: false,

  // Your site's web address, like 'https://yourname.github.io'.
  // Only needed if you set searchEngines to true (it is used to make a sitemap).
  url: '',

  // Special boxes you can use inside a post. In your post, write:
  //
  //   ::: lesson
  //   Never stop asking why.
  //   :::
  //
  // The word after ::: picks the box. The text on the right is its title.
  // Add your own kinds here, then style them in public/css/prose.css.
  callouts: {
    lesson: 'A lesson learned',
    letter: 'A letter to my sons',
    memory: 'A memory',
    note: 'A note',
  },

  // Fonts come from Google Fonts. If you ever want to change the look of the
  // letters, this is the address to change. Leave it empty ('') to use only the
  // fonts already on each reader's device.
  fontsUrl:
    'https://fonts.googleapis.com/css2' +
    '?family=Cinzel:wght@400;500;600;700' +
    '&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500' +
    '&family=IM+Fell+English:ital@0;1' +
    '&family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500' +
    '&family=Caveat:wght@500;600' +
    '&display=swap',
};
