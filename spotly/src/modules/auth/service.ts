import { apiClient } from "@/lib/api/client";
import { useAuthStore } from "@/lib/store/auth-store";
import type {
  LocalRegisterPayload,
  LoginPayload,
  OAuthProvider,
  RegisterPayload,
  Session,
} from "./types";

const AUTH_BASE = "/auth";

export async function registerUser(payload: RegisterPayload) {
  return apiClient.post<Session>(`${AUTH_BASE}/register`, payload);
}

export async function registerLocal(payload: LocalRegisterPayload) {
  return apiClient.post<Session>(`${AUTH_BASE}/register/local`, payload);
}

export async function login(payload: LoginPayload) {
  const session = await apiClient.post<Session>(`${AUTH_BASE}/login`, payload);
  useAuthStore.getState().setSession(mapSessionToStore(session.user), session.accessToken);
  return session;
}

export async function loginWithProvider(provider: OAuthProvider) {
  const redirect =
    typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : undefined;

  return apiClient.get<{ redirectUrl: string }>(`${AUTH_BASE}/oauth/${provider}`, {
    params: { redirect },
  });
}

export async function refreshSession(refreshToken: string) {
  const session = await apiClient.post<Session>(`${AUTH_BASE}/refresh`, { refreshToken });
  useAuthStore.getState().setSession(mapSessionToStore(session.user), session.accessToken);
  return session;
}

export async function logout() {
  await apiClient.post<void>(`${AUTH_BASE}/logout`);
  useAuthStore.getState().clearSession();
}

function mapSessionToStore(sessionUser: Session["user"]) {
  return {
    id: sessionUser.id,
    email: sessionUser.email,
    name: sessionUser.fullName,
    role: sessionUser.role,
    avatarUrl: sessionUser.avatarUrl,
  };
}

