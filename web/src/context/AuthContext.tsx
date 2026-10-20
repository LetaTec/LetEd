import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { isAxiosError } from 'axios';

import { AUTH_ERROR_CODE, AUTH_TEXT } from '@constants/auth';
import { useToast } from '@context/ToastContext';
import { hasApiErrorCode } from '@services/api/errors';
import { getCurrentSession, type AuthUser } from '@services/auth';
import { API_CLIENT } from '@services/http/api';

export type AuthStatus = 'loading' | 'authenticated' | 'anonymous';

export interface AuthContextValue {
  status: AuthStatus;
  user: AuthUser | null;
  isLoggedIn: boolean;
  login: (user: AuthUser) => void;
  clearSession: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const AUTH_ENDPOINT_PREFIX = '/auth/';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { showToast } = useToast();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');
  const userRef = useRef<AuthUser | null>(null);
  userRef.current = user;

  const login = useCallback((nextUser: AuthUser) => {
    setUser(nextUser);
    setStatus('authenticated');
  }, []);

  const clearSession = useCallback(() => {
    setUser(null);
    setStatus('anonymous');
  }, []);

  // Restore the session from the httpOnly cookie on page load.
  useEffect(() => {
    let isActive = true;

    getCurrentSession()
      .then(sessionUser => {
        if (isActive) login(sessionUser);
      })
      .catch(error => {
        if (!isActive) return;

        if (hasApiErrorCode(error, AUTH_ERROR_CODE.sessionExpired)) {
          showToast(AUTH_TEXT.sessionExpiredToast);
        } else if (!hasApiErrorCode(error, AUTH_ERROR_CODE.unauthenticated)) {
          console.error('[auth] failed to restore session', error);
        }

        clearSession();
      });

    return () => {
      isActive = false;
    };
  }, [clearSession, login, showToast]);

  // A protected request answered with 401 means the server-side session is
  // gone (expired or revoked): drop the local session and tell the student.
  useEffect(() => {
    const interceptor = API_CLIENT.interceptors.response.use(
      response => response,
      error => {
        const url = isAxiosError(error) ? (error.config?.url ?? '') : '';
        const isAuthEndpoint =
          url.startsWith(AUTH_ENDPOINT_PREFIX) || url.includes('/auth/');

        if (
          isAxiosError(error) &&
          error.response?.status === 401 &&
          !isAuthEndpoint &&
          userRef.current
        ) {
          clearSession();
          showToast(AUTH_TEXT.sessionExpiredToast);
        }

        return Promise.reject(error);
      },
    );

    return () => API_CLIENT.interceptors.response.eject(interceptor);
  }, [clearSession, showToast]);

  const value = useMemo(
    () => ({
      status,
      user,
      isLoggedIn: user !== null,
      login,
      clearSession,
    }),
    [clearSession, login, status, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
