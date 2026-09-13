import { useAuth } from '../context/AuthContext';
import Container from '../components/common/Container';
import Avatar from '../components/common/Avatar';
import UpdateProfileForm from '../features/users/components/UpdateProfileForm';
import ChangePasswordForm from '../features/users/components/ChangePasswordForm';
import DeleteAccountSection from '../features/users/components/DeleteAccountSection';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <Container className="max-w-3xl space-y-12 py-14">
      <div className="flex items-center gap-4">
        <Avatar name={user?.name} photo={user?.photo} size={56} />
        <div>
          <h1 className="text-3xl font-semibold">{user?.name ?? 'My account'}</h1>
          <p className="mt-1 text-sm text-[var(--color-mist-500)]">
            {user?.email} · {user?.role === 'admin' ? 'Admin' : 'Traveler'}
          </p>
        </div>
      </div>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Profile information</h2>
        <UpdateProfileForm />
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Change password</h2>
        <ChangePasswordForm />
      </section>

      <section className="border-t border-[var(--color-mist-300)] pt-8">
        <h2 className="mb-4 text-lg font-semibold text-[var(--color-danger-600)]">Danger zone</h2>
        <DeleteAccountSection />
      </section>
    </Container>
  );
}
