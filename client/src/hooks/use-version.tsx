import { useQuery } from "@tanstack/react-query";

interface HealthResponse {
  status: string;
  timestamp: string;
  version: string;
  environment: string;
}

export function useVersion() {
  const { data, isLoading, error } = useQuery<HealthResponse>({
    queryKey: ["/api/health"],
    staleTime: 0,
    refetchOnWindowFocus: false,
  });

  return {
    version: data?.version || "Loading...",
    status: data?.status || "Unknown",
    environment: data?.environment || "Unknown",
    isLoading,
    error,
  };
}
