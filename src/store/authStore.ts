// src/store/authStore.ts -- updated for real API auth
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  token: string | null;
  userName: string | null;
  /** Store a real JWT + display name after a successful API login. */
  setSession: (token: string, userName: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userName: null,
      setSession: (token: string, userName: string) => set({ token, userName }),
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

