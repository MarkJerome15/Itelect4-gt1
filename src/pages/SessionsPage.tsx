// src/pages/SessionsPage.tsx
// The search/filter/grid logic MOVED here from App.tsx.
// Each SessionCard is wrapped in a <Link> so clicking it navigates to the detail page.
//
// Uses:
// - useState for sessions, isLoading, isError, searchTerm
// - useEffect with setTimeout to simulate an async fetch
// - useRef for the search input (focus without re-renders)
// - usePrevious to display the previous search term
// - Responsive grid: sm:grid-cols-2 lg:grid-cols-3

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import type { TutoringSession } from '../types';
import { SessionCard } from '../components/SessionCard';
import { usePrevious } from '../hooks/usePrevious';
import { MOCK_SESSIONS } from '../data/mockData';

export function SessionsPage() {
  const [sessions, setSessions] = useState<TutoringSession[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Simulate an async data fetch on mount.
  useEffect(() => {
    const timerId = setTimeout(() => {
      setSessions(MOCK_SESSIONS);
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timerId);
  }, []);

  // useRef — gives us a handle to the DOM input without triggering re-renders.
  const searchInputRef = useRef<HTMLInputElement>(null);

  const focusSearchInput = (): void => {
    searchInputRef.current?.focus();
  };

  // Typed onChange handler — React.ChangeEvent<HTMLInputElement>
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  };

  // Derived state — not stored in useState, computed on every render.
  const filteredSessions: TutoringSession[] = sessions.filter((s) =>
    s.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // usePrevious tracks the search term from the *previous* render.
  const previousSearch = usePrevious<string>(searchTerm);

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Tutoring Sessions</h1>

      {/* ===== SEARCH ===== */}
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
            Previous search: &quot;{previousSearch}&quot;
          </p>
        )}
      </section>

      {/* ===== SESSION GRID ===== */}
      <section className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <h2 className="text-xl font-semibold">Available Sessions</h2>
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
              <div
                key={skeleton}
                className="border border-gray-200 dark:border-gray-700 p-5 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse h-28"
              >
                <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : filteredSessions.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            No sessions match &quot;{searchTerm}&quot;.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSessions.map((session) => (
              /* Each card links to /sessions/:id for the detail view.
                 We use <Link> here (not useNavigate) because this is
                 a static navigational element in JSX. */
              <Link
                key={session.id}
                to={`/sessions/${session.id}`}
                className="block hover:ring-2 hover:ring-blue-500 rounded-lg transition-all"
              >
                <SessionCard session={session} />
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
