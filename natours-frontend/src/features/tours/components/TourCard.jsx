import { Link } from 'react-router-dom';
import { Clock, Gauge, MapPin } from 'lucide-react';
import RatingStars from '../../../components/common/RatingStars';
import SmartImage from '../../../components/common/SmartImage';
import { formatPrice, difficultyLabel } from '../../../utils/formatters';
import { resolveImageUrl } from '../../../utils/images';

export default function TourCard({ tour }) {
  return (
    <Link
      to={`/tours/${tour._id}`}
      className="group block overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-mist-300)] bg-white transition-shadow hover:shadow-lg hover:shadow-[var(--color-pine-900)]/10"
    >
      <div className="relative h-48 overflow-hidden">
        <SmartImage
          src={resolveImageUrl(tour.imageCover, 'tours')}
          alt={tour.name}
          loading="lazy"
          className="size-full"
          imgClassName="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-[var(--radius-pill)] bg-[var(--color-pine-950)]/85 px-3 py-1 text-xs font-medium text-parchment-100">
          {difficultyLabel(tour.difficulty)}
        </span>
      </div>

      <div className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-semibold leading-snug text-[var(--color-ink-900)]">
            {tour.name}
          </h3>
          <span className="whitespace-nowrap font-display text-lg font-semibold text-[var(--color-pine-900)]">
            {formatPrice(tour.price)}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--color-mist-500)]">
          <span className="flex items-center gap-1">
            <Clock className="size-3.5" aria-hidden="true" /> {tour.duration} days
          </span>
          <span className="flex items-center gap-1">
            <Gauge className="size-3.5" aria-hidden="true" /> Up to {tour.maxGroupSize}
          </span>
          {tour.startLocation?.description && (
            <span className="flex items-center gap-1">
              <MapPin className="size-3.5" aria-hidden="true" /> {tour.startLocation.description}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-1">
          <RatingStars rating={tour.ratingsAverage} />
          <span className="text-xs text-[var(--color-mist-500)]">
            {tour.ratingsQuantity} review{tour.ratingsQuantity === 1 ? '' : 's'}
          </span>
        </div>
      </div>
    </Link>
  );
}
