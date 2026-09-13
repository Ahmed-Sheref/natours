import { Compass } from 'lucide-react';
import LoginForm from '../features/auth/components/LoginForm';

export default function LoginPage() {
  return (
    <div className="grid min-h-[calc(100vh-4rem)] md:grid-cols-2">
      <div className="hidden bg-[var(--color-pine-950)] p-12 text-parchment-100 md:flex md:flex-col md:justify-between">
        <div className="flex items-center gap-2">
          <Compass className="size-6 text-[var(--color-brass-500)]" aria-hidden="true" />
          <span className="font-display text-lg font-semibold">Natours</span>
        </div>
        <blockquote className="font-display text-3xl leading-snug text-balance">
          "The mountains are calling, and the itinerary is already planned."
        </blockquote>
        <p className="text-sm text-parchment-100/60">Small groups. Real guides. No detours.</p>
      </div>

      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <h1 className="mb-1 text-3xl font-semibold">Welcome back</h1>
          <p className="mb-8 text-sm text-[var(--color-mist-500)]">Log in to book your next expedition.</p>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
