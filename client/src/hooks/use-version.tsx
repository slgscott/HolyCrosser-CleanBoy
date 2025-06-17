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
<<<<<<< HEAD
    staleTime: 0,
=======
    staleTime: 0, // 5 minutes
>>>>>>> bd23dc6eafd966bc176fceb3c19fd7cb20ff5371
    refetchOnWindowFocus: false,
  });

  return {
    version: data?.version || "2.9.1",
    status: data?.status || "healthy",
    environment: data?.environment || "production",
    isLoading,
    error,
  };
}
