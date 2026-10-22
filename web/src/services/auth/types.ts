import type { UserRole } from '@constants/auth';
import type { StudentStandard, StudentStream } from '@constants/student';

// A super admin account may have no student profile.
export type AuthUser = {
  id: string;
  email: string;
  role: UserRole;
  student: {
    id: string;
    fullName: string;
    standard: StudentStandard;
    stream: StudentStream | null;
    streamOther: string | null;
  } | null;
};

export type RegisterRequest = {
  fullName: string;
  email: string;
  password: string;
  dateOfBirth: string;
  mobile: string;
  standard: StudentStandard;
  stream: StudentStream | null;
  streamOther: string | null;
  address: string | null;
};

export type LoginRequest = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export type PasswordResetRequest = {
  email: string;
};

export type AdminSignInRequest = {
  email: string;
};

export type AdminSignInConfirmRequest = {
  token: string;
};

export type PasswordResetConfirmRequest = {
  token: string;
  password: string;
};
