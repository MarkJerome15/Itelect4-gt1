// src/api/client.ts
// Single source of truth for all HTTP calls to the backend.
// Base URL is read from VITE_API_URL so it works in dev (localhost:4000)
// and can be pointed at a deployed URL via the env var.

import { useAuthStore } from '../store/authStore';
import type { AiReview } from '../types';

export type { AiReview };

export const API_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:4000';

// ── Shared helpers ──────────────────────────────────────────────────────────

/** Build default request headers, injecting the JWT when available. */
function authHeaders(extra?: Record<string, string>): Record<string, string> {
  const token = useAuthStore.getState().token;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...extra,
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Thin fetch wrapper that throws a structured Error with the server's
 * `message` field (or a fallback) whenever `!res.ok`.
 */
async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, options);

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const body = (await res.json()) as { message?: string };
      if (body.message) message = body.message;
    } catch {
      // body wasn't JSON – keep the status fallback
    }
    throw new Error(message);
  }

  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}

// ═══════════════════════════════════════════════════════════════════════════
// AUTH  —  /api/auth/*
// ═══════════════════════════════════════════════════════════════════════════

export type UserRole = 'tutor' | 'tutee' | 'user' | 'admin';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface RegisterResponse {
  message: string;
  user: AuthUser;
}

/** POST /api/auth/register */
export async function register(payload: RegisterPayload): Promise<RegisterResponse> {
  return request<RegisterResponse>('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

/** POST /api/auth/login */
export async function login(payload: LoginPayload): Promise<AuthResponse> {
  return request<AuthResponse>('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

/** GET /api/auth/me */
export async function fetchCurrentUser(): Promise<AuthUser> {
  const res = await request<{ user: AuthUser }>('/api/auth/me', {
    headers: authHeaders(),
  });
  return res.user;
}

/** GET /api/auth/tutors */
export async function fetchTutors(): Promise<AuthUser[]> {
  const res = await request<{ tutors: AuthUser[] }>('/api/auth/tutors', {
    headers: authHeaders(),
  });
  return res.tutors;
}

// ═══════════════════════════════════════════════════════════════════════════
// SESSIONS  —  /api/sessions/* (Peer Tutoring Sessions)
// ═══════════════════════════════════════════════════════════════════════════

export type SessionStatus = 'available' | 'planned' | 'in-progress' | 'completed' | 'cancelled';

export interface UserSummary {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  role: string;
}

export interface ApiSession {
  id: string;
  _id?: string;
  title: string;
  subject: string;
  description: string;
  status: SessionStatus;
  ratePerHour: number;
  durationMinutes: number;
  availableSlots: number;
  notes: string;
  tutorId?: UserSummary | string;
  userId?: UserSummary | string;
  createdAt: string;
  updatedAt: string;
}

export interface SessionsListResponse {
  count: number;
  sessions: ApiSession[];
}

export interface SessionDetailResponse {
  session: ApiSession;
}

export type CreateSessionInput = {
  title: string;
  subject?: string;
  description?: string;
  status?: SessionStatus;
  ratePerHour?: number;
  durationMinutes: number;
  availableSlots?: number;
  notes?: string;
};

export type UpdateSessionInput = Partial<CreateSessionInput>;

export interface SessionFilterParams {
  mine?: boolean;
  subject?: string;
  status?: string;
  search?: string;
}

/** GET /api/sessions — list tutoring sessions with optional filters */
export async function fetchSessions(params?: SessionFilterParams): Promise<ApiSession[]> {
  const query = new URLSearchParams();
  if (params?.mine) query.set('mine', 'true');
  if (params?.subject && params.subject !== 'all') query.set('subject', params.subject);
  if (params?.status && params.status !== 'all') query.set('status', params.status);
  if (params?.search && params.search.trim()) query.set('search', params.search.trim());

  const queryString = query.toString() ? `?${query.toString()}` : '';
  const data = await request<SessionsListResponse>(`/api/sessions${queryString}`, {
    headers: authHeaders(),
  });
  return data.sessions;
}

/** GET /api/sessions/:id — get a single session */
export async function fetchSessionById(id: string): Promise<ApiSession> {
  const data = await request<SessionDetailResponse>(`/api/sessions/${id}`, {
    headers: authHeaders(),
  });
  return data.session;
}

/** POST /api/sessions — create a new tutoring session */
export async function createSession(body: CreateSessionInput): Promise<ApiSession> {
  const data = await request<SessionDetailResponse>('/api/sessions', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  return data.session;
}

/** PATCH /api/sessions/:id — update a session */
export async function updateSession(
  id: string,
  body: UpdateSessionInput
): Promise<ApiSession> {
  const data = await request<SessionDetailResponse>(`/api/sessions/${id}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  return data.session;
}

/** DELETE /api/sessions/:id — delete a session (returns void) */
export async function deleteSession(id: string): Promise<void> {
  return request<void>(`/api/sessions/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// BOOKINGS  —  /api/bookings/* (Peer Tutoring Bookings)
// ═══════════════════════════════════════════════════════════════════════════

export type BookingStatus = 'requested' | 'confirmed' | 'completed' | 'cancelled';

export interface ApiBooking {
  id: string;
  _id?: string;
  sessionId: {
    id?: string;
    _id?: string;
    title: string;
    subject?: string;
    ratePerHour?: number;
    durationMinutes?: number;
    status?: string;
  } | string;
  tuteeId: UserSummary | string;
  tutorId: UserSummary | string;
  status: BookingStatus;
  scheduledAt: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingsListResponse {
  count: number;
  bookings: ApiBooking[];
}

export interface BookingDetailResponse {
  booking: ApiBooking;
}

export interface CreateBookingInput {
  sessionId: string;
  scheduledAt: string;
  notes?: string;
}

export interface UpdateBookingStatusInput {
  status: BookingStatus;
  notes?: string;
}

export interface BookingFilterParams {
  status?: string;
  role?: 'tutor' | 'tutee';
}

/** GET /api/bookings — list bookings for the current user */
export async function fetchBookings(params?: BookingFilterParams): Promise<ApiBooking[]> {
  const query = new URLSearchParams();
  if (params?.status && params.status !== 'all') query.set('status', params.status);
  if (params?.role) query.set('role', params.role);

  const queryString = query.toString() ? `?${query.toString()}` : '';
  const data = await request<BookingsListResponse>(`/api/bookings${queryString}`, {
    headers: authHeaders(),
  });
  return data.bookings;
}

/** GET /api/bookings/:id — get a single booking */
export async function fetchBookingById(id: string): Promise<ApiBooking> {
  const data = await request<BookingDetailResponse>(`/api/bookings/${id}`, {
    headers: authHeaders(),
  });
  return data.booking;
}

/** POST /api/bookings — create a new booking request */
export async function createBooking(body: CreateBookingInput): Promise<ApiBooking> {
  const data = await request<BookingDetailResponse>('/api/bookings', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  return data.booking;
}

/** PATCH /api/bookings/:id — update booking status (confirm, complete, cancel) */
export async function updateBookingStatus(
  id: string,
  body: UpdateBookingStatusInput
): Promise<ApiBooking> {
  const data = await request<BookingDetailResponse>(`/api/bookings/${id}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  return data.booking;
}

/** DELETE /api/bookings/:id — cancel/delete booking */
export async function deleteBooking(id: string): Promise<void> {
  return request<void>(`/api/bookings/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// AI REVIEW  —  POST /api/ai
// ═══════════════════════════════════════════════════════════════════════════

/** POST /api/ai — request Gemini feedback on project/tutoring description */
export function askAi(prompt: string): Promise<AiReview> {
  return request<AiReview>('/api/ai', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ prompt }),
  });
}

