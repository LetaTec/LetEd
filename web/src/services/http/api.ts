import axios, { AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

if (import.meta.env.PROD && !import.meta.env.VITE_API_URL) {
  console.warn(
    '[letaEd] VITE_API_URL is not set. Defaulting to /api. Ensure your API is available at the same origin or set VITE_API_URL in Cloudflare Pages build settings.',
  );
}

// Session auth uses an httpOnly cookie set by the API, so requests only need
// to include credentials; no token is ever readable from JavaScript.
export const API_CLIENT = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Detect when Cloudflare Pages SPA fallback serves index.html instead of an API response
API_CLIENT.interceptors.response.use(
  response => {
    const rawContentType = response.headers?.['content-type'];
    const contentType =
      typeof rawContentType === 'string' ? rawContentType : '';
    const isHtml =
      typeof response.data === 'string' &&
      (contentType.includes('text/html') ||
        response.data.trimStart().startsWith('<!doctype') ||
        response.data.trimStart().startsWith('<!DOCTYPE') ||
        response.data.trimStart().startsWith('<html'));

    if (isHtml) {
      return Promise.reject(
        new AxiosError(
          'API endpoint returned HTML instead of JSON. Ensure the backend API is deployed and VITE_API_URL is configured.',
          'ERR_BAD_RESPONSE',
          response.config,
          response.request,
          {
            ...response,
            status: 503,
            statusText: 'Service Unavailable',
            data: {
              message:
                'The backend API is not available. Please verify the API is deployed and VITE_API_URL is configured.',
              code: 'API_UNAVAILABLE',
              details: null,
            },
          },
        ),
      );
    }

    return response;
  },
  error => Promise.reject(error),
);
