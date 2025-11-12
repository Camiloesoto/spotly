import { apiClient } from "@/lib/api/client";
import type { LocalProfile, UpdateLocalProfilePayload } from "./types";

const PROFILE_BASE = "/locals";

export async function getLocalProfile(id: string) {
  return apiClient.get<LocalProfile>(`${PROFILE_BASE}/${id}`);
}

export async function updateLocalProfile(id: string, payload: UpdateLocalProfilePayload) {
  return apiClient.put<LocalProfile, UpdateLocalProfilePayload>(`${PROFILE_BASE}/${id}`, payload);
}

export async function approveLocalProfile(id: string) {
  return apiClient.post<LocalProfile>(`${PROFILE_BASE}/${id}/approve`);
}

export async function rejectLocalProfile(id: string, reason: string) {
  return apiClient.post<LocalProfile>(`${PROFILE_BASE}/${id}/reject`, { reason });
}

