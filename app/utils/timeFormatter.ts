// app/utils/timeFormatter.ts

/**
 * Format time in MM:SS format
 */
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")} min`;
};

/**
 * Format time in HH:MM:SS format for longer durations
 */
export const formatLongTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  }
  return `${minutes}m ${secs}s`;
};

/**
 * Format a number to always have 2 digits
 */
export const formatTwoDigits = (value: number): string => {
  return value.toString().padStart(2, "0");
};

/**
 * Convert minutes and seconds to total seconds
 */
export const toTotalSeconds = (minutes: number, seconds: number): number => {
  return minutes * 60 + seconds;
};

/**
 * Convert total seconds to minutes and seconds object
 */
export const fromTotalSeconds = (
  totalSeconds: number
): { minutes: number; seconds: number } => {
  return {
    minutes: Math.floor(totalSeconds / 60),
    seconds: totalSeconds % 60,
  };
};

/**
 * Check if timer should show warning (last 5 minutes)
 */
export const shouldShowTimeWarning = (remainingSeconds: number): boolean => {
  return remainingSeconds < 300; // 5 minutes
};

/**
 * Get time display color based on remaining time
 */
export const getTimeDisplayColor = (
  remainingSeconds: number,
  isTimedExam: boolean
): string => {
  if (!isTimedExam) return "text-blue-800";
  if (shouldShowTimeWarning(remainingSeconds)) return "text-red-600";
  return "text-blue-800";
};

/**
 * Get background color for time display
 */
export const getTimeDisplayBackground = (
  remainingSeconds: number,
  isTimedExam: boolean
): string => {
  if (!isTimedExam) return "bg-white";
  if (shouldShowTimeWarning(remainingSeconds)) return "bg-red-100";
  return "bg-white";
};
