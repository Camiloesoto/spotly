import { apiClient } from "@/lib/api/client";
import { getMockPlacesResponse, MOCK_PLACES } from "./mock-data";
import type {
  BookingScheduleItem,
  CreatePlacePayload,
  PlaceCategory,
  PlaceDetail,
  PlaceFilters,
  PlaceListResponse,
  PlaceSummary,
  UpdatePlaceBookingConfigPayload,
} from "./types";

const PLACES_BASE = "/places";
// Usar mock data si no hay API_URL configurada o si está explícitamente habilitado
// En desarrollo, siempre usar mock data a menos que se especifique lo contrario
const USE_MOCK_DATA =
  process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true" ||
  !process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_URL === "http://localhost:3333/api/v1" ||
  process.env.NODE_ENV === "development";

// Helper para verificar si Prisma está disponible
async function getPrisma() {
  try {
    const { getPrismaClient } = await import("@/lib/prisma");
    return await getPrismaClient();
  } catch (error) {
    return null;
  }
}

// Helper para mapear PriceRange de Prisma a string
function mapPrismaPriceRangeToPriceRange(prismaRange: string): "low" | "medium" | "high" {
  const rangeMap: Record<string, "low" | "medium" | "high"> = {
    LOW: "low",
    MEDIUM: "medium",
    HIGH: "high",
  };
  return rangeMap[prismaRange] || "medium";
}

// Helper para convertir Place de Prisma a PlaceSummary
function mapPrismaPlaceToPlaceSummary(prismaPlace: any, distanceInKm?: number): PlaceSummary {
  return {
    id: prismaPlace.id,
    name: prismaPlace.name,
    description: prismaPlace.description,
    city: prismaPlace.city,
    address: prismaPlace.address,
    latitude: prismaPlace.latitude || undefined,
    longitude: prismaPlace.longitude || undefined,
    category: prismaPlace.categories[0] || "restaurant", // Tomar la primera categoría
    priceRange: mapPrismaPriceRangeToPriceRange(prismaPlace.priceRange),
    rating: prismaPlace.rating || undefined,
    coverImageUrl: prismaPlace.coverImageUrl || undefined,
    musicStyles: prismaPlace.musicStyles || [],
    distanceInKm: distanceInKm || prismaPlace.distanceInKm || undefined,
  };
}

// Helper para convertir Place de Prisma a PlaceDetail
function mapPrismaPlaceToPlaceDetail(prismaPlace: any): PlaceDetail {
  const schedule = (prismaPlace.schedule as any) || [];
  const avgRating = prismaPlace.rating || 0;
  const priceRange = mapPrismaPriceRangeToPriceRange(prismaPlace.priceRange);
  
  return {
    id: prismaPlace.id,
    name: prismaPlace.name,
    description: prismaPlace.description,
    city: prismaPlace.city,
    address: prismaPlace.address,
    latitude: prismaPlace.latitude || undefined,
    longitude: prismaPlace.longitude || undefined,
    category: prismaPlace.categories[0] || "restaurant",
    priceRange,
    rating: avgRating,
    coverImageUrl: prismaPlace.coverImageUrl || undefined,
    musicStyles: prismaPlace.musicStyles || [],
    distanceInKm: prismaPlace.distanceInKm || undefined,
    phone: prismaPlace.phone,
    website: undefined, // No está en el schema aún
    schedule,
    gallery: [], // No está en el schema aún
    amenities: prismaPlace.category === "restaurant" ? ["WiFi", "Terraza"] : ["WiFi", "Música en vivo"],
    averageTicket: priceRange === "high" ? 80000 : priceRange === "medium" ? 50000 : 30000,
    capacity: prismaPlace.capacity || undefined,
    reviewCount: 0, // Se calculará desde reviews cuando las implementemos
  };
}

