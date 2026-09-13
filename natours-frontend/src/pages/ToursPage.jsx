import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, SearchX } from 'lucide-react';
import Container from '../components/common/Container';
import TourCard from '../features/tours/components/TourCard';
import TourFilters from '../features/tours/components/TourFilters';
import { TourCardSkeleton } from '../components/common/Skeleton';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';
import { useTours } from '../features/tours/tours.hooks';

const PAGE_SIZE = 9;

export default function ToursPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ sort: '-ratingsAverage' });

  const queryFilters = { ...filters, page, limit: PAGE_SIZE };
  const { data, isLoading, isError, error, isFetching } = useTours(queryFilters);

  const visibleTours = useMemo(() => {
    if (!data?.tours) return [];
    if (!search.trim()) return data.tours;
    const term = search.trim().toLowerCase();
    return data.tours.filter((t) => t.name.toLowerCase().includes(term));
  }, [data, search]);

  function handleFiltersChange(next) {
    setPage(1);
    setFilters(next);
  }

  const hasNextPage = (data?.results ?? 0) === PAGE_SIZE;

  return (
    <Container className="py-14">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">All expeditions</h1>
        <p className="mt-2 text-[var(--color-mist-500)]">
          Search below matches tour names on the current page — the API doesn't yet support full-catalog text search.
        </p>
      </div>

      <div className="mb-8">
        <TourFilters
          search={search}
          onSearchChange={setSearch}
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />
      </div>

      {isError ? (
        <ErrorMessage message={error.message} />
      ) : isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <TourCardSkeleton key={i} />)}
        </div>
      ) : visibleTours.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No tours found"
          message="Try a different search term or clearing your filters."
        />
      ) : (
        <div className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ${isFetching ? 'opacity-60' : ''}`}>
          {visibleTours.map((tour) => (
            <TourCard key={tour._id} tour={tour} />
          ))}
        </div>
      )}

      <div className="mt-10 flex items-center justify-center gap-3">
        <Button
          variant="outline"
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          <ChevronLeft className="size-4" /> Previous
        </Button>
        <span className="text-sm text-[var(--color-mist-500)]">Page {page}</span>
        <Button
          variant="outline"
          disabled={!hasNextPage}
          onClick={() => setPage((p) => p + 1)}
        >
          Next <ChevronRight className="size-4" />
        </Button>
      </div>
    </Container>
  );
}
