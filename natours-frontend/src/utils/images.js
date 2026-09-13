const apiUrl = import.meta.env.VITE_API_URL ?? '';

// The API is mounted at .../api/v1, but static files (public/img/...) are
// served from the server root — strip the /api(/v1) suffix to get that root.
export const SERVER_ORIGIN = apiUrl.replace(/\/api(\/v\d+)?\/?$/, '');

// Convention assumed to match the seed data (tour-2-cover.jpg, user-1.jpg, ...):
// the backend serves them as static files at /img/<folder>/<filename>, e.g.
// express.static('public') with files under public/img/tours and public/img/users.
// If your backend ends up serving them from a different path, this is the one
// place to change.
export function resolveImageUrl(value, folder = 'tours') {
  if (!value) return null;
  if (/^(https?:)?\/\//.test(value) || value.startsWith('data:')) return value;
  return `${SERVER_ORIGIN}/img/${folder}/${value}`;
}
