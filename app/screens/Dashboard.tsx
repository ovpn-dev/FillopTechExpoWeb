// screens/Dashboard.tsx
import React, { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Button from "../components/Button";
// Merged: Using improved type definitions from the new code
import { ExamConfig, ExamMode, ExamType } from "../examInterface/welcome";

interface DashboardProps {
  onStartExam: (config: ExamConfig) => void;
}

// Retained from old code: Comprehensive list of subjects
const allSubjects = [
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
];

// Retained from old code: Detailed question sources
const questionSources = {
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
  NABTEB: [
    "Random Questions",
    "2024 NABTEB Questions",
    "2023 NABTEB Questions",
    "2022 NABTEB Questions",
  ],
  OTHER: ["Random Questions", "Custom Questions", "Practice Bank"],
};

// Merged: Using FC definition from new code for consistency
const Dashboard: React.FC<DashboardProps> = ({ onStartExam }) => {
  // Merged: Using stricter types from new code (ExamMode, ExamType)
  const [mode, setMode] = useState<ExamMode | null>(null);
  const [examType, setExamType] = useState<ExamType | null>(null);

  // Retained from old code: Comprehensive state management
  const [subjects, setSubjects] = useState<string[]>([]);
  const [source, setSource] = useState<string>("");
  const [showSourceDropdown, setShowSourceDropdown] = useState(false);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [numberOfQuestions, setNumberOfQuestions] = useState(20);

  // Merged: handleSubmit from old code with robust question logic
  const handleSubmit = () => {
    if (!mode || !examType || subjects.length === 0 || !source) {
      Alert.alert("Incomplete Form", "Please fill all required fields.");
      return;
    }

    const examConfig: ExamConfig = {
      mode,
      examType,
      subjects,
      source,
      duration: { minutes, seconds },
      // Retained: Specific question logic from old code is more detailed
      numberOfQuestions: examType === "JAMB" ? 60 : 40,
      totalTime: minutes * 60 + seconds,
    };

    onStartExam(examConfig);
  };

  // Merged: toggleSubject from new code with improved Alert
  const toggleSubject = (subject: string) => {
    const maxSubjects = examType === "JAMB" ? 4 : 9;

    if (subjects.includes(subject)) {
      setSubjects((prev) => prev.filter((s) => s !== subject));
    } else {
      if (subjects.length >= maxSubjects) {
        Alert.alert(
          "Subject Limit",
          `You can only select maximum ${maxSubjects} subjects for ${examType}`,
          [{ text: "OK" }] // Improvement from new code
        );
        return;
      }
      setSubjects((prev) => [...prev, subject]);
    }
  };

  // Retained from old code: All helper functions
  const incrementTime = (type: "minutes" | "seconds") => {
    if (type === "minutes") {
      setMinutes((prev) => Math.min(prev + 1, 999));
    } else {
      if (seconds === 59) {
        setSeconds(0);
        setMinutes((prev) => Math.min(prev + 1, 999));
      } else {
        setSeconds((prev) => prev + 1);
      }
    }
  };

  const decrementTime = (type: "minutes" | "seconds") => {
    if (type === "minutes") {
      setMinutes((prev) => Math.max(prev - 1, 0));
    } else {
      if (seconds === 0) {
        if (minutes > 0) {
          setSeconds(59);
          setMinutes((prev) => prev - 1);
        }
      } else {
        setSeconds((prev) => prev - 1);
      }
    }
  };

  const handleSourceSelect = (selectedSource: string) => {
    setSource(selectedSource);
    setShowSourceDropdown(false);
  };

  // Merged: Using ExamType for better type safety
  const handleExamTypeChange = (type: ExamType) => {
    setExamType(type);
    setSource("");
    setSubjects([]);

    if (type === "JAMB") {
      setMinutes(180);
      setSeconds(0);
      setNumberOfQuestions(60);
    } else if (["WAEC", "NECO", "NABTEB"].includes(type)) {
      setMinutes(120);
      setSeconds(0);
      setNumberOfQuestions(40);
    } else {
      setMinutes(60);
      setSeconds(0);
      setNumberOfQuestions(20);
    }
  };

  const availableSources = examType ? questionSources[examType] : [];

  const isFormComplete =
    mode &&
    examType &&
    subjects.length > 0 &&
    source &&
    (minutes > 0 || seconds > 0);

  const formatTime = (value: number) => value.toString().padStart(2, "0");

  const getSubjectValidationMessage = () => {
    if (!examType) return "";
    const maxSubjects = examType === "JAMB" ? 4 : 9;
    if (examType === "JAMB" && subjects.length > 0 && subjects.length < 4) {
      return `JAMB requires exactly 4 subjects. Selected: ${subjects.length}/4`;
    }
    return `Selected: ${subjects.length}/${maxSubjects} subjects`;
  };

  // Retained from old code: The full, detailed JSX structure
  return (
    <ScrollView className="flex-1 p-6">
      <Text className="text-4xl text-center font-bold mb-2 text-green-800">
        WELCOME TO CBT!
      </Text>
      <Text className="text-center text-gray-600 mb-8">
        Select your examination preferences
      </Text>

      {/* Mode Selection */}
      <Text className="text-red-600 mb-3 font-bold text-lg">CHOOSE MODE:</Text>
      <View className="flex-row gap-2 mb-8 flex-wrap">
        {[
          { key: "TIMED", label: "TIMED EXAMS", color: "bg-gray-700" },
          { key: "UNTIMED", label: "UNTIMED EXAMS", color: "bg-blue-600" },
          { key: "STUDY", label: "STUDY MODE", color: "bg-green-600" },
          { key: "NEWS", label: "NEWS & UPDATES", color: "bg-purple-600" },
        ].map((m) => (
          <TouchableOpacity
            key={m.key}
            onPress={() => setMode(m.key as ExamMode)}
            className={`px-4 py-3 rounded-lg shadow-sm ${
              mode === m.key ? m.color : "bg-gray-400"
            }`}
          >
            <Text className="text-white font-semibold">{m.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Exam Type */}
      <Text className="text-red-600 mb-3 font-bold text-lg">
        SELECT EXAMINATION TYPE:
      </Text>
      <View className="flex-row gap-8 mb-8 flex-wrap">
        {[
          { key: "JAMB", label: "JAMB UTME", desc: "4 subjects, 3 hours" },
          { key: "WAEC", label: "WAEC", desc: "Up to 9 subjects" },
          { key: "NECO", label: "NECO", desc: "Up to 9 subjects" },
          { key: "OTHER", label: "CUSTOM", desc: "Practice mode" },
        ].map((type) => (
          <TouchableOpacity
            key={type.key}
            className="flex-row items-center gap-3 mb-2"
            onPress={() => handleExamTypeChange(type.key as ExamType)}
          >
            <View
              className={`w-6 h-6 rounded-full border-2 border-black items-center justify-center ${
                examType === type.key ? "bg-red-600" : "bg-white"
              }`}
            >
              {examType === type.key && (
                <View className="w-3 h-3 rounded-full bg-white" />
              )}
            </View>
            <View>
              <Text className="text-lg font-semibold">{type.label}</Text>
              <Text className="text-sm text-gray-600">{type.desc}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Subject Selection */}
      <View className="mb-8">
        <Text className="font-bold mb-2 text-lg">CHOOSE SUBJECT(S)</Text>
        {examType && (
          <Text className="text-sm text-blue-600 mb-3">
            {getSubjectValidationMessage()}
          </Text>
        )}
        <View className="flex-row flex-wrap gap-3">
          {allSubjects.map((subj) => {
            const isSelected = subjects.includes(subj);
            return (
              <View
                key={subj}
                className="flex-row items-center gap-2 mb-2 w-full max-w-xs"
              >
                <TouchableOpacity
                  onPress={() => toggleSubject(subj)}
                  className={`w-5 h-5 border-2 border-black items-center justify-center ${
                    isSelected ? "bg-black" : "bg-white"
                  }`}
                >
                  {isSelected && (
                    <Text className="text-white text-xs font-bold">✓</Text>
                  )}
                </TouchableOpacity>
                <Text className={`text-base flex-1 `}>{subj}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Question Source and Timer */}
      <View className="flex-row justify-between items-start mb-5 gap-4">
        {/* Source */}
        <View className="flex-1 mb-6 relative">
          <Text className="font-bold mb-2 text-lg">SOURCE OF QUESTIONS</Text>
          <View className="border-2 border-red-600 bg-white rounded-lg shadow-sm">
            <TouchableOpacity
              className="p-4 flex-row justify-between items-center"
              onPress={() =>
                examType && setShowSourceDropdown(!showSourceDropdown)
              }
              disabled={!examType}
            >
              <Text
                className={`text-base ${!examType ? "text-gray-400" : "text-gray-800"}`}
              >
                {source ||
                  (!examType
                    ? "Select exam type first"
                    : "Select question source")}
              </Text>
              <Text className="text-black text-lg">▼</Text>
            </TouchableOpacity>
          </View>

          {showSourceDropdown && examType && (
            <View className="absolute top-full left-0 right-0 bg-white border-2 border-red-600 border-t-0 rounded-b-lg z-10 shadow-lg">
              {availableSources.map((sourceOption, index) => (
                <TouchableOpacity
                  key={sourceOption}
                  className={`p-4 ${index < availableSources.length - 1 ? "border-b border-gray-200" : ""}`}
                  onPress={() => handleSourceSelect(sourceOption)}
                >
                  <Text className="text-base text-gray-800">
                    {sourceOption}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Timer */}
        <View className="mb-8 flex-1">
          <Text className="font-bold mb-2 text-lg">SET EXAM DURATION</Text>
          <View className="border-2 border-black bg-white rounded-lg shadow-sm">
            <View className="flex-row items-center justify-center p-4">
              <View className="flex-row items-center gap-4">
                {/* Minutes */}
                <View className="items-center">
                  <TouchableOpacity
                    onPress={() => incrementTime("minutes")}
                    className="p-2 bg-gray-200 rounded"
                  >
                    <Text className="text-lg font-bold">▲</Text>
                  </TouchableOpacity>
                  <View className="my-2 bg-blue-100 px-3 py-2 rounded">
                    <Text className="text-2xl font-mono font-bold text-blue-800">
                      {formatTime(minutes)}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => decrementTime("minutes")}
                    className="p-2 bg-gray-200 rounded"
                  >
                    <Text className="text-lg font-bold">▼</Text>
                  </TouchableOpacity>
                  <Text className="text-sm text-gray-600 mt-1">Minutes</Text>
                </View>

                <Text className="text-3xl font-bold text-gray-600">:</Text>

                {/* Seconds */}
                <View className="items-center">
                  <TouchableOpacity
                    onPress={() => incrementTime("seconds")}
                    className="p-2 bg-gray-200 rounded"
                  >
                    <Text className="text-lg font-bold">▲</Text>
                  </TouchableOpacity>
                  <View className="my-2 bg-blue-100 px-3 py-2 rounded">
                    <Text className="text-2xl font-mono font-bold text-blue-800">
                      {formatTime(seconds)}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => decrementTime("seconds")}
                    className="p-2 bg-gray-200 rounded"
                  >
                    <Text className="text-lg font-bold">▼</Text>
                  </TouchableOpacity>
                  <Text className="text-sm text-gray-600 mt-1">Seconds</Text>
                </View>
              </View>
            </View>
          </View>
          <Text className="text-sm text-gray-600 mt-2 text-center">
            Total Duration: {minutes}:{formatTime(seconds)} (
            {Math.floor((minutes * 60 + seconds) / 60)} minutes)
          </Text>
        </View>
      </View>

      {/* Submit */}
      <Button
        title={isFormComplete ? "START EXAMINATION" : "COMPLETE ALL FIELDS"}
        onPress={handleSubmit}
        className={`mb-8 py-4 ${isFormComplete ? "bg-green-600" : "bg-gray-500"}`}
      />

      {/* Summary */}
      {isFormComplete && (
        <View className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
          <Text className="font-bold text-green-800 mb-2">📋 Exam Summary</Text>
          <Text className="text-green-700">Mode: {mode}</Text>
          <Text className="text-green-700">Exam: {examType}</Text>
          <Text className="text-green-700">
            Subjects: {subjects.join(", ")}
          </Text>
          <Text className="text-green-700">Source: {source}</Text>
          <Text className="text-green-700">
            Duration: {minutes}:{formatTime(seconds)}
          </Text>
        </View>
      )}

      {/* Footer */}
      <View>
        <Text className="text-center text-lg font-bold text-gray-700">
          2025 © FILLOP TECH LIMITED
        </Text>
        <Text className="text-center text-sm text-gray-500">
          Touching Lives Through CBT Technology
        </Text>
      </View>
    </ScrollView>
  );
};

export default Dashboard;
