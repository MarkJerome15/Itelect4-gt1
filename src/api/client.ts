// src/api/client.ts
// All API calls go through this file.
// Base URL is read from the VITE_API_URL environment variable so the same
// code works against localhost in dev and the Vercel backend in production.
import type { ApiTutoringSession, ApiBooking, NewBooking } from "../types/index";
import { useAuthStore } from "../store/authStore";

// Fallback keeps local dev working if .env is missing.
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

// ── helpers ──────────────────────────────────────────────────────────
/** Build headers with the Bearer token when available. */
function authHeaders(): Record<string, string> {
  const token = useAuthStore.getState().token;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

// ── auth ─────────────────────────────────────────────────────────────
export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: { name: string; email: string };
}

/** POST /api/auth/login */
export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || "Invalid email or password");
  }
  return res.json();
}

// ── sessions (public) ────────────────────────────────────────────────
/** GET /api/sessions -> the whole list */
export async function fetchSessions(): Promise<ApiTutoringSession[]> {
  const res = await fetch(`${API_URL}/api/sessions`);
  if (!res.ok) {
    throw new Error("Could not load sessions");
  }
  return res.json();
}

/** GET /api/sessions/:id -> one session */
export async function fetchSessionById(id: string): Promise<ApiTutoringSession> {
  const res = await fetch(`${API_URL}/api/sessions/${id}`);
  if (!res.ok) {
    throw new Error("Could not load that session");
  }
  return res.json();
}

// ── bookings (protected) ────────────────────────────────────────────
/** GET /api/bookings */
export async function fetchBookings(): Promise<ApiBooking[]> {
  const res = await fetch(`${API_URL}/api/bookings`, {
    headers: authHeaders(),
  });
  if (!res.ok) {
    throw new Error("Could not load bookings");
  }
  return res.json();
}

/** POST /api/bookings -> the document the server saved */
export async function createBooking(
  newBooking: NewBooking
): Promise<ApiBooking> {
  const res = await fetch(`${API_URL}/api/bookings`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(newBooking),
  });
  if (!res.ok) {
    throw new Error("Could not save the booking");
  }
  return res.json();
}
