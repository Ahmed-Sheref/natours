import { Search } from 'lucide-react';

const SORT_OPTIONS = [
  { value: '-ratingsAverage', label: 'Top rated' },
  { value: 'price', label: 'Price: low to high' },
  { value: '-price', label: 'Price: high to low' },
  { value: 'duration', label: 'Duration: shortest first' },
];

const DIFFICULTIES = [
  { value: '', label: 'Any difficulty' },
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Moderate' },
  { value: 'difficult', label: 'Challenging' },
];

const inputClass =
  'rounded-[var(--radius-card)] border border-[var(--color-mist-300)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-brass-500)]';

export default function TourFilters({ search, onSearchChange, filters, onFiltersChange }) {
  function update(key, value) {
    onFiltersChange({ ...filters, [key]: value || undefined });
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--color-mist-500)]"
          aria-hidden="true"
        />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tours by name…"
          aria-label="Search tours by name"
          className={`${inputClass} w-full pl-9`}
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <select
          value={filters.difficulty ?? ''}
          onChange={(e) => update('difficulty', e.target.value)}
          className={inputClass}
          aria-label="Filter by difficulty"
        >
          {DIFFICULTIES.map((d) => (
            <option key={d.value} value={d.value}>{d.label}</option>
          ))}
        </select>

        <select
          value={filters.sort ?? '-ratingsAverage'}
          onChange={(e) => update('sort', e.target.value)}
          className={inputClass}
          aria-label="Sort tours"
        >
          {SORT_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        <div className="flex items-center gap-1.5">
          <input
            type="number"
            min="0"
            inputMode="numeric"
            placeholder="Min $"
            aria-label="Minimum price"
            value={filters['price[gte]'] ?? ''}
            onChange={(e) => update('price[gte]', e.target.value)}
            className={`${inputClass} w-24`}
          />
          <span className="text-[var(--color-mist-500)]">–</span>
          <input
            type="number"
            min="0"
            inputMode="numeric"
            placeholder="Max $"
            aria-label="Maximum price"
            value={filters['price[lte]'] ?? ''}
            onChange={(e) => update('price[lte]', e.target.value)}
            className={`${inputClass} w-24`}
          />
        </div>
      </div>
    </div>
  );
}
