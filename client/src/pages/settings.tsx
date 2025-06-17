import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useVersion } from "@/hooks/use-version";
import { ChevronLeft, Save, Info } from "lucide-react";
import { useLocation } from "wouter";
import type { UserPreferences, AppSettings } from "@shared/schema";

export default function Settings() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { version, status, environment } = useVersion();

  // Query for preferences
  const { data: preferences, isLoading: preferencesLoading } = useQuery<UserPreferences[]>({
    queryKey: ["/api/preferences"],
  });

  // Query for app settings
  const { data: appSettings, isLoading: settingsLoading } = useQuery<AppSettings>({
    queryKey: ["/api/settings"],
  });

  // Available data fields for each screen type
  const availableFields = {
    crossings: [
      { value: "safeFrom1-safeTo1", label: "Safe Period 1" },
      { value: "unsafeFrom1-unsafeTo1", label: "Unsafe Period 1" },
      { value: "safeFrom2-safeTo2", label: "Safe Period 2" },
      { value: "unsafeFrom2-unsafeTo2", label: "Unsafe Period 2" },
      { value: "status", label: "Status" },
      { value: "notes", label: "Notes" }
    ],
    tides: [
      { value: "highTide1Time-highTide1Height", label: "High Tide 1" },
      { value: "lowTide1Time-lowTide1Height", label: "Low Tide 1" },
      { value: "highTide2Time-highTide2Height", label: "High Tide 2" },
      { value: "lowTide2Time-lowTide2Height", label: "Low Tide 2" }
    ],
    weather: [
      { value: "temperature", label: "Temperature" },
      { value: "temperatureMax", label: "Max Temperature" },
      { value: "temperatureMin", label: "Min Temperature" },
      { value: "windSpeed", label: "Wind Speed" },
      { value: "windSpeedMax", label: "Max Wind Speed" },
      { value: "windDirection", label: "Wind Direction" },
      { value: "humidity", label: "Humidity" },
      { value: "precipitationSum", label: "Precipitation" },
      { value: "cloudcover", label: "Cloud Cover" },
      { value: "uvIndexMax", label: "UV Index" },
      { value: "condition", label: "Condition" },
      { value: "description", label: "Description" }
    ]
  };

  // Local state for column selections
  const [columnSelections, setColumnSelections] = useState({
    crossings: {
      column1: "safeFrom1-safeTo1",
      column2: "unsafeFrom1-unsafeTo1", 
      column3: "safeFrom2-safeTo2",
      column4: "unsafeFrom2-unsafeTo2"
    },
    tides: {
      column1: "highTide1Time-highTide1Height",
      column2: "lowTide1Time-lowTide1Height",
      column3: "highTide2Time-highTide2Height",
      column4: "lowTide2Time-lowTide2Height"
    },
    weather: {
      column1: "temperature",
      column2: "windSpeed",
      column3: "precipitationSum",
      column4: "humidity"
    }
  });

  // Initialize form data when preferences load
  useEffect(() => {
    if (preferences) {
      const crossingPrefs = preferences.find(p => p.screenType === "crossings");
      const tidePrefs = preferences.find(p => p.screenType === "tides");
      const weatherPrefs = preferences.find(p => p.screenType === "weather");

      if (crossingPrefs) {
        setColumnSelections(prev => ({
          ...prev,
          crossings: {
            column1: crossingPrefs.column1Name,
            column2: crossingPrefs.column2Name,
            column3: crossingPrefs.column3Name,
            column4: crossingPrefs.column4Name,
          }
        }));
      }

      if (tidePrefs) {
        setColumnSelections(prev => ({
          ...prev,
          tides: {
            column1: tidePrefs.column1Name,
            column2: tidePrefs.column2Name,
            column3: tidePrefs.column3Name,
            column4: tidePrefs.column4Name,
          }
        }));
      }

      if (weatherPrefs) {
        setColumnSelections(prev => ({
          ...prev,
          weather: {
            column1: weatherPrefs.column1Name,
            column2: weatherPrefs.column2Name,
            column3: weatherPrefs.column3Name,
            column4: weatherPrefs.column4Name,
          }
        }));
      }
    }
  }, [preferences]);

  // Mutation for saving preferences
  const savePreferencesMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/preferences", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/preferences"] });
      toast({ title: "Success", description: "Column preferences saved successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to save preferences", variant: "destructive" });
    },
  });

  const handleSavePreferences = async () => {
    try {
      // Save all three screen preferences  
      const screens = ['crossings', 'tides', 'weather'] as const;
      
      for (const screenType of screens) {
        const selections = columnSelections[screenType];
        const fieldLabels = availableFields[screenType];
        
        await savePreferencesMutation.mutateAsync({
          screenType,
          column1Name: fieldLabels.find(f => f.value === selections.column1)?.label || selections.column1,
          column2Name: fieldLabels.find(f => f.value === selections.column2)?.label || selections.column2,
          column3Name: fieldLabels.find(f => f.value === selections.column3)?.label || selections.column3,
          column4Name: fieldLabels.find(f => f.value === selections.column4)?.label || selections.column4,
        });
      }
    } catch (error) {
      // Error handled by mutation onError
    }
  };

  const updateColumnSelection = (screenType: keyof typeof columnSelections, column: string, value: string) => {
    setColumnSelections(prev => ({
      ...prev,
      [screenType]: {
        ...prev[screenType],
        [column]: value
      }
    }));
  };

  if (preferencesLoading || settingsLoading) {
    return (
      <div className="min-h-screen">
        <header className="bg-primary text-white px-4 py-6 flex items-center">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-primary-light mr-3"
            onClick={() => setLocation("/")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-bold">Setup</h1>
        </header>
        <div className="p-4">
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary text-white px-4 py-6 flex items-center shadow-md">
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-primary-light mr-3"
          onClick={() => setLocation("/")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-bold">Column Setup</h1>
      </header>

      <div className="p-4 space-y-4">
        {/* Safe Crossing Times */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Safe Crossing Times - Column Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {[1, 2, 3, 4].map((colNum) => (
                <div key={colNum}>
                  <Label className="text-sm font-medium">Column {colNum}</Label>
                  <Select
                    value={columnSelections.crossings[`column${colNum}` as keyof typeof columnSelections.crossings]}
                    onValueChange={(value) => updateColumnSelection('crossings', `column${colNum}`, value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select data field" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableFields.crossings.map((field) => (
                        <SelectItem key={field.value} value={field.value}>
                          {field.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tide Times */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tide Times - Column Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {[1, 2, 3, 4].map((colNum) => (
                <div key={colNum}>
                  <Label className="text-sm font-medium">Column {colNum}</Label>
                  <Select
                    value={columnSelections.tides[`column${colNum}` as keyof typeof columnSelections.tides]}
                    onValueChange={(value) => updateColumnSelection('tides', `column${colNum}`, value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select data field" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableFields.tides.map((field) => (
                        <SelectItem key={field.value} value={field.value}>
                          {field.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weather Data */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Weather Data - Column Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {[1, 2, 3, 4].map((colNum) => (
                <div key={colNum}>
                  <Label className="text-sm font-medium">Column {colNum}</Label>
                  <Select
                    value={columnSelections.weather[`column${colNum}` as keyof typeof columnSelections.weather]}
                    onValueChange={(value) => updateColumnSelection('weather', `column${colNum}`, value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select data field" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableFields.weather.map((field) => (
                        <SelectItem key={field.value} value={field.value}>
                          {field.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Button
          onClick={handleSavePreferences}
          className="w-full"
          disabled={savePreferencesMutation.isPending}
        >
          <Save className="h-4 w-4 mr-2" />
          {savePreferencesMutation.isPending ? "Saving..." : "Save Column Settings"}
        </Button>

        {/* App Information */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Info className="h-5 w-5 mr-2" />
              App Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Version:</span>
              <Badge variant="secondary">{version}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Status:</span>
              <Badge variant={status === 'healthy' ? 'default' : 'destructive'}>{status}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Environment:</span>
              <Badge variant="outline">{environment}</Badge>
            </div>
            <div className="pt-2 border-t">
              <p className="text-xs text-gray-600">
                Maritime navigation app with authentic harbor data from Northumberland County Council
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
