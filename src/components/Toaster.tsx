// src/components/Toaster.tsx
// Renders active toasts with crisp Lucide icons and zero emojis.
import { Check, X, Info, AlertTriangle } from 'lucide-react';
import { useToastStore, type Toast } from '../store/toastStore';

const STYLES: Record<Toast['type'], string> = {
  success:
    'bg-emerald-50 border-emerald-200 text-emerald-950 dark:bg-emerald-950/80 dark:border-emerald-800 dark:text-emerald-100',
  error:
    'bg-rose-50 border-rose-200 text-rose-950 dark:bg-rose-950/80 dark:border-rose-800 dark:text-rose-100',
  info:
    'bg-blue-50 border-blue-200 text-blue-950 dark:bg-blue-950/80 dark:border-blue-800 dark:text-blue-100',
  warning:
    'bg-amber-50 border-amber-200 text-amber-950 dark:bg-amber-950/80 dark:border-amber-800 dark:text-amber-100',
};

const ICON_STYLES: Record<Toast['type'], string> = {
  success: 'bg-emerald-500 text-white',
  error: 'bg-rose-500 text-white',
  info: 'bg-blue-500 text-white',
  warning: 'bg-amber-500 text-white',
};

export function Toaster() {
  const { toasts, dismiss } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none"
      style={{ maxWidth: '22rem' }}
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          role="alert"
          className={`pointer-events-auto toast-enter flex items-start gap-3 rounded-xl border p-4 shadow-lg shadow-black/10 transition-all ${STYLES[t.type]}`}
        >
          {/* Icon badge */}
          <span
            className={`flex-shrink-0 mt-0.5 h-6 w-6 rounded-lg flex items-center justify-center ${ICON_STYLES[t.type]}`}
          >
            {t.type === 'success' && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
            {t.type === 'error' && <X className="w-3.5 h-3.5 stroke-[2.5]" />}
            {t.type === 'warning' && <AlertTriangle className="w-3.5 h-3.5 stroke-[2.5]" />}
            {t.type === 'info' && <Info className="w-3.5 h-3.5 stroke-[2.5]" />}
          </span>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold leading-snug">{t.title}</p>
            {t.message && (
              <p className="mt-0.5 text-xs opacity-75 leading-relaxed">{t.message}</p>
            )}
          </div>

          {/* Dismiss button */}
          <button
            onClick={() => dismiss(t.id)}
            aria-label="Dismiss notification"
            className="flex-shrink-0 mt-0.5 opacity-40 hover:opacity-100 transition-opacity p-0.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

export default Toaster;
