// src/pages/SessionDetailPage.tsx
// Comprehensive detail view for a Peer Tutoring session.
// Allows tutees to book the session and allows the tutor (owner) to edit or delete it.
// Professional UI with Lucide icons and zero emojis.

import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowLeft,
  User,
  CalendarCheck,
  Edit3,
  Trash2,
} from 'lucide-react';
import {
  fetchSessionById,
  updateSession,
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

function formatDuration(mins: number): string {
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h}h ${m}m` : `${h} hour${h > 1 ? 's' : ''}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

/* ── Inline Edit Form for Tutor ────────────────────────────── */
function EditForm({
  session,
  onCancel,
  onSaved,
}: {
  session: ApiSession;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<SessionFormValues>({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      title: session.title,
      subject: session.subject || 'General Tutoring',
      description: session.description || '',
      status: session.status,
      ratePerHour: session.ratePerHour ?? 20,
      durationMinutes: session.durationMinutes ?? 60,
      availableSlots: session.availableSlots ?? 1,
      notes: session.notes || '',
    },
  });

  const updateMutation = useMutation({
    mutationFn: (values: SessionFormValues) => updateSession(session.id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.invalidateQueries({ queryKey: ['sessions', session.id] });
      toast.success('Session updated', 'Changes saved successfully.');
      onSaved();
    },
    onError: (err) => {
      toast.error('Update failed', err instanceof Error ? err.message : undefined);
    },
  });

  return (
    <form onSubmit={handleSubmit((v) => updateMutation.mutate(v))} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="edit-title" className="text-xs font-semibold text-gray-700 dark:text-gray-300">
            Session Title <span className="text-red-400">*</span>
          </label>
          <input
            id="edit-title"
            {...register('title')}
            className="h-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/60"
          />
          {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
        </div>

        {/* Subject */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="edit-subject" className="text-xs font-semibold text-gray-700 dark:text-gray-300">
            Subject Area
          </label>
          <select
            id="edit-subject"
            {...register('subject')}
            className="h-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/60"
          >
            {SUBJECT_OPTIONS.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="edit-description" className="text-xs font-semibold text-gray-700 dark:text-gray-300">
          Description
        </label>
        <textarea
          id="edit-description"
          rows={2}
          {...register('description')}
          className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-2.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/60 resize-none"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Rate */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="edit-rate" className="text-xs font-semibold text-gray-700 dark:text-gray-300">
            Rate ($/hr)
          </label>
          <input
            id="edit-rate"
            type="number"
            min={0}
            {...register('ratePerHour', { valueAsNumber: true })}
            className="h-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/60"
          />
        </div>

        {/* Duration */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="edit-duration" className="text-xs font-semibold text-gray-700 dark:text-gray-300">
            Duration (min)
          </label>
          <input
            id="edit-duration"
            type="number"
            min={15}
            step={15}
            {...register('durationMinutes', { valueAsNumber: true })}
            className="h-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/60"
          />
        </div>

        {/* Slots */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="edit-slots" className="text-xs font-semibold text-gray-700 dark:text-gray-300">
            Slots
          </label>
          <input
            id="edit-slots"
            type="number"
            min={1}
            {...register('availableSlots', { valueAsNumber: true })}
            className="h-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/60"
          />
        </div>

        {/* Status */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="edit-status" className="text-xs font-semibold text-gray-700 dark:text-gray-300">
            Status
          </label>
          <select
            id="edit-status"
            {...register('status')}
            className="h-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/60"
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
        <label htmlFor="edit-notes" className="text-xs font-semibold text-gray-700 dark:text-gray-300">
          Prerequisites / Notes
        </label>
        <textarea
          id="edit-notes"
          rows={2}
          {...register('notes')}
          className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-2.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/60 resize-none"
        />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={!isDirty || isSubmitting || updateMutation.isPending}
          className="px-4 py-2 text-xs font-semibold bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
        >
          {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

/* ── Main Detail Component ─────────────────────────────────── */
export function SessionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const [isEditing, setIsEditing] = useState(false);
  const [scheduledAt, setScheduledAt] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(10, 0, 0, 0);
    return d.toISOString().slice(0, 16);
  });
  const [bookingNotes, setBookingNotes] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { data: session, isPending, error } = useQuery<ApiSession>({
    queryKey: ['sessions', id],
    queryFn: () => fetchSessionById(id!),
    enabled: Boolean(id),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteSession(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      toast.success('Session deleted', 'The tutoring session was removed.');
      navigate('/sessions');
    },
    onError: (err) => {
      toast.error('Delete failed', err instanceof Error ? err.message : undefined);
    },
  });

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setBookingLoading(true);
    try {
      await createBooking({
        sessionId: id,
        scheduledAt: new Date(scheduledAt).toISOString(),
        notes: bookingNotes.trim(),
      });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Booking requested', 'Your peer tutor will review your session request.');
      navigate('/bookings');
    } catch (err) {
      toast.error('Booking failed', err instanceof Error ? err.message : 'Could not book session');
    } finally {
      setBookingLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="glass-card p-8 rounded-2xl border border-gray-200 dark:border-gray-800 animate-pulse h-80" />
    );
  }

  if (error || !session) {
    return (
      <div className="glass-card p-8 rounded-2xl border border-gray-200 dark:border-gray-800 text-center space-y-4">
        <p className="text-gray-500">Tutoring session not found.</p>
        <Link to="/sessions" className="text-primary hover:underline text-sm font-semibold">
          ← Back to Sessions
        </Link>
      </div>
    );
  }

  const tutorUser =
    typeof session.userId === 'object'
      ? session.userId
      : typeof session.tutorId === 'object'
      ? session.tutorId
      : null;
  const tutorName = tutorUser?.name || 'Peer Tutor';
  const tutorEmail = tutorUser?.email || '';

  const isOwner =
    user?.id &&
    (session.userId === user.id ||
      (typeof session.userId === 'object' && (session.userId as any).id === user.id) ||
      (typeof session.userId === 'object' && (session.userId as any)._id === user.id));

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back button */}
      <div>
        <Link
          to="/sessions"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Sessions</span>
        </Link>
      </div>

      {/* Main card */}
      <div className="glass-card p-6 md:p-8 rounded-2xl border border-gray-200/80 dark:border-gray-800 space-y-6">
        {/* Header bar */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-gray-100 dark:border-gray-800">
          <div className="space-y-2 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800">
                {session.subject || 'General'}
              </span>
              <StatusBadge status={session.status} size="sm" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              {session.title}
            </h1>
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <User className="w-3.5 h-3.5" />
              <span>Tutor: {tutorName}</span>
              {tutorEmail && <span>• {tutorEmail}</span>}
            </div>
          </div>

          {/* Owner actions */}
          {isOwner && !isEditing && (
            <div className="flex items-center gap-2 self-start">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Session</span>
              </button>

              {confirmDelete ? (
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-rose-600 dark:text-rose-400 font-semibold">Delete?</span>
                  <button
                    type="button"
                    onClick={() => deleteMutation.mutate()}
                    className="px-2 py-1 bg-rose-600 text-white rounded text-xs font-bold"
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="px-2 py-1 text-gray-500 hover:text-gray-700 text-xs"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Edit mode or View mode */}
        {isEditing ? (
          <EditForm
            session={session}
            onCancel={() => setIsEditing(false)}
            onSaved={() => setIsEditing(false)}
          />
        ) : (
          <div className="space-y-6">
            {/* Specs row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 text-center">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Rate</p>
                <p className="text-base font-bold text-gray-900 dark:text-white mt-0.5">
                  ${session.ratePerHour ?? 20}/hr
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Duration</p>
                <p className="text-base font-bold text-gray-900 dark:text-white mt-0.5">
                  {formatDuration(session.durationMinutes)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Slots</p>
                <p className="text-base font-bold text-gray-900 dark:text-white mt-0.5">
                  {session.availableSlots ?? 1}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Status</p>
                <div className="mt-1 flex justify-center">
                  <StatusBadge status={session.status} size="sm" />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <h3 className="text-xs uppercase font-bold tracking-wider text-gray-400">
                Session Overview
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {session.description || 'No detailed description provided.'}
              </p>
            </div>

            {/* Prerequisites / Notes */}
            {session.notes && (
              <div className="space-y-1.5">
                <h3 className="text-xs uppercase font-bold tracking-wider text-gray-400">
                  Prerequisites & Materials
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/40 p-3 rounded-xl border border-gray-100 dark:border-gray-800 leading-relaxed">
                  {session.notes}
                </p>
              </div>
            )}

            {/* Timestamps */}
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-400 flex flex-wrap gap-4">
              <span>Listed: {formatDate(session.createdAt)}</span>
              <span>Updated: {formatDate(session.updatedAt)}</span>
            </div>

            {/* Student Booking Form (for tutees / non-owners) */}
            {!isOwner && (
              <div className="pt-6 border-t border-gray-200 dark:border-gray-800 space-y-4">
                <div className="flex items-center gap-2">
                  <CalendarCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <h2 className="text-base font-bold text-gray-900 dark:text-white">
                    Request This Tutoring Session
                  </h2>
                </div>

                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label
                        htmlFor="detail-datetime"
                        className="text-xs font-semibold text-gray-700 dark:text-gray-300"
                      >
                        Preferred Date & Time
                      </label>
                      <input
                        id="detail-datetime"
                        type="datetime-local"
                        required
                        value={scheduledAt}
                        onChange={(e) => setScheduledAt(e.target.value)}
                        className="h-10 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/60"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="detail-notes"
                        className="text-xs font-semibold text-gray-700 dark:text-gray-300"
                      >
                        Notes for Tutor (Topics or homework questions)
                      </label>
                      <input
                        id="detail-notes"
                        type="text"
                        value={bookingNotes}
                        onChange={(e) => setBookingNotes(e.target.value)}
                        placeholder="e.g., Focus on Chapter 4 review problems"
                        className="h-10 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/60"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-500 active:scale-[0.98] transition-all shadow-sm"
                  >
                    <CalendarCheck className="w-4 h-4" />
                    <span>{bookingLoading ? 'Submitting...' : 'Book Tutoring Session'}</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SessionDetailPage;
