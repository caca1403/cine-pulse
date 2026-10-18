const NOISE_WORDS = new Set([
  'hd', 'full', 'izle', 'seyret', 'film', 'dizi', 'anime', 'turkce',
  'dublaj', 'altyazili', 'sezon', 'bolum', 'fragman', 'filmekseni', 'ekseni',
  'sezonlukdizi', 'yabancidizi', 'dizipal', 'dizibal'
]);

export function normalizeMediaTitle(value) {
  return (value || '')
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('tr-TR')
    .replace(/[ıİ]/g, 'i')
    .replace(/\bs\d{1,2}\s*e\d{1,3}\b/g, ' ')
    .replace(/\b(?:sezon|bolum)\s*\d+\b/g, ' ')
    .replace(/\b\d+\s*(?:sezon|bolum)\b/g, ' ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word && !NOISE_WORDS.has(word) && !/^(?:19|20)\d{2}$/.test(word))
    .join(' ')
    .trim();
}

function levenshteinDistance(left, right) {
  if (left === right) return 0;
  if (!left.length) return right.length;
  if (!right.length) return left.length;
  const row = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let i = 1; i <= left.length; i++) {
    let diagonal = row[0];
    row[0] = i;
    for (let j = 1; j <= right.length; j++) {
      const previous = row[j];
      row[j] = Math.min(
        row[j] + 1,
        row[j - 1] + 1,
        diagonal + (left[i - 1] === right[j - 1] ? 0 : 1)
      );
      diagonal = previous;
    }
  }
  return row[right.length];
}

export function mediaTitleSimilarity(left, right) {
  const a = normalizeMediaTitle(left);
  const b = normalizeMediaTitle(right);
  if (!a || !b) return 0;
  if (a === b) return 1;
  return 1 - (levenshteinDistance(a, b) / Math.max(a.length, b.length));
}

export function isStrictMediaTitleMatch(candidate, expectedTitles, threshold = 0.9) {
  const titles = Array.isArray(expectedTitles) ? expectedTitles : [expectedTitles];
  return titles.filter(Boolean).some(expected => mediaTitleSimilarity(candidate, expected) >= threshold);
}

export function extractPageMediaTitle(html) {
  if (!html) return '';
  const rawTitle = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)/i)?.[1]
    || html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g, ' ')
    || html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]
    || '';
  // Remove episode/site suffixes before normalization. Some legacy Turkish
  // providers declare the wrong charset, so "Bölüm" may arrive corrupted,
  // while the preceding "1. Sezon" marker is still reliable.
  return rawTitle
    .replace(/\s+\d+\s*\.?\s*sezon\b[\s\S]*$/i, '')
    .replace(/\s+[-|]\s*(?:sezonluk\s*dizi|sezonlukdizi|filmekseni|yabanci\s*dizi)[\s\S]*$/i, '')
    .trim();
}
