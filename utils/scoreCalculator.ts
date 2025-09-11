// app/utils/scoreCalculator.ts
import { shouldUseTimer } from "../data/examTypes";
import { ExamResults } from "../types";
import { ExamConfig } from "./examValidator";

export class ScoreCalculator {
  /**
   * Calculate exam results based on user answers and exam configuration
   */
  static calculateResults(
    userAnswers: Record<string, string>,
    examConfig: ExamConfig,
    examStartTime: number | null
  ): ExamResults {
    const questionsPerSubject = examConfig.numberOfQuestions || 40;
    const totalQuestions = examConfig.subjects.length * questionsPerSubject;

    // Calculate time used
    let timeUsed = 0;
    if (shouldUseTimer(examConfig.mode) && examStartTime) {
      timeUsed = Math.floor((Date.now() - examStartTime) / 1000);
    }

    // Initialize subject breakdown
    const subjectBreakdown: {
      [subject: string]: { correct: number; total: number };
    } = {};
    examConfig.subjects.forEach((subject) => {
      subjectBreakdown[subject] = { correct: 0, total: questionsPerSubject };
    });

    // Calculate scores (using mock scoring for now)
    let correctAnswers = 0;

    examConfig.subjects.forEach((subject) => {
      for (let i = 1; i <= questionsPerSubject; i++) {
        const questionId = `${subject}_q_${i}`;
        if (userAnswers[questionId]) {
          // Mock scoring - 70% chance of being correct for demonstration
          if (Math.random() > 0.3) {
            correctAnswers++;
            subjectBreakdown[subject].correct++;
          }
        }
      }
    });

    return {
      score: correctAnswers,
      totalQuestions,
      timeUsed,
      subjectBreakdown,
      answers: userAnswers,
      examMode: examConfig.mode,
    };
  }

  /**
   * Calculate percentage score
   */
  static calculatePercentage(score: number, totalQuestions: number): number {
    return Math.round((score / totalQuestions) * 100);
  }

  /**
   * Get performance grade based on percentage
   */
  static getPerformanceGrade(percentage: number): {
    grade: string;
    message: string;
    description: string;
    color: string;
    bgColor: string;
  } {
    if (percentage >= 70) {
      return {
        grade: "EXCELLENT",
        message: "EXCELLENT PERFORMANCE!",
        description:
          "Outstanding work! You've demonstrated strong mastery of the subjects.",
        color: "text-green-800",
        bgColor: "bg-green-100",
      };
    } else if (percentage >= 50) {
      return {
        grade: "GOOD",
        message: "GOOD PERFORMANCE!",
        description:
          "Well done! With some more practice, you can achieve excellence.",
        color: "text-yellow-800",
        bgColor: "bg-yellow-100",
      };
    } else {
      return {
        grade: "NEEDS IMPROVEMENT",
        message: "NEEDS IMPROVEMENT",
        description: "Keep practicing! Focus on areas where you scored lower.",
        color: "text-red-800",
        bgColor: "bg-red-100",
      };
    }
  }

  /**
   * Get subject performance for individual subjects
   */
  static getSubjectPerformance(
    correct: number,
    total: number
  ): {
    percentage: number;
    grade: string;
    color: string;
  } {
    const percentage = Math.round((correct / total) * 100);

    if (percentage >= 70) {
      return { percentage, grade: "Excellent", color: "text-green-600" };
    } else if (percentage >= 50) {
      return { percentage, grade: "Good", color: "text-yellow-600" };
    } else {
      return { percentage, grade: "Poor", color: "text-red-600" };
    }
  }

  /**
   * Get subjects that need improvement
   */
  static getSubjectsNeedingImprovement(subjectBreakdown: {
    [subject: string]: { correct: number; total: number };
  }): string[] {
    return Object.entries(subjectBreakdown)
      .filter(([_, data]) => data.correct / data.total < 0.7)
      .map(([subject, _]) => subject);
  }

  /**
   * Generate study recommendations
   */
  static generateStudyRecommendations(subjectBreakdown: {
    [subject: string]: { correct: number; total: number };
  }): string[] {
    const weakSubjects = this.getSubjectsNeedingImprovement(subjectBreakdown);

    if (weakSubjects.length === 0) {
      return [
        "Great job! You've performed well across all subjects. Keep practicing to maintain your level.",
      ];
    }

    return weakSubjects.map((subject) => {
      const performance = this.getSubjectPerformance(
        subjectBreakdown[subject].correct,
        subjectBreakdown[subject].total
      );
      return `Focus more on ${subject} (scored ${performance.percentage}%)`;
    });
  }
}
