import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ImagePlus, Images, X } from 'lucide-react';
import Container from '../components/common/Container';
import Button from '../components/common/Button';
import ErrorMessage from '../components/common/ErrorMessage';
import PageLoader from '../components/common/PageLoader';
import { useTour, useUpdateTour } from '../features/tours/tours.hooks';
import { resolveImageUrl } from '../utils/images';

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_GALLERY_IMAGES = 3;

function validateImage(file) {
  if (!file.type.startsWith('image/')) return 'Please choose image files only.';
  if (file.size > MAX_IMAGE_BYTES) return 'Each image must be 5MB or smaller.';
  return null;
}

export default function EditTourPage() {
  const { id } = useParams();
  const { data: tour, isLoading, isError, error, refetch } = useTour(id);
  const updateMutation = useUpdateTour(id);

  const [name, setName] = useState('');
  const [summary, setSummary] = useState('');
  const [imageCover, setImageCover] = useState(null);
  const [images, setImages] = useState([]);
  const [fileError, setFileError] = useState(null);

  useEffect(() => {
    if (!tour) return;
    setName(tour.name ?? '');
    setSummary(tour.summary ?? '');
  }, [tour]);

  const coverPreview = useMemo(
    () => (imageCover ? URL.createObjectURL(imageCover) : null),
    [imageCover]
  );

  const imagePreviews = useMemo(
    () => images.map((file) => URL.createObjectURL(file)),
    [images]
  );

  useEffect(() => {
    return () => {
      if (coverPreview) URL.revokeObjectURL(coverPreview);
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [coverPreview, imagePreviews]);

  function handleCoverChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const message = validateImage(file);
    if (message) {
      setFileError(message);
      e.target.value = '';
      return;
    }

    setFileError(null);
    setImageCover(file);
  }

  function handleImagesChange(e) {
    const selected = Array.from(e.target.files ?? []);
    if (selected.length === 0) return;

    if (selected.length > MAX_GALLERY_IMAGES) {
      setFileError(`Choose up to ${MAX_GALLERY_IMAGES} gallery images.`);
      e.target.value = '';
      return;
    }

    for (const file of selected) {
      const message = validateImage(file);
      if (message) {
        setFileError(message);
        e.target.value = '';
        return;
      }
    }

    setFileError(null);
    setImages(selected);
  }

  function handleSubmit(e) {
    e.preventDefault();
    setFileError(null);

    updateMutation.mutate({
      name,
      summary,
      imageCover,
      images,
    });
  }

  if (isLoading) {
    return <PageLoader label="Loading tour…" />;
  }

  if (isError) {
    return (
      <Container className="py-14">
        <ErrorMessage
          title="Couldn't load this tour"
          message={error.message}
          onRetry={refetch}
        />
      </Container>
    );
  }

  const currentCover = resolveImageUrl(tour.imageCover, 'tours');
  const currentImages = (tour.images ?? []).map((image) => resolveImageUrl(image, 'tours'));

  return (
    <Container className="max-w-3xl py-14">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[var(--color-brass-600)]">Admin</p>
          <h1 className="mt-1 text-3xl font-semibold">Edit tour images</h1>
          <p className="mt-2 text-sm text-[var(--color-mist-500)]">
            This form sends multipart/form-data to PATCH /tours/{id} so you can test Multer + Sharp end to end.
          </p>
        </div>
        <Link
          to={`/tours/${id}`}
          className="shrink-0 rounded-[var(--radius-card)] border border-[var(--color-pine-900)]/30 px-4 py-2 text-sm font-semibold text-[var(--color-pine-900)] hover:bg-[var(--color-pine-900)]/5"
        >
          Back to tour
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="space-y-4 rounded-[var(--radius-card)] border border-[var(--color-mist-300)] bg-white p-6">
          <div>
            <label htmlFor="tour-name" className="mb-1.5 block text-sm font-medium">Name</label>
            <input
              id="tour-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-[var(--radius-card)] border border-[var(--color-mist-300)] px-4 py-2.5 text-sm outline-none focus:border-[var(--color-brass-500)]"
            />
          </div>

          <div>
            <label htmlFor="tour-summary" className="mb-1.5 block text-sm font-medium">Summary</label>
            <textarea
              id="tour-summary"
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full resize-y rounded-[var(--radius-card)] border border-[var(--color-mist-300)] px-4 py-2.5 text-sm outline-none focus:border-[var(--color-brass-500)]"
            />
          </div>
        </section>

        <section className="space-y-4 rounded-[var(--radius-card)] border border-[var(--color-mist-300)] bg-white p-6">
          <div>
            <h2 className="font-semibold">Cover image</h2>
            <p className="mt-1 text-sm text-[var(--color-mist-500)]">
              Field name: <code>imageCover</code> — one image.
            </p>
          </div>

          <div className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-mist-300)] bg-[var(--color-parchment-300)]">
            {(coverPreview || currentCover) ? (
              <img
                src={coverPreview || currentCover}
                alt="Tour cover preview"
                className="h-64 w-full object-cover"
              />
            ) : (
              <div className="flex h-64 items-center justify-center text-[var(--color-mist-500)]">
                No cover image
              </div>
            )}
          </div>

          <label className="inline-flex cursor-pointer items-center gap-2 rounded-[var(--radius-card)] border border-[var(--color-pine-900)]/30 px-4 py-2 text-sm font-semibold text-[var(--color-pine-900)] hover:bg-[var(--color-pine-900)]/5">
            <ImagePlus className="size-4" />
            Choose cover
            <input type="file" accept="image/*" onChange={handleCoverChange} className="sr-only" />
          </label>
          {imageCover && <p className="text-xs text-[var(--color-mist-500)]">New: {imageCover.name}</p>}
        </section>

        <section className="space-y-4 rounded-[var(--radius-card)] border border-[var(--color-mist-300)] bg-white p-6">
          <div>
            <h2 className="font-semibold">Gallery images</h2>
            <p className="mt-1 text-sm text-[var(--color-mist-500)]">
              Field name: <code>images</code> — choose up to 3 images.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {(imagePreviews.length > 0 ? imagePreviews : currentImages).map((src, index) => (
              <div key={src} className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-mist-300)]">
                <img src={src} alt={`Tour gallery ${index + 1}`} className="h-36 w-full object-cover" />
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-[var(--radius-card)] border border-[var(--color-pine-900)]/30 px-4 py-2 text-sm font-semibold text-[var(--color-pine-900)] hover:bg-[var(--color-pine-900)]/5">
              <Images className="size-4" />
              Choose gallery
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImagesChange}
                className="sr-only"
              />
            </label>

            {images.length > 0 && (
              <button
                type="button"
                onClick={() => setImages([])}
                className="inline-flex items-center gap-1 text-sm text-[var(--color-danger-600)] hover:underline"
              >
                <X className="size-4" /> Clear selection
              </button>
            )}
          </div>

          {images.length > 0 && (
            <p className="text-xs text-[var(--color-mist-500)]">
              {images.length} new image{images.length === 1 ? '' : 's'} selected.
            </p>
          )}
        </section>

        {fileError && (
          <p role="alert" className="rounded-[var(--radius-card)] bg-[var(--color-danger-100)] px-4 py-3 text-sm text-[var(--color-danger-600)]">
            {fileError}
          </p>
        )}

        {updateMutation.isError && (
          <p role="alert" className="rounded-[var(--radius-card)] bg-[var(--color-danger-100)] px-4 py-3 text-sm text-[var(--color-danger-600)]">
            {updateMutation.error.message}
          </p>
        )}

        {updateMutation.isSuccess && (
          <p className="rounded-[var(--radius-card)] bg-[var(--color-success-100)] px-4 py-3 text-sm text-[var(--color-success-600)]">
            Tour updated. The backend returned the new image filenames successfully.
          </p>
        )}

        <Button type="submit" loading={updateMutation.isPending}>
          Save tour changes
        </Button>
      </form>
    </Container>
  );
}
