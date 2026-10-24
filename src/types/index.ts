// src/types/index.ts
// Core type definitions.
// The old tutoring-session / booking types are kept for backward compat
// but the real API types now live in src/api/client.ts.

// ===== ENUMS =====
export enum UserRole {
  Tutor = 'tutor',
  Tutee = 'tutee',
}

export enum BookingStatus {
  Requested = 'requested',
  Confirmed = 'confirmed',
  Completed = 'completed',
}

// ===== LEGACY MOCK ENTITIES (used by mockData.ts / DashboardPage tutors) =====
export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
}

export interface TutoringSession {
  id: number;
  tutorId: number;
  subject: string;
  ratePerHour: number;
  availableSlots: number;
}

export interface Booking {
  id: number;
  sessionId: number;
  tuteeId: number;
  status: BookingStatus;
  scheduledAt: Date;
}

// ===== GENERICS =====
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// ===== UTILITY TYPES =====
export type BookingUpdate = Partial<Booking>;
export type PublicUser = Omit<User, 'email' | 'isActive'>;
export type UserPreview = Pick<User, 'id' | 'name' | 'role'>;

// Legacy API types (kept for reference; new code uses src/api/client.ts types)
export type ApiTutoringSession = Omit<TutoringSession, 'id'> & {
  _id?: string;
  id: string;
};
export type ApiBooking = Omit<Booking, 'id' | 'scheduledAt' | 'sessionId'> & {
  _id?: string;
  id: string;
  sessionId: string;
  scheduledAt: string;
};
export type NewBooking = Omit<ApiBooking, 'id' | '_id'>;
