import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { Toast, type ToastTone } from '@components/ui/Toast/Toast';
import { TOAST_DURATION_MS } from '@constants/ui';

type ToastState = {
  message: string;
  tone: ToastTone;
};

interface ToastContextValue {
  showToast: (message: string, tone?: ToastTone) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toast, setToast] = useState<ToastState | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<number | undefined>(undefined);

  const showToast = useCallback(
    (message: string, tone: ToastTone = 'default') => {
      window.clearTimeout(timeoutRef.current);
      setToast({ message, tone });
      setIsOpen(true);
      timeoutRef.current = window.setTimeout(
        () => setIsOpen(false),
        TOAST_DURATION_MS,
      );
    },
    [],
  );

  useEffect(() => () => window.clearTimeout(timeoutRef.current), []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toast message={toast?.message ?? ''} tone={toast?.tone} open={isOpen} />
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
