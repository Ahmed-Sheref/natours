import { useMutation } from '@tanstack/react-query';
import { createCheckoutSession } from './booking.api';

export function useCheckoutSession() {
  return useMutation({
    mutationFn: createCheckoutSession,
  });
}
