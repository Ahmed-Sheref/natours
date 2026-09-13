export function formatPrice(value) {
  if (typeof value !== 'number') return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(value) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value));
}

export function difficultyLabel(difficulty) {
  const map = {
    easy: 'Easy',
    medium: 'Moderate',
    difficult: 'Challenging',
  };
  return map[difficulty] ?? difficulty;
}
