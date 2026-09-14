import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Clock, Gauge, MapPin, Users, Tag, CalendarDays, Info } from 'lucide-react';
import Container from '../components/common/Container';
import Button from '../components/common/Button';
import RatingStars from '../components/common/RatingStars';
import ErrorMessage from '../components/common/ErrorMessage';
import { TextSkeleton } from '../components/common/Skeleton';
import TourGallery from '../features/tours/components/TourGallery';
import TourMap from '../features/tours/components/TourMap';
import ReviewList from '../features/reviews/components/ReviewList';
import ReviewForm from '../features/reviews/components/ReviewForm';
import { useTour } from '../features/tours/tours.hooks';
import { useCheckoutSession } from '../features/bookings/booking.hooks';
import { formatPrice, formatDate, difficultyLabel } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';

export default function TourDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: tour, isLoading, isError, error, refetch } = useTour(id);
  const checkout = useCheckoutSession();

  function handleBookTour() {
    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }

    checkout.mutate(id, {
      onSuccess: (session) => {
        // Stripe Checkout is hosted by Stripe. The backend creates the session
        // and returns its URL; the frontend only redirects the browser there.
        window.location.assign(session.url);
      },
    });
  }

  if (isLoading) {
    return (
      <Container className="space-y-6 py-14">
        <TextSkeleton className="h-[45vh] w-full" />
        <TextSkeleton className="h-8 w-2/3" />
        <TextSkeleton className="h-4 w-1/3" />
      </Container>
    );
  }

  if (isError) {
    return (
      <Container className="py-14">
        <ErrorMessage
          title="Couldn't load this tour"
          message={error.status === 404 ? 'This tour no longer exists or the link is wrong.' : error.message}
          onRetry={error.status === 404 ? undefined : refetch}
        />
      </Container>
    );
  }

  const facts = [
    { icon: Clock, label: 'Duration', value: `${tour.duration} days` },
    { icon: Gauge, label: 'Difficulty', value: difficultyLabel(tour.difficulty) },
    { icon: Users, label: 'Group size', value: `Up to ${tour.maxGroupSize}` },
    { icon: MapPin, label: 'Starts in', value: tour.startLocation?.description ?? '—' },
    { icon: Tag, label: 'Price', value: `${formatPrice(tour.price)} / person` },
    { icon: CalendarDays, label: 'Next date', value: tour.startDates?.[0] ? formatDate(tour.startDates[0]) : 'TBA' },
  ];

  return (
    <div className="pb-20">
      <Container className="py-8">
        <TourGallery cover={tour.imageCover} images={tour.images} name={tour.name} />
      </Container>

      <Container className="grid gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-2 flex items-center gap-3">
            <RatingStars rating={tour.ratingsAverage} />
            <span className="text-sm text-[var(--color-mist-500)]">
              {tour.ratingsQuantity} review{tour.ratingsQuantity === 1 ? '' : 's'}
            </span>
          </div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h1 className="font-display text-3xl font-semibold sm:text-4xl">{tour.name}</h1>
            {user?.role === 'admin' && (
              <Link
                to={`/tours/${id}/edit`}
                className="rounded-[var(--radius-card)] border border-[var(--color-pine-900)]/30 px-4 py-2 text-sm font-semibold text-[var(--color-pine-900)] hover:bg-[var(--color-pine-900)]/5"
              >
                Edit tour
              </Link>
            )}
          </div>
          <p className="mb-6 text-[var(--color-ink-700)]">{tour.summary}</p>

          <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {facts.map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-[var(--radius-card)] border border-[var(--color-mist-300)] p-4">
                <Icon className="mb-2 size-5 text-[var(--color-brass-500)]" aria-hidden="true" />
                <p className="text-xs text-[var(--color-mist-500)]">{label}</p>
                <p className="text-sm font-semibold text-[var(--color-ink-900)]">{value}</p>
              </div>
            ))}
          </div>

          {tour.description && (
            <div className="mb-12">
              <h2 className="mb-3 text-xl font-semibold">About this expedition</h2>
              <p className="whitespace-pre-line leading-relaxed text-[var(--color-ink-700)]">{tour.description}</p>
            </div>
          )}

          {tour.locations?.length > 0 && (
            <div className="mb-12">
              <h2 className="mb-3 text-xl font-semibold">Route</h2>
              <div className="mb-4">
                <TourMap startLocation={tour.startLocation} locations={tour.locations} tourName={tour.name} />
              </div>
              <ul className="space-y-2">
                {tour.locations.map((loc, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-ink-700)]">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-[var(--color-brass-500)]" aria-hidden="true" />
                    <span>
                      Day {loc.day ?? i + 1} — {loc.description ?? loc.address}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h2 className="mb-4 text-xl font-semibold">Reviews</h2>
            <div className="mb-6">
              <ReviewForm tourId={id} />
            </div>
            <ReviewList tourId={id} />
          </div>
        </div>

        <aside className="h-fit rounded-[var(--radius-card)] border border-[var(--color-mist-300)] p-6 lg:sticky lg:top-24">
          <p className="font-display text-2xl font-semibold">{formatPrice(tour.price)}</p>
          <p className="mb-5 text-sm text-[var(--color-mist-500)]">per person</p>

          <Button className="w-full" loading={checkout.isPending} onClick={handleBookTour}>
            {user ? 'Book this tour' : 'Log in to book'}
          </Button>

          {checkout.isError ? (
            <p role="alert" className="mt-3 text-xs text-[var(--color-danger-600)]">
              {checkout.error?.message ?? 'Could not start checkout. Please try again.'}
            </p>
          ) : (
            <p className="mt-3 flex items-start gap-1.5 text-xs text-[var(--color-mist-500)]">
              <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
              {user
                ? 'You will be redirected to Stripe to complete your payment securely.'
                : 'You need to log in before starting checkout.'}
            </p>
          )}
        </aside>
      </Container>
    </div>
  );
}
