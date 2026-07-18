import React from 'react';
import type { User } from '../types';

// Explicit Props interface built from our actual User type.
// This guarantees that whoever uses <TutorCard /> MUST pass a valid 'User' object.
interface TutorCardProps {
  tutor: User;
  // A typed callback prop: a function passed from parent to child that takes a 'User' and returns nothing.
  onSelect: (tutor: User) => void;
}

export const TutorCard: React.FC<TutorCardProps> = ({ tutor, onSelect }) => {
  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem', borderRadius: '8px', maxWidth: '300px' }}>
      <h3>{tutor.name}</h3>
      <p>Email: {tutor.email}</p>
      <p>Status: {tutor.isActive ? '🟢 Active' : '🔴 Inactive'}</p>
      
      {/* Typed onClick using React.MouseEvent. 
          HTMLButtonElement tells React exactly what kind of DOM element was clicked. */}
      <button 
        style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
        onClick={(_e: React.MouseEvent<HTMLButtonElement>) => onSelect(tutor)}
      >
        Select Tutor
      </button>
    </div>
  );
};
