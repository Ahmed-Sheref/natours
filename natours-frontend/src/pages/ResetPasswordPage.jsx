import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Container from '../components/common/Container';
import Button from '../components/common/Button';
import { resetPassword, fetchCurrentUser } from '../features/auth/auth.api';
import { setToken } from '../utils/token';
import { useAuth } from '../context/AuthContext';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [values, setValues] = useState({ password: '', confirmPassword: '' });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (values.password !== values.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      const { token: newToken } = await resetPassword({ token, ...values });
      setToken(newToken);
      const user = await fetchCurrentUser();
      setUser(user);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Container className="flex min-h-[calc(100vh-4rem)] max-w-sm flex-col justify-center py-16">
      <h1 className="mb-2 text-2xl font-semibold">Choose a new password</h1>
      <p className="mb-8 text-sm text-[var(--color-mist-500)]">This link expires 10 minutes after it was sent.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <p className="text-sm text-[var(--color-danger-600)]">{error}</p>}
        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium">New password</label>
          <input
            id="password"
            type="password"
            required
            minLength={8}
            value={values.password}
            onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))}
            className="w-full rounded-[var(--radius-card)] border border-[var(--color-mist-300)] px-4 py-2.5 text-sm outline-none focus:border-[var(--color-brass-500)]"
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium">Confirm new password</label>
          <input
            id="confirmPassword"
            type="password"
            required
            minLength={8}
            value={values.confirmPassword}
            onChange={(e) => setValues((v) => ({ ...v, confirmPassword: e.target.value }))}
            className="w-full rounded-[var(--radius-card)] border border-[var(--color-mist-300)] px-4 py-2.5 text-sm outline-none focus:border-[var(--color-brass-500)]"
          />
        </div>
        <Button type="submit" loading={submitting} className="w-full">
          Reset password
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--color-mist-500)]">
        <Link to="/login" className="font-medium text-[var(--color-pine-900)] hover:underline">
          Back to log in
        </Link>
      </p>
    </Container>
  );
}
