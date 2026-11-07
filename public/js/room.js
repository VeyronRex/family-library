/* ─────────────────────────────────────────────────────────────────────────────
   THE LIBRARY ROOM
   Three small things, all optional. The books are ordinary links, so the page
   works without any of this.

     1. A caption that names the book you point at (or tab to).
     2. A slight turning of the room as the mouse moves.
     3. "Opening" the book you click: it comes out, the room fades to paper,
        and then the page loads.
   ───────────────────────────────────────────────────────────────────────────── */

(() => {
  const room = document.querySelector('.room');
  if (!room) return;

  const books = Array.from(room.querySelectorAll('a.book'));
  const quiet = window.matchMedia('(prefers-reduced-motion: reduce)');
  const OPEN_DELAY = 620; // how long the opening takes, in milliseconds
  let leaving = false;

  // ── 1. Caption ────────────────────────────────────────────────────────────

  const caption = room.querySelector('[data-caption]');
  if (caption) {
    const title = caption.querySelector('.caption__title');
    const tagline = caption.querySelector('.caption__tagline');
    const idleTitle = caption.dataset.default || title.textContent;

    const show = (book) => {
      title.textContent = book ? book.dataset.title : idleTitle;
      tagline.textContent = book ? book.dataset.tagline : '';
      caption.classList.toggle('is-idle', !book);
    };

    books.forEach((book) => {
      book.addEventListener('pointerenter', (event) => event.pointerType !== 'touch' && show(book));
      book.addEventListener('pointerleave', () => show(null));
      book.addEventListener('focus', () => show(book));
      book.addEventListener('blur', () => show(null));
    });
  }

  // ── 2. The room turns a little with the mouse ────────────────────────────

  const layers = Array.from(room.querySelectorAll('[data-depth]')).map((element) => ({
    element,
    depth: Number(element.dataset.depth) || 0,
  }));
  const STRENGTH = 2.5; // pixels of movement for each point of depth
  let frame = 0;
  let target = 0;

  const turn = () => {
    frame = 0;
    layers.forEach(({ element, depth }) => {
      element.style.transform = `translate3d(${(-depth * target * STRENGTH).toFixed(2)}px, 0, 0)`;
    });
  };

  const aim = (value) => {
    target = value;
    if (!frame) frame = requestAnimationFrame(turn);
  };

  window.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse' || quiet.matches) return;
    aim((event.clientX / window.innerWidth - 0.5) * 2);
  });
  document.addEventListener('pointerleave', () => aim(0));

  // ── 3. Opening a book ─────────────────────────────────────────────────────

  const reset = () => {
    leaving = false;
    room.classList.remove('is-leaving');
    books.forEach((book) => book.classList.remove('is-opening'));
  };

  books.forEach((book) => {
    book.addEventListener('click', (event) => {
      const plain = event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
      if (event.defaultPrevented || !plain || quiet.matches) return;
      event.preventDefault();
      if (leaving) return;
      leaving = true;
      book.classList.add('is-opening');
      room.classList.add('is-leaving');
      window.setTimeout(() => {
        window.location.href = book.href;
      }, OPEN_DELAY);
    });
  });

  // Coming back with the Back button can show the room as we left it.
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) reset();
  });

  // ── Keyboard: arrow keys move from book to book ──────────────────────────

  room.addEventListener('keydown', (event) => {
    const index = books.indexOf(document.activeElement);
    if (index < 0) return;
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
    if (event.key === 'Home') books[0].focus();
    else if (event.key === 'End') books[books.length - 1].focus();
    else if (step) books[(index + step + books.length) % books.length].focus();
    else return;
    event.preventDefault();
  });
})();
