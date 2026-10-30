// src/test/BookingBadge.test.tsx
// Test 1 (Component): BookingBadge renders the booking ID and status correctly.
// This checks what a user sees in the UI, not the internal implementation.

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BookingBadge } from '../components/BookingBadge';
import type { ApiBooking } from '../types';
import { BookingStatus } from '../types';

// Sample booking data matching the ApiBooking shape from src/types/index.ts
const confirmedBooking: ApiBooking = {
  id: 'booking-001',
  _id: 'booking-001',
  sessionId: 'session-abc',
  tuteeId: 1,
  status: BookingStatus.Confirmed,
  scheduledAt: '2026-10-30T10:00:00Z',
};

const pendingBooking: ApiBooking = {
  id: 'booking-002',
  _id: 'booking-002',
  sessionId: 'session-abc',
  tuteeId: 1,
  status: BookingStatus.Requested,
  scheduledAt: '2026-10-31T10:00:00Z',
};

describe('BookingBadge', () => {
  it('shows the booking ID and CONFIRMED status', () => {
    render(<BookingBadge booking={confirmedBooking} />);

    // The component renders "Booking #<id> - <STATUS>"
    expect(screen.getByText(/Booking #booking-001/i)).toBeInTheDocument();
    expect(screen.getByText(/CONFIRMED/i)).toBeInTheDocument();
  });

  it('shows REQUESTED status for a pending booking', () => {
    render(<BookingBadge booking={pendingBooking} />);

    expect(screen.getByText(/Booking #booking-002/i)).toBeInTheDocument();
    expect(screen.getByText(/REQUESTED/i)).toBeInTheDocument();
  });

  it('renders optional children inside the badge', () => {
    render(
      <BookingBadge booking={confirmedBooking}>
        <span>Extra booking info</span>
      </BookingBadge>
    );

    expect(screen.getByText('Extra booking info')).toBeInTheDocument();
  });
});
