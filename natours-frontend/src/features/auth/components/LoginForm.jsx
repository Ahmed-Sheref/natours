import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Button from '../../../components/common/Button';

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [values, setValues] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = location.state?.from?.pathname ?? '/';

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(values);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {error && (
        <p role="alert" className="rounded-[var(--radius-card)] bg-[var(--color-danger-100)] px-4 py-3 text-sm text-[var(--color-danger-600)]">
          {error}
        </p>
      )}

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-[var(--color-ink-900)]">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={values.email}
          onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
          className="w-full rounded-[var(--radius-card)] border border-[var(--color-mist-300)] bg-white px-4 py-2.5 text-sm outline-none focus:border-[var(--color-brass-500)]"
        />
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label htmlFor="password" className="block text-sm font-medium text-[var(--color-ink-900)]">
            Password
          </label>
          <Link to="/forgot-password" className="text-xs font-medium text-[var(--color-mist-500)] hover:text-[var(--color-pine-900)]">
            Forgot password?
          </Link>
        </div>
        <input
          id="password"
          type="password"
          required
          autoComplete="current-password"
          value={values.password}
          onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))}
          className="w-full rounded-[var(--radius-card)] border border-[var(--color-mist-300)] bg-white px-4 py-2.5 text-sm outline-none focus:border-[var(--color-brass-500)]"
        />
      </div>

      <Button type="submit" loading={submitting} className="w-full">
        Log in
      </Button>

      <p className="text-center text-sm text-[var(--color-mist-500)]">
        New here?{' '}
        <Link to="/signup" className="font-medium text-[var(--color-pine-900)] hover:underline">
          Create an account
        </Link>
      </p>
    </form>
  );
}
