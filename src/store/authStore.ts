// src/store/authStore.ts
// Manages JWT token and authenticated user data.
// Persisted to localStorage so sessions survive page refreshes.
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser } from '../api/client';

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  /** Convenience getter for display name */
  userName: string | null;
  /** Store the JWT and full user object after successful login/register. */
  setSession: (token: string, user: AuthUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      userName: null,
      setSession: (token: string, user: AuthUser) =>
        set({ token, user, userName: user.name }),
      logout: () => set({ token: null, user: null, userName: null }),
    }),
    {
      name: 'itelect4-auth',
      // Persist only what we need — everything else is re-derived
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        userName: state.userName,
      }),
    }
  )
);

export default useAuthStore;
