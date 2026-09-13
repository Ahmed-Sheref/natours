import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getTourReviews, getAllReviews, createReview } from './reviews.api';

export function useTourReviews(tourId) {
  return useQuery({
    queryKey: ['reviews', tourId],
    queryFn: () => getTourReviews(tourId),
    enabled: Boolean(tourId),
  });
}

// Used by the homepage testimonials section — real reviews, most recent first.
export function useTestimonials(limit = 3) {
  return useQuery({
    queryKey: ['reviews', 'testimonials', limit],
    queryFn: () => getAllReviews({ sort: '-createdAt', limit }),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateReview(tourId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values) => createReview(tourId, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', tourId] });
      queryClient.invalidateQueries({ queryKey: ['tour', tourId] });
    },
  });
}
