const BASE = import.meta.env.VITE_API_URL ?? '';

async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Request failed: ${res.status}`);
  return data;
}

export const getLebron = () => apiFetch('/api/games/lebron');
export const getTeams = () => apiFetch('/api/games/teams');
export const getGames = (params) => {
  const qs = new URLSearchParams();
  if (params.season) qs.set('season', params.season);
  if (params.team_ids) qs.set('team_ids', params.team_ids);
  if (params.cursor) qs.set('cursor', params.cursor);
  if (params.per_page) qs.set('per_page', params.per_page);
  return apiFetch(`/api/games/list?${qs}`);
};

export const getFavorites = () => apiFetch('/api/favorites');
export const saveFavorite = (body) => apiFetch('/api/favorites', { method: 'POST', body });
export const updateFavorite = (id, body) => apiFetch(`/api/favorites/${id}`, { method: 'PUT', body });
export const deleteFavorite = (id) => apiFetch(`/api/favorites/${id}`, { method: 'DELETE' });
