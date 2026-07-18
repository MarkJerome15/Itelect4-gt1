// src/index.ts

import {
  User,
  UserRole,
  TutoringSession,
  Booking,
  BookingStatus,
  ApiResponse,
  BookingUpdate,
  PublicUser,
  UserPreview
} from "../types/index";

// ===== GENERIC FUNCTIONS =====

// 1. Constrained generic function that gets an item by ID. 
// `T extends { id: number }` ensures that whatever type is passed in MUST have an 'id' property of type number.
export function getById<T extends { id: number }>(items: T[], id: number): T | undefined {
  return items.find(item => item.id === id);
}

// 2. A basic generic function that gets the first item in an array, or undefined if empty.
// 'T' can be literally anything here.
export function getFirst<T>(items: T[]): T | undefined {
  return items.length > 0 ? items[0] : undefined;
}

// ===== EXAMPLE USAGE =====

// 1. Create sample users (Tutor and Tutee) using the UserRole const enum
const sampleTutor: User = {
  id: 1,
  name: "Alice Math",
  email: "alice@tutor.com",
  role: UserRole.Tutor, // Enum usage
  isActive: true,
};

const sampleTutee: User = {
  id: 2,
  name: "Bob Student",
  email: "bob@student.com",
  role: UserRole.Tutee, // Enum usage
  isActive: true,
};

const allUsers = [sampleTutor, sampleTutee];

// 2. Create a sample TutoringSession
const mathSession: TutoringSession = {
  id: 101,
  tutorId: sampleTutor.id,
  subject: "Calculus 101",
  ratePerHour: 25,
  availableSlots: 5,
};

const allSessions = [mathSession];

// 3. Create a sample Booking using the BookingStatus regular enum
const sampleBooking: Booking = {
  id: 1001,
  sessionId: mathSession.id,
  tuteeId: sampleTutee.id,
  status: BookingStatus.Requested, // Enum usage
  scheduledAt: new Date("2026-08-01T10:00:00Z"),
};

// 4. Using the constrained generic function 'getById'
// Notice we pass <User> and <TutoringSession> to tell TypeScript what 'T' is.
const foundUser = getById<User>(allUsers, 2);
console.log("Found User:", foundUser?.name); // Output: Bob Student

const foundSession = getById<TutoringSession>(allSessions, 101);
console.log("Found Session:", foundSession?.subject); // Output: Calculus 101

// Using the basic generic function 'getFirst'
const firstUser = getFirst<User>(allUsers);
console.log("First User in list:", firstUser?.name); // Output: Alice Math

// 5. Using the generic ApiResponse<T> interface
// We wrap a User object in our generic API response structure
const userResponse: ApiResponse<User> = {
  success: true,
  data: sampleTutor,
  message: "Tutor fetched successfully"
};
console.log("API Response Data:", userResponse.data.name);

// 6. Using Utility Types
// a) Partial<T>: Provide only the fields you want to update
const bookingUpdatePayload: BookingUpdate = {
  status: BookingStatus.Confirmed 
};
console.log("Booking Update Payload:", bookingUpdatePayload);

// b) Omit<T, K>: Provide user data but WITHOUT email and isActive
const publicTutorProfile: PublicUser = {
  id: sampleTutor.id,
  name: sampleTutor.name,
  role: sampleTutor.role
};
console.log("Public Tutor Profile:", publicTutorProfile);

// c) Pick<T, K>: Provide ONLY the id, name, and role fields
const tuteePreview: UserPreview = {
  id: sampleTutee.id,
  name: sampleTutee.name,
  role: sampleTutee.role
};
console.log("Tutee Preview:", tuteePreview);
