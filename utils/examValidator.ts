// app/utils/examValidator.ts
import { ExamMode, ExamType, shouldUseTimer } from "../data/examTypes";
import { getMaxSubjectsForExamType } from "../data/subjects";

export interface ExamConfig {
  mode: ExamMode;
  examType: ExamType;
  subjects: string[];
  source: string;
  duration: { minutes: number; seconds: number };
  numberOfQuestions: number;
  totalTime: number;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class ExamValidator {
  /**
   * Validate complete exam configuration
   */
  static validateExamConfig(config: Partial<ExamConfig>): ValidationResult {
    const errors: string[] = [];

    // Check required fields
    if (!config.mode) {
      errors.push("Please select an exam mode");
    }

    if (!config.examType) {
      errors.push("Please select an examination type");
    }

    if (!config.subjects || config.subjects.length === 0) {
      errors.push("Please select at least one subject");
    }

    if (!config.source) {
      errors.push("Please select a question source");
    }

    // Subject count validation
    if (config.examType && config.subjects) {
      const maxSubjects = getMaxSubjectsForExamType(config.examType);

      if (config.examType === "JAMB" && config.subjects.length !== 4) {
        errors.push("JAMB requires exactly 4 subjects");
      } else if (config.subjects.length > maxSubjects) {
        errors.push(
          `You can only select maximum ${maxSubjects} subjects for ${config.examType}`
        );
      }
    }

    // Timer validation for timed exams
    if (config.mode && shouldUseTimer(config.mode)) {
      const hasValidTimer =
        (config.duration?.minutes || 0) > 0 ||
        (config.duration?.seconds || 0) > 0;
      if (!hasValidTimer) {
        errors.push("Please set a duration for timed exams");
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Check if subject can be added to selection
   */
  static canAddSubject(
    subjects: string[],
    examType: ExamType,
    newSubject: string
  ): ValidationResult {
    const errors: string[] = [];

    if (subjects.includes(newSubject)) {
      errors.push("Subject already selected");
      return { isValid: false, errors };
    }

    const maxSubjects = getMaxSubjectsForExamType(examType);

    if (subjects.length >= maxSubjects) {
      errors.push(
        `You can only select maximum ${maxSubjects} subjects for ${examType}`
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get subject validation message for display
   */
  static getSubjectValidationMessage(
    subjects: string[],
    examType: ExamType
  ): string {
    if (!examType) return "";

    const maxSubjects = getMaxSubjectsForExamType(examType);

    if (examType === "JAMB" && subjects.length > 0 && subjects.length < 4) {
      return `JAMB requires exactly 4 subjects. Selected: ${subjects.length}/4`;
    }

    return `Selected: ${subjects.length}/${maxSubjects} subjects`;
  }

  /**
   * Check if exam form is complete and ready for submission
   */
  static isFormComplete(config: Partial<ExamConfig>): boolean {
    const validation = this.validateExamConfig(config);
    return validation.isValid;
  }

  /**
   * Validate timer values
   */
  static validateTimer(minutes: number, seconds: number): ValidationResult {
    const errors: string[] = [];

    if (minutes < 0 || minutes > 999) {
      errors.push("Minutes must be between 0 and 999");
    }

    if (seconds < 0 || seconds > 59) {
      errors.push("Seconds must be between 0 and 59");
    }

    if (minutes === 0 && seconds === 0) {
      errors.push("Timer must be greater than 0");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
