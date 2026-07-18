// types/index.ts

// ===== ENUMS =====
// Const enum for User role ("tutor" | "tutee"). 
// Const enums are fully erased during compilation, leaving only their values.
export enum UserRole {
  Tutor = "tutor",
  Tutee = "tutee",
}

// Regular enum for the Booking status lifecycle.
// Useful when you need the enum object to exist at runtime (e.g., iterating over statuses).
export enum BookingStatus {
  Requested = "requested",
  Confirmed = "confirmed",
  Completed = "completed",
}

// ===== CORE ENTITIES =====
export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole; // Uses the UserRole const enum
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
  status: BookingStatus; // Uses the BookingStatus regular enum
  scheduledAt: Date;
}

// ===== GENERICS =====
// 1. Generic interface ApiResponse<T> that can wrap any data shape.
// 'T' is a placeholder for the actual type of data we're responding with.
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// ===== UTILITY TYPES =====
// 1. Partial<T>: Creates a type with all properties of T set to optional. 
// Excellent for update payloads where you might only update 1 or 2 fields.
export type BookingUpdate = Partial<Booking>;

// 2. Omit<T, K>: Creates a type by removing keys K from T. 
// Perfect for safely exposing user profiles without revealing sensitive fields like email.
export type PublicUser = Omit<User, "email" | "isActive">;

// 3. Pick<T, K>: Creates a type by explicitly selecting keys K from T. 
// Great for generating a lightweight preview object (e.g., in a list of users).
export type UserPreview = Pick<User, "id" | "name" | "role">;
