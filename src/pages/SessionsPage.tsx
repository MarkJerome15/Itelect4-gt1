// src/pages/SessionsPage.tsx
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import type { ApiTutoringSession } from '../types';
import { SessionCard } from '../components/SessionCard';
import { usePrevious } from '../hooks/usePrevious';
import { useUiStore } from '../store/uiStore';
import { fetchSessions } from '../api/client';

export function SessionsPage() {
  // These four lines replace ALL of Session 6's fetching state
  const { data, isPending, isError, error } = useQuery<ApiTutoringSession[]>({
    queryKey: ['sessions'],
    queryFn: fetchSessions,
  });

  // The search box now reads and writes the store, not local state
  const searchTerm = useUiStore((state) => state.searchTerm);
  const setSearchTerm = useUiStore((state) => state.setSearchTerm);
  const previousSearch = usePrevious(searchTerm);

  if (isPending) {
    return <div className="animate-pulse p-6">Loading sessions...</div>;
  }

  if (isError) {
    return (
      <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 text-red-700 dark:text-red-400">
        {error.message} -- is json-server running on port 3001?
      </div>
    );
  }

  // Below this line data is ApiTutoringSession[], never undefined
  const filteredSessions = (data ?? []).filter((s) =>
    s.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Tutoring Sessions</h2>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search sessions..."
        className="w-full rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-2 text-gray-900 dark:text-white"
      />
      {previousSearch !== undefined && previousSearch !== searchTerm && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Previous search: &quot;{previousSearch}&quot;
        </p>
      )}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredSessions.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 col-span-full">
            No sessions match &quot;{searchTerm}&quot;.
          </p>
        ) : (
          filteredSessions.map((session) => (
            <Link
              key={session.id}
              to={`/sessions/${session.id}`}
              className="block hover:ring-2 hover:ring-blue-500 rounded-lg transition-all"
            >
              <SessionCard session={session} />
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default SessionsPage;
