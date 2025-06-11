import { useQuery } from "@tanstack/react-query";
import type { ScreenType } from "@/pages/home";
import type { CrossingTime, TideData, WeatherData } from "@shared/schema";

export function useWeekData(screenType: ScreenType, weekOffset: number) {
  const endpoint = screenType === "crossings" ? "crossing-times" : 
                   screenType === "tides" ? "tide-times" : 
                   "weather-data";
  
  const queryKey = `/api/${endpoint}/${weekOffset}`;
  console.log('Fetching data from:', queryKey);
  
  return useQuery({
    queryKey: [queryKey],
    enabled: true,
    onSuccess: (data) => {
      console.log('Data fetched successfully:', data);
    },
    onError: (error) => {
      console.error('Query error:', error);
    }
  });
}
