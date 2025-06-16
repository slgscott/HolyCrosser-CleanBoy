
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

  // Extract data and timestamp from weather API response
  const data = screenType === "weather" && rawData && typeof rawData === 'object' && 'data' in rawData 
    ? rawData.data 
    : rawData;
  
  const databaseTimestamp = screenType === "weather" && rawData && typeof rawData === 'object' && 'lastUpdated' in rawData 
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

  const getRowData = (date: Date) => {
    if (!data || !Array.isArray(data)) return ["—", "—", "—", "—"];
    
    // Use local date string to avoid timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    const dayData = data.find((d: any) => d.date === dateStr);
    
    if (!dayData) return ["—", "—", "—", "—"];

    switch (screenType) {
      case "crossings":
        return [
          <div className="text-sm leading-tight whitespace-pre-line font-medium">
            {formatTimeRange(dayData.safeFrom1 || dayData.safe_from_1, dayData.safeTo1 || dayData.safe_to_1, date, false)}
          </div>,
          <div className="text-sm leading-tight whitespace-pre-line font-medium">
            {formatTimeRange(dayData.unsafeFrom1 || dayData.unsafe_from_1, dayData.unsafeTo1 || dayData.unsafe_to_1, date, false)}
          </div>,
          <div className="text-sm leading-tight whitespace-pre-line font-medium">
            {isNextDayTime(dayData.safeFrom2 || dayData.safe_from_2) ? "—" : formatTimeRange(dayData.safeFrom2 || dayData.safe_from_2, dayData.safeTo2 || dayData.safe_to_2, date, true)}
          </div>,
          <div className="text-sm leading-tight whitespace-pre-line font-medium">
            {isNextDayTime(dayData.unsafeFrom2 || dayData.unsafe_from_2) ? "—" : formatTimeRange(dayData.unsafeFrom2 || dayData.unsafe_from_2, dayData.unsafeTo2 || dayData.unsafe_to_2, date, true)}
          </div>
        ];
      case "tides":
        return [
          <div className="text-sm">
            <div className="text-base text-blue-600 font-medium">{dayData.highTide1Time || dayData.high_tide_1_time || "—"}</div>
            {(dayData.highTide1Height || dayData.high_tide_1_height) && <div className="text-sm text-black">{(dayData.highTide1Height || dayData.high_tide_1_height).toFixed(1)}m</div>}
          </div>,
          <div className="text-sm">
            <div className="text-base text-blue-600 font-medium">{dayData.lowTide1Time || dayData.low_tide_1_time || "—"}</div>
            {(dayData.lowTide1Height || dayData.low_tide_1_height) && <div className="text-sm text-black">{(dayData.lowTide1Height || dayData.low_tide_1_height).toFixed(1)}m</div>}
          </div>,
          <div className="text-sm">
            <div className="text-base text-blue-600 font-medium">{dayData.highTide2Time || dayData.high_tide_2_time || "—"}</div>
            {(dayData.highTide2Height || dayData.high_tide_2_height) && <div className="text-sm text-black">{(dayData.highTide2Height || dayData.high_tide_2_height).toFixed(1)}m</div>}
          </div>,
          <div className="text-sm">
            <div className="text-base text-blue-600 font-medium">{dayData.lowTide2Time || dayData.low_tide_2_time || "—"}</div>
            {(dayData.lowTide2Height || dayData.low_tide_2_height) && <div className="text-sm text-black">{(dayData.lowTide2Height || dayData.low_tide_2_height).toFixed(1)}m</div>}
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
          // Temperature column: Max/Min
          <div className="text-sm">
            {dayData.temperatureMin && dayData.temperatureMax ? (
              <>
                <div className="text-red-600 font-medium">{dayData.temperatureMax}°</div>
                <div className="text-blue-600 font-medium">{dayData.temperatureMin}°</div>
              </>
            ) : dayData.temperature ? (
              <div className="font-medium">{dayData.temperature}°</div>
            ) : "—"}
          </div>,
          
          // Precipitation column with umbrella icon for wet days
          <div className="text-sm flex items-center justify-center">
            {dayData.precipitationSum ? (
              <div className="flex items-center space-x-1">
                {isWetDay(dayData.precipitationSum) && (
                  <Umbrella className="h-3 w-3 text-blue-500" />
                )}
                <span className="font-medium">{dayData.precipitationSum}mm</span>
              </div>
            ) : "—"}
          </div>,
          
          // Wind column: Speed and direction
          <div className="text-sm">
            {dayData.windSpeed || dayData.windSpeedMax ? (
              <div className="flex flex-col items-center">
                <div className="flex items-center space-x-1">
                  <Wind className="h-3 w-3 text-gray-600" />
                  <span className="font-medium">{dayData.windSpeed || dayData.windSpeedMax}mph</span>
                </div>
                {dayData.windDirectionDominant && (
                  <div className="text-base">{getWindDirection(dayData.windDirectionDominant)}</div>
                )}
              </div>
            ) : "—"}
          </div>,
          
          // UV & Cloud column
          <div className="text-sm">
            {dayData.uvIndexMax || dayData.cloudcover ? (
              <div className="flex flex-col items-center space-y-1">
                {dayData.uvIndexMax && (
                  <div className="flex items-center space-x-1">
                    <Sun className="h-3 w-3 text-yellow-500" />
                    <span className="font-medium">UV{dayData.uvIndexMax}</span>
                  </div>
                )}
                {dayData.cloudcover && (
                  <div className="flex items-center space-x-1">
                    <Cloud className="h-3 w-3 text-gray-500" />
                    <span className="font-medium">{dayData.cloudcover}%</span>
                  </div>
                )}
              </div>
            ) : "—"}
          </div>
        ];
      default:
        return ["—", "—", "—", "—"];
    }
  };

  const getCellBackground = (columnIndex: number, isCurrentDay: boolean = false) => {
    if (screenType === "crossings") {
      return columnIndex % 2 === 0 ? "bg-success-light" : "bg-error-light";
    }
    if (screenType === "tides") {
      // High1 and High2 columns (index 0 and 2) get light blue background
      if (columnIndex === 0 || columnIndex === 2) {
        return "bg-blue-25";
      }
      return "bg-gray-50";
    }
    return "bg-gray-50";
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
    </div>
  );
}
