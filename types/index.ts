// app/cbtapp/types/index.ts - Updated to use our new constants
import type { ExamConfig } from "../utils/examValidator";
export { ExamMode, ExamType } from "../data/examTypes";
export { Subject } from "../data/subjects";
export { Question } from "../services/questionService";
export type { ExamConfig, ValidationResult } from "../utils/examValidator";

// Re-export auth types
export * from "./auth.types";

// Screen navigation types
export type AppScreen = "dashboard" | "instructions" | "exam" | "results";

// Exam results interface
export interface ExamResults {
  score: number;
  totalQuestions: number;
  timeUsed: number;
  subjectBreakdown: { [subject: string]: { correct: number; total: number } };
  answers: { [questionId: string]: string };
  examMode?: string;
}

// Component prop types that might be reused
export interface BaseExamProps {
  examConfig: ExamConfig;
}

export interface NavigationProps {
  onNext?: () => void;
  onPrevious?: () => void;
  onBack?: () => void;
  onSubmit?: () => void;
}
