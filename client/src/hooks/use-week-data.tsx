import { useQuery } from "@tanstack/react-query";
import type { ScreenType } from "@/pages/home";
import type { CrossingTime, TideData, WeatherData } from "@shared/schema";

export function useWeekData(screenType: ScreenType, weekOffset: number) {
  const endpoint = screenType === "crossings" ? "crossing-times" : 
                   screenType === "tides" ? "tide-times" : 
                   "weather-data";
  
  const result = useQuery({
    queryKey: [`/api/${endpoint}/${weekOffset}`],
    enabled: true,
  });
  
  console.log(`Query for ${screenType} (${endpoint}) week ${weekOffset}:`, result);
  
  return result;
}
