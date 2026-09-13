import { apiClient, extractData } from '../../api/client';

export async function signup({ name, email, password, confirmPassword }) {
  const response = await apiClient.post('/users/signup', {
    name,
    email,
    password,
    confirmPassword,
  });
  // { token, user }
  const body = response.data;
  return { token: body.token, user: body.data.user };
}

export async function login({ email, password }) {
  const response = await apiClient.post('/users/login', { email, password });
  // Login only returns a token — the caller must fetch the current user separately.
  return { token: response.data.token };
}

export async function fetchCurrentUser() {
  const response = await apiClient.get('/users/me');
  return extractData(response);
}

export async function forgotPassword({ email }) {
  const response = await apiClient.post('/users/forgetpassword', { email });
  return extractData(response);
}

export async function resetPassword({ token, password, confirmPassword }) {
  const response = await apiClient.patch(`/users/resetpassword/${token}`, {
    password,
    confirmPassword,
  });
  return { token: response.data.token };
}
