// src/pages/BookingsPage.tsx
// Management page for Peer Tutoring Bookings (requested, confirmed, completed, cancelled).
// Supports role-specific workflows for Tutors (confirm, complete, cancel) and Tutees (request, view, cancel).
// Pure professional UI with Lucide icons and zero emojis.

import { useState } from 'react';
import { Link } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CalendarCheck,
  User,
  Check,
  X,
  Calendar,
  BookOpen,
  CheckCircle2,
} from 'lucide-react';
import {
  fetchBookings,
  updateBookingStatus,
  type ApiBooking,
  type BookingStatus,
} from '../api/client';
import { useAuthStore } from '../store/authStore';
import { StatusBadge } from '../components/StatusBadge';
import { toast } from '../store/toastStore';

type FilterTab = 'all' | 'requested' | 'confirmed' | 'completed' | 'cancelled';

export function BookingsPage() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const isTutor = user?.role === 'tutor';
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  const { data: bookings = [], isPending, error } = useQuery<ApiBooking[]>({
    queryKey: ['bookings', activeTab],
    queryFn: () => fetchBookings({ status: activeTab === 'all' ? undefined : activeTab }),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: BookingStatus }) =>
      updateBookingStatus(id, { status }),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      const label =
        vars.status === 'confirmed'
          ? 'Booking confirmed'
          : vars.status === 'completed'
          ? 'Booking marked as completed'
          : 'Booking cancelled';
      toast.success(label, 'Status updated successfully.');
    },
    onError: (err) => {
      toast.error('Update failed', err instanceof Error ? err.message : undefined);
    },
  });

  const handleUpdateStatus = (id: string, status: BookingStatus) => {
    updateStatusMutation.mutate({ id, status });
  };

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200/80 dark:border-gray-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              {isTutor ? 'Tutoring Booking Requests' : 'My Tutoring Bookings'}
            </h1>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {isTutor
              ? 'Review, confirm, and manage student bookings for your peer tutoring sessions.'
              : 'Track the status of your booked tutoring sessions and scheduled appointments.'}
          </p>
        </div>

        <Link
          to="/sessions"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-all self-start md:self-auto shadow-sm"
        >
          <BookOpen className="w-4 h-4" />
          <span>Browse Tutoring Sessions</span>
        </Link>
      </div>

      {/* ── Tabs Filter ── */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-gray-100 dark:bg-gray-800/80 rounded-xl max-w-fit">
        {(
          [
            { id: 'all', label: 'All Bookings' },
            { id: 'requested', label: 'Requested' },
            { id: 'confirmed', label: 'Confirmed' },
            { id: 'completed', label: 'Completed' },
            { id: 'cancelled', label: 'Cancelled' },
          ] as { id: FilterTab; label: string }[]
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      {isPending ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="glass-card p-5 rounded-xl border border-gray-200 dark:border-gray-800 animate-pulse h-28"
            />
          ))}
        </div>
      ) : error ? (
        <div className="glass-card p-6 rounded-xl border border-rose-200 dark:border-rose-900/50 text-center text-rose-600 dark:text-rose-400">
          Failed to load bookings: {error instanceof Error ? error.message : 'Unknown error'}
        </div>
      ) : bookings.length === 0 ? (
        <div className="glass-card p-12 rounded-2xl border border-gray-200/80 dark:border-gray-800 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 mx-auto">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              No bookings in this category
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
              {isTutor
                ? 'When students book your tutoring sessions, their requests will appear here.'
                : 'You have not booked any tutoring sessions matching this filter yet.'}
            </p>
          </div>
          {!isTutor && (
            <Link
              to="/sessions"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-all"
            >
              <BookOpen className="w-4 h-4" />
              <span>Find a Peer Tutor</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const session = typeof booking.sessionId === 'object' ? booking.sessionId : null;
            const tutee = typeof booking.tuteeId === 'object' ? booking.tuteeId : null;
            const tutor = typeof booking.tutorId === 'object' ? booking.tutorId : null;

            const scheduledDate = new Date(booking.scheduledAt).toLocaleDateString(undefined, {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={booking.id}
                className="glass-card p-5 rounded-2xl border border-gray-200/80 dark:border-gray-800 hover:shadow-md transition-shadow space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800">
                        {session?.subject || 'Tutoring'}
                      </span>
                      <StatusBadge status={booking.status} size="sm" />
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                      {session?.title || 'Tutoring Session'}
                    </h3>
                  </div>

                  {session?.ratePerHour !== undefined && (
                    <div className="text-sm font-bold text-gray-900 dark:text-white shrink-0 sm:text-right">
                      ${session.ratePerHour}/hr
                      <span className="block text-xs font-normal text-gray-500 dark:text-gray-400">
                        {session.durationMinutes ?? 60} mins
                      </span>
                    </div>
                  )}
                </div>

                {/* Details Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-3 border-t border-gray-100 dark:border-gray-800/80 text-xs text-gray-600 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                    <span className="font-medium">{scheduledDate}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400 shrink-0" />
                    <span>
                      {isTutor
                        ? `Student: ${tutee?.name || 'Tutee'} (${tutee?.email || 'N/A'})`
                        : `Tutor: ${tutor?.name || 'Peer Tutor'}`}
                    </span>
                  </div>

                  {booking.notes && (
                    <div className="sm:col-span-2 md:col-span-1 italic text-gray-500 dark:text-gray-400 truncate">
                      Notes: "{booking.notes}"
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-800/60">
                  {/* Tutor actions */}
                  {isTutor && booking.status === 'requested' && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                        disabled={updateStatusMutation.isPending}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-500 transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Confirm Request</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                        disabled={updateStatusMutation.isPending}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Decline</span>
                      </button>
                    </>
                  )}

                  {isTutor && booking.status === 'confirmed' && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(booking.id, 'completed')}
                        disabled={updateStatusMutation.isPending}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark Completed</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                        disabled={updateStatusMutation.isPending}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Cancel</span>
                      </button>
                    </>
                  )}

                  {/* Tutee actions */}
                  {!isTutor &&
                    (booking.status === 'requested' || booking.status === 'confirmed') && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                        disabled={updateStatusMutation.isPending}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Cancel Booking</span>
                      </button>
                    )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default BookingsPage;
