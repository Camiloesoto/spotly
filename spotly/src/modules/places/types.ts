export type PlaceCategory = "restaurant" | "bar" | "club";

export type PriceRange = "low" | "medium" | "high";

export type PlaceSummary = {
  id: string;
  name: string;
  description: string;
  city: string;
  address: string;
  latitude?: number;
  longitude?: number;
  category: PlaceCategory;
  priceRange: PriceRange;
  rating?: number;
  coverImageUrl?: string;
  musicStyles: string[];
  distanceInKm?: number;
};

export type PlaceFilters = {
  search?: string;
  category?: PlaceCategory;
  priceRange?: PriceRange;
  latitude?: number;
  longitude?: number;
  radiusInKm?: number;
};

export type PlaceListResponse = {
  data: PlaceSummary[];
  total: number;
  page?: number;
  pageSize?: number;
};

export type PlaceDetail = PlaceSummary & {
  phone?: string;
  website?: string;
  schedule?: Array<{
    day: string;
    opensAt: string;
    closesAt: string;
    isClosed?: boolean;
  }>;
  gallery?: string[];
  amenities?: string[];
  averageTicket?: number;
  capacity?: number;
  reviewCount?: number;
};

export type CreatePlacePayload = {
  name: string;
  description: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  latitude?: number;
  longitude?: number;
  categories: string[];
  priceRange: PriceRange;
  musicStyles: string[];
  schedule: Array<{
    day: string;
    opensAt: string;
    closesAt: string;
  }>;
  coverImageUrl?: string;
  ownerId: string;
};

export type BookingScheduleItem = {
  day: string;
  opensAt: string;
  closesAt: string;
  isAvailable: boolean;
};

export type UpdatePlaceBookingConfigPayload = {
  capacity?: number;
  bookingSchedule?: BookingScheduleItem[];
};
