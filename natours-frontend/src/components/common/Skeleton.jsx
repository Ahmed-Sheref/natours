export function TourCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-mist-300)] bg-white">
      <div className="h-48 animate-pulse bg-[var(--color-parchment-300)]" />
      <div className="space-y-3 p-5">
        <div className="h-4 w-2/3 animate-pulse rounded bg-[var(--color-parchment-300)]" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-[var(--color-parchment-300)]" />
        <div className="h-3 w-1/3 animate-pulse rounded bg-[var(--color-parchment-300)]" />
      </div>
    </div>
  );
}

export function TextSkeleton({ className = '' }) {
  return <div className={`animate-pulse rounded bg-[var(--color-parchment-300)] ${className}`} />;
}
