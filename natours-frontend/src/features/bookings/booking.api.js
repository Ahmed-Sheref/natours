import { apiClient } from '../../api/client';

export async function createCheckoutSession(tourId) {
  const response = await apiClient.get(`/booking/checkout-session/${tourId}`);
  const session = response.data?.session;

  if (!session?.url) {
    throw new Error('The server did not return a Stripe checkout URL.');
  }

  return session;
}
