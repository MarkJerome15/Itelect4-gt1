# Peer Tutoring Booking Platform

A web application that connects students with peer tutors. Tutees can browse available tutors and tutoring sessions, make bookings, and track booking statuses. Built with React, TypeScript, and Vite for ITELECT4.

## Interfaces / Types

| Name | Kind | Fields |
|---|---|---|
| `User` | `interface` | `id`, `name`, `email`, `role` (UserRole), `isActive` |
| `TutoringSession` | `interface` | `id`, `tutorId`, `subject`, `ratePerHour`, `availableSlots` |
| `Booking` | `interface` | `id`, `sessionId`, `tuteeId`, `status` (BookingStatus), `scheduledAt` |
| `ApiResponse<T>` | `interface` | `success`, `data`, `message?` |
| `BookingUpdate` | `type` | `Partial<Booking>` |
| `PublicUser` | `type` | `Omit<User, "email" \| "isActive">` |
| `UserPreview` | `type` | `Pick<User, "id" \| "name" \| "role">` |
| `UserRole` | `enum` | `Tutor = "tutor"`, `Tutee = "tutee"` |
| `BookingStatus` | `enum` | `Requested`, `Confirmed`, `Completed` |

## How to Install and Run

```bash
npm install
npm run dev
```

To type-check with no output:

```bash
npx tsc --noEmit
```

## Git

```bash
git add .
git commit -m "GT1 Part 2: generics, utility types, enums"
git tag gt1
git push --tags
git push
```