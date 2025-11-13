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
// Usar mock data si no hay API_URL configurada o si está explícitamente habilitado
const USE_MOCK_DATA =
  process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true" ||
  !process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_URL === "http://localhost:3333/api/v1";

// Simular usuarios en memoria (solo para desarrollo)
const MOCK_USERS: Array<{
  email: string;
  password: string;
  fullName: string;
  role: "user" | "owner" | "admin";
  id: string;
}> = [];

function createMockSession(user: { email: string; fullName: string; role: "user" | "owner" | "admin"; id: string }): Session {
  return {
    accessToken: `mock_token_${user.id}_${Date.now()}`,
    refreshToken: `mock_refresh_${user.id}_${Date.now()}`,
    expiresIn: 3600,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    },
  };
}

export async function registerUser(payload: RegisterPayload) {
  if (USE_MOCK_DATA) {
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    // Verificar si el usuario ya existe
    const existingUser = MOCK_USERS.find((u) => u.email === payload.email);
    if (existingUser) {
      throw new Error("Este correo electrónico ya está registrado");
    }

    // Crear nuevo usuario
    const newUser = {
      id: `user_${Date.now()}`,
      email: payload.email,
      password: payload.password, // En producción esto estaría hasheado
      fullName: payload.fullName,
      role: payload.role,
    };

    MOCK_USERS.push(newUser);
    const session = createMockSession(newUser);
    useAuthStore.getState().setSession(mapSessionToStore(session.user), session.accessToken);
    return session;
  }

  const session = await apiClient.post<Session>(`${AUTH_BASE}/register`, payload);
  useAuthStore.getState().setSession(mapSessionToStore(session.user), session.accessToken);
  return session;
}

export async function registerLocal(payload: LocalRegisterPayload) {
  if (USE_MOCK_DATA) {
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Crear usuario owner con el local
    const newUser = {
      id: `owner_${Date.now()}`,
      email: `owner_${Date.now()}@seki.com`, // Email temporal
      password: "temp_password",
      fullName: payload.name,
      role: "owner" as const,
    };

    MOCK_USERS.push(newUser);
    const session = createMockSession(newUser);
    useAuthStore.getState().setSession(mapSessionToStore(session.user), session.accessToken);
    return session;
  }

  const session = await apiClient.post<Session>(`${AUTH_BASE}/register/local`, payload);
  useAuthStore.getState().setSession(mapSessionToStore(session.user), session.accessToken);
  return session;
}

export async function login(payload: LoginPayload) {
  if (USE_MOCK_DATA) {
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Buscar usuario
    const user = MOCK_USERS.find((u) => u.email === payload.email);
    if (!user || user.password !== payload.password) {
      throw new Error("Credenciales inválidas. Verifica tu correo y contraseña.");
    }

    const session = createMockSession(user);
    useAuthStore.getState().setSession(mapSessionToStore(session.user), session.accessToken);
    return session;
  }

  const session = await apiClient.post<Session>(`${AUTH_BASE}/login`, payload);
  useAuthStore.getState().setSession(mapSessionToStore(session.user), session.accessToken);
  return session;
}

export async function loginWithProvider(provider: OAuthProvider) {
  if (USE_MOCK_DATA) {
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // En modo mock, mostrar mensaje informativo
    throw new Error("Login con Google no está disponible en modo demo. Por favor, usa email y contraseña.");
  }

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
  if (USE_MOCK_DATA) {
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 200));
    useAuthStore.getState().clearSession();
    return;
  }

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

