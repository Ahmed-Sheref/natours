import { apiClient, extractData } from '../../api/client';

// `filters` is passed straight through as query params, mirroring the
// backend's own syntax: sort, page, limit, difficulty, price[gte], price[lte],
// duration[gte], duration[lte]. See handlerFactory.js on the backend —
// there is no `fields` projection support and no total-count field, so we
// can only tell "there might be a next page" from results.length === limit.
export async function getTours(filters = {}) {
  const response = await apiClient.get('/tours', { params: filters });
  return {
    tours: extractData(response),
    results: response.data.results,
  };
}

export async function getTour(id) {
  const response = await apiClient.get(`/tours/${id}`);
  return extractData(response);
}

// Multipart update used by the admin edit page.
// Do NOT set Content-Type manually: the browser/Axios adds the multipart
// boundary for FormData automatically.
export async function updateTour(id, values) {
  const formData = new FormData();

  if (values.name !== undefined) formData.append('name', values.name);
  if (values.summary !== undefined) formData.append('summary', values.summary);

  if (values.imageCover) {
    formData.append('imageCover', values.imageCover);
  }

  for (const image of values.images ?? []) {
    // Repeating the same field name is exactly what upload.fields({ name: 'images' }) expects.
    formData.append('images', image);
  }

  const response = await apiClient.patch(`/tours/${id}`, formData);
  return extractData(response);
}
