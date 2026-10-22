import { API_CLIENT } from '@services/http/api';

import type {
  AdminSignInConfirmRequest,
  AdminSignInRequest,
  AuthUser,
  LoginRequest,
  PasswordResetConfirmRequest,
  PasswordResetRequest,
  RegisterRequest,
} from './types';

type AuthUserResponse = { user: AuthUser };

export const registerStudent = async (body: RegisterRequest) =>
  (await API_CLIENT.post<AuthUserResponse>('/auth/register', body)).data.user;

export const loginStudent = async (body: LoginRequest) =>
  (await API_CLIENT.post<AuthUserResponse>('/auth/login', body)).data.user;

export const logoutStudent = async () => {
  await API_CLIENT.post('/auth/logout');
};

export const getCurrentSession = async () =>
  (await API_CLIENT.get<AuthUserResponse>('/auth/session')).data.user;

export const requestPasswordReset = async (body: PasswordResetRequest) => {
  await API_CLIENT.post('/auth/password-reset', body);
};

export const confirmPasswordReset = async (
  body: PasswordResetConfirmRequest,
) => {
  await API_CLIENT.post('/auth/password-reset/confirm', body);
};

// Super admins sign in with a one-time link emailed to them.
export const requestAdminSignIn = async (body: AdminSignInRequest) => {
  await API_CLIENT.post('/auth/admin-sign-in', body);
};

export const confirmAdminSignIn = async (body: AdminSignInConfirmRequest) =>
  (await API_CLIENT.post<AuthUserResponse>('/auth/admin-sign-in/confirm', body))
    .data.user;
