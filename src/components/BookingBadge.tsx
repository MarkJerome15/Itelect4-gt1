import React from 'react';
import type { Booking } from '../types';

// Explicit Props interface built from our Booking type.
interface BookingBadgeProps {
  booking: Booking;
  // 'children' is a special React prop type that allows passing nested HTML/JSX inside this component.
  children?: React.ReactNode; 
}

export const BookingBadge: React.FC<BookingBadgeProps> = ({ booking, children }) => {
  // Determine badge color dynamically based on our BookingStatus enum
  const badgeColor = booking.status === 'confirmed' ? '#28a745' : 
                     booking.status === 'completed' ? '#6c757d' : '#ffc107';

  return (
    <div style={{ 
      padding: '0.75rem', 
      margin: '1rem', 
      backgroundColor: badgeColor, 
      color: booking.status === 'requested' ? 'black' : 'white', 
      display: 'inline-block', 
      borderRadius: '4px' 
    }}>
      <strong>Booking #{booking.id}</strong> - {booking.status.toUpperCase()}
      
      {/* If the parent component passed any children (like a date or extra text), render it here! */}
      {children && (
        <div style={{ marginTop: '0.5rem', fontSize: '0.9em', borderTop: '1px solid rgba(255,255,255,0.3)', paddingTop: '0.5rem' }}>
          {children}
        </div>
      )}
    </div>
  );
};
