import { TriangleAlert } from 'lucide-react';
import Button from './Button';

export default function ErrorMessage({
  title = 'Something went wrong',
  message,
  onRetry,
}) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-3 rounded-[var(--radius-card)] border border-[var(--color-danger-600)]/20 bg-[var(--color-danger-100)] px-6 py-10 text-center"
    >
      <TriangleAlert className="size-6 text-[var(--color-danger-600)]" aria-hidden="true" />
      <p className="font-semibold text-[var(--color-ink-900)]">{title}</p>
      {message && <p className="max-w-sm text-sm text-[var(--color-ink-700)]">{message}</p>}
      {onRetry && (
        <Button variant="outline" onClick={onRetry} className="mt-1">
          Try again
        </Button>
      )}
    </div>
  );
}
