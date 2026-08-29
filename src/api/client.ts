// src/api/client.ts
// Every call to json-server lives in this one file.
import type { ApiTutoringSession, ApiBooking, NewBooking } from "../types/index";

export const API_URL = "http://localhost:3001";

// GET /sessions -> the whole list
export async function fetchSessions(): Promise<ApiTutoringSession[]> {
  const res = await fetch(`${API_URL}/sessions`);
  if (!res.ok) {
    throw new Error("Could not load sessions");
  }
  return res.json();
}

// GET /sessions/:id -> one session
export async function fetchSessionById(id: string): Promise<ApiTutoringSession> {
  const res = await fetch(`${API_URL}/sessions/${id}`);
  if (!res.ok) {
    throw new Error("Could not load that session");
  }
  return res.json();
}

// GET /bookings
export async function fetchBookings(): Promise<ApiBooking[]> {
  const res = await fetch(`${API_URL}/bookings`);
  if (!res.ok) {
    throw new Error("Could not load bookings");
  }
  return res.json();
}

// POST /bookings -> the row the server saved, with the id it made
export async function createBooking(
  newBooking: NewBooking
): Promise<ApiBooking> {
  const res = await fetch(`${API_URL}/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newBooking),
  });
  if (!res.ok) {
    throw new Error("Could not save the booking");
  }
  return res.json();
}
