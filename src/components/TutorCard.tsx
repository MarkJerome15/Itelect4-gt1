import React from 'react';
import type { User } from '../types';

interface TutorCardProps {
  tutor: User;
  onSelect: (tutor: User) => void;
}

export const TutorCard: React.FC<TutorCardProps> = ({ tutor, onSelect }) => {
  return (
    <div className="border border-gray-300 dark:border-gray-700 p-4 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 flex flex-col gap-2">
      <h3 className="font-semibold text-lg">{tutor.name}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">Email: {tutor.email}</p>
      <p className="text-sm">Status: {tutor.isActive ? 'Active' : 'Inactive'}</p>
      
      <button 
        className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded transition-colors"
        onClick={(_e: React.MouseEvent<HTMLButtonElement>) => onSelect(tutor)}
      >
        Select Tutor
      </button>
    </div>
  );
};
