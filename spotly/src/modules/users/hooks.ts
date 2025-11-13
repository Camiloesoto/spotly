import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UpdateUserProfilePayload, UserProfile } from "./types";
import { getUserProfile, updateUserProfile } from "./service";

const USER_PROFILE_KEY = ["user-profile"];

export function useUserProfileQuery() {
  return useQuery<UserProfile>({
    queryKey: USER_PROFILE_KEY,
    queryFn: getUserProfile,
    staleTime: 60000, // 1 minuto
  });
}

export function useUpdateUserProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation<UserProfile, Error, UpdateUserProfilePayload>({
    mutationFn: updateUserProfile,
    onSuccess: (updatedProfile) => {
      // Invalidar la query para refrescar
      queryClient.setQueryData(USER_PROFILE_KEY, updatedProfile);
      queryClient.invalidateQueries({ queryKey: USER_PROFILE_KEY });
    },
  });
}

