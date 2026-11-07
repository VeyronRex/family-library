// Small gold emblems drawn on the books. Each one is a set of shapes on a
// 100 × 100 canvas. The colour (gold foil on the shelf, ink on the pages) is
// set by CSS, so the drawings below carry no colours of their own.
//
// To add an emblem: add an entry here, then use its name in config/books.mjs.

export const emblems = {
  // A shield with a star: the family crest.
  crest: `
    <path d="M50 5 L87 17 V47 C87 70 71 87 50 96 C29 87 13 70 13 47 V17 Z" fill="none" stroke-width="3.2" stroke-linejoin="round"/>
    <path d="M50 12 L80 22 V47 C80 66 67 80 50 88 C33 80 20 66 20 47 V22 Z" fill="none" stroke-width="1.2" stroke-linejoin="round"/>
    <path d="M50 26 L54.2 38.2 L67.1 38.4 L56.9 46.2 L60.6 58.6 L50 51.2 L39.4 58.6 L43.1 46.2 L32.9 38.4 L45.8 38.2 Z" stroke="none"/>
    <path d="M33 68 L50 76 L67 68" fill="none" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
  `,

  // A compass rose: for journeys and things learned along the way.
  compass: `
    <circle cx="50" cy="50" r="42" fill="none" stroke-width="2.4"/>
    <circle cx="50" cy="50" r="36" fill="none" stroke-width="0.9"/>
    <path d="M50 6 L56.5 43.5 L94 50 L56.5 56.5 L50 94 L43.5 56.5 L6 50 L43.5 43.5 Z" stroke="none"/>
    <path d="M27 27 L45 45 M73 27 L55 45 M73 73 L55 55 M27 73 L45 55" fill="none" stroke-width="2" stroke-linecap="round"/>
    <circle cx="50" cy="50" r="4.5" fill="none" stroke="rgba(0,0,0,.45)" stroke-width="1.6"/>
  `,

  // A feather pen: for the days as they come.
  quill: `
    <path d="M88 7 C60 11 33 33 28 62 C26 74 29 84 34 91 C36 79 44 67 55 60 C71 50 85 33 88 7 Z" stroke="none"/>
    <path d="M88 7 C64 30 46 55 34 91" fill="none" stroke="rgba(0,0,0,.45)" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M34 91 L21 98 L27 88 Z" stroke="none"/>
    <path d="M71 21 L60 28 M63 34 L52 41 M55 47 L46 53 M79 27 L70 36 M71 42 L62 49" fill="none" stroke="rgba(0,0,0,.32)" stroke-width="1.2" stroke-linecap="round"/>
  `,
};

export const emblemNames = Object.keys(emblems);
