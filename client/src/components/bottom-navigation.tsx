import { Button } from "@/components/ui/button";
import { Navigation, Waves, CloudSun, Settings } from "lucide-react";
import { useLocation } from "wouter";
import type { ScreenType } from "@/pages/home";

interface BottomNavigationProps {
  currentScreen: ScreenType;
  onScreenChange: (screen: ScreenType) => void;
}

export default function BottomNavigation({ currentScreen, onScreenChange }: BottomNavigationProps) {
  const [, setLocation] = useLocation();

  const navItems = [
    {
      id: "crossings" as ScreenType,
      label: "Crossings",
      icon: Navigation,
      onClick: () => onScreenChange("crossings")
    },
    {
      id: "tides" as ScreenType,
      label: "Tides", 
      icon: Waves,
      onClick: () => onScreenChange("tides")
    },
    {
      id: "weather" as ScreenType,
      label: "Weather",
      icon: CloudSun,
      onClick: () => onScreenChange("weather")
    },
    {
      id: "settings" as const,
      label: "Setup",
      icon: Settings,
      onClick: () => setLocation("/settings")
    }
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 max-w-md w-full bg-white border-t border-gray-200 shadow-lg">
      <div className="flex justify-around py-2">
        {navItems.map((item) => {
          const isActive = item.id === currentScreen || (item.id === "settings" && window.location.pathname === "/settings");
          const Icon = item.icon;
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              className={`flex-1 py-3 px-2 text-center font-medium transition-colors ${
                isActive 
                  ? "bg-primary text-white" 
                  : "text-gray-600 hover:bg-gray-50"
              }`}
              onClick={item.onClick}
            >
              <div className="flex flex-col items-center">
                <Icon className="h-5 w-5 mb-1" />
                <span className="text-xs">{item.label}</span>
              </div>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}
