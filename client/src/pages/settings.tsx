import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { ChevronLeft, Save } from "lucide-react";
import { useLocation } from "wouter";
import type { UserPreferences, AppSettings } from "@shared/schema";

export default function Settings() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Query for preferences
  const { data: preferences, isLoading: preferencesLoading } = useQuery<UserPreferences[]>({
    queryKey: ["/api/preferences"],
  });

  // Query for app settings
  const { data: appSettings, isLoading: settingsLoading } = useQuery<AppSettings>({
    queryKey: ["/api/settings"],
  });

  // Local state for form data
  const [crossingColumns, setCrossingColumns] = useState({
    column1Name: "Morning",
    column2Name: "Midday", 
    column3Name: "Evening",
    column4Name: "Night"
  });

  const [tideColumns, setTideColumns] = useState({
    column1Name: "High Tide 1",
    column2Name: "Low Tide 1",
    column3Name: "High Tide 2", 
    column4Name: "Low Tide 2"
  });

  const [weatherColumns, setWeatherColumns] = useState({
    column1Name: "Temperature",
    column2Name: "Wind Speed",
    column3Name: "Precipitation",
    column4Name: "Visibility"
  });

  // Initialize form data when preferences load
  useState(() => {
    if (preferences) {
      const crossingPrefs = preferences.find(p => p.screenType === "crossings");
      const tidePrefs = preferences.find(p => p.screenType === "tides");
      const weatherPrefs = preferences.find(p => p.screenType === "weather");

      if (crossingPrefs) {
        setCrossingColumns({
          column1Name: crossingPrefs.column1Name,
          column2Name: crossingPrefs.column2Name,
          column3Name: crossingPrefs.column3Name,
          column4Name: crossingPrefs.column4Name,
        });
      }

      if (tidePrefs) {
        setTideColumns({
          column1Name: tidePrefs.column1Name,
          column2Name: tidePrefs.column2Name,
          column3Name: tidePrefs.column3Name,
          column4Name: tidePrefs.column4Name,
        });
      }

      if (weatherPrefs) {
        setWeatherColumns({
          column1Name: weatherPrefs.column1Name,
          column2Name: weatherPrefs.column2Name,
          column3Name: weatherPrefs.column3Name,
          column4Name: weatherPrefs.column4Name,
        });
      }
    }
  });

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
      await savePreferencesMutation.mutateAsync({
        screenType: "crossings",
        ...crossingColumns
      });
      
      await savePreferencesMutation.mutateAsync({
        screenType: "tides", 
        ...tideColumns
      });
      
      await savePreferencesMutation.mutateAsync({
        screenType: "weather",
        ...weatherColumns
      });
    } catch (error) {
      // Error handled by mutation onError
    }
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
            <CardTitle className="text-lg">Safe Crossing Times</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="crossing-col1" className="text-sm">Column 1</Label>
                <Input
                  id="crossing-col1"
                  value={crossingColumns.column1Name}
                  onChange={(e) => setCrossingColumns(prev => ({ ...prev, column1Name: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="crossing-col2" className="text-sm">Column 2</Label>
                <Input
                  id="crossing-col2"
                  value={crossingColumns.column2Name}
                  onChange={(e) => setCrossingColumns(prev => ({ ...prev, column2Name: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="crossing-col3" className="text-sm">Column 3</Label>
                <Input
                  id="crossing-col3"
                  value={crossingColumns.column3Name}
                  onChange={(e) => setCrossingColumns(prev => ({ ...prev, column3Name: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="crossing-col4" className="text-sm">Column 4</Label>
                <Input
                  id="crossing-col4"
                  value={crossingColumns.column4Name}
                  onChange={(e) => setCrossingColumns(prev => ({ ...prev, column4Name: e.target.value }))}
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tide Times */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tide Times</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="tide-col1" className="text-sm">Column 1</Label>
                <Input
                  id="tide-col1"
                  value={tideColumns.column1Name}
                  onChange={(e) => setTideColumns(prev => ({ ...prev, column1Name: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="tide-col2" className="text-sm">Column 2</Label>
                <Input
                  id="tide-col2"
                  value={tideColumns.column2Name}
                  onChange={(e) => setTideColumns(prev => ({ ...prev, column2Name: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="tide-col3" className="text-sm">Column 3</Label>
                <Input
                  id="tide-col3"
                  value={tideColumns.column3Name}
                  onChange={(e) => setTideColumns(prev => ({ ...prev, column3Name: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="tide-col4" className="text-sm">Column 4</Label>
                <Input
                  id="tide-col4"
                  value={tideColumns.column4Name}
                  onChange={(e) => setTideColumns(prev => ({ ...prev, column4Name: e.target.value }))}
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weather Data */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Weather Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="weather-col1" className="text-sm">Column 1</Label>
                <Input
                  id="weather-col1"
                  value={weatherColumns.column1Name}
                  onChange={(e) => setWeatherColumns(prev => ({ ...prev, column1Name: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="weather-col2" className="text-sm">Column 2</Label>
                <Input
                  id="weather-col2"
                  value={weatherColumns.column2Name}
                  onChange={(e) => setWeatherColumns(prev => ({ ...prev, column2Name: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="weather-col3" className="text-sm">Column 3</Label>
                <Input
                  id="weather-col3"
                  value={weatherColumns.column3Name}
                  onChange={(e) => setWeatherColumns(prev => ({ ...prev, column3Name: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="weather-col4" className="text-sm">Column 4</Label>
                <Input
                  id="weather-col4"
                  value={weatherColumns.column4Name}
                  onChange={(e) => setWeatherColumns(prev => ({ ...prev, column4Name: e.target.value }))}
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator />

        <Button
          onClick={handleSavePreferences}
          className="w-full"
          disabled={savePreferencesMutation.isPending}
        >
          <Save className="h-4 w-4 mr-2" />
          {savePreferencesMutation.isPending ? "Saving..." : "Save Column Settings"}
        </Button>
      </div>
    </div>
  );
}
