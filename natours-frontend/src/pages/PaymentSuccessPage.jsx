import { CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Container from '../components/common/Container';
import Button from '../components/common/Button';

export default function PaymentSuccessPage() {
  return (
    <Container className="py-20">
      <div className="mx-auto max-w-xl rounded-[var(--radius-card)] border border-[var(--color-success-600)]/20 bg-[var(--color-success-100)] p-8 text-center">
        <CheckCircle2 className="mx-auto mb-4 size-10 text-[var(--color-success-600)]" aria-hidden="true" />
        <h1 className="font-display text-3xl font-semibold">Payment completed</h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-700)]">
          Stripe has returned you to Natours after checkout. Your backend should still verify the payment event before treating the booking as confirmed.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button as={Link} to="/tours">Browse tours</Button>
          <Button as={Link} to="/me" variant="outline">My profile</Button>
        </div>
      </div>
    </Container>
  );
}
