import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Session auth uses an httpOnly cookie set by the API, so requests only need
// to include credentials; no token is ever readable from JavaScript.
export const API_CLIENT = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});
