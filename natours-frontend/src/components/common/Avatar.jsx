import { useState } from 'react';
import { User } from 'lucide-react';
import { resolveImageUrl } from '../../utils/images';

export default function Avatar({ name, photo, size = 36, className = '', variant = 'light' }) {
  const [errored, setErrored] = useState(false);
  const src = resolveImageUrl(photo, 'users');
  const initials = name
    ?.split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  const style = { width: size, height: size };
  const fallbackClass =
    variant === 'dark'
      ? 'bg-[var(--color-brass-500)]/20 text-[var(--color-brass-400)]'
      : 'bg-[var(--color-pine-900)]/10 text-[var(--color-pine-900)]';

  if (src && !errored) {
    return (
      <img
        src={src}
        alt={name ? `${name}'s avatar` : 'User avatar'}
        style={style}
        onError={() => setErrored(true)}
        className={`shrink-0 rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <span
      style={style}
      className={`flex shrink-0 items-center justify-center rounded-full text-xs font-semibold ${fallbackClass} ${className}`}
    >
      {initials || <User className="size-4" aria-hidden="true" />}
    </span>
  );
}
