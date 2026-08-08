import React from 'react';
import type { Booking } from '../types';

interface BookingBadgeProps {
  booking: Booking;
  children?: React.ReactNode; 
}

export const BookingBadge: React.FC<BookingBadgeProps> = ({ booking, children }) => {
  let badgeClasses = "";
  if (booking.status === 'confirmed') {
    badgeClasses = "bg-green-600 text-white dark:bg-green-700";
  } else if (booking.status === 'completed') {
    badgeClasses = "bg-gray-500 text-white dark:bg-gray-600";
  } else {
    badgeClasses = "bg-yellow-400 text-black dark:bg-yellow-500";
  }

  return (
    <div className={`p-3 rounded inline-block ${badgeClasses}`}>
      <span className="font-semibold">Booking #{booking.id}</span> - {booking.status.toUpperCase()}
      
      {children && (
        <div className="mt-2 pt-2 text-sm border-t border-black/10 dark:border-white/10">
          {children}
        </div>
      )}
    </div>
  );
};
