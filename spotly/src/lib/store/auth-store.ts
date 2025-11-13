"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

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
      setLoading: () => set({ status: "loading", error: undefined }),
      setSession: (user, token) => {
        set({ status: "authenticated", user, token, error: undefined });
      },
      clearSession: () => {
        set({ status: "idle", user: null, token: null, error: undefined });
        // Limpiar localStorage también
        if (typeof window !== "undefined") {
          localStorage.removeItem("seki-auth-storage");
        }
      },
      setError: (message) => set({ status: "error", error: message }),
    }),
    {
      name: "seki-auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        status: state.user && state.token ? "authenticated" : "idle",
      }),
      // Restaurar el estado correctamente al cargar
      onRehydrateStorage: () => (state) => {
        if (state?.user && state?.token) {
          state.status = "authenticated";
        } else {
          state.status = "idle";
          state.user = null;
          state.token = null;
        }
      },
    }
  )
);

