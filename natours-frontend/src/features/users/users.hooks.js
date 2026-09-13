import { useMutation } from '@tanstack/react-query';
import * as usersApi from './users.api';
import { useAuth } from '../../context/AuthContext';
import { setToken } from '../../utils/token';

export function useUpdateProfile() {
  const { setUser } = useAuth();
  return useMutation({
    mutationFn: usersApi.updateProfile,
    onSuccess: (newUser) => setUser(newUser),
  });
}

export function useUpdatePassword() {
  return useMutation({
    mutationFn: usersApi.updatePassword,
    onSuccess: ({ token }) => setToken(token),
  });
}

export function useDeleteAccount() {
  const { logout } = useAuth();
  return useMutation({
    mutationFn: usersApi.deleteAccount,
    onSuccess: () => logout(),
  });
}
