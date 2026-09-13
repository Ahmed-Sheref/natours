import { Star } from 'lucide-react';

export default function RatingStars({ rating = 0, size = 14 }) {
  const rounded = Math.round(rating);
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`Rated ${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < rounded ? 'fill-[var(--color-brass-500)] text-[var(--color-brass-500)]' : 'text-[var(--color-mist-300)]'}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}
