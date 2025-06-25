
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Waves, CloudSun, Navigation, RefreshCw, AlertTriangle, Umbrella, Wind, Sun, Cloud } from "lucide-react";
import { getWeekDates, isToday } from "@/lib/date-utils";
import { useWeekData } from "@/hooks/use-week-data";
import type { ScreenType } from "@/pages/home";

interface DataTableProps {
  screenType: ScreenType;
  weekOffset: number;
}

export default function DataTable({ screenType, weekOffset }: DataTableProps) {
  const weekDates = getWeekDates(weekOffset);
  
  const { data: rawData, isLoading, error, refetch } = useWeekData(screenType, weekOffset);

  // Extract data and timestamp from API response (all endpoints now return {data, lastUpdated})
  const data = rawData && typeof rawData === 'object' && 'data' in rawData 
    ? rawData.data 
    : rawData;
  
  const databaseTimestamp = rawData && typeof rawData === 'object' && 'lastUpdated' in rawData 
    ? rawData.lastUpdated as string
    : null;

  const getScreenConfig = () => {
    switch (screenType) {
      case "crossings":
        return {
          title: "Safe Crossing Times",
          icon: <Navigation className="h-5 w-5 text-primary mr-2" />,
          defaultColumns: ["Safe", "Unsafe", "Safe", "Unsafe"]
        };
      case "tides":
        return {
          title: "Tide Times",
          icon: <Waves className="h-5 w-5 text-primary mr-2" />,
          defaultColumns: ["High", "Low", "High", "Low"]
        };
      case "weather":
        return {
          title: "Weather Data",
          icon: <CloudSun className="h-5 w-5 text-primary mr-2" />,
          defaultColumns: ["Temp", "Precip", "Wind", "UV/Cloud"]
        };
      default:
        return {
          title: "Data",
          icon: null,
          defaultColumns: ["Column 1", "Column 2", "Column 3", "Column 4"]
        };
    }
  };

  const config = getScreenConfig();
  const columns = config.defaultColumns;

  if (isLoading) {
    return (
      <div className="p-4">
        <Card className="shadow-sm border border-gray-200">
          <CardContent className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading {config.title.toLowerCase()}...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Card className="shadow-sm border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center mb-2">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              <h3 className="font-semibold text-red-800">Connection Error</h3>
            </div>
            <p className="text-red-700 text-sm mb-3">
              Unable to connect to Harbor Data Manager. Please check your connection and try again.
            </p>
            <Button
              onClick={() => refetch()}
              variant="destructive"
              size="sm"
              className="bg-red-500 hover-bg-red-600"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatDayName = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const formatDayDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatTimeWithDay = (time: string, baseDate: Date, isSecondPeriod: boolean = false) => {
    if (!time || time === "—") return "—";
    
    const [hours, minutes] = time.split(':').map(Number);
    
    // For second period times (safeFrom2, safeTo2, unsafeFrom2, unsafeTo2), 
    // if it's in the morning (before 12pm), assume next day
    if (isSecondPeriod && hours < 12) {
      const timeDate = new Date(baseDate);
      timeDate.setDate(timeDate.getDate() + 1);
      const dayName = timeDate.toLocaleDateString('en-US', { weekday: 'short' });
      return `${time} (${dayName})`;
    }
    
    return time;
  };

  const formatTimeRange = (fromTime: string, toTime: string, baseDate: Date, isSecondPeriod: boolean = false) => {
    if (!fromTime || !toTime || fromTime === "—" || toTime === "—") return "—";
    
    const formattedFrom = formatTimeWithDay(fromTime, baseDate, isSecondPeriod);
    const formattedTo = formatTimeWithDay(toTime, baseDate, isSecondPeriod);
    
    return `${formattedFrom} until\n${formattedTo}`;
  };

  const isNextDayTime = (time: string) => {
    if (!time || time === "—") return false;
    const [hours] = time.split(':').map(Number);
    return hours < 12; // Morning hours indicate next day
  };

  const formatTideHeight = (height: string | number | null | undefined) => {
    if (!height) return "—";
    const numHeight = typeof height === 'string' ? parseFloat(height) : height;
    return isNaN(numHeight) ? "—" : `${numHeight.toFixed(1)}m`;
  };

  const getRowData = (date: Date) => {
    if (!data || !Array.isArray(data)) return ["—", "—", "—", "—"];
    
    // Use local date string to avoid timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    // Handle both date formats: "2025-06-25" and "2025-06-25T00:00:00.000Z"
    const dayData = data.find((d: any) => {
      const dbDate = d.date ? d.date.split('T')[0] : d.date; // Extract date part from ISO string
      return dbDate === dateStr;
    });
    
    if (!dayData) return ["—", "—", "—", "—"];

    switch (screenType) {
      case "crossings":
        return [
          <div key="safe1" className="text-sm leading-tight whitespace-pre-line">
            <div className="font-bold text-black">{dayData.safeFrom1 || dayData.morning || "—"}</div>
            <div className="text-sm">until</div>
            <div className="font-bold text-black">{dayData.safeTo1 || "—"}</div>
          </div>,
          <div key="unsafe1" className="text-sm leading-tight whitespace-pre-line">
            <div className="font-bold text-black">{dayData.unsafeFrom1 || dayData.midday || "—"}</div>
            <div className="text-sm">until</div>
            <div className="font-bold text-black">{dayData.unsafeTo1 || "—"}</div>
          </div>,
          <div key="safe2" className="text-sm leading-tight whitespace-pre-line">
            <div className="font-bold text-black">{dayData.safeFrom2 || dayData.evening || "—"}</div>
            <div className="text-sm">until</div>
            <div className="font-bold text-black">{formatTimeWithDay(dayData.safeTo2, date, true) || "—"}</div>
          </div>,
          <div key="unsafe2" className="text-sm leading-tight whitespace-pre-line">
            {dayData.unsafeFrom2 ? (
              <>
                <div className="font-bold text-black">{dayData.unsafeFrom2}</div>
                <div className="text-sm">until</div>
                <div className="font-bold text-black">{formatTimeWithDay(dayData.unsafeTo2, date, true)}</div>
              </>
            ) : "—"}
          </div>
        ];
      case "tides":
        return [
          <div key="high1" className="text-sm text-center">
            <div className="font-bold text-blue-600 text-base">{dayData.highTide1Time || "—"}</div>
            <div className="text-xs font-medium">{formatTideHeight(dayData.highTide1Height)}</div>
          </div>,
          <div key="low1" className="text-sm text-center">
            <div className="font-bold text-blue-600 text-base">{dayData.lowTide1Time || "—"}</div>
            <div className="text-xs font-medium">{formatTideHeight(dayData.lowTide1Height)}</div>
          </div>,
          <div key="high2" className="text-sm text-center">
            <div className="font-bold text-blue-600 text-base">{dayData.highTide2Time || "—"}</div>
            <div className="text-xs font-medium">{formatTideHeight(dayData.highTide2Height)}</div>
          </div>,
          <div key="low2" className="text-sm text-center">
            <div className="font-bold text-blue-600 text-base">{dayData.lowTide2Time || "—"}</div>
            <div className="text-xs font-medium">{formatTideHeight(dayData.lowTide2Height)}</div>
          </div>
        ];
      case "weather":
        // Helper function to get wind direction arrow
        const getWindDirection = (degrees: number) => {
          if (degrees === null || degrees === undefined) return "";
          const directions = ["↓", "↙", "←", "↖", "↑", "↗", "→", "↘"];
          const index = Math.round(degrees / 45) % 8;
          return directions[index];
        };

        // Helper function to determine if precipitation is high
        const isWetDay = (precipitation: string | null) => {
          if (!precipitation) return false;
          const precip = parseFloat(precipitation);
          return precip > 5; // Consider >5mm as particularly wet
        };

        return [
          <div key="temp" className="text-sm text-center">
            <div className="font-bold text-red-600 text-base">{dayData.temperatureMax || dayData.temperature || "—"}°</div>
            <div className="font-bold text-blue-600 text-sm">{dayData.temperatureMin || "—"}°</div>
          </div>,
          
          <div key="precip" className="text-sm text-center">
            {dayData.precipitation || dayData.precipitationSum ? (
              <div className="font-medium">{dayData.precipitation || dayData.precipitationSum}mm</div>
            ) : "—"}
          </div>,
          
          <div key="wind" className="text-sm text-center">
            <div className="font-medium">🌪️ {dayData.windSpeed || "—"}mph</div>
            <div className="text-xs">→</div>
          </div>,
          
          <div key="uv" className="text-sm text-center">
            <div className="font-medium">☀️ UV{dayData.uvIndexMax || dayData.uvIndex || "—"}</div>
            <div className="text-xs">☁️ {dayData.humidity || "—"}%</div>
          </div>
        ];
      default:
        return ["—", "—", "—", "—"];
    }
  };

  const getCellBackground = (columnIndex: number, isCurrentDay: boolean = false) => {
    if (screenType === "crossings") {
      return columnIndex % 2 === 0 ? "bg-green-100" : "bg-red-100";
    }
    if (screenType === "tides") {
      return "bg-blue-25";
    }
    return "bg-white";
  };

  return (
    <div className="p-4">
      <Card className="shadow-sm border border-gray-200 overflow-hidden">
        <CardHeader className="bg-gray-50 px-4 py-2 border-b border-gray-200">
          <CardTitle className="flex items-center justify-between text-base font-semibold text-gray-800">
            <div className="flex items-center">
              {config.icon}
              {config.title}
            </div>
            {screenType === "weather" && data && Array.isArray(data) && data.length > 0 && databaseTimestamp && (
              <div className="text-sm font-normal text-blue-600">
                Updated: {databaseTimestamp}
              </div>
            )}
          </CardTitle>
        </CardHeader>

        <div className="overflow-x-auto">
          <div className="w-full" style={{ width: "405px" }}>
            {/* Header Row */}
            <div className="bg-gray-100 flex" style={{ height: "45px" }}>
              <div className="px-2 py-3 text-center font-semibold text-gray-700 sticky left-0 bg-gray-100 z-10 text-sm flex items-center justify-center" style={{ width: "65px", minWidth: "65px", maxWidth: "65px" }}>
                Day
              </div>
              {columns.map((column, index) => (
                <div key={index} className="px-2 py-3 text-center font-semibold text-gray-700 text-sm flex items-center justify-center" style={{ width: "85px", minWidth: "85px", maxWidth: "85px" }}>
                  {column}
                </div>
              ))}
            </div>
            
            {/* Data Rows */}
            {weekDates.map((date, dayIndex) => {
              const isCurrentDay = isToday(date);
              const nextDay = weekDates[dayIndex + 1];
              const isNextDayToday = nextDay ? isToday(nextDay) : false;
              const rowData = getRowData(date);
              const isLastWeekday = dayIndex === 4; // Friday (day index 4)
              
              return (
                <div key={`row-${dayIndex}`}>
                  <div
                    className="flex"
                    style={{ height: "75px" }}
                  >
                    <div className={`px-2 py-3 font-medium sticky left-0 z-5 ${
                      isCurrentDay ? "bg-primary-light bg-opacity-10" : "bg-white"
                    } flex flex-col justify-center items-center text-center`} style={{ width: "65px", minWidth: "65px", maxWidth: "65px", height: "75px" }}>
                      <div className="flex items-center">
                        <span className={`text-sm font-semibold ${isCurrentDay ? "text-primary font-bold" : "text-gray-800"}`}>
                          {formatDayName(date)}
                        </span>
                        {isCurrentDay && (
                          <div className="w-2 h-2 bg-primary rounded-full ml-1"></div>
                        )}
                      </div>
                      <div className={`text-xs ${
                        isCurrentDay ? "text-primary font-medium" : "text-gray-500"
                      }`}>
                        {formatDayDate(date)}
                      </div>
                      {isCurrentDay && (
                        <div className="text-xs text-primary font-medium">
                          (Today)
                        </div>
                      )}
                    </div>
                    {rowData.map((cellData, colIndex) => (
                      <div
                        key={colIndex}
                        className="px-2 py-3 text-center text-gray-800 flex items-center justify-center"
                        style={{ 
                          width: "85px", 
                          minWidth: "85px", 
                          maxWidth: "85px", 
                          height: "75px",
                          backgroundColor: screenType === "tides" && (colIndex === 0 || colIndex === 2) 
                            ? "#eff6ff" 
                            : screenType === "crossings" 
                              ? (colIndex % 2 === 0 ? "hsl(120, 60%, 92%)" : "hsl(0, 100%, 96%)")
                              : "#f9fafb"
                        }}
                      >
                        {cellData}
                      </div>
                    ))}
                  </div>
                  {/* Regular day separator */}
                  {!isLastWeekday && (
                    <div 
                      style={{ 
                        height: "1px", 
                        width: "100%", 
                        backgroundColor: (isCurrentDay || isNextDayToday) ? "#93c5fd" : "white" 
                      }}
                    />
                  )}
                  {/* Weekend separator */}
                  {isLastWeekday && (
                    <div 
                      style={{ height: "3px", width: "100%", backgroundColor: "#9ca3af" }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </Card>
      
      {/* Footer with data source and timestamp - outside the card */}
      {data && Array.isArray(data) && data.length > 0 && (
        <div className="mt-2 px-2">
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>
              Source: {screenType === "crossings" ? "Northumberland County Council" : 
                      screenType === "tides" ? "UK Hydrographic Office" : 
                      "Open-Meteo"}
            </span>
            {databaseTimestamp && (
              <span>Last updated: {databaseTimestamp}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
