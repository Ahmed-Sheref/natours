import { useState } from 'react';
import { Link } from 'react-router-dom';
import Container from '../components/common/Container';
import Button from '../components/common/Button';
import { forgotPassword } from '../features/auth/auth.api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    setError(null);
    try {
      await forgotPassword({ email });
      setStatus('sent');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  }

  return (
    <Container className="flex min-h-[calc(100vh-4rem)] max-w-sm flex-col justify-center py-16">
      <h1 className="mb-2 text-2xl font-semibold">Reset your password</h1>
      <p className="mb-8 text-sm text-[var(--color-mist-500)]">
        We'll email you a link to choose a new one.
      </p>

      {status === 'sent' ? (
        <p className="rounded-[var(--radius-card)] bg-[var(--color-success-100)] px-4 py-3 text-sm text-[var(--color-success-600)]">
          If that email is registered, a reset link is on its way.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <p className="text-sm text-[var(--color-danger-600)]">{error}</p>}
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-[var(--radius-card)] border border-[var(--color-mist-300)] px-4 py-2.5 text-sm outline-none focus:border-[var(--color-brass-500)]"
            />
          </div>
          <Button type="submit" loading={status === 'sending'} className="w-full">
            Send reset link
          </Button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-[var(--color-mist-500)]">
        <Link to="/login" className="font-medium text-[var(--color-pine-900)] hover:underline">
          Back to log in
        </Link>
      </p>
    </Container>
  );
}
