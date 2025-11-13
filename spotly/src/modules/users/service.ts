import { apiClient } from "@/lib/api/client";
import { useAuthStore } from "@/lib/store/auth-store";
import type { UpdateUserProfilePayload, UserProfile } from "./types";

const USERS_BASE = "/users";

// Usar mock data si no hay API_URL configurada o si está explícitamente habilitado
const USE_MOCK_DATA =
  process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true" ||
  !process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_URL === "http://localhost:3333/api/v1" ||
  process.env.NODE_ENV === "development";

export async function getUserProfile(): Promise<UserProfile> {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const user = useAuthStore.getState().user;
    if (!user) {
      throw new Error("Usuario no autenticado");
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: undefined,
      avatarUrl: user.avatarUrl,
      role: user.role === "guest" ? "user" : user.role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  return apiClient.get<UserProfile>(`${USERS_BASE}/me`);
}

export async function updateUserProfile(
  payload: UpdateUserProfilePayload
): Promise<UserProfile> {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const user = useAuthStore.getState().user;
    if (!user) {
      throw new Error("Usuario no autenticado");
    }

    // Actualizar el store con los nuevos datos
    const updatedUser = {
      ...user,
      name: payload.name ?? user.name,
      email: payload.email ?? user.email,
      avatarUrl: payload.avatarUrl ?? user.avatarUrl,
    };

    useAuthStore.getState().setSession(updatedUser, useAuthStore.getState().token!);

    return {
      id: user.id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: payload.phone,
      avatarUrl: updatedUser.avatarUrl,
      role: user.role === "guest" ? "user" : user.role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  const updated = await apiClient.put<UserProfile, UpdateUserProfilePayload>(
    `${USERS_BASE}/me`,
    payload
  );

  // Actualizar el store con los nuevos datos
  useAuthStore.getState().setSession(
    {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      avatarUrl: updated.avatarUrl,
    },
    useAuthStore.getState().token!
  );

  return updated;
}

