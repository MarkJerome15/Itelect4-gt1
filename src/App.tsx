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
  const [searchTerm, setSearchTerm] = useState<string>('');

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
    <div style={{ fontFamily: 'sans-serif', padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <h1>📚 Peer Tutoring Platform</h1>
      <p style={{ color: '#555' }}>GT2 Part 2 — useState · useEffect · useRef · Custom Hooks</p>
      <hr />

      <section>
        <h2>🔍 Search Sessions</h2>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Filter by subject…"
            value={searchTerm}
            onChange={handleSearchChange}
            style={{ padding: '0.4rem 0.8rem', fontSize: '1rem', borderRadius: '4px', border: '1px solid #aaa', width: '260px' }}
          />
          <button
            onClick={focusSearchInput}
            style={{ padding: '0.4rem 0.8rem', cursor: 'pointer', borderRadius: '4px', border: '1px solid #007bff', background: '#007bff', color: '#fff' }}
          >
            Focus Input
          </button>
        </div>

        {previousSearch !== undefined && previousSearch !== searchTerm && (
          <p style={{ color: '#888', fontSize: '0.85rem', marginTop: '0.4rem' }}>
            ↩ Previous search: <em>"{previousSearch}"</em>
          </p>
        )}
      </section>

      <hr />

      <section>
        <h2>👩‍🏫 Available Tutors</h2>

        {selectedTutor !== null && (
          <p style={{ background: '#d4edda', border: '1px solid #c3e6cb', borderRadius: '4px', padding: '0.5rem 1rem', display: 'inline-block', marginBottom: '0.5rem' }}>
            ✅ Selected: <strong>{selectedTutor.name}</strong>
          </p>
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {MOCK_TUTORS.map((tutor) => (
            <TutorCard key={tutor.id} tutor={tutor} onSelect={setSelectedTutor} />
          ))}
        </div>
      </section>

      <hr />

      <section>
        <h2>ℹ️ Extra Details</h2>
        <button
          onClick={toggleDetails}
          style={{ padding: '0.4rem 1rem', cursor: 'pointer', borderRadius: '4px', marginBottom: '0.5rem' }}
        >
          {showDetails ? '▲ Hide Details' : '▼ Show Details'}
        </button>
        {showDetails && (
          <div style={{ background: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '4px', padding: '1rem' }}>
            <p><strong>Platform Info</strong></p>
            <ul>
              <li>Sessions are loaded asynchronously via <code>useEffect</code> + <code>setTimeout</code>.</li>
              <li>Search filtering is a <em>derived value</em> — not stored in state.</li>
              <li><code>useRef</code> tracks the search input without causing extra renders.</li>
              <li><code>usePrevious</code> uses a ref + effect to remember the last search term.</li>
            </ul>
          </div>
        )}
      </section>

      <hr />

      <section>
        <h2>📋 Tutoring Sessions</h2>
        {isLoading ? (
          <p style={{ color: '#007bff', fontStyle: 'italic' }}>⏳ Loading sessions…</p>
        ) : filteredSessions.length === 0 ? (
          <p style={{ color: '#dc3545' }}>No sessions match "<strong>{searchTerm}</strong>".</p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {filteredSessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        )}
      </section>

      <hr />

      <section>
        <h2>🗂️ My Bookings</h2>
        <BookingBadge booking={SAMPLE_BOOKING}>
          <span>🗓️ Scheduled for: {SAMPLE_BOOKING.scheduledAt.toLocaleDateString()}</span>
        </BookingBadge>
      </section>
    </div>
  );
}

export default App;
