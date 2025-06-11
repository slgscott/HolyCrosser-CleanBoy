import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getWeekRange } from "@/lib/date-utils";

interface WeekNavigationProps {
  weekOffset: number;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
}

export default function WeekNavigation({ weekOffset, onPreviousWeek, onNextWeek }: WeekNavigationProps) {
  const { startDate, endDate } = getWeekRange(weekOffset);
  
  const formatDateRange = (start: Date, end: Date) => {
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    const startStr = start.toLocaleDateString('en-US', options);
    const endStr = end.toLocaleDateString('en-US', options);
    const year = end.getFullYear();
    return `${startStr} - ${endStr}, ${year}`;
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <Button
        variant="ghost"
        size="sm"
        className="p-2 rounded-full hover:bg-gray-100"
        onClick={onPreviousWeek}
      >
        <ChevronLeft className="h-5 w-5 text-primary" />
      </Button>
      
      <div className="text-center">
        <h2 className="font-semibold text-gray-800">
          {formatDateRange(startDate, endDate)}
        </h2>
        <p className="text-xs text-gray-500">Week Navigation</p>
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        className="p-2 rounded-full hover:bg-gray-100"
        onClick={onNextWeek}
      >
        <ChevronRight className="h-5 w-5 text-primary" />
      </Button>
    </div>
  );
}
