import { Loader2 } from 'lucide-react';

const variants = {
  primary:
    'bg-[var(--color-brass-500)] text-[var(--color-pine-950)] hover:bg-[var(--color-brass-400)]',
  dark:
    'bg-[var(--color-pine-900)] text-[var(--color-parchment-100)] hover:bg-[var(--color-pine-800)]',
  outline:
    'border border-[var(--color-pine-900)]/30 text-[var(--color-pine-900)] hover:bg-[var(--color-pine-900)]/5',
  ghost:
    'text-[var(--color-pine-900)] hover:bg-[var(--color-pine-900)]/5',
  danger:
    'bg-[var(--color-danger-600)] text-white hover:opacity-90',
};

export default function Button({
  as: Component = 'button',
  variant = 'primary',
  loading = false,
  disabled,
  className = '',
  children,
  ...props
}) {
  return (
    <Component
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-[var(--radius-card)] px-5 py-2.5 text-sm font-semibold transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {loading && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
      {children}
    </Component>
  );
}
