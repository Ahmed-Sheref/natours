import { useState } from 'react';
import { ImageOff } from 'lucide-react';

export default function SmartImage({ src, alt, className = '', imgClassName, ...props }) {
  const [errored, setErrored] = useState(false);

  if (!src || errored) {
    return (
      <div
        className={`flex items-center justify-center bg-[var(--color-parchment-300)] text-[var(--color-mist-500)] ${className}`}
        role="img"
        aria-label={alt || 'Image unavailable'}
      >
        <ImageOff className="size-6" aria-hidden="true" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={imgClassName ?? className}
      onError={() => setErrored(true)}
      {...props}
    />
  );
}