export async function listPlaces(filters: PlaceFilters = {}) {
  // Intentar usar Prisma primero (si está disponible y no estamos en modo mock)
  const prisma = await getPrisma();
  if (prisma && !USE_MOCK_DATA) {
    try {
      const where: any = {};

      // Filtro por búsqueda (nombre o descripción)
      if (filters.search) {
        where.OR = [
          { name: { contains: filters.search, mode: "insensitive" } },
          { description: { contains: filters.search, mode: "insensitive" } },
        ];
      }

      // Filtro por categoría
      if (filters.category) {
        where.categories = { has: filters.category };
      }

      // Filtro por rango de precios
      if (filters.priceRange) {
        // @ts-ignore - Prisma puede no estar instalado
        const prismaModule = await import("@prisma/client");
        const PriceRange = (prismaModule as any).PriceRange;
        const priceRangeEnum = PriceRange?.[filters.priceRange.toUpperCase()] || filters.priceRange.toUpperCase();
        where.priceRange = priceRangeEnum;
      }

      const prismaPlaces = await prisma.place.findMany({
        where,
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          reviews: {
            select: {
              rating: true,
            },
          },
        },
        orderBy: {
          rating: "desc",
        },
      });

      // Calcular rating promedio y mapear a PlaceSummary
      const places = prismaPlaces.map((place: any) => {
        const avgRating = place.reviews.length > 0
          ? place.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / place.reviews.length
          : place.rating || 0;

        return mapPrismaPlaceToPlaceSummary(
          { ...place, rating: avgRating },
          place.distanceInKm || undefined
        );
      });

      return {
        data: places,
        total: places.length,
      } as PlaceListResponse;
    } catch (error) {
      // Si hay error de Prisma, fallar al mock data o API
      console.error("Error usando Prisma, fallando a mock data:", error);
    }
  }

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
  // Intentar usar Prisma primero (si está disponible y no estamos en modo mock)
  const prisma = await getPrisma();
  if (prisma && !USE_MOCK_DATA) {
    try {
      const prismaPlace = await prisma.place.findUnique({
        where: { id },
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          reviews: {
            select: {
              id: true,
              rating: true,
              comment: true,
              createdAt: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  avatarUrl: true,
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
            take: 10, // Últimas 10 reseñas
          },
        },
      });

      if (!prismaPlace) {
        throw new Error("Lugar no encontrado");
      }

      // Calcular rating promedio
      const avgRating = prismaPlace.reviews.length > 0
        ? prismaPlace.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / prismaPlace.reviews.length
        : prismaPlace.rating || 0;

      const placeDetail = mapPrismaPlaceToPlaceDetail({
        ...prismaPlace,
        rating: avgRating,
        reviewCount: prismaPlace.reviews.length,
      });

      return placeDetail;
    } catch (error) {
      // Si hay error de Prisma, fallar al mock data o API
      console.error("Error usando Prisma, fallando a mock data:", error);
    }
  }

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

export async function createPlace(payload: CreatePlacePayload): Promise<PlaceDetail> {
  // Intentar usar Prisma primero (si está disponible y no estamos en modo mock)
  const prisma = await getPrisma();
  if (prisma && !USE_MOCK_DATA) {
    try {
      // @ts-ignore - Prisma puede no estar instalado
      const prismaModule = await import("@prisma/client");
      const PriceRange = (prismaModule as any).PriceRange;
      const priceRangeEnum = PriceRange?.[payload.priceRange.toUpperCase()] || payload.priceRange.toUpperCase();

      const prismaPlace = await prisma.place.create({
        data: {
          name: payload.name,
          description: payload.description,
          address: payload.address,
          city: payload.city,
          country: payload.country,
          phone: payload.phone,
          latitude: payload.latitude,
          longitude: payload.longitude,
          categories: payload.categories,
          priceRange: priceRangeEnum,
          musicStyles: payload.musicStyles,
          schedule: payload.schedule as any,
          coverImageUrl: payload.coverImageUrl,
          ownerId: payload.ownerId,
          rating: 0, // Rating inicial
        },
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          reviews: {
            select: {
              rating: true,
            },
          },
        },
      });

      const avgRating = prismaPlace.reviews.length > 0
        ? prismaPlace.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / prismaPlace.reviews.length
        : prismaPlace.rating || 0;

      return mapPrismaPlaceToPlaceDetail({
        ...prismaPlace,
        rating: avgRating,
        reviewCount: prismaPlace.reviews.length,
      });
    } catch (error) {
      // Si hay error de Prisma, fallar al mock data o API
      console.error("Error usando Prisma, fallando a mock data:", error);
    }
  }

  if (USE_MOCK_DATA) {
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // Crear un nuevo lugar con datos mock
    const newPlace: PlaceDetail = {
      id: `place-${Date.now()}`,
      name: payload.name,
      description: payload.description,
      city: payload.city,
      address: payload.address,
      latitude: payload.latitude,
      longitude: payload.longitude,
      category: (payload.categories[0] as PlaceCategory) || "restaurant",
      priceRange: payload.priceRange,
      rating: 0,
      coverImageUrl: payload.coverImageUrl,
      musicStyles: payload.musicStyles,
      phone: payload.phone,
      website: undefined,
      schedule: payload.schedule.map((s) => ({
        day: s.day,
        opensAt: s.opensAt,
        closesAt: s.closesAt,
        isClosed: false,
      })),
      gallery: [],
      amenities: [],
      averageTicket: payload.priceRange === "high" ? 80000 : payload.priceRange === "medium" ? 50000 : 30000,
      capacity: 50,
      reviewCount: 0,
    };

    return newPlace;
  }

  return apiClient.post<PlaceDetail>(PLACES_BASE, payload);
}

