export function getWeekRange(weekOffset: number) {
  // Fixed calculation to match available data starting from June 9th
  const today = new Date('2025-06-11'); // Current date (Wednesday)
  const currentDay = today.getDay(); // 3 for Wednesday
  const daysFromMonday = currentDay === 0 ? 6 : currentDay - 1; // 2 days from Monday
  
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - daysFromMonday + (weekOffset * 7) + 1); // +1 to align with data
  startOfWeek.setHours(0, 0, 0, 0);
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  
  return { startDate: startOfWeek, endDate: endOfWeek };
}

export function getWeekDates(weekOffset: number): Date[] {
  const { startDate } = getWeekRange(weekOffset);
  const dates: Date[] = [];
  
  // Debug for Monday calculation
  if (weekOffset === 0) {
    console.log('Week 0 startDate (Monday):', startDate.toISOString().split('T')[0]);
  }
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate.getTime()); // Use getTime() to avoid reference issues
    date.setDate(date.getDate() + i);
    dates.push(date);
  }
  
  // Debug first date (Monday)
  if (weekOffset === 0 && dates.length > 0) {
    console.log('First date (Monday) in array:', dates[0].toISOString().split('T')[0]);
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
