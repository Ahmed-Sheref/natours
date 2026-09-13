import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PageLoader from '../components/common/PageLoader';

export default function AdminRoute() {
  const { user, initializing } = useAuth();

  if (initializing) {
    return <PageLoader label="Checking admin access…" />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/tours" replace />;
  }

  return <Outlet />;
}
