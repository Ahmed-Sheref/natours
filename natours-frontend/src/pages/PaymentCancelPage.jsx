import { XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Container from '../components/common/Container';
import Button from '../components/common/Button';

export default function PaymentCancelPage() {
  return (
    <Container className="py-20">
      <div className="mx-auto max-w-xl rounded-[var(--radius-card)] border border-[var(--color-mist-300)] p-8 text-center">
        <XCircle className="mx-auto mb-4 size-10 text-[var(--color-mist-500)]" aria-hidden="true" />
        <h1 className="font-display text-3xl font-semibold">Checkout cancelled</h1>
        <p className="mt-3 text-sm text-[var(--color-ink-700)]">
          No problem. You can return to the tours list and try again whenever you are ready.
        </p>
        <div className="mt-6">
          <Button as={Link} to="/tours">Back to tours</Button>
        </div>
      </div>
    </Container>
  );
}
