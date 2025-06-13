import { useState } from "react";
import WeekNavigation from "@/components/week-navigation";
import DataTable from "@/components/data-table";
import BottomNavigation from "@/components/bottom-navigation";
import PWAInstallPrompt from "@/components/pwa-install-prompt";

export type ScreenType = "crossings" | "tides" | "weather";

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>("crossings");
  const [weekOffset, setWeekOffset] = useState(0);

  const handlePreviousWeek = () => {
    setWeekOffset(prev => prev - 1);
  };

  const handleNextWeek = () => {
    setWeekOffset(prev => prev + 1);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-primary text-white px-4 py-4 shadow-md relative">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Holy Crosser</h1>
        </div>
        <p className="text-xs opacity-70 absolute top-2 right-4">Version 2.6.0</p>
      </header>

      {/* Week Navigation */}
      <WeekNavigation
        weekOffset={weekOffset}
        onPreviousWeek={handlePreviousWeek}
        onNextWeek={handleNextWeek}
      />

      {/* Data Table */}
      <DataTable
        screenType={currentScreen}
        weekOffset={weekOffset}
      />

      {/* Bottom Navigation */}
      <BottomNavigation
        currentScreen={currentScreen}
        onScreenChange={setCurrentScreen}
      />

      {/* PWA Install Prompt */}
      <PWAInstallPrompt />

      {/* Bottom padding for fixed navigation */}
      <div className="h-20"></div>
    </div>
  );
}
