// app/data/subjects.ts
export const ALL_SUBJECTS = [
  "AGRICULTURAL SCIENCE",
  "ENGLISH LANGUAGE",
  "BIOLOGY",
  "CHEMISTRY",
  "LIT. IN ENGLISH",
  "MATHEMATICS",
  "PHYSICS",
  "FRENCH",
  "FURTHER MATHEMATICS",
  "CIVIC EDUCATION",
  "FINANCIAL ACCOUNTING",
  "BIBLE KNOWLEDGE",
  "COMMERCE",
  "COMPUTER STUDIES",
  "BASIC WORKSHOP",
  "GEOGRAPHY",
  "ECONOMICS",
  "ARABIC",
] as const;

// Type for type safety
export type Subject = (typeof ALL_SUBJECTS)[number];

// Helper functions
export const getSubjectDisplayName = (subject: Subject): string => {
  // For subjects with long names, you can customize display here
  const displayNames: Partial<Record<Subject, string>> = {
    "LIT. IN ENGLISH": "Literature",
    "AGRICULTURAL SCIENCE": "Agric Science",
    "FINANCIAL ACCOUNTING": "Fin. Accounting",
    "FURTHER MATHEMATICS": "Further Maths",
  };

  return displayNames[subject] || subject;
};

import { ExamType } from "./examTypes";

export const getMaxSubjectsForExamType = (examType: ExamType): number => {
  switch (examType) {
    case "JAMB":
      return 4;
    case "WAEC":
    case "NECO":
      return 9;
    default:
      return 9;
  }
};

export const getQuestionsPerSubject = (examType: ExamType): number => {
  return examType === "JAMB" ? 60 : 40;
};
