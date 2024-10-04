export function getDaysInCurrentMonth(): number {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  // Creating a date object with the next month and day 0 gives the last day of the current month
  return new Date(year, month + 1, 0).getDate();
}

export function getDateDifference(date1: Date, date2: Date) {
  const diffInMs = Math.abs(date2.getTime() - date1.getTime()); // Difference in milliseconds

  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24)); // Convert to days
  const diffInHours = Math.floor((diffInMs / (1000 * 60 * 60)) % 24); // Convert to hours
  const diffInMinutes = Math.floor((diffInMs / (1000 * 60)) % 60); // Convert to minutes
  const diffInSeconds = Math.floor((diffInMs / 1000) % 60); // Convert to seconds

  return { diffInDays, diffInHours, diffInMinutes, diffInSeconds };
}
