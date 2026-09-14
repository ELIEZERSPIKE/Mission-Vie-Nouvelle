import { useEffect, useState } from 'react';

export type AuthToastType = 'success' | 'error';

export interface AuthToastItem {
  id: number;
  type: AuthToastType;
  message: string;
  duration: number;
}

type Listener = (toasts: AuthToastItem[]) => void;

let toasts: AuthToastItem[] = [];
let nextId = 0;
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((listener) => listener(toasts));
}

function push(type: AuthToastType, message: string, duration = 4000) {
  const id = nextId++;
  toasts = [...toasts, { id, type, message, duration }];
  emit();

  window.setTimeout(() => dismiss(id), duration);

  return id;
}

function dismiss(id: number) {
  toasts = toasts.filter((toast) => toast.id !== id);
  emit();
}

export const authToast = {
  success: (message: string, duration?: number) => push('success', message, duration),
  error: (message: string, duration?: number) => push('error', message, duration),
  dismiss,
};

export function useAuthToasts(): AuthToastItem[] {
  const [state, setState] = useState<AuthToastItem[]>(toasts);

  useEffect(() => {
    listeners.add(setState);
    setState(toasts);
    return () => {
      listeners.delete(setState);
    };
  }, []);

  return state;
}