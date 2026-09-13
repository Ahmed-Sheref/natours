import axios from 'axios';
import { getToken, removeToken } from '../utils/token';

const baseURL = import.meta.env.VITE_API_URL;

if (!baseURL) {
  // Fail loudly in dev rather than silently hitting a relative URL.
  console.warn(
    'VITE_API_URL is not set. Copy .env.example to .env and point it at your Express API.'
  );
}

export const apiClient = axios.create({
  baseURL,
});

// Attach the JWT to every outgoing request, if we have one.
apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// A single place other modules can register interest in "the session just died".
// AuthContext subscribes to this so a 401 anywhere logs the user out consistently.
let unauthorizedHandler = null;
export function onUnauthorized(handler) {
  unauthorizedHandler = handler;
}

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken();
      unauthorizedHandler?.();
    }
    return Promise.reject(normalizeError(error));
  }
);

// The backend uses three different success-response shapes depending on the
// endpoint (see natours-frontend README for the full breakdown). This helper
// hides that inconsistency from the rest of the app.
export function extractData(response) {
  const body = response.data;
  if (body?.data?.data !== undefined) return body.data.data; // list/single via handlerFactory
  if (body?.data !== undefined) return body.data; // signup, aggregations
  return body; // login, updateMe, updatePassword, deleteMe, forgetPassword
}

function normalizeError(error) {
  const message =
    error.response?.data?.message ||
    (error.request && !error.response
      ? 'Could not reach the server. Check your connection and try again.'
      : 'Something went wrong. Please try again.');
  return { message, status: error.response?.status };
}
