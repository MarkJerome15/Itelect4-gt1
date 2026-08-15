// src/pages/SessionDetailPage.tsx
// Reads the session id from the URL, looks it up in mock data,
// and shows a "not found" message if it doesn't exist.
//
// KEY CONCEPT — why useParams always returns string | undefined:
// React Router can't guarantee at the TYPE level that a param exists.
// The user might type /sessions/ with no id, or the route might be
// misconfigured. TypeScript reflects this uncertainty by making every
// param value `string | undefined`. That's why the "not found" check
// is REQUIRED, not optional — it handles the undefined case.
//
// Uses useNavigate() for the "Back to Sessions" button instead of <Link>,
// because it's triggered from a click handler (programmatic navigation).

import { useParams, useNavigate } from 'react-router';
import { MOCK_SESSIONS, MOCK_TUTORS } from '../data/mockData';

export function SessionDetailPage() {
  // The generic <{ id: string }> tells TS what params to expect,
  // but each value is still string | undefined at runtime.
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Convert the string param to a number and look it up.
  const session = MOCK_SESSIONS.find((s) => s.id === Number(id));

  // If the id is missing or doesn't match any session, show a styled message.
  if (!session) {
    return (
      <div className="text-center py-16">
        <h1 className="text-4xl font-bold text-red-600 dark:text-red-400 mb-4">
          Session Not Found
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          No session exists with id &quot;{id ?? 'undefined'}&quot;.
        </p>
        {/* useNavigate inside a handler — not during render.
            Calling navigate() directly in the component body (outside a handler)
            would fire on every render → state update → re-render → infinite loop. */}
        <button
          onClick={() => navigate('/sessions')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
        >
          Back to Sessions
        </button>
      </div>
    );
  }

  // Look up the tutor name for display.
  const tutor = MOCK_TUTORS.find((t) => t.id === session.tutorId);

  return (
    <>
      <button
        onClick={() => navigate('/sessions')}
        className="mb-6 px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
      >
        ← Back to Sessions
      </button>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-4">{session.subject}</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500 dark:text-gray-400">Tutor</span>
            <p className="font-semibold">{tutor?.name ?? 'Unknown Tutor'}</p>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Rate</span>
            <p className="font-semibold">${session.ratePerHour}/hr</p>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Available Slots</span>
            <p className="font-semibold">{session.availableSlots}</p>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Session ID</span>
            <p className="font-semibold">{session.id}</p>
          </div>
        </div>
      </div>
    </>
  );
}
