"use client";

import { create } from "zustand";

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

export const useAuthStore = create<AuthState>((set) => ({
  status: "idle",
  user: null,
  token: null,
  setLoading: () => set({ status: "loading", error: undefined }),
  setSession: (user, token) => set({ status: "authenticated", user, token, error: undefined }),
  clearSession: () => set({ status: "idle", user: null, token: null, error: undefined }),
  setError: (message) => set({ status: "error", error: message }),
}));

