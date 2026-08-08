import React from 'react';
import type { TutoringSession } from '../types';

interface SessionCardProps {
  session: TutoringSession;
  variant?: "default" | "compact";
}

export const SessionCard: React.FC<SessionCardProps> = ({ session, variant = "default" }) => {
  const isCompact = variant === "compact";

  return (
    <div className={`border border-blue-600 dark:border-blue-400 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 flex flex-col ${isCompact ? 'p-3' : 'p-5 gap-2'}`}>
      <h4 className={`font-semibold ${isCompact ? 'text-sm' : 'text-base'}`}>{session.subject}</h4>
      {!isCompact && <p className="text-sm text-gray-600 dark:text-gray-400">Rate: ${session.ratePerHour}/hr</p>}
      <p className={`text-gray-600 dark:text-gray-400 ${isCompact ? 'text-xs mt-1' : 'text-sm'}`}>Available Slots: {session.availableSlots}</p>
    </div>
  );
};
