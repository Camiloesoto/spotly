"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useEffect, useState } from "react";
import { useSyncSessionToken } from "@/lib/auth/session";
import { useAuthStore } from "@/lib/store/auth-store";

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  const [queryClient] = useState(() => new QueryClient());
  const [isHydrated, setIsHydrated] = useState(false);
  useSyncSessionToken();

  // Hidratar el store de autenticación solo en el cliente
  useEffect(() => {
    useAuthStore.persist.rehydrate();
    setIsHydrated(true);
  }, []);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

