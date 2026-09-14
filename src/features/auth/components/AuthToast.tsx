import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { useAuthToasts, authToast, type AuthToastItem } from '../lib/authToast';

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5 shrink-0">
      <circle cx="10" cy="10" r="9" className="fill-primary/15" />
      <path
        d="M6 10.5l2.5 2.5L14 7.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-primary"
      />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5 shrink-0">
      <circle cx="10" cy="10" r="9" className="fill-destructive/15" />
      <path
        d="M7 7l6 6M13 7l-6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        className="text-destructive"
      />
    </svg>
  );
}

function ToastCard({ toast }: { toast: AuthToastItem }) {
  const isSuccess = toast.type === 'success';
  const close = () => authToast.dismiss(toast.id);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.96, transition: { duration: 0.15 } }}
      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
      role="alert"
      onClick={close}
      className={[
        'pointer-events-auto relative flex w-full max-w-sm cursor-pointer items-start gap-3 overflow-hidden border bg-background/95 px-4 py-3 pr-8 shadow-lg backdrop-blur-sm',
        isSuccess
          ? 'border-primary/30 shadow-[0_0_28px_hsl(var(--primary)/0.30)]'
          : 'border-destructive/40 shadow-[0_0_28px_hsl(var(--destructive)/0.25)]',
      ].join(' ')}
    >
      {isSuccess ? <CheckIcon /> : <ErrorIcon />}

      <p className="pt-0.5 text-sm leading-5 text-foreground">{toast.message}</p>

      <button
        type="button"
        aria-label="Fermer"
        onClick={(e) => {
          e.stopPropagation();
          close();
        }}
        className="absolute right-2 top-2 text-muted-foreground/60 transition-colors hover:text-foreground"
      >
        <svg viewBox="0 0 14 14" fill="none" className="h-3.5 w-3.5">
          <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      <div className="absolute bottom-0 left-0 h-0.5 w-full bg-border/40">
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: toast.duration / 1000, ease: 'linear' }}
          className={isSuccess ? 'h-full bg-primary/70' : 'h-full bg-destructive/70'}
        />
      </div>
    </motion.div>
  );
}

export function AuthToastViewport() {
  const toasts = useAuthToasts();

  return createPortal(
    <div className="pointer-events-none fixed inset-x-0 top-5 z-50 flex flex-col items-center gap-2.5 px-5">
      <AnimatePresence initial={false}>
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>,
    document.body
  );
}