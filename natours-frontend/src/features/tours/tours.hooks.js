import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
import { getTours, getTour, updateTour } from './tours.api';

export function useTours(filters = {}) {
  return useQuery({
    queryKey: ['tours', filters],
    queryFn: () => getTours(filters),
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
  });
}

export function useTour(id) {
  return useQuery({
    queryKey: ['tour', id],
    queryFn: () => getTour(id),
    enabled: Boolean(id),
    staleTime: 60 * 1000,
  });
}

export function useUpdateTour(id) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values) => updateTour(id, values),
    onSuccess: (updatedTour) => {
      // Show the new filenames/images immediately on the details page.
      queryClient.setQueryData(['tour', id], updatedTour);
      queryClient.invalidateQueries({ queryKey: ['tours'] });
    },
  });
}
