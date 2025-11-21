import type { Booking } from "./types";

// Simular reservas en memoria (solo para desarrollo)
export const MOCK_BOOKINGS: Booking[] = [];

export function getMockBookingsByUserId(userId: string): Booking[] {
  if (!userId) {
    return MOCK_BOOKINGS; // Si no hay userId, retornar todas
  }
  return MOCK_BOOKINGS.filter((booking) => booking.userId === userId);
}

export function getMockBookingById(id: string): Booking | undefined {
  return MOCK_BOOKINGS.find((booking) => booking.id === id);
}

export function addMockBooking(booking: Booking): void {
  MOCK_BOOKINGS.push(booking);
}

export function updateMockBooking(id: string, updates: Partial<Booking>): Booking | null {
  const index = MOCK_BOOKINGS.findIndex((b) => b.id === id);
  if (index === -1) return null;

  MOCK_BOOKINGS[index] = { ...MOCK_BOOKINGS[index], ...updates, updatedAt: new Date().toISOString() };
  return MOCK_BOOKINGS[index];
}

