import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Booking,
  BookingDetail,
  BookingListResponse,
  CreateBookingPayload,
} from "./types";
import {
  cancelBooking,
  createBooking,
  getBookingById,
  getBookingsByUser,
} from "./service";

const BOOKINGS_QUERY_KEY = ["bookings"];

export function useBookingsQuery() {
  return useQuery<BookingListResponse>({
    queryKey: BOOKINGS_QUERY_KEY,
    queryFn: getBookingsByUser,
    staleTime: 30000, // 30 segundos
  });
}

export function useBookingQuery(id: string) {
  return useQuery<BookingDetail>({
    queryKey: [...BOOKINGS_QUERY_KEY, id],
    queryFn: () => getBookingById(id),
    enabled: !!id,
    staleTime: 30000,
  });
}

export function useCreateBookingMutation() {
  const queryClient = useQueryClient();

  return useMutation<Booking, Error, CreateBookingPayload>({
    mutationFn: createBooking,
    onSuccess: () => {
      // Invalidar la lista de reservas para refrescar
      queryClient.invalidateQueries({ queryKey: BOOKINGS_QUERY_KEY });
    },
  });
}

export function useCancelBookingMutation() {
  const queryClient = useQueryClient();

  return useMutation<Booking, Error, string>({
    mutationFn: cancelBooking,
    onSuccess: () => {
      // Invalidar la lista de reservas para refrescar
      queryClient.invalidateQueries({ queryKey: BOOKINGS_QUERY_KEY });
    },
  });
}

