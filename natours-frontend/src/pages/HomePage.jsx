import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Compass, ShieldCheck, Users, Map } from 'lucide-react';
import Container from '../components/common/Container';
import Button from '../components/common/Button';
import TourCard from '../features/tours/components/TourCard';
import { TourCardSkeleton } from '../components/common/Skeleton';
import ErrorMessage from '../components/common/ErrorMessage';
import RatingStars from '../components/common/RatingStars';
import { useTours } from '../features/tours/tours.hooks';
import { useTestimonials } from '../features/reviews/reviews.hooks';

const BENEFITS = [
  {
    icon: Compass,
    title: 'Curated routes',
    text: 'Every expedition is scouted and re-walked by our guides before it ever reaches the calendar.',
  },
  {
    icon: ShieldCheck,
    title: 'Trusted guides',
    text: 'Certified, local, and genuinely opinionated about the best route up.',
  },
  {
    icon: Users,
    title: 'Small groups',
    text: 'We cap group sizes so the trail feels like yours, not a queue.',
  },
  {
    icon: Map,
    title: 'Real logistics',
    text: 'Transfers, permits, and gear sorted — you just need to show up.',
  },
];

export default function HomePage() {
  const { data, isLoading, isError, error } = useTours({ limit: 3, sort: '-ratingsAverage' });
  const { data: testimonials } = useTestimonials(3);

  return (
    <div>
      <Hero />

      <section className="py-20">
        <Container>
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-semibold">Featured expeditions</h2>
              <p className="mt-2 text-[var(--color-mist-500)]">Our highest-rated tours this season.</p>
            </div>
            <Link to="/tours" className="hidden shrink-0 text-sm font-semibold text-[var(--color-pine-900)] hover:underline sm:block">
              View all tours →
            </Link>
          </div>

          {isError ? (
            <ErrorMessage message={error.message} />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {isLoading
                ? Array.from({ length: 3 }).map((_, i) => <TourCardSkeleton key={i} />)
                : data.tours.map((tour) => <TourCard key={tour._id} tour={tour} />)}
            </div>
          )}

          <Link to="/tours" className="mt-8 block text-center text-sm font-semibold text-[var(--color-pine-900)] hover:underline sm:hidden">
            View all tours →
          </Link>
        </Container>
      </section>

      <section className="bg-[var(--color-parchment-200)] py-20">
        <Container>
          <h2 className="mb-10 text-3xl font-semibold">Why travel with us</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-[var(--radius-card)] bg-white p-6">
                <Icon className="mb-4 size-6 text-[var(--color-brass-500)]" aria-hidden="true" />
                <h3 className="mb-2 font-semibold text-[var(--color-ink-900)]">{title}</h3>
                <p className="text-sm text-[var(--color-mist-500)]">{text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {testimonials?.length > 0 && (
        <section className="py-20">
          <Container>
            <h2 className="mb-10 text-3xl font-semibold">What travelers say</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {testimonials.map((t) => (
                <figure key={t._id} className="rounded-[var(--radius-card)] border border-[var(--color-mist-300)] p-6">
                  <RatingStars rating={t.rating} />
                  <blockquote className="mt-3 text-sm leading-relaxed text-[var(--color-ink-700)]">
                    "{t.review}"
                  </blockquote>
                  <figcaption className="mt-4 text-sm font-semibold text-[var(--color-ink-900)]">
                    {t.user?.name ?? 'Traveler'}
                  </figcaption>
                </figure>
              ))}
            </div>
          </Container>
        </section>
      )}

      <section className="bg-[var(--color-pine-950)] py-20 text-parchment-100">
        <Container className="flex flex-col items-center gap-6 text-center">
          <h2 className="max-w-xl font-display text-3xl font-semibold text-balance sm:text-4xl">
            Your next trailhead is one booking away.
          </h2>
          <Button as={Link} to="/tours" variant="primary" className="px-7 py-3 text-base">
            Browse expeditions
          </Button>
        </Container>
      </section>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative flex min-h-[85vh] items-end overflow-hidden bg-[var(--color-pine-950)]">
      <img
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1800&q=80"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 size-full object-cover opacity-70"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-pine-950)] via-[var(--color-pine-950)]/40 to-[var(--color-pine-950)]/10" />

      <Container className="relative pb-20 pt-40 text-parchment-100">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="max-w-2xl font-display text-4xl font-semibold leading-tight text-balance sm:text-6xl"
        >
          Expeditions on foot, by sea, and through snow.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          className="mt-5 max-w-md text-parchment-100/80"
        >
          Small-group tours led by local guides who've walked every mile of the route themselves.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          className="mt-8 flex flex-wrap gap-3"
        >
          <Button as={Link} to="/tours" variant="primary" className="px-6 py-3 text-base">
            Explore tours
          </Button>
          <Button as={Link} to="/signup" variant="outline" className="border-parchment-100/30 px-6 py-3 text-base text-parchment-100 hover:bg-white/10">
            Create an account
          </Button>
        </motion.div>
      </Container>
    </section>
  );
}
