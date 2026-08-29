// src/data/mockData.ts
// MOCK_SESSIONS and MOCK_BOOKINGS are DELETED. They live in db.json now,
// and the app fetches them instead of importing them.
//
// MOCK_TUTORS and MOCK_TUTEE stay. There is no /users endpoint and no real login until
// Module 4 -- the Dashboard's tutors and student are still hard-coded, on purpose.

import type { User } from '../types';
import { UserRole } from '../types';

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
