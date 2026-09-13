import { MessageSquare } from 'lucide-react';
import { useTourReviews } from '../reviews.hooks';
import ReviewCard from './ReviewCard';
import { TextSkeleton } from '../../../components/common/Skeleton';
import ErrorMessage from '../../../components/common/ErrorMessage';
import EmptyState from '../../../components/common/EmptyState';

export default function ReviewList({ tourId }) {
  const { data: reviews, isLoading, isError, error, refetch } = useTourReviews(tourId);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <TextSkeleton className="h-24" />
        <TextSkeleton className="h-24" />
      </div>
    );
  }

  if (isError) {
    return <ErrorMessage message={error.message} onRetry={refetch} />;
  }

  if (!reviews?.length) {
    return (
      <EmptyState
        icon={MessageSquare}
        title="No reviews yet"
        message="Be the first traveler to share how this expedition went."
      />
    );
  }

  return (
    <ul className="space-y-4">
      {reviews.map((review) => (
        <ReviewCard key={review._id} review={review} />
      ))}
    </ul>
  );
}
