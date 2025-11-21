import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createRestaurantRequest,
  getRestaurantRequestById,
  listRestaurantRequests,
  reviewRestaurantRequest,
  submitPlaceProfile,
} from "./service";
import type { ReviewRestaurantRequestPayload, SubmitPlaceProfilePayload } from "./types";

export function useRestaurantRequestsQuery(status?: string) {
  return useQuery({
    queryKey: ["restaurant-requests", status],
    queryFn: () => listRestaurantRequests(status),
  });
}

export function useRestaurantRequestQuery(id: string) {
  return useQuery({
    queryKey: ["restaurant-request", id],
    queryFn: () => getRestaurantRequestById(id),
    enabled: !!id,
  });
}

export function useCreateRestaurantRequestMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRestaurantRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["restaurant-requests"] });
    },
  });
}

export function useReviewRestaurantRequestMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ReviewRestaurantRequestPayload }) =>
      reviewRestaurantRequest(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["restaurant-requests"] });
    },
  });
}

export function useSubmitPlaceProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SubmitPlaceProfilePayload) => submitPlaceProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["restaurant-requests"] });
      queryClient.invalidateQueries({ queryKey: ["places"] });
    },
  });
}

