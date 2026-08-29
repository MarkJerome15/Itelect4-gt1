// src/pages/BookingsPage.tsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { ApiBooking } from '../types';
import { BookingStatus } from '../types';
import { BookingBadge } from '../components/BookingBadge';
import { fetchBookings, createBooking } from '../api/client';

export function BookingsPage() {
  const [sessionId, setSessionId] = useState<string>('');
  const queryClient = useQueryClient();

  // 1. READ -- useQuery
  const { data, isPending, isError } = useQuery<ApiBooking[]>({
    queryKey: ['bookings'],
    queryFn: fetchBookings,
  });

  // 2. WRITE -- useMutation
  const addBooking = useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      // Invalidate queries to trigger an immediate refetch
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      setSessionId('');
    },
  });

  const handleAdd = (): void => {
    if (!sessionId.trim()) return;
    addBooking.mutate({
      sessionId: Number(sessionId) || 101,
      tuteeId: 99,
      status: BookingStatus.Requested,
      scheduledAt: new Date().toISOString(),
    });
  };

  if (isPending) {
    return <div className="animate-pulse p-6">Loading bookings...</div>;
  }

  if (isError) {
    return (
      <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 text-red-700 dark:text-red-400">
        Could not load bookings.
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">My Bookings</h2>

      <div className="mb-6 flex gap-2">
        <input
          value={sessionId}
          onChange={(e) => setSessionId(e.target.value)}
          placeholder="Session ID (e.g. 101)..."
          className="w-full rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-2 text-gray-900 dark:text-white"
        />
        <button
          onClick={handleAdd}
          disabled={sessionId === '' || addBooking.isPending}
          className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 shrink-0"
        >
          {addBooking.isPending ? 'Saving...' : 'Add Booking'}
        </button>
      </div>

      {addBooking.isError && (
        <p className="mb-4 text-sm text-red-700 dark:text-red-400">
          {addBooking.error.message}
        </p>
      )}

      <div className="space-y-4">
        {(data ?? []).map((booking) => (
          <div key={booking.id}>
            <BookingBadge booking={booking}>
              <span>
                Session #{booking.sessionId} • Scheduled for: {new Date(booking.scheduledAt).toLocaleDateString()}
              </span>
            </BookingBadge>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BookingsPage;
