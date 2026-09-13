import RatingStars from '../../../components/common/RatingStars';
import Avatar from '../../../components/common/Avatar';
import { formatDate } from '../../../utils/formatters';

export default function ReviewCard({ review }) {
  return (
    <li className="rounded-[var(--radius-card)] border border-[var(--color-mist-300)] bg-white p-5">
      <div className="mb-3 flex items-center gap-3">
        <Avatar name={review.user?.name} photo={review.user?.photo} size={36} />
        <div className="flex-1">
          <p className="text-sm font-semibold text-[var(--color-ink-900)]">{review.user?.name ?? 'Traveler'}</p>
          <p className="text-xs text-[var(--color-mist-500)]">{formatDate(review.createdAt)}</p>
        </div>
        <RatingStars rating={review.rating} size={13} />
      </div>
      <p className="text-sm leading-relaxed text-[var(--color-ink-700)]">{review.review}</p>
    </li>
  );
}
