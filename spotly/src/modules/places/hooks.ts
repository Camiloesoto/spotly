"use client";

import { useQuery } from "@tanstack/react-query";
import { getPlaceById, listPlaces, searchPlacesByName } from "./service";
import type { PlaceDetail, PlaceFilters, PlaceListResponse, PlaceSummary } from "./types";

const PLACES_QUERY_KEY = ["places"];

export function usePlacesQuery(filters: PlaceFilters = {}) {
  return useQuery<PlaceListResponse, Error>({
    queryKey: [...PLACES_QUERY_KEY, filters],
    queryFn: () => listPlaces(filters),
  });
}

export function usePlacesSearchQuery(searchTerm: string) {
  return useQuery<PlaceSummary[], Error>({
    queryKey: [...PLACES_QUERY_KEY, "search", searchTerm],
    queryFn: () => searchPlacesByName(searchTerm),
    enabled: searchTerm.length > 1,
  });
}

export function usePlaceQuery(id: string) {
  return useQuery<PlaceDetail, Error>({
    queryKey: [...PLACES_QUERY_KEY, id],
    queryFn: () => getPlaceById(id),
    enabled: Boolean(id),
  });
}

