// src/pages/BookingsPage.tsx
// Renders BookingBadge components with mock booking data.
// This page is protected by ProtectedRoute in the route table —
// the protection logic is NOT in this component, it's configured
// in App.tsx as a parent <Route element={<ProtectedRoute />}>.

import { BookingBadge } from '../components/BookingBadge';
import { MOCK_BOOKINGS } from '../data/mockData';

export function BookingsPage() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>

      <div className="space-y-4">
        {MOCK_BOOKINGS.map((booking) => (
          <BookingBadge key={booking.id} booking={booking}>
            <span>Scheduled for: {booking.scheduledAt.toLocaleDateString()}</span>
          </BookingBadge>
        ))}
      </div>
    </>
  );
}
