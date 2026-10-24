// src/pages/DashboardPage.tsx
// Comprehensive Peer Tutoring Dashboard for Tutors and Tutees.
// Professional UI with Lucide icons and zero emojis.

import { Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import {
  BookOpen,
  CalendarCheck,
  Clock,
  ArrowRight,
  CheckCircle2,
  Calendar,
  GraduationCap,
} from 'lucide-react';
import {
  fetchSessions,
  fetchBookings,
  type ApiSession,
  type ApiBooking,
} from '../api/client';
import { useAuthStore } from '../store/authStore';
import { StatusBadge } from '../components/StatusBadge';

export function DashboardPage() {
  const { userName, user } = useAuthStore();
  const isTutor = user?.role === 'tutor';

  // Fetch sessions
  const { data: sessions, isPending: sessionsPending } = useQuery<ApiSession[]>({
    queryKey: ['sessions'],
    queryFn: () => fetchSessions(),
    staleTime: 30_000,
  });

  // Fetch bookings
  const { data: bookings, isPending: bookingsPending } = useQuery<ApiBooking[]>({
    queryKey: ['bookings'],
    queryFn: () => fetchBookings(),
    staleTime: 30_000,
  });

  const sessionList = sessions ?? [];
  const bookingList = bookings ?? [];

  // Metrics
  const requestedBookings = bookingList.filter((b) => b.status === 'requested').length;
  const confirmedBookings = bookingList.filter((b) => b.status === 'confirmed').length;
  const completedBookings = bookingList.filter((b) => b.status === 'completed').length;
  const activeSessions = sessionList.filter((s) => s.status === 'available' || s.status === 'planned').length;

  return (
    <div className="space-y-8">
      {/* ── Welcome Banner ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 text-white shadow-lg border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-wider text-indigo-400">
                {isTutor ? 'Peer Tutor Portal' : 'Student Tutee Portal'}
              </span>
              <StatusBadge status={user?.role || 'tutee'} size="sm" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Welcome, {userName ?? 'User'}
            </h1>
            <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
              {isTutor
                ? 'Manage your tutoring sessions, review student booking requests, and schedule one-on-one sessions.'
                : 'Browse verified peer tutors, request one-on-one sessions, and view your upcoming study bookings.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/sessions"
              className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-white text-slate-900 hover:bg-slate-100 transition-all inline-flex items-center gap-2 shadow-sm"
            >
              <BookOpen className="w-4 h-4" />
              <span>Browse Sessions</span>
            </Link>
            <Link
              to="/bookings"
              className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition-all inline-flex items-center gap-2 shadow-sm"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>My Bookings</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-xl border border-gray-200/80 dark:border-gray-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white leading-none">
              {sessionsPending ? '-' : activeSessions}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">
              Available Sessions
            </p>
          </div>
        </div>

        <div className="glass-card p-5 rounded-xl border border-gray-200/80 dark:border-gray-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white leading-none">
              {bookingsPending ? '-' : requestedBookings}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">
              Pending Requests
            </p>
          </div>
        </div>

        <div className="glass-card p-5 rounded-xl border border-gray-200/80 dark:border-gray-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-sky-600 dark:text-sky-400">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white leading-none">
              {bookingsPending ? '-' : confirmedBookings}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">
              Confirmed Bookings
            </p>
          </div>
        </div>

        <div className="glass-card p-5 rounded-xl border border-gray-200/80 dark:border-gray-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white leading-none">
              {bookingsPending ? '-' : completedBookings}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">
              Completed
            </p>
          </div>
        </div>
      </div>

      {/* ── Two Column Layout: Recent Sessions & Upcoming Bookings ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Sessions */}
        <div className="glass-card p-6 rounded-2xl border border-gray-200/80 dark:border-gray-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                Tutoring Sessions
              </h2>
            </div>
            <Link
              to="/sessions"
              className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {sessionList.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
              No tutoring sessions found.{' '}
              <Link to="/sessions" className="text-primary hover:underline font-medium">
                Create or browse sessions
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {sessionList.slice(0, 4).map((session) => (
                <Link
                  key={session.id}
                  to={`/sessions/${session.id}`}
                  className="p-3.5 rounded-xl border border-gray-100 dark:border-gray-800/80 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all block group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                          {session.subject || 'General'}
                        </span>
                        <StatusBadge status={session.status} size="sm" />
                      </div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-primary transition-colors">
                        {session.title}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        ${session.ratePerHour ?? 20}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">/hr</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Bookings Overview */}
        <div className="glass-card p-6 rounded-2xl border border-gray-200/80 dark:border-gray-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                Recent Bookings
              </h2>
            </div>
            <Link
              to="/bookings"
              className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
            >
              <span>Manage bookings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {bookingList.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
              No bookings yet.{' '}
              <Link to="/sessions" className="text-primary hover:underline font-medium">
                Book a peer tutoring session
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {bookingList.slice(0, 4).map((booking) => {
                const sessionObj = typeof booking.sessionId === 'object' ? booking.sessionId : null;
                const title = sessionObj?.title || 'Tutoring Session';
                const dateStr = new Date(booking.scheduledAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div
                    key={booking.id}
                    className="p-3.5 rounded-xl border border-gray-100 dark:border-gray-800/80 flex items-center justify-between gap-3"
                  >
                    <div className="space-y-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {title}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{dateStr}</span>
                      </div>
                    </div>
                    <StatusBadge status={booking.status} size="sm" />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
