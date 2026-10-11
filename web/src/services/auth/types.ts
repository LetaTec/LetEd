import type { StudentStandard, StudentStream } from '@constants/student';

export type AuthUser = {
  id: string;
  email: string;
  student: {
    id: string;
    fullName: string;
    standard: StudentStandard;
    stream: StudentStream | null;
  };
};

export type RegisterRequest = {
  fullName: string;
  email: string;
  password: string;
  dateOfBirth: string;
  mobile: string;
  standard: StudentStandard;
  stream: StudentStream | null;
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

export type PasswordResetConfirmRequest = {
  token: string;
  password: string;
};
