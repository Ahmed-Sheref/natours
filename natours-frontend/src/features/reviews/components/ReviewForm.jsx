import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useCreateReview } from '../reviews.hooks';
import Button from '../../../components/common/Button';

export default function ReviewForm({ tourId }) {
  const { isAuthenticated, user } = useAuth();
  const { mutate, isPending, isError, error } = useCreateReview(tourId);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isAuthenticated) {
    return (
      <p className="rounded-[var(--radius-card)] border border-dashed border-[var(--color-mist-300)] p-5 text-sm text-[var(--color-mist-500)]">
        <Link to="/login" className="font-medium text-[var(--color-pine-900)] hover:underline">
          Log in
        </Link>{' '}
        to leave a review for this tour.
      </p>
    );
  }

  // The backend only allows role: 'user' to POST a review (restrictto('user')).
  if (user?.role !== 'user') {
    return null;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!review.trim()) return;
    mutate(
      { review, rating },
      {
        onSuccess: () => {
          setReview('');
          setRating(5);
          setSubmitted(true);
        },
      }
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-[var(--radius-card)] border border-[var(--color-mist-300)] bg-white p-5">
      <p className="text-sm font-semibold text-[var(--color-ink-900)]">Share your experience</p>

      <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={rating === n}
            aria-label={`${n} star${n === 1 ? '' : 's'}`}
            onClick={() => setRating(n)}
          >
            <Star
              className={n <= rating ? 'size-6 fill-[var(--color-brass-500)] text-[var(--color-brass-500)]' : 'size-6 text-[var(--color-mist-300)]'}
            />
          </button>
        ))}
      </div>

      <textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        required
        rows={3}
        placeholder="What stood out about this expedition?"
        className="w-full resize-none rounded-[var(--radius-card)] border border-[var(--color-mist-300)] px-4 py-2.5 text-sm outline-none focus:border-[var(--color-brass-500)]"
      />

      {isError && <p className="text-sm text-[var(--color-danger-600)]">{error.message}</p>}
      {submitted && <p className="text-sm text-[var(--color-success-600)]">Thanks — your review was posted.</p>}

      <Button type="submit" loading={isPending}>
        Post review
      </Button>
    </form>
  );
}
