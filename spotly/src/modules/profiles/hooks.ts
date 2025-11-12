"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  approveLocalProfile,
  getLocalProfile,
  rejectLocalProfile,
  updateLocalProfile,
} from "./service";
import type { LocalProfile, UpdateLocalProfilePayload } from "./types";

const LOCAL_PROFILE_KEY = ["local-profile"];

export function useLocalProfileQuery(id: string) {
  return useQuery<LocalProfile, Error>({
    queryKey: [...LOCAL_PROFILE_KEY, id],
    queryFn: () => getLocalProfile(id),
    enabled: Boolean(id),
  });
}

export function useUpdateLocalProfileMutation(id: string) {
  const queryClient = useQueryClient();
  return useMutation<LocalProfile, Error, UpdateLocalProfilePayload>({
    mutationFn: (payload) => updateLocalProfile(id, payload),
    onSuccess: (profile) => {
      queryClient.setQueryData([...LOCAL_PROFILE_KEY, id], profile);
    },
  });
}

export function useApproveLocalProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation<LocalProfile, Error, string>({
    mutationFn: approveLocalProfile,
    onSuccess: (profile) => {
      queryClient.invalidateQueries({ queryKey: LOCAL_PROFILE_KEY });
      queryClient.setQueryData([...LOCAL_PROFILE_KEY, profile.id], profile);
    },
  });
}

export function useRejectLocalProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation<LocalProfile, Error, { id: string; reason: string }>({
    mutationFn: ({ id, reason }) => rejectLocalProfile(id, reason),
    onSuccess: (profile) => {
      queryClient.invalidateQueries({ queryKey: LOCAL_PROFILE_KEY });
      queryClient.setQueryData([...LOCAL_PROFILE_KEY, profile.id], profile);
    },
  });
}

