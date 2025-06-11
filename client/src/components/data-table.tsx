import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Waves, CloudSun, Navigation, RefreshCw, AlertTriangle } from "lucide-react";
import { getWeekDates, isToday } from "@/lib/date-utils";
import { useWeekData } from "@/hooks/use-week-data";
import type { ScreenType } from "@/pages/home";
import type { UserPreferences } from "@shared/schema";

interface DataTableProps {
  screenType: ScreenType;
  weekOffset: number;
}

export default function DataTable({ screenType, weekOffset }: DataTableProps) {
  const weekDates = getWeekDates(weekOffset);
  
  // Get column preferences
  const { data: preferences } = useQuery<UserPreferences[]>({
    queryKey: ["/api/preferences"],
  });

  const currentPreferences = preferences?.find(p => p.screenType === screenType);
  
  const { data, isLoading, error, refetch } = useWeekData(screenType, weekOffset);

  const getScreenConfig = () => {
    switch (screenType) {
      case "crossings":
        return {
          title: "Safe Crossing Times",
          icon: <Navigation className="h-5 w-5 text-primary mr-2" />,
          defaultColumns: ["Morning", "Midday", "Evening", "Night"]
        };
      case "tides":
        return {
          title: "Tide Times",
          icon: <Waves className="h-5 w-5 text-primary mr-2" />,
          defaultColumns: ["High Tide 1", "Low Tide 1", "High Tide 2", "Low Tide 2"]
        };
      case "weather":
        return {
          title: "Weather Data",
          icon: <CloudSun className="h-5 w-5 text-primary mr-2" />,
          defaultColumns: ["Temperature", "Wind Speed", "Precipitation", "Visibility"]
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
  const columns = currentPreferences ? [
    currentPreferences.column1Name,
    currentPreferences.column2Name,
    currentPreferences.column3Name,
    currentPreferences.column4Name
  ] : config.defaultColumns;

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

  const getRowData = (date: Date) => {
    if (!data || !Array.isArray(data)) return ["—", "—", "—", "—"];
    
    const dateStr = date.toISOString().split('T')[0];
    const dayData = data.find((d: any) => d.date === dateStr);
    
    if (!dayData) return ["—", "—", "—", "—"];

    switch (screenType) {
      case "crossings":
        return [
          dayData.safeFrom1 || "—",
          dayData.safeTo1 || "—", 
          dayData.safeFrom2 || "—",
          dayData.safeTo2 || "—"
        ];
      case "tides":
        return [
          dayData.highTide1Time || "—",
          dayData.lowTide1Time || "—",
          dayData.highTide2Time || "—", 
          dayData.lowTide2Time || "—"
        ];
      case "weather":
        return [
          dayData.temperature ? `${dayData.temperature}°` : dayData.temperatureMax ? `${dayData.temperatureMax}°` : "—",
          dayData.windSpeed ? `${dayData.windSpeed} mph` : dayData.windSpeedMax ? `${dayData.windSpeedMax} mph` : "—",
          dayData.precipitationSum !== null ? `${dayData.precipitationSum}mm` : "—",
          dayData.humidity ? `${dayData.humidity}%` : dayData.cloudcover ? `${dayData.cloudcover}%` : "—"
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
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 text-left font-medium text-gray-700 sticky left-0 bg-gray-100 z-10 min-w-[80px]">
                  Day
                </th>
                {columns.map((column, index) => (
                  <th key={index} className="px-3 py-2 text-center font-medium text-gray-700 min-w-[90px]">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {weekDates.map((date, dayIndex) => {
                const isCurrentDay = isToday(date);
                const rowData = getRowData(date);
                
                return (
                  <tr
                    key={dayIndex}
                    className={`border-b border-gray-100 hover:bg-gray-50 ${
                      isCurrentDay ? "bg-primary-light bg-opacity-10 hover:bg-primary-light hover:bg-opacity-20" : ""
                    }`}
                  >
                    <td className={`px-3 py-3 font-medium sticky left-0 z-10 ${
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
                        className={`px-3 py-3 text-center text-gray-800 ${getCellBackground(colIndex)}`}
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
