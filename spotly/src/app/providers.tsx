"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { useSyncSessionToken } from "@/lib/auth/session";

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  const [queryClient] = useState(() => new QueryClient());
  useSyncSessionToken();

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

