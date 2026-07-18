# Peer Tutoring Booking Platform

A platform connecting students with tutors. Tutors can post tutoring sessions specifying the subject, rate, and available time slots. Tutees can then browse and book these sessions, with bookings transitioning through a status lifecycle (Requested -> Confirmed -> Completed).

## Core Entities & Types
- `User`: Defines user accounts (tutors or tutees).
- `UserRole`: A const enum for user roles (`Tutor` or `Tutee`).
- `TutoringSession`: Represents a session posted by a tutor.
- `Booking`: Represents a reservation made by a tutee.
- `BookingStatus`: An enum tracking the lifecycle of a booking.
- `ApiResponse<T>`: A generic wrapper for standardizing API responses.
- `BookingUpdate` (`Partial<Booking>`): Utility type for handling partial updates to a booking without requiring all fields.
- `PublicUser` (`Omit<User, "email" | "isActive">`): Utility type for safely exposing public user data by omitting sensitive information.
- `UserPreview` (`Pick<User, "id" | "name" | "role">`): Utility type for constructing lightweight user previews.

## Installation & Running

1. **Install dependencies:**
   Ensure you have your Node environment set up, then run:
   ```bash
   npm install
   ```

2. **Run the application:**
   Execute the `src/index.ts` file using `ts-node`:
   ```bash
   npx ts-node src/index.ts
   ```

3. **Type-check the code:**
   Verify that there are zero TypeScript compiler errors under strict mode:
   ```bash
   npx tsc --noEmit
   ```
