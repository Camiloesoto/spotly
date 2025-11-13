"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type UserRole = "guest" | "user" | "owner" | "admin";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
};

type AuthState = {
  status: "idle" | "loading" | "authenticated" | "error";
  user: AuthUser | null;
  token: string | null;
  error?: string;
  _hasHydrated: boolean;
  setHasHydrated: (hasHydrated: boolean) => void;
  setLoading: () => void;
  setSession: (user: AuthUser, token: string) => void;
  clearSession: () => void;
  setError: (message: string) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      status: "idle",
      user: null,
      token: null,
      error: undefined,
      _hasHydrated: false,
      setHasHydrated: (hasHydrated) => {
        set({ _hasHydrated: hasHydrated });
      },
      setLoading: () => set({ status: "loading", error: undefined }),
      setSession: (user, token) => {
        set({ status: "authenticated", user, token, error: undefined });
      },
      clearSession: () => {
        set({ status: "idle", user: null, token: null, error: undefined });
      },
      setError: (message) => set({ status: "error", error: message }),
    }),
    {
      name: "seki-auth-storage",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        status: state.user && state.token ? "authenticated" : "idle",
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
          if (state.user && state.token) {
            state.status = "authenticated";
          } else {
            state.status = "idle";
            state.user = null;
            state.token = null;
          }
        }
      },
    }
  )
);

