// app/data/examTypes.ts
export type ExamMode = "TIMED" | "UNTIMED" | "STUDY" | "NEWS";
export type ExamType = "JAMB" | "WAEC" | "NECO" | "OTHER";

export const EXAM_MODES = [
  {
    key: "TIMED" as const,
    label: "TIMED EXAMS",
    color: "bg-gray-700",
    description: "Complete exam within set time limit",
  },
  {
    key: "UNTIMED" as const,
    label: "UNTIMED EXAMS",
    color: "bg-blue-600",
    description: "Take as much time as needed",
  },
  {
    key: "STUDY" as const,
    label: "STUDY MODE",
    color: "bg-green-600",
    description: "Practice with instant feedback",
  },
  {
    key: "NEWS" as const,
    label: "NEWS & UPDATES",
    color: "bg-purple-600",
    description: "Latest updates and announcements",
  },
] as const;

export const EXAM_TYPES = [
  {
    key: "JAMB" as const,
    label: "JAMB UTME",
    description: "4 subjects, 3 hours",
    maxSubjects: 4,
    questionsPerSubject: 60,
    defaultDuration: { minutes: 180, seconds: 0 },
  },
  {
    key: "WAEC" as const,
    label: "WAEC",
    description: "Up to 9 subjects",
    maxSubjects: 9,
    questionsPerSubject: 40,
    defaultDuration: { minutes: 120, seconds: 0 },
  },
  {
    key: "NECO" as const,
    label: "NECO",
    description: "Up to 9 subjects",
    maxSubjects: 9,
    questionsPerSubject: 40,
    defaultDuration: { minutes: 120, seconds: 0 },
  },
  {
    key: "OTHER" as const,
    label: "CUSTOM",
    description: "Practice mode",
    maxSubjects: 9,
    questionsPerSubject: 20,
    defaultDuration: { minutes: 60, seconds: 0 },
  },
] as const;

export const QUESTION_SOURCES = {
  JAMB: [
    "Random Questions",
    "2025 JAMB Questions",
    "2024 JAMB Questions",
    "2023 JAMB Questions",
    "2022 JAMB Questions",
    "2021 JAMB Questions",
    "2020 JAMB Questions",
    "2019 JAMB Questions",
  ],
  WAEC: [
    "Random Questions",
    "2025 WAEC Questions",
    "2024 WAEC Questions",
    "2023 WAEC Questions",
    "2022 WAEC Questions",
    "2021 WAEC Questions",
    "2020 WAEC Questions",
    "2019 WAEC Questions",
  ],
  NECO: [
    "Random Questions",
    "2024 NECO Questions",
    "2023 NECO Questions",
    "2022 NECO Questions",
    "2021 NECO Questions",
  ],
  OTHER: ["Random Questions", "Custom Questions", "Practice Bank"],
} as const;

// Helper functions
export const getExamTypeConfig = (examType: ExamType) => {
  return EXAM_TYPES.find((type) => type.key === examType);
};

export const getModeConfig = (mode: ExamMode) => {
  return EXAM_MODES.find((m) => m.key === mode);
};

export const shouldUseTimer = (mode: ExamMode): boolean => {
  return mode === "TIMED";
};

export const getAvailableSources = (examType: ExamType) => {
  return QUESTION_SOURCES[examType] || [];
};
