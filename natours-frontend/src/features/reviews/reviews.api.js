import { apiClient, extractData } from '../../api/client';

// Note: the backend mounts this nested route as singular `/review`
// (`TourRouter.use('/:tour/review', reviewRouter)`), not `/reviews`.
export async function getTourReviews(tourId) {
  const response = await apiClient.get(`/tours/${tourId}/review`);
  return extractData(response);
}

// Flat, un-nested endpoint — used on the homepage to pull a handful of
// real reviews for the testimonials section (no dedicated endpoint exists).
export async function getAllReviews(params = {}) {
  const response = await apiClient.get('/reviews', { params });
  return extractData(response);
}

export async function createReview(tourId, { review, rating }) {
  const response = await apiClient.post(`/tours/${tourId}/review`, {
    review,
    rating,
  });
  return extractData(response);
}
