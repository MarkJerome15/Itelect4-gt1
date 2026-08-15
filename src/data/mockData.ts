// src/data/mockData.ts
// Shared mock data so every page can import from one place.

import type { User, TutoringSession, Booking } from '../types';
import { UserRole, BookingStatus } from '../types';

export const MOCK_TUTORS: User[] = [
  { id: 1, name: 'Alice Math', email: 'alice@tutor.com', role: UserRole.Tutor, isActive: true },
  { id: 2, name: 'Bob Science', email: 'bob@tutor.com', role: UserRole.Tutor, isActive: true },
  { id: 3, name: 'Carol History', email: 'carol@tutor.com', role: UserRole.Tutor, isActive: false },
];

export const MOCK_TUTEE: User = {
  id: 99,
  name: 'Dave Student',
  email: 'dave@student.com',
  role: UserRole.Tutee,
  isActive: true,
};

export const MOCK_SESSIONS: TutoringSession[] = [
  { id: 101, tutorId: 1, subject: 'Calculus 101', ratePerHour: 25, availableSlots: 5 },
  { id: 102, tutorId: 1, subject: 'Linear Algebra', ratePerHour: 30, availableSlots: 3 },
  { id: 103, tutorId: 2, subject: 'Physics Mechanics', ratePerHour: 28, availableSlots: 2 },
  { id: 104, tutorId: 2, subject: 'Chemistry Basics', ratePerHour: 22, availableSlots: 4 },
  { id: 105, tutorId: 3, subject: 'World History', ratePerHour: 20, availableSlots: 6 },
];

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 1001,
    sessionId: 101,
    tuteeId: 99,
    status: BookingStatus.Confirmed,
    scheduledAt: new Date('2026-08-01T10:00:00Z'),
  },
  {
    id: 1002,
    sessionId: 103,
    tuteeId: 99,
    status: BookingStatus.Requested,
    scheduledAt: new Date('2026-08-05T14:00:00Z'),
  },
];
