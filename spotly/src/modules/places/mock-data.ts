import type { PlaceListResponse, PlaceSummary } from "./types";

export const MOCK_PLACES: PlaceSummary[] = [
  {
    id: "1",
    name: "La Terraza del Mar",
    description: "Restaurante de mariscos frescos con vista al océano. Ambiente relajado y música en vivo los fines de semana.",
    city: "Bogotá",
    address: "Calle 85 #12-45, Zona Rosa",
    latitude: 4.6533,
    longitude: -74.0836,
    category: "restaurant",
    priceRange: "high",
    rating: 4.7,
    coverImageUrl: undefined,
    musicStyles: ["Jazz", "Latin"],
    distanceInKm: 2.5,
  },
  {
    id: "2",
    name: "Bar El Rincón",
    description: "Bar acogedor con amplia selección de cervezas artesanales y cócteles clásicos. Ideal para after office.",
    city: "Bogotá",
    address: "Carrera 15 #93-20",
    latitude: 4.6789,
    longitude: -74.0523,
    category: "bar",
    priceRange: "medium",
    rating: 4.5,
    coverImageUrl: undefined,
    musicStyles: ["Rock", "Indie"],
    distanceInKm: 3.2,
  },
  {
    id: "3",
    name: "Club Nocturno",
    description: "Discoteca moderna con las mejores pistas de baile y DJs internacionales. Ambiente vibrante y energía alta.",
    city: "Bogotá",
    address: "Calle 70 #5-30",
    latitude: 4.6543,
    longitude: -74.0598,
    category: "club",
    priceRange: "high",
    rating: 4.3,
    coverImageUrl: undefined,
    musicStyles: ["Electronic", "Reggaeton", "Hip-Hop"],
    distanceInKm: 1.8,
  },
  {
    id: "4",
    name: "Café Artesanal",
    description: "Cafetería especializada en café de origen colombiano. Ambiente tranquilo perfecto para trabajar o estudiar.",
    city: "Bogotá",
    address: "Carrera 7 #32-16",
    latitude: 4.6097,
    longitude: -74.0817,
    category: "restaurant",
    priceRange: "low",
    rating: 4.6,
    coverImageUrl: undefined,
    musicStyles: ["Indie", "Jazz"],
    distanceInKm: 4.1,
  },
  {
    id: "5",
    name: "Sushi Bar Tokio",
    description: "Restaurante japonés auténtico con sushi fresco y ambiente elegante. Reserva recomendada los fines de semana.",
    city: "Bogotá",
    address: "Calle 93 #12-45",
    latitude: 4.6789,
    longitude: -74.0456,
    category: "restaurant",
    priceRange: "high",
    rating: 4.8,
    coverImageUrl: undefined,
    musicStyles: [],
    distanceInKm: 2.9,
  },
  {
    id: "6",
    name: "Pub Irlandés",
    description: "Auténtico pub irlandés con ambiente festivo, cerveza Guinness y música en vivo. Perfecto para grupos grandes.",
    city: "Bogotá",
    address: "Carrera 11 #85-30",
    latitude: 4.6654,
    longitude: -74.0521,
    category: "bar",
    priceRange: "medium",
    rating: 4.4,
    coverImageUrl: undefined,
    musicStyles: ["Rock", "Country"],
    distanceInKm: 3.5,
  },
];

export function getMockPlacesResponse(filters?: {
  search?: string;
  category?: string;
  priceRange?: string;
}): PlaceListResponse {
  let filtered = [...MOCK_PLACES];

  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(
      (place) =>
        place.name.toLowerCase().includes(searchLower) ||
        place.description.toLowerCase().includes(searchLower) ||
        place.city.toLowerCase().includes(searchLower)
    );
  }

  if (filters?.category && filters.category !== "all") {
    filtered = filtered.filter((place) => place.category === filters.category);
  }

  if (filters?.priceRange && filters.priceRange !== "all") {
    filtered = filtered.filter((place) => place.priceRange === filters.priceRange);
  }

  return {
    data: filtered,
    total: filtered.length,
    page: 1,
    pageSize: filtered.length,
  };
}

