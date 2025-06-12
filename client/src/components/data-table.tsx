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
  
  const { data, isLoading, error, refetch } = useWeekData(screenType, weekOffset);

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
          <div className="text-xs leading-tight whitespace-pre-line">
            {formatTimeRange(dayData.safeFrom1, dayData.safeTo1, date, false)}
          </div>,
          <div className="text-xs leading-tight whitespace-pre-line">
            {formatTimeRange(dayData.unsafeFrom1, dayData.unsafeTo1, date, false)}
          </div>,
          <div className="text-xs leading-tight whitespace-pre-line">
            {formatTimeRange(dayData.safeFrom2, dayData.safeTo2, date, true)}
          </div>,
          <div className="text-xs leading-tight whitespace-pre-line">
            {formatTimeRange(dayData.unsafeFrom2, dayData.unsafeTo2, date, true)}
          </div>
        ];
      case "tides":
        return [
          <div className="text-xs">
            <div className="text-blue-600">{dayData.highTide1Time || "—"}</div>
            {dayData.highTide1Height && <div className="text-xs text-black">{dayData.highTide1Height.toFixed(1)}m</div>}
          </div>,
          <div className="text-xs">
            <div className="text-blue-600">{dayData.lowTide1Time || "—"}</div>
            {dayData.lowTide1Height && <div className="text-xs text-black">{dayData.lowTide1Height.toFixed(1)}m</div>}
          </div>,
          <div className="text-xs">
            <div className="text-blue-600">{dayData.highTide2Time || "—"}</div>
            {dayData.highTide2Height && <div className="text-xs text-black">{dayData.highTide2Height.toFixed(1)}m</div>}
          </div>,
          <div className="text-xs">
            <div className="text-blue-600">{dayData.lowTide2Time || "—"}</div>
            {dayData.lowTide2Height && <div className="text-xs text-black">{dayData.lowTide2Height.toFixed(1)}m</div>}
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
          <div className="text-xs">
            {dayData.temperatureMin && dayData.temperatureMax ? (
              <>
                <div className="text-red-600">{dayData.temperatureMax}°</div>
                <div className="text-blue-600">{dayData.temperatureMin}°</div>
              </>
            ) : dayData.temperature ? (
              <div>{dayData.temperature}°</div>
            ) : "—"}
          </div>,
          
          // Precipitation column with umbrella icon for wet days
          <div className="text-xs flex items-center justify-center">
            {dayData.precipitationSum ? (
              <div className="flex items-center space-x-1">
                {isWetDay(dayData.precipitationSum) && (
                  <Umbrella className="h-2 w-2 text-blue-500" />
                )}
                <span>{dayData.precipitationSum}mm</span>
              </div>
            ) : "—"}
          </div>,
          
          // Wind column: Speed and direction
          <div className="text-xs">
            {dayData.windSpeed || dayData.windSpeedMax ? (
              <div className="flex flex-col items-center">
                <div className="flex items-center space-x-1">
                  <Wind className="h-2 w-2 text-gray-600" />
                  <span>{dayData.windSpeed || dayData.windSpeedMax}mph</span>
                </div>
                {dayData.windDirectionDominant && (
                  <div className="text-sm">{getWindDirection(dayData.windDirectionDominant)}</div>
                )}
              </div>
            ) : "—"}
          </div>,
          
          // UV & Cloud column
          <div className="text-xs">
            {dayData.uvIndexMax || dayData.cloudcover ? (
              <div className="flex flex-col items-center space-y-1">
                {dayData.uvIndexMax && (
                  <div className="flex items-center space-x-1">
                    <Sun className="h-2 w-2 text-yellow-500" />
                    <span>UV{dayData.uvIndexMax}</span>
                  </div>
                )}
                {dayData.cloudcover && (
                  <div className="flex items-center space-x-1">
                    <Cloud className="h-2 w-2 text-gray-500" />
                    <span>{dayData.cloudcover}%</span>
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

  const getCellBackground = (columnIndex: number) => {
    if (screenType === "crossings") {
      return columnIndex % 2 === 0 ? "bg-success-light" : "bg-error-light";
    }
    return "bg-gray-50";
  };

  return (
    <div className="p-4">
      <Card className="shadow-sm border border-gray-200 overflow-hidden">
        <CardHeader className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <CardTitle className="flex items-center font-semibold text-gray-800">
            {config.icon}
            {config.title}
          </CardTitle>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-2 py-2 text-left font-medium text-gray-700 sticky left-0 bg-gray-100 z-10 w-[70px]">
                  Day
                </th>
                {columns.map((column, index) => (
                  <th key={index} className="px-2 py-2 text-center font-medium text-gray-700 w-[70px]">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {weekDates.map((date, dayIndex) => {
                const isCurrentDay = isToday(date);
                const rowData = getRowData(date);
                const isLastWeekday = dayIndex === 4; // Friday (day index 4)
                
                return (
                  <tr
                    key={dayIndex}
                    className={`border-b hover:bg-gray-50 ${
                      isLastWeekday ? "border-b-2 border-gray-400" : "border-gray-100"
                    } ${
                      isCurrentDay ? "bg-primary-light bg-opacity-10 hover:bg-primary-light hover:bg-opacity-20" : ""
                    }`}
                  >
                    <td className={`px-2 py-2 font-medium sticky left-0 z-5 w-[70px] h-[50px] ${
                      isCurrentDay ? "bg-primary-light bg-opacity-10" : "bg-white"
                    }`}>
                      <div className="flex items-center">
                        <span className={isCurrentDay ? "text-primary font-semibold" : "text-gray-800"}>
                          {formatDayName(date)}
                        </span>
                        {isCurrentDay && (
                          <div className="w-2 h-2 bg-primary rounded-full ml-1"></div>
                        )}
                      </div>
                      <div className={`text-xs ${
                        isCurrentDay ? "text-primary font-medium" : "text-gray-500"
                      }`}>
                        {formatDayDate(date)}{isCurrentDay ? " (Today)" : ""}
                      </div>
                    </td>
                    {rowData.map((cellData, colIndex) => (
                      <td
                        key={colIndex}
                        className={`px-2 py-2 text-center text-gray-800 w-[70px] h-[50px] ${getCellBackground(colIndex)}`}
                      >
                        {cellData}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {screenType === "crossings" && (
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-success-light rounded mr-1"></div>
                  <span>Safe</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-error-light rounded mr-1"></div>
                  <span>Caution</span>
                </div>
              </div>
              <div className="text-gray-500">
                <RefreshCw className="h-3 w-3 inline mr-1" />
                Updated {new Date().toLocaleTimeString('en-US', { 
                  hour: 'numeric', 
                  minute: '2-digit',
                  hour12: true 
                })}
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
