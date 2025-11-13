import { apiClient } from "@/lib/api/client";
import type {
  Booking,
  BookingDetail,
  BookingListResponse,
  CreateBookingPayload,
  BookingStatus,
} from "./types";
import {
  addMockBooking,
  getMockBookingById,
  getMockBookingsByUserId,
  updateMockBooking,
} from "./mock-data";
import { useAuthStore } from "@/lib/store/auth-store";
import { getPlaceById } from "@/modules/places/service";

const BOOKINGS_BASE = "/bookings";

// Usar mock data si no hay API_URL configurada o si está explícitamente habilitado
const USE_MOCK_DATA =
  process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true" ||
  !process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_URL === "http://localhost:3333/api/v1" ||
  process.env.NODE_ENV === "development";

// Helper para verificar si Prisma está disponible
async function getPrisma() {
  try {
    const { prisma } = await import("@/lib/prisma");
    return prisma;
  } catch (error) {
    return null;
  }
}

// Helper para mapear BookingStatus de Prisma a string
function mapPrismaStatusToStatus(prismaStatus: string): BookingStatus {
  const statusMap: Record<string, BookingStatus> = {
    PENDING: "pending",
    CONFIRMED: "confirmed",
    CANCELLED: "cancelled",
    COMPLETED: "completed",
    REJECTED: "rejected",
  };
  return statusMap[prismaStatus] || "pending";
}

// Helper para mapear string a BookingStatus de Prisma
function mapStatusToPrismaStatus(status: BookingStatus): string {
  const statusMap: Record<BookingStatus, string> = {
    pending: "PENDING",
    confirmed: "CONFIRMED",
    cancelled: "CANCELLED",
    completed: "COMPLETED",
    rejected: "REJECTED",
  };
  return statusMap[status] || "PENDING";
}

// Helper para convertir Booking de Prisma a tipo local
function mapPrismaBookingToBooking(prismaBooking: any): Booking {
  return {
    id: prismaBooking.id,
    placeId: prismaBooking.placeId,
    placeName: prismaBooking.placeName,
    userId: prismaBooking.userId,
    userName: prismaBooking.user?.name || "Usuario",
    userEmail: prismaBooking.user?.email || "",
    userPhone: prismaBooking.user?.phone || undefined,
    date: prismaBooking.date.toISOString().split("T")[0], // Extraer solo la fecha
    time: prismaBooking.time,
    numberOfGuests: prismaBooking.numberOfGuests,
    status: mapPrismaStatusToStatus(prismaBooking.status),
    specialRequests: prismaBooking.specialRequests || undefined,
    createdAt: prismaBooking.createdAt.toISOString(),
    updatedAt: prismaBooking.updatedAt.toISOString(),
  };
}

// Helper para convertir Booking de Prisma a BookingDetail
function mapPrismaBookingToBookingDetail(prismaBooking: any): BookingDetail {
  return {
    ...mapPrismaBookingToBooking(prismaBooking),
    placeAddress: prismaBooking.place?.address || "",
    placePhone: prismaBooking.place?.phone || "",
  };
}

