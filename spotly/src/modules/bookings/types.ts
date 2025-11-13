export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed" | "rejected";

export type Booking = {
  id: string;
  placeId: string;
  placeName: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  date: string; // ISO date string
  time: string; // HH:mm format
  numberOfGuests: number;
  status: BookingStatus;
  specialRequests?: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
};

export type CreateBookingPayload = {
  placeId: string;
  date: string; // ISO date string (YYYY-MM-DD)
  time: string; // HH:mm format
  numberOfGuests: number;
  specialRequests?: string;
};

export type BookingListResponse = {
  data: Booking[];
  total: number;
  page: number;
  pageSize: number;
};

export type BookingDetail = Booking & {
  placeAddress?: string;
  placePhone?: string;
  cancellationReason?: string;
};

