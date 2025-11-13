import { apiClient } from "@/lib/api/client";
import type {
  Booking,
  BookingDetail,
  BookingListResponse,
  CreateBookingPayload,
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

export async function createBooking(payload: CreateBookingPayload): Promise<Booking> {
  if (USE_MOCK_DATA) {
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 800));

    const user = useAuthStore.getState().user;
    if (!user) {
      throw new Error("Debes iniciar sesión para crear una reserva");
    }

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
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const user = useAuthStore.getState().user;
    if (!user) {
      return { data: [], total: 0, page: 1, pageSize: 0 };
    }

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

