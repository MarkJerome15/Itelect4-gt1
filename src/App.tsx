import React, { useState, useEffect, useRef } from 'react';
import type { User, TutoringSession, Booking } from './types';
import { UserRole, BookingStatus } from './types';
import { TutorCard } from './components/TutorCard';
import { SessionCard } from './components/SessionCard';
import { BookingBadge } from './components/BookingBadge';
import { useToggle } from './hooks/useToggle';
import { usePrevious } from './hooks/usePrevious';

const MOCK_TUTORS: User[] = [
  { id: 1, name: 'Alice Math', email: 'alice@tutor.com', role: UserRole.Tutor, isActive: true },
  { id: 2, name: 'Bob Science', email: 'bob@tutor.com', role: UserRole.Tutor, isActive: true },
  { id: 3, name: 'Carol History', email: 'carol@tutor.com', role: UserRole.Tutor, isActive: false },
];

const MOCK_SESSIONS: TutoringSession[] = [
  { id: 101, tutorId: 1, subject: 'Calculus 101', ratePerHour: 25, availableSlots: 5 },
  { id: 102, tutorId: 1, subject: 'Linear Algebra', ratePerHour: 30, availableSlots: 3 },
  { id: 103, tutorId: 2, subject: 'Physics Mechanics', ratePerHour: 28, availableSlots: 2 },
  { id: 104, tutorId: 2, subject: 'Chemistry Basics', ratePerHour: 22, availableSlots: 4 },
  { id: 105, tutorId: 3, subject: 'World History', ratePerHour: 20, availableSlots: 6 },
];

const SAMPLE_BOOKING: Booking = {
  id: 1001,
  sessionId: 101,
  tuteeId: 99,
  status: BookingStatus.Confirmed,
  scheduledAt: new Date('2026-08-01T10:00:00Z'),
};

function App() {
  const [selectedTutor, setSelectedTutor] = useState<User | null>(null);
  const [sessions, setSessions] = useState<TutoringSession[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const [isDarkMode, toggleDarkMode] = useToggle(false);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setSessions(MOCK_SESSIONS);
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timerId);
  }, []);

  const searchInputRef = useRef<HTMLInputElement>(null);

  const focusSearchInput = (): void => {
    searchInputRef.current?.focus();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  };

  const filteredSessions: TutoringSession[] = sessions.filter((s) =>
    s.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [showDetails, toggleDetails] = useToggle(false);
  const previousSearch = usePrevious<string>(searchTerm);

  return (
    <div className={`${isDarkMode ? 'dark' : ''} min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors`}>
      <div className="max-w-5xl mx-auto p-6 font-sans text-gray-900 dark:text-gray-100">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Peer Tutoring Platform</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">GT2 Part 3 - Tailwind CSS & Dark Mode</p>
          </div>
          <button 
            onClick={toggleDarkMode}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Toggle {isDarkMode ? 'Light' : 'Dark'} Mode
          </button>
        </header>

        <hr className="border-gray-300 dark:border-gray-700 mb-8" />

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Search Sessions</h2>
          <div className="flex gap-2 items-center">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Filter by subject..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={focusSearchInput}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              Focus Input
            </button>
          </div>

          {previousSearch !== undefined && previousSearch !== searchTerm && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Previous search: "{previousSearch}"
            </p>
          )}
        </section>

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

        <section className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-xl font-semibold">Tutoring Sessions</h2>
            <button 
              onClick={() => setIsError(!isError)}
              className="text-sm px-3 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
            >
              Simulate Error
            </button>
          </div>

          {isError ? (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-400 rounded-lg">
              <h3 className="font-semibold mb-1">Failed to load sessions</h3>
              <p className="text-sm">Please check your connection and try again.</p>
            </div>
          ) : isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((skeleton) => (
                <div key={skeleton} className="border border-gray-200 dark:border-gray-700 p-5 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse h-28">
                  <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          ) : filteredSessions.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No sessions match "{searchTerm}".</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSessions.map((session) => (
                <SessionCard key={session.id} session={session} />
              ))}
            </div>
          )}
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">My Bookings</h2>
          <BookingBadge booking={SAMPLE_BOOKING}>
            <span>Scheduled for: {SAMPLE_BOOKING.scheduledAt.toLocaleDateString()}</span>
          </BookingBadge>
        </section>

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
                <li>Search filtering is a derived value - not stored in state.</li>
                <li>useRef tracks the search input without causing extra renders.</li>
                <li>usePrevious uses a ref + effect to remember the last search term.</li>
              </ul>
            </div>
          )}
        </section>

      </div>
    </div>
  );
}

export default App;