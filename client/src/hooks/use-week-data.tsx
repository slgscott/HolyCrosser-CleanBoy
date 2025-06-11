import { useQuery } from "@tanstack/react-query";
import type { ScreenType } from "@/pages/home";
import type { CrossingTime, TideData, WeatherData } from "@shared/schema";

export function useWeekData(screenType: ScreenType, weekOffset: number) {
  return useQuery({
    queryKey: [`/api/${screenType === "crossings" ? "crossing-times" : screenType === "tides" ? "tide-times" : "weather-data"}`, weekOffset],
    enabled: true,
  });
}
