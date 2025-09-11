// app/lib/utils.ts - Utility functions for FILLOP CBT GURU

/**
 * Utility function to merge CSS classes
 * Simple alternative to clsx library
 */
export function cn(...inputs: (string | undefined | null | boolean)[]): string {
  return inputs.filter(Boolean).join(" ").trim();
}

/**
 * Format currency in Nigerian Naira
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format date to Nigerian format
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Calculate time difference in minutes
 */
export function getTimeDifference(startTime: Date, endTime: Date): number {
  const diffInMilliseconds = endTime.getTime() - startTime.getTime();
  return Math.floor(diffInMilliseconds / (1000 * 60));
}

/**
 * Format duration from minutes to human-readable format
 */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
}

/**
 * Calculate percentage score
 */
export function calculatePercentage(correct: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

/**
 * Get grade based on percentage
 */
export function getGrade(percentage: number): { grade: string; color: string } {
  if (percentage >= 90) return { grade: "A+", color: "text-green-600" };
  if (percentage >= 80) return { grade: "A", color: "text-green-500" };
  if (percentage >= 70) return { grade: "B", color: "text-blue-500" };
  if (percentage >= 60) return { grade: "C", color: "text-yellow-500" };
  if (percentage >= 50) return { grade: "D", color: "text-orange-500" };
  return { grade: "F", color: "text-red-500" };
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate Nigerian phone number
 */
export function isValidNigerianPhone(phone: string): boolean {
  const phoneRegex = /^(\+234|234|0)([789][01]|[789]\d)\d{8}$/;
  return phoneRegex.test(phone.replace(/\s+/g, ""));
}

/**
 * Generate random activation code
 */
export function generateActivationCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Shuffle array (for randomizing questions)
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Get exam duration based on type
 */
export function getExamDuration(examType: string): number {
  const durations: Record<string, number> = {
    "JAMB UTME": 180, // 3 hours
    WAEC: 240, // 4 hours
    NECO: 240, // 4 hours
  };
  return durations[examType] || 120;
}

/**
 * Get subject color for UI
 */
export function getSubjectColor(subject: string): string {
  const colors: Record<string, string> = {
    Mathematics: "bg-blue-100 text-blue-800",
    "English Language": "bg-green-100 text-green-800",
    Physics: "bg-purple-100 text-purple-800",
    Chemistry: "bg-red-100 text-red-800",
    Biology: "bg-yellow-100 text-yellow-800",
    Geography: "bg-indigo-100 text-indigo-800",
    Government: "bg-pink-100 text-pink-800",
    Economics: "bg-orange-100 text-orange-800",
    History: "bg-gray-100 text-gray-800",
    "Literature in English": "bg-teal-100 text-teal-800",
  };
  return colors[subject] || "bg-gray-100 text-gray-800";
}

/**
 * Calculate days until exam
 */
export function getDaysUntilExam(examDate: string): number {
  const exam = new Date(examDate);
  const today = new Date();
  const diffTime = exam.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Generate performance insights
 */
export function generatePerformanceInsights(scores: number[]): {
  trend: "improving" | "declining" | "stable";
  average: number;
  highest: number;
  lowest: number;
  consistency: "high" | "medium" | "low";
} {
  if (scores.length === 0) {
    return {
      trend: "stable",
      average: 0,
      highest: 0,
      lowest: 0,
      consistency: "low",
    };
  }

  const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  const highest = Math.max(...scores);
  const lowest = Math.min(...scores);

  // Calculate trend (comparing first half vs second half)
  const midPoint = Math.floor(scores.length / 2);
  const firstHalfAvg =
    scores.slice(0, midPoint).reduce((sum, score) => sum + score, 0) / midPoint;
  const secondHalfAvg =
    scores.slice(midPoint).reduce((sum, score) => sum + score, 0) /
    (scores.length - midPoint);

  let trend: "improving" | "declining" | "stable" = "stable";
  if (secondHalfAvg > firstHalfAvg + 5) trend = "improving";
  else if (secondHalfAvg < firstHalfAvg - 5) trend = "declining";

  // Calculate consistency based on standard deviation
  const variance =
    scores.reduce((sum, score) => sum + Math.pow(score - average, 2), 0) /
    scores.length;
  const standardDeviation = Math.sqrt(variance);

  let consistency: "high" | "medium" | "low" = "medium";
  if (standardDeviation < 10) consistency = "high";
  else if (standardDeviation > 20) consistency = "low";

  return {
    trend,
    average: Math.round(average),
    highest,
    lowest,
    consistency,
  };
}

/**
 * Format time remaining for exam timer
 */
export function formatTimeRemaining(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Get motivational message based on score
 */
export function getMotivationalMessage(score: number): string {
  if (score >= 90) return "Outstanding performance! You're exam-ready! 🌟";
  if (score >= 80) return "Excellent work! Keep up the momentum! 🚀";
  if (score >= 70)
    return "Good job! A little more practice and you'll excel! 💪";
  if (score >= 60) return "You're getting there! Focus on your weak areas! 📚";
  if (score >= 50)
    return "Don't give up! More practice will improve your score! 💪";
  return "Keep practicing! Every question brings you closer to success! 🎯";
}

/**
 * Storage utilities for offline functionality
 */
export const storage = {
  set: async (key: string, value: any): Promise<void> => {
    try {
      // In React Native, you would use AsyncStorage
      // For web, using localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error("Storage set error:", error);
    }
  },

  get: async (key: string): Promise<any> => {
    try {
      if (typeof window !== "undefined") {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      }
      return null;
    } catch (error) {
      console.error("Storage get error:", error);
      return null;
    }
  },

  remove: async (key: string): Promise<void> => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.error("Storage remove error:", error);
    }
  },

  clear: async (): Promise<void> => {
    try {
      if (typeof window !== "undefined") {
        localStorage.clear();
      }
    } catch (error) {
      console.error("Storage clear error:", error);
    }
  },
};

/**
 * Network utilities
 */
export const network = {
  isOnline: (): boolean => {
    if (typeof window !== "undefined") {
      return navigator.onLine;
    }
    return true; // Assume online in server environment
  },

  checkConnection: async (): Promise<boolean> => {
    try {
      const response = await fetch("/api/health", {
        method: "HEAD",
        cache: "no-cache",
      });
      return response.ok;
    } catch {
      return false;
    }
  },
};

/**
 * Question difficulty analyzer
 */
export function analyzeQuestionDifficulty(
  correctAnswers: number,
  totalAttempts: number
): "Easy" | "Medium" | "Hard" {
  if (totalAttempts === 0) return "Medium";

  const successRate = correctAnswers / totalAttempts;

  if (successRate >= 0.8) return "Easy";
  if (successRate >= 0.5) return "Medium";
  return "Hard";
}

/**
 * Study recommendation engine
 */
export function generateStudyRecommendations(
  subjectScores: Record<string, number[]>
): Array<{
  subject: string;
  priority: "High" | "Medium" | "Low";
  message: string;
}> {
  const recommendations: Array<{
    subject: string;
    priority: "High" | "Medium" | "Low";
    message: string;
  }> = [];

  Object.entries(subjectScores).forEach(([subject, scores]) => {
    if (scores.length === 0) return;

    const average =
      scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const insights = generatePerformanceInsights(scores);

    let priority: "High" | "Medium" | "Low" = "Medium";
    let message = "";

    if (average < 50) {
      priority = "High";
      message = `Critical attention needed. Focus on fundamentals and practice more questions.`;
    } else if (average < 70) {
      priority = "Medium";
      message = `Good progress. Work on specific topics where you're struggling.`;
    } else {
      priority = "Low";
      message = `Excellent performance. Maintain with regular practice.`;
    }

    if (insights.trend === "declining") {
      priority = priority === "Low" ? "Medium" : "High";
      message +=
        " Note: Performance is declining, consider reviewing recent topics.";
    }

    recommendations.push({ subject, priority, message });
  });

  return recommendations.sort((a, b) => {
    const priorityOrder = { High: 3, Medium: 2, Low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
}
