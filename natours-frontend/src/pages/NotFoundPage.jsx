import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import Container from '../components/common/Container';
import Button from '../components/common/Button';

export default function NotFoundPage() {
  return (
    <Container className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4 py-16 text-center">
      <Compass className="size-10 text-[var(--color-brass-500)]" aria-hidden="true" />
      <h1 className="font-display text-4xl font-semibold">Off the map</h1>
      <p className="max-w-sm text-[var(--color-mist-500)]">
        We couldn't find that page. It may have been moved, or the link might be outdated.
      </p>
      <Button as={Link} to="/" className="mt-2">
        Back to home
      </Button>
    </Container>
  );
}
