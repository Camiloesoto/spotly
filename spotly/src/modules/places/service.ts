import { apiClient } from "@/lib/api/client";
import { getMockPlacesResponse, MOCK_PLACES } from "./mock-data";
import type { PlaceDetail, PlaceFilters, PlaceListResponse, PlaceSummary } from "./types";

const PLACES_BASE = "/places";
// Usar mock data si no hay API_URL configurada o si está explícitamente habilitado
// En desarrollo, siempre usar mock data a menos que se especifique lo contrario
const USE_MOCK_DATA =
  process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true" ||
  !process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_URL === "http://localhost:3333/api/v1" ||
  process.env.NODE_ENV === "development";

export async function listPlaces(filters: PlaceFilters = {}) {
  if (USE_MOCK_DATA) {
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 500));
    return getMockPlacesResponse({
      search: filters.search,
      category: filters.category,
      priceRange: filters.priceRange,
    });
  }

  return apiClient.get<PlaceListResponse>(PLACES_BASE, {
    params: filters,
  });
}

export async function getPlaceById(id: string) {
  if (USE_MOCK_DATA) {
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 300));
    const place = MOCK_PLACES.find((p) => p.id === id);
    if (!place) {
      throw new Error("Lugar no encontrado");
    }
    // Convertir a PlaceDetail agregando campos adicionales
    return {
      ...place,
      phone: "+57 300 123 4567",
      website: "https://example.com",
      schedule: [
        { day: "monday", opensAt: "12:00", closesAt: "22:00" },
        { day: "tuesday", opensAt: "12:00", closesAt: "22:00" },
        { day: "wednesday", opensAt: "12:00", closesAt: "22:00" },
        { day: "thursday", opensAt: "12:00", closesAt: "22:00" },
        { day: "friday", opensAt: "12:00", closesAt: "23:00" },
        { day: "saturday", opensAt: "12:00", closesAt: "23:00" },
        { day: "sunday", opensAt: "12:00", closesAt: "21:00" },
      ],
      gallery: [],
      amenities: place.category === "restaurant" ? ["WiFi", "Terraza", "Estacionamiento"] : ["WiFi", "Música en vivo"],
      averageTicket: place.priceRange === "high" ? 80000 : place.priceRange === "medium" ? 50000 : 30000,
      capacity: 50,
      reviewCount: Math.floor(Math.random() * 100) + 20,
    } as PlaceDetail;
  }

  return apiClient.get<PlaceDetail>(`${PLACES_BASE}/${id}`);
}

export async function searchPlacesByName(name: string) {
  return apiClient.get<PlaceSummary[]>(`${PLACES_BASE}/search`, {
    params: { q: name },
  });
}

