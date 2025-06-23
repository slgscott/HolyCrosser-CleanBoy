export function getWeekRange(weekOffset: number) {
  // Calculate the current week dynamically based on today's date
  const today = new Date();
  const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const daysToMonday = currentDay === 0 ? 6 : currentDay - 1; // Days to subtract to get to Monday
  
  const currentMonday = new Date(today);
  currentMonday.setDate(today.getDate() - daysToMonday);
  currentMonday.setHours(0, 0, 0, 0);
  
  const startOfWeek = new Date(currentMonday);
  startOfWeek.setDate(currentMonday.getDate() + (weekOffset * 7));
  
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
