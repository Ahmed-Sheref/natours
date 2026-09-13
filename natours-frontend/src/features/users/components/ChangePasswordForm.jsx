import { useState } from 'react';
import { useUpdatePassword } from '../users.hooks';
import Button from '../../../components/common/Button';

const initial = { currentPassword: '', newPassword: '', confirmPassword: '' };

export default function ChangePasswordForm() {
  const { mutate, isPending, isError, error, isSuccess } = useUpdatePassword();
  const [values, setValues] = useState(initial);

  function update(field) {
    return (e) => setValues((v) => ({ ...v, [field]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    mutate(values, { onSuccess: () => setValues(initial) });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="currentPassword" className="mb-1.5 block text-sm font-medium">Current password</label>
        <input
          id="currentPassword"
          type="password"
          required
          value={values.currentPassword}
          onChange={update('currentPassword')}
          className="w-full rounded-[var(--radius-card)] border border-[var(--color-mist-300)] px-4 py-2.5 text-sm outline-none focus:border-[var(--color-brass-500)]"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="newPassword" className="mb-1.5 block text-sm font-medium">New password</label>
          <input
            id="newPassword"
            type="password"
            required
            minLength={8}
            value={values.newPassword}
            onChange={update('newPassword')}
            className="w-full rounded-[var(--radius-card)] border border-[var(--color-mist-300)] px-4 py-2.5 text-sm outline-none focus:border-[var(--color-brass-500)]"
          />
        </div>
        <div>
          <label htmlFor="confirmNewPassword" className="mb-1.5 block text-sm font-medium">Confirm new password</label>
          <input
            id="confirmNewPassword"
            type="password"
            required
            minLength={8}
            value={values.confirmPassword}
            onChange={update('confirmPassword')}
            className="w-full rounded-[var(--radius-card)] border border-[var(--color-mist-300)] px-4 py-2.5 text-sm outline-none focus:border-[var(--color-brass-500)]"
          />
        </div>
      </div>
      {isError && <p className="text-sm text-[var(--color-danger-600)]">{error.message}</p>}
      {isSuccess && <p className="text-sm text-[var(--color-success-600)]">Password updated.</p>}
      <Button type="submit" loading={isPending}>Update password</Button>
    </form>
  );
}