export async function createBooking(payload: CreateBookingPayload): Promise<Booking> {
  // Intentar usar Prisma primero (si está disponible y no estamos en modo mock)
  const prisma = await getPrisma();
  const user = useAuthStore.getState().user;

  if (!user) {
    throw new Error("Debes iniciar sesión para crear una reserva");
  }

  if (prisma && !USE_MOCK_DATA) {
    try {
      // Obtener información del lugar
      let placeName = "Lugar de ejemplo";
      try {
        const place = await getPlaceById(payload.placeId);
        placeName = place.name;
      } catch (error) {
        console.warn("No se pudo obtener el nombre del lugar:", error);
      }

      // Convertir fecha string a Date
      const bookingDate = new Date(payload.date + "T" + payload.time);

      // @ts-ignore - Prisma puede no estar instalado
      const prismaModule = await import("@prisma/client");
      const statusEnum = prismaModule?.BookingStatus?.PENDING || "PENDING";

      const newBooking = await prisma.booking.create({
        data: {
          placeId: payload.placeId,
          userId: user.id,
          date: bookingDate,
          time: payload.time,
          numberOfGuests: payload.numberOfGuests,
          specialRequests: payload.specialRequests || null,
          status: statusEnum,
          placeName,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      });

      return mapPrismaBookingToBooking(newBooking);
    } catch (error) {
      // Si hay error de Prisma, fallar al mock data o API
      console.error("Error usando Prisma, fallando a mock data:", error);
    }
  }

  if (USE_MOCK_DATA) {
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Generar ID único
    const bookingId = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Obtener información del lugar
    let placeName = "Lugar de ejemplo";
    try {
      const place = await getPlaceById(payload.placeId);
      placeName = place.name;
    } catch (error) {
      console.warn("No se pudo obtener el nombre del lugar:", error);
    }

    const newBooking: Booking = {
      id: bookingId,
      placeId: payload.placeId,
      placeName,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userPhone: undefined,
      date: payload.date,
      time: payload.time,
      numberOfGuests: payload.numberOfGuests,
      status: "pending",
      specialRequests: payload.specialRequests,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addMockBooking(newBooking);
    return newBooking;
  }

  const booking = await apiClient.post<Booking>(BOOKINGS_BASE, payload);
  return booking;
}

export async function getBookingsByUser(): Promise<BookingListResponse> {
  // Intentar usar Prisma primero (si está disponible y no estamos en modo mock)
  const prisma = await getPrisma();
  const user = useAuthStore.getState().user;

  if (!user) {
    return { data: [], total: 0, page: 1, pageSize: 0 };
  }

  if (prisma && !USE_MOCK_DATA) {
    try {
      const prismaBookings = await prisma.booking.findMany({
        where: { userId: user.id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          place: {
            select: {
              id: true,
              name: true,
              address: true,
              phone: true,
            },
          },
        },
        orderBy: { date: "desc" },
      });

      const bookings = prismaBookings.map(mapPrismaBookingToBooking);

      // Ordenar por fecha y hora combinadas (más recientes primero)
      const sortedBookings = bookings.sort((a: Booking, b: Booking) => 
        new Date(b.date + "T" + b.time).getTime() - new Date(a.date + "T" + a.time).getTime()
      );

      return {
        data: sortedBookings,
        total: sortedBookings.length,
        page: 1,
        pageSize: sortedBookings.length,
      };
    } catch (error) {
      // Si hay error de Prisma, fallar al mock data o API
      console.error("Error usando Prisma, fallando a mock data:", error);
    }
  }

  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const userBookings = getMockBookingsByUserId(user.id);

    return {
      data: userBookings.sort((a, b) => 
        new Date(b.date + "T" + b.time).getTime() - new Date(a.date + "T" + a.time).getTime()
      ),
      total: userBookings.length,
      page: 1,
      pageSize: userBookings.length,
    };
  }

  return apiClient.get<BookingListResponse>(BOOKINGS_BASE);
}

export async function getBookingById(id: string): Promise<BookingDetail> {
  // Intentar usar Prisma primero (si está disponible y no estamos en modo mock)
  const prisma = await getPrisma();
  if (prisma && !USE_MOCK_DATA) {
    try {
      const prismaBooking = await prisma.booking.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          place: {
            select: {
              id: true,
              name: true,
              address: true,
              phone: true,
            },
          },
        },
      });

      if (!prismaBooking) {
        throw new Error("Reserva no encontrada");
      }

      return mapPrismaBookingToBookingDetail(prismaBooking);
    } catch (error) {
      // Si hay error de Prisma, fallar al mock data o API
      console.error("Error usando Prisma, fallando a mock data:", error);
    }
  }

  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const booking = getMockBookingById(id);
    if (!booking) {
      throw new Error("Reserva no encontrada");
    }

    return {
      ...booking,
      placeAddress: "Dirección del lugar",
      placePhone: "+57 300 123 4567",
    };
  }

  return apiClient.get<BookingDetail>(`${BOOKINGS_BASE}/${id}`);
}

export async function cancelBooking(id: string): Promise<Booking> {
  // Intentar usar Prisma primero (si está disponible y no estamos en modo mock)
  const prisma = await getPrisma();
  if (prisma && !USE_MOCK_DATA) {
    try {
      // @ts-ignore - Prisma puede no estar instalado
      const prismaModule = await import("@prisma/client");
      const statusEnum = prismaModule?.BookingStatus?.CANCELLED || "CANCELLED";

      const updated = await prisma.booking.update({
        where: { id },
        data: {
          status: statusEnum,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      });

      return mapPrismaBookingToBooking(updated);
    } catch (error) {
      // Si hay error de Prisma, fallar al mock data o API
      console.error("Error usando Prisma, fallando a mock data:", error);
    }
  }

  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const updated = updateMockBooking(id, { status: "cancelled" });
    if (!updated) {
      throw new Error("Reserva no encontrada");
    }

    return updated;
  }

  return apiClient.patch<Booking>(`${BOOKINGS_BASE}/${id}/cancel`, {});
}

