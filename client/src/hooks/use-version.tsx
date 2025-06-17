import { APP_VERSION, APP_STATUS, APP_ENVIRONMENT } from "@/lib/version";

export function useVersion() {
  return {
    version: APP_VERSION,
    status: APP_STATUS,
    environment: APP_ENVIRONMENT,
    isLoading: false,
    error: null,
  };
}