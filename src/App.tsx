// Import our core types
import type { User, TutoringSession, Booking } from './types';
import { UserRole, BookingStatus } from './types';
// Import our newly created components
import { TutorCard } from './components/TutorCard';
import { SessionCard } from './components/SessionCard';
import { BookingBadge } from './components/BookingBadge';

function App() {
  // --- 1. MOCK DATA USING OUR STRICT TYPES ---
  const sampleTutor: User = {
    id: 1,
    name: "Alice Math",
    email: "alice@tutor.com",
    role: UserRole.Tutor,
    isActive: true,
  };

  const sampleSession: TutoringSession = {
    id: 101,
    tutorId: sampleTutor.id,
    subject: "Calculus 101",
    ratePerHour: 25,
    availableSlots: 5,
  };

  const sampleBooking: Booking = {
    id: 1001,
    sessionId: sampleSession.id,
    tuteeId: 2, // Sample tutee ID
    status: BookingStatus.Confirmed,
    scheduledAt: new Date("2026-08-01T10:00:00Z"),
  };
  console.log(sampleBooking); // Used to avoid TS6133

  // --- 2. TYPED EVENT HANDLER ---
  // This is the function we pass down into TutorCard's 'onSelect' prop.
  const handleTutorSelect = (tutor: User) => {
    alert(`You selected tutor: ${tutor.name}`);
  };

  // --- 3. RENDER ---
  return (
    <div style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
      <h1>Peer Tutoring Platform</h1>
      <hr />
      
      <h2>Available Tutors</h2>
      {/* Passing our mock data and our typed handler as props */}
      <TutorCard tutor={sampleTutor} onSelect={handleTutorSelect} />

      <h2>Tutoring Sessions</h2>
      <SessionCard session={sampleSession} />

      <h2>My Bookings</h2>
      {/* Passing the booking prop, and some extra React nodes as 'children' */}
      <BookingBadge booking={sampleBooking}>
        <span>🗓️ Scheduled for: {sampleBooking.scheduledAt.toLocaleDateString()}</span>
      </BookingBadge>
    </div>
  );
}

export default App;
