// src/components/StatusBadge.tsx
// Clean, professional pill badge for sessions, bookings, and user roles. No emojis.

export type AnyStatus =
  | 'available'
  | 'planned'
  | 'in-progress'
  | 'completed'
  | 'cancelled'
  | 'requested'
  | 'confirmed'
  | 'tutor'
  | 'tutee'
  | 'admin'
  | string;

interface StatusBadgeProps {
  status: AnyStatus;
  size?: 'sm' | 'md' | 'lg';
}

const CONFIG: Record<string, { label: string; dotColor: string; bgClass: string; textClass: string }> = {
  // Session statuses
  available: {
    label: 'Available',
    dotColor: 'bg-emerald-500',
    bgClass: 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800',
    textClass: 'text-emerald-700 dark:text-emerald-300',
  },
  planned: {
    label: 'Planned',
    dotColor: 'bg-blue-500',
    bgClass: 'bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800',
    textClass: 'text-blue-700 dark:text-blue-300',
  },
  'in-progress': {
    label: 'In Progress',
    dotColor: 'bg-amber-500',
    bgClass: 'bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800',
    textClass: 'text-amber-700 dark:text-amber-300',
  },
  completed: {
    label: 'Completed',
    dotColor: 'bg-emerald-600',
    bgClass: 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800',
    textClass: 'text-emerald-700 dark:text-emerald-300',
  },
  cancelled: {
    label: 'Cancelled',
    dotColor: 'bg-rose-500',
    bgClass: 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800',
    textClass: 'text-rose-700 dark:text-rose-300',
  },

  // Booking statuses
  requested: {
    label: 'Requested',
    dotColor: 'bg-amber-500',
    bgClass: 'bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800',
    textClass: 'text-amber-700 dark:text-amber-300',
  },
  confirmed: {
    label: 'Confirmed',
    dotColor: 'bg-indigo-500',
    bgClass: 'bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800',
    textClass: 'text-indigo-700 dark:text-indigo-300',
  },

  // Roles
  tutor: {
    label: 'Tutor',
    dotColor: 'bg-sky-500',
    bgClass: 'bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800',
    textClass: 'text-sky-700 dark:text-sky-300',
  },
  tutee: {
    label: 'Tutee',
    dotColor: 'bg-purple-500',
    bgClass: 'bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800',
    textClass: 'text-purple-700 dark:text-purple-300',
  },
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const norm = status?.toLowerCase() || 'planned';
  const conf = CONFIG[norm] || {
    label: status,
    dotColor: 'bg-slate-400',
    bgClass: 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700',
    textClass: 'text-slate-700 dark:text-slate-300',
  };

  const sizeClass =
    size === 'sm'
      ? 'text-xs px-2 py-0.5 gap-1.5'
      : size === 'lg'
      ? 'text-sm px-3 py-1 gap-2'
      : 'text-xs px-2.5 py-1 gap-1.5';

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium tracking-tight whitespace-nowrap ${sizeClass} ${conf.bgClass} ${conf.textClass}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${conf.dotColor}`} aria-hidden="true" />
      {conf.label}
    </span>
  );
}

export default StatusBadge;
