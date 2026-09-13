import { useEffect, useMemo, useRef, useState } from 'react';
import { Camera } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useUpdateProfile } from '../users.hooks';
import Avatar from '../../../components/common/Avatar';
import Button from '../../../components/common/Button';

const MAX_PHOTO_BYTES = 5 * 1024 * 1024; // 5MB

export default function UpdateProfileForm() {
  const { user } = useAuth();
  const { mutate, isPending, isError, error, isSuccess } = useUpdateProfile();
  const [values, setValues] = useState({ name: user?.name ?? '', email: user?.email ?? '' });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoError, setPhotoError] = useState(null);
  const fileInputRef = useRef(null);

  // Derived from photoFile during render, not stored separately — an effect
  // only handles the cleanup side-effect (revoking the old URL), not state.
  const previewUrl = useMemo(
    () => (photoFile ? URL.createObjectURL(photoFile) : null),
    [photoFile]
  );
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file later
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setPhotoError('Please choose an image file.');
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setPhotoError('That image is too large — please pick one under 5MB.');
      return;
    }
    setPhotoError(null);
    setPhotoFile(file);
  }

  function handleSubmit(e) {
    e.preventDefault();
    mutate(
      { ...values, photo: photoFile },
      { onSuccess: () => setPhotoFile(null) }
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex items-center gap-4">
        <div className="relative">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="New profile photo preview"
              className="size-16 rounded-full object-cover"
            />
          ) : (
            <Avatar name={user?.name} photo={user?.photo} size={64} />
          )}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            aria-label="Change profile photo"
            className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full bg-[var(--color-brass-500)] text-[var(--color-pine-950)] ring-2 ring-white"
          >
            <Camera className="size-3.5" aria-hidden="true" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="sr-only"
          />
        </div>
        <div>
          <p className="text-sm font-medium text-[var(--color-ink-900)]">Profile photo</p>
          <p className="text-xs text-[var(--color-mist-500)]">
            {photoFile ? photoFile.name : 'JPG or PNG, up to 5MB'}
          </p>
          {photoError && <p className="text-xs text-[var(--color-danger-600)]">{photoError}</p>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="profile-name" className="mb-1.5 block text-sm font-medium">Name</label>
          <input
            id="profile-name"
            value={values.name}
            onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
            className="w-full rounded-[var(--radius-card)] border border-[var(--color-mist-300)] px-4 py-2.5 text-sm outline-none focus:border-[var(--color-brass-500)]"
          />
        </div>
        <div>
          <label htmlFor="profile-email" className="mb-1.5 block text-sm font-medium">Email</label>
          <input
            id="profile-email"
            type="email"
            value={values.email}
            onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
            className="w-full rounded-[var(--radius-card)] border border-[var(--color-mist-300)] px-4 py-2.5 text-sm outline-none focus:border-[var(--color-brass-500)]"
          />
        </div>
      </div>
      {isError && <p className="text-sm text-[var(--color-danger-600)]">{error.message}</p>}
      {isSuccess && <p className="text-sm text-[var(--color-success-600)]">Profile updated.</p>}
      <Button type="submit" loading={isPending}>Save changes</Button>
    </form>
  );
}
