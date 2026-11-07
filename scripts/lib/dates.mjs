// Dates are written as YYYY-MM-DD (for example 2026-11-05).
// They are handled as plain calendar dates, so time zones can never shift a
// post to the day before or after.

export function parseDate(input) {
  const m = /^\s*(\d{4})-(\d{1,2})-(\d{1,2})(?:[T\s].*)?$/.exec(String(input ?? ''));
  if (!m) return null;
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  const real =
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
  if (!real) return null;
  const pad = (n) => String(n).padStart(2, '0');
  return { date, year, month, day, iso: `${year}-${pad(month)}-${pad(day)}` };
}

export function formatLong(parts, language = 'en') {
  return new Intl.DateTimeFormat(language, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(parts.date);
}

export function monthName(month, language = 'en', style = 'long') {
  return new Intl.DateTimeFormat(language, { month: style, timeZone: 'UTC' }).format(
    new Date(Date.UTC(2000, month - 1, 1)),
  );
}

export function weekdayName(parts, language = 'en') {
  return new Intl.DateTimeFormat(language, { weekday: 'short', timeZone: 'UTC' }).format(parts.date);
}

export function monthYear(year, month, language = 'en') {
  return new Intl.DateTimeFormat(language, { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(Date.UTC(year, month - 1, 1)),
  );
}

export function formatNumber(n, language = 'en') {
  return new Intl.NumberFormat(language, { useGrouping: false }).format(n);
}
