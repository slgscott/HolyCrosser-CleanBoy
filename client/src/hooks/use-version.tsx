import { useQuery } from "@tanstack/react-query";

interface HealthResponse {
  status: string;
  timestamp: string;
  version: string;
  environment: string;
}

export function useVersion() {
  const { data, isLoading, error } = useQuery<HealthResponse>({
    queryKey: ["/api/version"],
    staleTime: 0, // Force fresh data
    refetchOnWindowFocus: true,
  });

  return {
    version: data?.version || "Unknown",
    status: data?.status || "Unknown",
    environment: data?.environment || "Unknown",
    isLoading,
    error,
  };
}