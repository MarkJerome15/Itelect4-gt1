// src/pages/DashboardPage.tsx
// The landing page — renders tutor cards with the selected-tutor pattern
// and the "show details" toggle, both moved here from App.tsx.

import { useState } from 'react';
import type { User } from '../types';
import { TutorCard } from '../components/TutorCard';
import { useToggle } from '../hooks/useToggle';
import { MOCK_TUTORS } from '../data/mockData';

export function DashboardPage() {
  const [selectedTutor, setSelectedTutor] = useState<User | null>(null);
  const [showDetails, toggleDetails] = useToggle(false);

  return (
    <>
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Welcome to the Peer Tutoring Platform
      </p>

      {/* ===== AVAILABLE TUTORS ===== */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Available Tutors</h2>

        {selectedTutor !== null && (
          <div className="mb-4 inline-block px-4 py-2 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300 rounded">
            Selected: <span className="font-semibold">{selectedTutor.name}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_TUTORS.map((tutor) => (
            <TutorCard key={tutor.id} tutor={tutor} onSelect={setSelectedTutor} />
          ))}
        </div>
      </section>

      {/* ===== EXTRA DETAILS (useToggle demo) ===== */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Extra Details</h2>
        <button
          onClick={toggleDetails}
          className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded mb-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>

        {showDetails && (
          <div className="p-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded">
            <p className="font-semibold mb-2">Platform Info</p>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700 dark:text-gray-300">
              <li>Sessions are loaded asynchronously via useEffect + setTimeout.</li>
              <li>Search filtering is a derived value – not stored in state.</li>
              <li>useRef tracks the search input without causing extra renders.</li>
              <li>usePrevious uses a ref + effect to remember the last search term.</li>
            </ul>
          </div>
        )}
      </section>
    </>
  );
}
