import { useState } from 'react';
import { useDeleteAccount } from '../users.hooks';
import Button from '../../../components/common/Button';

export default function DeleteAccountSection() {
  const [confirming, setConfirming] = useState(false);
  const { mutate, isPending, isError, error } = useDeleteAccount();

  if (!confirming) {
    return (
      <Button variant="danger" onClick={() => setConfirming(true)}>
        Delete account
      </Button>
    );
  }

  return (
    <div className="space-y-3 rounded-[var(--radius-card)] border border-[var(--color-danger-600)]/30 bg-[var(--color-danger-100)] p-4">
      <p className="text-sm text-[var(--color-ink-900)]">
        This deactivates your account. You won't be able to log back in with these credentials. Are you sure?
      </p>
      {isError && <p className="text-sm text-[var(--color-danger-600)]">{error.message}</p>}
      <div className="flex gap-3">
        <Button variant="danger" loading={isPending} onClick={() => mutate()}>
          Yes, delete my account
        </Button>
        <Button variant="ghost" onClick={() => setConfirming(false)}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
