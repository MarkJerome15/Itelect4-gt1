// src/pages/SessionsPage.tsx
// Peer Tutoring Sessions Catalog & Management.
// Features Subject filters, text search, Tutor session creation, and direct Tutee booking modal.
// Professional UI with Lucide icons and zero emojis.

import { useState } from 'react';
import { Link } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  BookOpen,
  Plus,
  Search,
  Clock,
  DollarSign,
  User,
  X,
  Trash2,
  CalendarCheck,
  GraduationCap,
} from 'lucide-react';
import {
  fetchSessions,
  createSession,
  deleteSession,
  createBooking,
  type ApiSession,
} from '../api/client';
import {
  sessionSchema,
  type SessionFormValues,
  STATUS_OPTIONS,
  SUBJECT_OPTIONS,
} from '../schemas/sessionSchema';
import { useAuthStore } from '../store/authStore';
import { toast } from '../store/toastStore';
import { StatusBadge } from '../components/StatusBadge';
import { SessionCardSkeleton } from '../components/SessionCardSkeleton';

function formatDuration(mins: number): string {
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

/* ── Booking Modal Component ───────────────────────────────── */
interface BookModalProps {
  session: ApiSession;
  onClose: () => void;
}

function BookModal({ session, onClose }: BookModalProps) {
  const queryClient = useQueryClient();
  const [scheduledAt, setScheduledAt] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(10, 0, 0, 0);
    return d.toISOString().slice(0, 16);
  });
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createBooking({
        sessionId: session.id,
        scheduledAt: new Date(scheduledAt).toISOString(),
        notes: notes.trim(),
      });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Booking requested', 'Your peer tutor will review and confirm your session.');
      onClose();
    } catch (err) {
      toast.error('Booking failed', err instanceof Error ? err.message : 'Could not book session');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-bold text-gray-900 dark:text-white text-base">
              Book Tutoring Session
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleBooking} className="mt-4 space-y-4">
          <div className="bg-gray-50 dark:bg-gray-800/60 p-3 rounded-xl space-y-1">
            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold uppercase tracking-wider">
              {session.subject}
            </p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{session.title}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              ${session.ratePerHour}/hr • {session.durationMinutes} minutes
            </p>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="booking-datetime"
              className="text-xs font-semibold text-gray-700 dark:text-gray-300"
            >
              Scheduled Date & Time
            </label>
            <input
              id="booking-datetime"
              type="datetime-local"
              required
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="h-10 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/60"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="booking-notes"
              className="text-xs font-semibold text-gray-700 dark:text-gray-300"
            >
              Notes for Tutor (Topics you need help with)
            </label>
            <textarea
              id="booking-notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Need help with limits, derivatives, or midterm exam practice."
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-2.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/60 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 rounded-lg shadow-sm transition-colors"
            >
              {loading ? 'Submitting...' : 'Confirm Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── New Session Form Component ────────────────────────────── */
function NewSessionForm({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SessionFormValues>({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      status: 'available',
      subject: 'Computer Science',
      ratePerHour: 20,
      durationMinutes: 60,
      availableSlots: 1,
    },
  });

  const createMutation = useMutation({
    mutationFn: createSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      reset();
      onClose();
      toast.success('Session created', 'Your new peer tutoring session has been listed.');
    },
    onError: (err) => {
      toast.error('Failed to create session', err instanceof Error ? err.message : undefined);
    },
  });

  const onSubmit = (values: SessionFormValues) => {
    createMutation.mutate({
      title: values.title,
      subject: values.subject,
      description: values.description ?? '',
      status: values.status,
      ratePerHour: values.ratePerHour,
      durationMinutes: values.durationMinutes,
      availableSlots: values.availableSlots,
      notes: values.notes ?? '',
    });
  };

  return (
    <div className="glass-card p-6 mb-6 rounded-2xl border border-gray-200/80 dark:border-gray-800 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            Offer New Peer Tutoring Session
          </h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          aria-label="Close form"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="ns-title" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Session Title / Topic <span className="text-red-400">*</span>
            </label>
            <input
              id="ns-title"
              {...register('title')}
              placeholder="e.g., Data Structures & Algorithms Practice"
              className={`h-10 w-full rounded-lg border bg-white dark:bg-gray-900 px-3 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/60 transition ${
                errors.title
                  ? 'border-red-400 dark:border-red-600'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            />
            {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
          </div>

          {/* Subject */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="ns-subject" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Subject Area <span className="text-red-400">*</span>
            </label>
            <select
              id="ns-subject"
              {...register('subject')}
              className="h-10 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/60 transition"
            >
              {SUBJECT_OPTIONS.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
            {errors.subject && <p className="text-xs text-red-500">{errors.subject.message}</p>}
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="ns-desc" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Description
          </label>
          <input
            id="ns-desc"
            {...register('description')}
            placeholder="Briefly describe what students will learn in this session"
            className="h-10 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/60 transition"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Rate per hour */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="ns-rate" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Rate ($/hour)
            </label>
            <input
              id="ns-rate"
              type="number"
              min={0}
              {...register('ratePerHour', { valueAsNumber: true })}
              className="h-10 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/60 transition"
            />
          </div>

          {/* Duration */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="ns-duration" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Duration (mins)
            </label>
            <input
              id="ns-duration"
              type="number"
              min={15}
              max={480}
              step={15}
              {...register('durationMinutes', { valueAsNumber: true })}
              className="h-10 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/60 transition"
            />
          </div>

          {/* Slots */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="ns-slots" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Available Slots
            </label>
            <input
              id="ns-slots"
              type="number"
              min={1}
              max={50}
              {...register('availableSlots', { valueAsNumber: true })}
              className="h-10 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/60 transition"
            />
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="ns-status" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Status
            </label>
            <select
              id="ns-status"
              {...register('status')}
              className="h-10 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/60 transition"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Notes */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="ns-notes" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Prerequisites / Session Notes
          </label>
          <textarea
            id="ns-notes"
            rows={2}
            {...register('notes')}
            placeholder="e.g., Bring laptop with VS Code and Node.js installed."
            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/60 transition resize-none"
          />
        </div>

        {/* Form actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting || createMutation.isPending}
            className="h-10 px-5 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {createMutation.isPending ? 'Publishing...' : 'Publish Tutoring Session'}
          </button>
          <button
            type="button"
            onClick={() => {
              reset();
              onClose();
            }}
            className="h-10 px-4 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

/* ── Main Page Component ───────────────────────────────────── */
export function SessionsPage() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const isTutor = user?.role === 'tutor';

  const [showNewForm, setShowNewForm] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [bookingSession, setBookingSession] = useState<ApiSession | null>(null);

  const { data: sessions = [], isPending, error } = useQuery<ApiSession[]>({
    queryKey: ['sessions', selectedSubject, selectedStatus, search],
    queryFn: () =>
      fetchSessions({
        subject: selectedSubject === 'all' ? undefined : selectedSubject,
        status: selectedStatus === 'all' ? undefined : selectedStatus,
        search: search.trim() || undefined,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      toast.success('Session deleted', 'The tutoring session was removed.');
    },
    onError: (err) => {
      toast.error('Delete failed', err instanceof Error ? err.message : undefined);
    },
  });

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200/80 dark:border-gray-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              Peer Tutoring Sessions
            </h1>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Browse available tutoring sessions, connect with student tutors, or offer sessions.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowNewForm((prev) => !prev)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.98] transition-all shadow-sm self-start md:self-auto"
        >
          {showNewForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span>{showNewForm ? 'Close Form' : isTutor ? 'Offer Tutoring Session' : 'Offer Session'}</span>
        </button>
      </div>

      {/* ── New Session Form Drawer ── */}
      {showNewForm && <NewSessionForm onClose={() => setShowNewForm(false)} />}

      {/* ── Search & Filter Controls ── */}
      <div className="glass-card p-4 rounded-2xl border border-gray-200/80 dark:border-gray-800 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search topic, subject, or tutor..."
              className="h-10 w-full pl-9 pr-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/60 transition"
            />
          </div>

          {/* Subject Filter */}
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="h-10 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/60 transition"
          >
            <option value="all">All Subjects</option>
            {SUBJECT_OPTIONS.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="h-10 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/60 transition"
          >
            <option value="all">All Statuses</option>
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Sessions Cards Grid ── */}
      {isPending ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <SessionCardSkeleton />
          <SessionCardSkeleton />
          <SessionCardSkeleton />
        </div>
      ) : error ? (
        <div className="glass-card p-6 rounded-2xl border border-rose-200 dark:border-rose-900/50 text-center text-rose-600 dark:text-rose-400">
          Failed to load tutoring sessions: {error instanceof Error ? error.message : 'Unknown error'}
        </div>
      ) : sessions.length === 0 ? (
        <div className="glass-card p-12 rounded-2xl border border-gray-200/80 dark:border-gray-800 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 mx-auto">
            <BookOpen className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              No tutoring sessions found
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
              {search || selectedSubject !== 'all' || selectedStatus !== 'all'
                ? 'Try adjusting your filters or search keywords.'
                : 'Be the first peer tutor to offer a session!'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowNewForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Session</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sessions.map((session) => {
            const tutorUser =
              typeof session.userId === 'object'
                ? session.userId
                : typeof session.tutorId === 'object'
                ? session.tutorId
                : null;
            const tutorName = tutorUser?.name || 'Peer Tutor';

            const isOwner =
              user?.id &&
              (session.userId === user.id ||
                (typeof session.userId === 'object' && (session.userId as any).id === user.id) ||
                (typeof session.userId === 'object' && (session.userId as any)._id === user.id));

            return (
              <div
                key={session.id}
                className="glass-card p-5 rounded-2xl border border-gray-200/80 dark:border-gray-800 flex flex-col justify-between hover:shadow-lg transition-all group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800">
                      {session.subject || 'General'}
                    </span>
                    <StatusBadge status={session.status} size="sm" />
                  </div>

                  <div>
                    <Link
                      to={`/sessions/${session.id}`}
                      className="font-bold text-gray-900 dark:text-white text-base leading-snug group-hover:text-primary transition-colors line-clamp-1"
                    >
                      {session.title}
                    </Link>
                    {session.description && (
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                        {session.description}
                      </p>
                    )}
                  </div>

                  {/* Tutor info */}
                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                    <User className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="font-medium truncate">{tutorName}</span>
                  </div>

                  {/* Meta specs */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 dark:border-gray-800/80 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1.5 font-semibold text-gray-900 dark:text-white">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                      <span>${session.ratePerHour ?? 20}/hr</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      <span>{formatDuration(session.durationMinutes)}</span>
                    </div>
                  </div>
                </div>

                {/* Card Action footer */}
                <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between gap-2">
                  <Link
                    to={`/sessions/${session.id}`}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    Details
                  </Link>

                  <div className="flex items-center gap-2">
                    {/* Delete button for session owner */}
                    {isOwner && (
                      <button
                        type="button"
                        onClick={() => deleteMutation.mutate(session.id)}
                        disabled={deleteMutation.isPending}
                        title="Delete Session"
                        className="p-1.5 text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}

                    {/* Book button for students / tutees */}
                    {!isOwner && (
                      <button
                        type="button"
                        onClick={() => setBookingSession(session)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition-colors inline-flex items-center gap-1.5 shadow-sm"
                      >
                        <CalendarCheck className="w-3.5 h-3.5" />
                        <span>Book Session</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Direct Booking Modal ── */}
      {bookingSession && (
        <BookModal session={bookingSession} onClose={() => setBookingSession(null)} />
      )}
    </div>
  );
}

export default SessionsPage;
