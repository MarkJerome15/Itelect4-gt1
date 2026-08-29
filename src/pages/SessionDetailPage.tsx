// src/pages/SessionDetailPage.tsx
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router';
import type { ApiTutoringSession } from '../types';
import { fetchSessionById } from '../api/client';
import { MOCK_TUTORS } from '../data/mockData';

export function SessionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isPending, isError, error } = useQuery<ApiTutoringSession>({
    queryKey: ['sessions', id],
    queryFn: () => fetchSessionById(id!),
    enabled: id !== undefined,
  });

  if (isPending) {
    return <div className="animate-pulse p-6">Loading session...</div>;
  }

  if (isError || !data) {
    return (
      <div className="text-center py-16">
        <div className="mb-4 inline-block rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 text-red-700 dark:text-red-400">
          {error?.message || 'Could not load that session'}
        </div>
        <div>
          <button
            onClick={() => navigate('/sessions')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            Back to Sessions
          </button>
        </div>
      </div>
    );
  }

  const tutor = MOCK_TUTORS.find((t) => t.id === data.tutorId);

  return (
    <>
      <button
        onClick={() => navigate('/sessions')}
        className="mb-6 px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
      >
        ← Back to Sessions
      </button>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-4">{data.subject}</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500 dark:text-gray-400">Tutor</span>
            <p className="font-semibold">{tutor?.name ?? 'Unknown Tutor'}</p>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Rate</span>
            <p className="font-semibold">${data.ratePerHour}/hr</p>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Available Slots</span>
            <p className="font-semibold">{data.availableSlots}</p>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Session ID</span>
            <p className="font-semibold">{data.id}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default SessionDetailPage;
