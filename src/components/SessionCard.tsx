import React from 'react';
import type { TutoringSession } from '../types';

// Explicit Props interface built from our TutoringSession type.
interface SessionCardProps {
  session: TutoringSession;
}

export const SessionCard: React.FC<SessionCardProps> = ({ session }) => {
  return (
    <div style={{ border: '1px solid #007bff', padding: '1rem', margin: '1rem', borderRadius: '8px', maxWidth: '300px' }}>
      <h4 style={{ margin: '0 0 10px 0' }}>📘 {session.subject}</h4>
      <p style={{ margin: '5px 0' }}>Rate: ${session.ratePerHour}/hr</p>
      <p style={{ margin: '5px 0' }}>Available Slots: {session.availableSlots}</p>
    </div>
  );
};
