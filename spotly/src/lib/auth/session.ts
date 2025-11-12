"use client";

import { useEffect } from "react";
import { apiClient } from "../api/client";
import { useAuthStore } from "../store/auth-store";

/**
 * Hook para mantener sincronizado el token de autenticación con el cliente HTTP.
 * Debe ser usado en layouts o providers cercanos a la raíz (e.g. dashboard).
 */
export function useSyncSessionToken() {
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    apiClient.setAuthToken(token);
  }, [token]);
}

