// Reads the small block of details at the top of a post:
//
//   ---
//   title: "My first trip"
//   date: 2026-11-05
//   tags: [travel, family]
//   ---
//
// Only the simple parts of that format are supported, which is all a post needs.

export function parseFrontmatter(source) {
  const text = source.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
  if (!text.startsWith('---\n')) return { data: {}, body: text };

  const match = /^---\n([\s\S]*?)\n?---[ \t]*(?:\n|$)/.exec(text);
  if (!match) {
    throw new Error(
      'The details at the top start with --- but never end. Add another line with just --- after them.',
    );
  }

  const data = {};
  let currentKey = null;
  const lines = match[1].split('\n');

  lines.forEach((line, index) => {
    if (!line.trim() || line.trim().startsWith('#')) return;

    const item = /^\s*-\s+(.*)$/.exec(line);
    if (item && currentKey) {
      if (!Array.isArray(data[currentKey])) data[currentKey] = [];
      data[currentKey].push(scalar(item[1]));
      return;
    }

    const pair = /^([A-Za-z_][\w-]*):(?:[ \t]+(.*))?$/.exec(line);
    if (!pair) {
      throw new Error(
        `Line ${index + 2} of the details at the top is not understood: "${line.trim()}". Write each detail as  name: value`,
      );
    }
    currentKey = pair[1];
    const value = (pair[2] ?? '').trim();
    data[currentKey] = value === '' ? '' : parseValue(value);
  });

  return { data, body: text.slice(match[0].length) };
}

function parseValue(value) {
  if (value.startsWith('[') && value.endsWith(']')) return splitList(value.slice(1, -1));
  return scalar(value);
}

function scalar(value) {
  const v = value.trim();
  if ((v.startsWith('"') && v.endsWith('"') && v.length >= 2) || (v.startsWith("'") && v.endsWith("'") && v.length >= 2)) {
    return v.slice(1, -1).replace(/\\(["'\\])/g, '$1');
  }
  if (v === 'true') return true;
  if (v === 'false') return false;
  if (v === 'null' || v === '~') return null;
  return v;
}

// Splits  a, "b, c", d  into items, respecting quotes at the start of an item.
function splitList(inner) {
  const items = [];
  let current = '';
  let quote = null;
  for (const ch of inner) {
    if (quote) {
      if (ch === quote) quote = null;
      else current += ch;
    } else if ((ch === '"' || ch === "'") && current.trim() === '') {
      quote = ch;
    } else if (ch === ',') {
      items.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  items.push(current.trim());
  return items.filter((item) => item !== '');
}
