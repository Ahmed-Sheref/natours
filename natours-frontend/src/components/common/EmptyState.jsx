export default function EmptyState({ icon: Icon, title, message, action }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-[var(--radius-card)] border border-dashed border-[var(--color-mist-300)] px-6 py-14 text-center">
      {Icon && <Icon className="size-7 text-[var(--color-mist-500)]" aria-hidden="true" />}
      <p className="font-semibold text-[var(--color-ink-900)]">{title}</p>
      {message && <p className="max-w-sm text-sm text-[var(--color-mist-500)]">{message}</p>}
      {action}
    </div>
  );
}
