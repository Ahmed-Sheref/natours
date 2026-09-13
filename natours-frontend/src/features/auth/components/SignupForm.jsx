import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Button from '../../../components/common/Button';

const initialValues = { name: '', email: '', password: '', confirmPassword: '' };

export default function SignupForm() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState(initialValues);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function update(field) {
    return (e) => setValues((v) => ({ ...v, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (values.password !== values.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      await signup(values);
      navigate('/', { replace: true });
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
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-[var(--color-ink-900)]">
          Full name
        </label>
        <input
          id="name"
          required
          minLength={3}
          maxLength={40}
          autoComplete="name"
          value={values.name}
          onChange={update('name')}
          className="w-full rounded-[var(--radius-card)] border border-[var(--color-mist-300)] bg-white px-4 py-2.5 text-sm outline-none focus:border-[var(--color-brass-500)]"
        />
      </div>

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
          onChange={update('email')}
          className="w-full rounded-[var(--radius-card)] border border-[var(--color-mist-300)] bg-white px-4 py-2.5 text-sm outline-none focus:border-[var(--color-brass-500)]"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-[var(--color-ink-900)]">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={values.password}
            onChange={update('password')}
            className="w-full rounded-[var(--radius-card)] border border-[var(--color-mist-300)] bg-white px-4 py-2.5 text-sm outline-none focus:border-[var(--color-brass-500)]"
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-[var(--color-ink-900)]">
            Confirm password
          </label>
          <input
            id="confirmPassword"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={values.confirmPassword}
            onChange={update('confirmPassword')}
            className="w-full rounded-[var(--radius-card)] border border-[var(--color-mist-300)] bg-white px-4 py-2.5 text-sm outline-none focus:border-[var(--color-brass-500)]"
          />
        </div>
      </div>

      <Button type="submit" loading={submitting} className="w-full">
        Create account
      </Button>

      <p className="text-center text-sm text-[var(--color-mist-500)]">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-[var(--color-pine-900)] hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
