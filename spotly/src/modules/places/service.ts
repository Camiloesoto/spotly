import { apiClient } from "@/lib/api/client";
import type { PlaceDetail, PlaceFilters, PlaceListResponse, PlaceSummary } from "./types";

const PLACES_BASE = "/places";

export async function listPlaces(filters: PlaceFilters = {}) {
  return apiClient.get<PlaceListResponse>(PLACES_BASE, {
    params: filters,
  });
}

export async function getPlaceById(id: string) {
  return apiClient.get<PlaceDetail>(`${PLACES_BASE}/${id}`);
}

export async function searchPlacesByName(name: string) {
  return apiClient.get<PlaceSummary[]>(`${PLACES_BASE}/search`, {
    params: { q: name },
  });
}

