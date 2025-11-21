"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPlace,
  getPlaceById,
  getPlaceByOwnerId,
  listPlaces,
  searchPlacesByName,
  updatePlaceBookingConfig,
} from "./service";
import type {
  CreatePlacePayload,
  PlaceDetail,
  PlaceFilters,
  PlaceListResponse,
  PlaceSummary,
  UpdatePlaceBookingConfigPayload,
} from "./types";

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

export function useCreatePlaceMutation() {
  return useMutation<PlaceDetail, Error, CreatePlacePayload>({
    mutationFn: createPlace,
  });
}

export function usePlaceByOwnerQuery(ownerId: string) {
  return useQuery<PlaceDetail | null, Error>({
    queryKey: ["place", "owner", ownerId],
    queryFn: () => getPlaceByOwnerId(ownerId),
    enabled: Boolean(ownerId),
  });
}

export function useUpdatePlaceBookingConfigMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    PlaceDetail,
    Error,
    { placeId: string; payload: UpdatePlaceBookingConfigPayload }
  >({
    mutationFn: ({ placeId, payload }) => updatePlaceBookingConfig(placeId, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["place", data.id] });
      queryClient.invalidateQueries({ queryKey: ["place", "owner"] });
      queryClient.invalidateQueries({ queryKey: ["places"] });
    },
  });
}

