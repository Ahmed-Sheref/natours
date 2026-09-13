import { Compass } from 'lucide-react';

export default function PageLoader({ label = 'Loading…' }) {
  return (
    <div
      className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-[var(--color-mist-500)]"
      role="status"
      aria-live="polite"
    >
      <Compass className="size-8 animate-spin" style={{ animationDuration: '2.5s' }} aria-hidden="true" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}
