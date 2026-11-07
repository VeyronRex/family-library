// Makes the search box and the Year / Month / Topic buttons work.
//
// Every entry on the page carries its year, month, topics and a bit of text as
// small data-… labels. Choosing a button simply hides the entries that do not
// match. The choices are also written into the web address (?year=2026&tag=travel)
// so a filtered list can be bookmarked or shared.

(() => {
  const root = document.querySelector('[data-filters]');
  const list = document.querySelector('[data-entries]');
  if (!root || !list) return;

  const labels = JSON.parse(root.dataset.labels || '{}');
  const entries = [...list.querySelectorAll('[data-entry]')].map((el) => ({
    el,
    year: el.dataset.year,
    month: el.dataset.month,
    tags: (el.dataset.tags || '').split('|').filter(Boolean),
    text: el.dataset.search || '',
  }));
  const groups = [...list.querySelectorAll('[data-group]')];
  const empty = list.querySelector('[data-empty]');
  const input = root.querySelector('[data-search-input]');
  const status = root.querySelector('[data-status]');
  const clear = root.querySelector('[data-clear]');
  const total = entries.length;

  const facets = {};
  root.querySelectorAll('[data-facet]').forEach((group) => {
    facets[group.dataset.facet] = { group, chips: [...group.querySelectorAll('.chip')] };
  });

  const state = { year: '', month: '', tag: '', q: '' };

  // Start from whatever the address says, ignoring anything that does not exist.
  const params = new URLSearchParams(location.search);
  for (const name of Object.keys(state)) {
    const value = (params.get(name) || '').trim();
    if (name === 'q') state.q = value;
    else if (facets[name]?.chips.some((chip) => chip.dataset.value === value)) state[name] = value;
  }
  input.value = state.q;

  const matches = (entry, s) =>
    (!s.year || entry.year === s.year) &&
    (!s.month || entry.month === s.month) &&
    (!s.tag || entry.tags.includes(s.tag)) &&
    (!s.q || s.q.toLowerCase().split(/\s+/).every((word) => entry.text.includes(word)));

  const fill = (template, values) =>
    String(template).replace(/\{(\w+)\}/g, (match, key) => (key in values ? values[key] : match));
  const noun = (n) => (n === 1 ? labels.nounOne : labels.nounMany);

  function update() {
    let shown = 0;
    for (const entry of entries) {
      const visible = matches(entry, state);
      entry.el.hidden = !visible;
      if (visible) shown += 1;
    }
    for (const group of groups) group.hidden = !group.querySelector('[data-entry]:not([hidden])');
    if (empty) empty.hidden = shown > 0;

    // Each button shows how many entries it would give, with the other choices kept.
    for (const [name, { chips }] of Object.entries(facets)) {
      for (const chip of chips) {
        const value = chip.dataset.value;
        const count = entries.filter((entry) => matches(entry, { ...state, [name]: value })).length;
        chip.querySelector('[data-count]').textContent = count;
        chip.setAttribute('aria-pressed', String(state[name] === value));
        chip.disabled = count === 0 && state[name] !== value;
      }
    }

    const active = Object.values(state).some(Boolean);
    clear.hidden = !active;
    status.textContent = fill(active ? labels.showing : labels.showingAll, { shown, total, noun: noun(active ? total : total) });

    const next = new URLSearchParams();
    for (const [name, value] of Object.entries(state)) if (value) next.set(name, value);
    const query = next.toString();
    history.replaceState(null, '', `${location.pathname}${query ? `?${query}` : ''}${location.hash}`);
  }

  root.addEventListener('click', (event) => {
    const chip = event.target.closest('.chip');
    if (chip) {
      const name = chip.closest('[data-facet]').dataset.facet;
      const value = chip.dataset.value;
      state[name] = state[name] === value ? '' : value;
      update();
      return;
    }
    if (event.target.closest('[data-clear]')) {
      Object.keys(state).forEach((name) => (state[name] = ''));
      input.value = '';
      update();
      return;
    }
    const more = event.target.closest('[data-more]');
    if (more) {
      const open = more.closest('[data-facet]').classList.toggle('is-expanded');
      more.textContent = open ? labels.showFewerTopics : labels.showAllTopics;
      more.setAttribute('aria-expanded', String(open));
    }
  });

  input.addEventListener('input', () => {
    state.q = input.value.trim();
    update();
  });

  // Choosing a topic on an entry filters the list too.
  list.addEventListener('click', (event) => {
    const tag = event.target.closest('[data-tag]');
    if (!tag || event.metaKey || event.ctrlKey || event.shiftKey) return;
    event.preventDefault();
    state.tag = tag.dataset.tag;
    update();
    const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    root.scrollIntoView({ behavior: calm ? 'auto' : 'smooth', block: 'start' });
  });

  // A topic hidden behind "Show all topics" must be visible if it is chosen.
  const chosen = facets.tag?.chips.find((chip) => chip.dataset.value === state.tag);
  if (chosen?.hasAttribute('data-extra')) root.querySelector('[data-more]')?.click();

  update();
})();
