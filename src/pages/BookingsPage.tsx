// src/pages/BookingsPage.tsx -- the finished file
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ApiBooking, ApiTutoringSession } from '../types';
import { BookingStatus } from '../types';
import { bookingSchema, type BookingFormValues } from '../schemas/bookingSchema';
import { BookingBadge } from '../components/BookingBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { fetchBookings, createBooking, fetchSessions } from '../api/client';

export function BookingsPage() {
  const queryClient = useQueryClient();

  // useForm holds the values, runs the schema, and stores the errors.
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    mode: 'onBlur',
    defaultValues: { sessionId: '', notes: '' },
  });

  // Same queryKey as SessionsPage, so this list comes out of the cache.
  const sessions = useQuery<ApiTutoringSession[]>({
    queryKey: ['sessions'],
    queryFn: fetchSessions,
  });

  const { data, isPending, isError } = useQuery<ApiBooking[]>({
    queryKey: ['bookings'],
    queryFn: fetchBookings,
  });

  const addBooking = useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      reset(); // clears every field at once
    },
  });

  // handleSubmit only calls this after the schema passes.
  const onSubmit = (values: BookingFormValues): void => {
    addBooking.mutate({
      sessionId: Number(values.sessionId),
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

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mb-6 grid gap-4 rounded-lg border border-gray-200 p-4 dark:border-gray-700 bg-white dark:bg-gray-800"
      >
        <div className="grid gap-1.5">
          <Label htmlFor="sessionId" className="text-foreground">
            Tutoring Session
          </Label>
          <select
            id="sessionId"
            {...register('sessionId')}
            className="h-8 rounded-lg border border-input bg-background px-2.5 text-sm text-foreground"
          >
            <option value="">Select a session...</option>
            {sessions.data?.map((s) => (
              <option key={s.id} value={s.id}>
                {s.subject} (${s.ratePerHour}/hr)
              </option>
            ))}
          </select>
          {errors.sessionId && (
            <p className="text-sm text-red-600">{errors.sessionId.message}</p>
          )}
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="notes" className="text-foreground">
            Study Topic / Goal
          </Label>
          <Input
            id="notes"
            {...register('notes')}
            aria-invalid={errors.notes ? true : undefined}
            placeholder="e.g., Exam preparation for Linear Algebra"
          />
          {errors.notes && (
            <p className="text-sm text-red-600">{errors.notes.message}</p>
          )}
        </div>

        {/* Never disabled on "invalid": clicking it is what shows the
            error messages. Only a save in flight disables it. */}
        <Button
          type="submit"
          disabled={addBooking.isPending}
          className="justify-self-start"
        >
          {addBooking.isPending ? 'Saving...' : 'Add Booking'}
        </Button>
      </form>

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
                Session #{booking.sessionId} • Scheduled for:{' '}
                {new Date(booking.scheduledAt).toLocaleDateString()}
              </span>
            </BookingBadge>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BookingsPage;
