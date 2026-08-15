// src/store/authStore.ts
// Zustand store for authentication state.
// Uses an explicit AuthState interface so every consumer knows the exact shape.

import { create } from 'zustand';

// The store's shape — typed explicitly so TypeScript catches any misuse.
interface AuthState {
  token: string | null;
  userName: string | null;
  login: (name: string) => void;
  logout: () => void;
}

// create<AuthState> tells Zustand what the store contains.
// login() generates a fake token and stores the user's name.
// logout() resets both to null.
export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  userName: null,
  login: (name: string) => set({ token: `demo-token-${name}`, userName: name }),
  logout: () => set({ token: null, userName: null }),
}));
