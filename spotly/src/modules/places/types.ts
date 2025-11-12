export type PlaceCategory = "restaurant" | "bar" | "club";

export type PriceRange = "low" | "medium" | "high";

export type PlaceSummary = {
  id: string;
  name: string;
  description: string;
  city: string;
  address: string;
  latitude: number;
  longitude: number;
  category: PlaceCategory;
  priceRange: PriceRange;
  rating: number;
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
  page: number;
  pageSize: number;
};

