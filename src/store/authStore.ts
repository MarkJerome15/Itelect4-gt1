// src/store/authStore.ts -- the finished file
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  token: string | null;
  userName: string | null;
  login: (name: string) => void;
  logout: () => void;
}

// The store from Session 6, now wrapped in persist( ... )
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userName: null,
      login: (name: string) => set({ token: `demo-token-${name}`, userName: name }),
      logout: () => set({ token: null, userName: null }),
    }),
    {
      name: "itelect4-auth", // the localStorage key it writes to
      partialize: (state) => ({ // save ONLY these two fields
        token: state.token,
        userName: state.userName,
      }),
    }
  )
);

export default useAuthStore;
