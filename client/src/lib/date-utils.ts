export function getWeekRange(weekOffset: number) {
  // Create Monday June 9th using local timezone to avoid UTC conversion issues
  const baseMonday = new Date(2025, 5, 9); // Year, Month (0-indexed), Day - June 9th 2025
  
  const startOfWeek = new Date(baseMonday);
  startOfWeek.setDate(baseMonday.getDate() + (weekOffset * 7));
  startOfWeek.setHours(0, 0, 0, 0);
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  
  return { startDate: startOfWeek, endDate: endOfWeek };
}

export function getWeekDates(weekOffset: number): Date[] {
  const { startDate } = getWeekRange(weekOffset);
  const dates: Date[] = [];
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate.getTime());
    date.setDate(startDate.getDate() + i);
    dates.push(date);
  }
  
  return dates;
}

export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

export function formatDateForApi(date: Date): string {
  return date.toISOString().split('T')[0];
}
