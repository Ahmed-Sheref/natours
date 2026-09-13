import SmartImage from '../../../components/common/SmartImage';
import { resolveImageUrl } from '../../../utils/images';

export default function TourGallery({ cover, images = [], name }) {
  const all = [cover, ...images].filter(Boolean).map((src) => resolveImageUrl(src, 'tours'));

  if (all.length <= 1) {
    return (
      <div className="h-[45vh] w-full overflow-hidden rounded-[var(--radius-card)] sm:h-[55vh]">
        <SmartImage src={all[0]} alt={name} className="size-full" imgClassName="size-full object-cover" />
      </div>
    );
  }

  const [primary, ...rest] = all;

  return (
    <div className="grid gap-2 sm:grid-cols-3 sm:grid-rows-2 sm:h-[55vh]">
      <div className="overflow-hidden rounded-[var(--radius-card)] sm:col-span-2 sm:row-span-2">
        <SmartImage src={primary} alt={name} className="h-56 w-full sm:h-full" imgClassName="h-56 w-full object-cover sm:h-full" />
      </div>

      <div className="flex gap-2 overflow-x-auto sm:contents sm:overflow-visible">
        {rest.slice(0, 2).map((src, i) => (
          <div key={src + i} className="h-32 w-40 shrink-0 overflow-hidden rounded-[var(--radius-card)] sm:h-full sm:w-full">
            <SmartImage
              src={src}
              alt={`${name} — view ${i + 2}`}
              className="size-full"
              imgClassName="size-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