export async function getPlaceByOwnerId(ownerId: string): Promise<PlaceDetail | null> {
  // Intentar usar Prisma primero (si está disponible y no estamos en modo mock)
  const prisma = await getPrisma();
  if (prisma && !USE_MOCK_DATA) {
    try {
      const prismaPlace = await prisma.place.findFirst({
        where: { ownerId },
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          reviews: {
            select: {
              rating: true,
            },
          },
        },
      });

      if (!prismaPlace) {
        return null;
      }

      const avgRating = prismaPlace.reviews.length > 0
        ? prismaPlace.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / prismaPlace.reviews.length
        : prismaPlace.rating || 0;

      return mapPrismaPlaceToPlaceDetail({
        ...prismaPlace,
        rating: avgRating,
        reviewCount: prismaPlace.reviews.length,
      });
    } catch (error) {
      console.error("Error usando Prisma, fallando a mock data:", error);
    }
  }

  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    // En mock data, buscar por ownerId no está implementado, retornar null
    return null;
  }

  return apiClient.get<PlaceDetail | null>(`${PLACES_BASE}/owner/${ownerId}`);
}

export async function updatePlaceBookingConfig(
  placeId: string,
  payload: UpdatePlaceBookingConfigPayload
): Promise<PlaceDetail> {
  // Intentar usar Prisma primero (si está disponible y no estamos en modo mock)
  const prisma = await getPrisma();
  if (prisma && !USE_MOCK_DATA) {
    try {
      const updateData: any = {};
      
      if (payload.capacity !== undefined) {
        updateData.capacity = payload.capacity;
      }
      
      if (payload.bookingSchedule !== undefined) {
        updateData.bookingSchedule = payload.bookingSchedule as any;
      }

      const prismaPlace = await prisma.place.update({
        where: { id: placeId },
        data: updateData,
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          reviews: {
            select: {
              rating: true,
            },
          },
        },
      });

      const avgRating = prismaPlace.reviews.length > 0
        ? prismaPlace.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / prismaPlace.reviews.length
        : prismaPlace.rating || 0;

      return mapPrismaPlaceToPlaceDetail({
        ...prismaPlace,
        rating: avgRating,
        reviewCount: prismaPlace.reviews.length,
      });
    } catch (error) {
      console.error("Error usando Prisma, fallando a mock data:", error);
      throw error;
    }
  }

  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    // En mock data, actualizar no está implementado completamente
    const place = MOCK_PLACES.find((p) => p.id === placeId);
    if (!place) {
      throw new Error("Lugar no encontrado");
    }
    // Retornar el lugar con los datos actualizados (simulado)
    const placeDetail: PlaceDetail = {
      ...place,
      capacity: payload.capacity ?? undefined,
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
      amenities: [],
      averageTicket: place.priceRange === "high" ? 80000 : place.priceRange === "medium" ? 50000 : 30000,
      reviewCount: 0,
    };
    return placeDetail;
  }

  return apiClient.patch<PlaceDetail>(`${PLACES_BASE}/${placeId}/booking-config`, payload);
}

