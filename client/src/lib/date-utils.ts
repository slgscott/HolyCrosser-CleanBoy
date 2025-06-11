export function getWeekRange(weekOffset: number) {
  const today = new Date();
  const currentDay = today.getDay();
  const daysFromMonday = currentDay === 0 ? 6 : currentDay - 1; // Sunday = 0, Monday = 1
  
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - daysFromMonday + (weekOffset * 7));
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
    const date = new Date(startDate);
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
