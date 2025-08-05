// screens/Dashboard.tsx - Refactored to use reusable Dropdown component
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ExamConfig, ExamMode, ExamType } from "../cbtApp";
import Button from "../components/Button";
import Dropdown from "../components/Dropdown"; // Import the reusable component

interface DashboardProps {
  onStartExam: (config: ExamConfig) => void;
}

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

const Dashboard: React.FC<DashboardProps> = ({ onStartExam }) => {
  const [mode, setMode] = useState<ExamMode | null>(null);
  const [examType, setExamType] = useState<ExamType | null>(null);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [source, setSource] = useState<string>("");
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [numberOfQuestions, setNumberOfQuestions] = useState(20);

  const shouldShowTimer = (mode: ExamMode | null): boolean => {
    return mode === "TIMED";
  };

  const handleSubmit = () => {
    const isTimerRequired = shouldShowTimer(mode);
    const hasValidTimer = minutes > 0 || seconds > 0;

    if (!mode || !examType || subjects.length === 0 || !source) {
      Alert.alert("Incomplete Form", "Please fill all required fields.");
      return;
    }

    if (isTimerRequired && !hasValidTimer) {
      Alert.alert("Timer Required", "Please set a duration for timed exams.");
      return;
    }

    const examConfig: ExamConfig = {
      mode,
      examType,
      subjects,
      source,
      duration: {
        minutes: isTimerRequired ? minutes : 0,
        seconds: isTimerRequired ? seconds : 0,
      },
      numberOfQuestions: examType === "JAMB" ? 60 : 40,
      totalTime: isTimerRequired ? minutes * 60 + seconds : 0,
    };

    onStartExam(examConfig);
  };

  const toggleSubject = (subject: string) => {
    const maxSubjects = examType === "JAMB" ? 4 : 9;

    if (subjects.includes(subject)) {
      setSubjects((prev) => prev.filter((s) => s !== subject));
    } else {
      if (subjects.length >= maxSubjects) {
        Alert.alert(
          "Subject Limit",
          `You can only select maximum ${maxSubjects} subjects for ${examType}`,
          [{ text: "OK" }]
        );
        return;
      }
      setSubjects((prev) => [...prev, subject]);
    }
  };

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

  const handleExamTypeChange = (type: ExamType) => {
    setExamType(type);
    setSource(""); // Reset source when exam type changes
    setSubjects([]);

    if (shouldShowTimer(mode)) {
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
    } else {
      setMinutes(0);
      setSeconds(0);
      setNumberOfQuestions(type === "JAMB" ? 60 : 40);
    }
  };

  const handleModeChange = (selectedMode: ExamMode) => {
    setMode(selectedMode);

    if (!shouldShowTimer(selectedMode)) {
      setMinutes(0);
      setSeconds(0);
    } else if (examType) {
      handleExamTypeChange(examType);
    }
  };

  // Get available sources based on selected exam type
  const availableSources = examType ? questionSources[examType] : [];

  const isFormComplete = () => {
    const basicRequirements = mode && examType && subjects.length > 0 && source;
    const timerRequirement = shouldShowTimer(mode)
      ? minutes > 0 || seconds > 0
      : true;
    return basicRequirements && timerRequirement;
  };

  const formatTime = (value: number) => value.toString().padStart(2, "0");

  const getSubjectValidationMessage = () => {
    if (!examType) return "";
    const maxSubjects = examType === "JAMB" ? 4 : 9;
    if (examType === "JAMB" && subjects.length > 0 && subjects.length < 4) {
      return `JAMB requires exactly 4 subjects. Selected: ${subjects.length}/4`;
    }
    return `Selected: ${subjects.length}/${maxSubjects} subjects`;
  };

  const getModeDescription = (modeKey: ExamMode) => {
    switch (modeKey) {
      case "TIMED":
        return "Complete exam within set time limit";
      case "UNTIMED":
        return "Take as much time as needed";
      case "STUDY":
        return "Practice with instant feedback";
      case "NEWS":
        return "Latest updates and announcements";
      default:
        return "";
    }
  };

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
            onPress={() => handleModeChange(m.key as ExamMode)}
            className={`px-4 py-3 rounded-lg shadow-sm ${
              mode === m.key ? m.color : "bg-gray-400"
            }`}
          >
            <Text className="text-white font-semibold text-center">
              {m.label}
            </Text>
            <Text className="text-white text-xs text-center mt-1">
              {getModeDescription(m.key as ExamMode)}
            </Text>
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

      <View className="flex-row w-full">
        {/* Subject Selection */}
        <View className="mb-8 w-[70%]">
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
                  <Text className="text-base flex-1">{subj}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Question Source and Timer - Side by Side */}
        <View className="mb-8 w-[30%]">
          <View className="flex-column justify-between items-center">
            {/* Source - Using Reusable Dropdown Component */}
            <View className="flex-1" style={{ zIndex: 999 }}>
              <Dropdown
                label="SOURCE OF QUESTIONS"
                placeholder={
                  !examType
                    ? "Select exam type first"
                    : "Select question source"
                }
                options={availableSources}
                selectedValue={source}
                onSelect={setSource}
                disabled={!examType}
                required
                borderColor="border-red-600"
                className="mb-4"
              />
            </View>

            {/* Timer - Right Side - Only show for TIMED mode */}
            {shouldShowTimer(mode) && (
              <View className="flex-1 items-center">
                <Text className="font-bold mb-2 text-lg">EXAM DURATION</Text>
                <View className="border-2 border-black bg-white rounded-lg shadow-sm p-3">
                  {/* Minutes */}
                  <View className="flex-row items-center mb-2">
                    <Text className="text-sm font-medium text-gray-700 w-12">
                      Min:
                    </Text>
                    <TouchableOpacity
                      onPress={() => decrementTime("minutes")}
                      className="w-7 h-7 bg-gray-200 rounded items-center justify-center"
                    >
                      <Text className="text-sm font-bold text-gray-700">−</Text>
                    </TouchableOpacity>
                    <TextInput
                      className="bg-blue-100 mx-2 px-2 py-1 rounded text-center text-sm font-mono font-bold text-blue-800 min-w-12"
                      value={minutes.toString()}
                      onChangeText={(text) => {
                        const num = parseInt(text) || 0;
                        setMinutes(Math.min(Math.max(num, 0), 999));
                      }}
                      keyboardType="numeric"
                      maxLength={3}
                    />
                    <TouchableOpacity
                      onPress={() => incrementTime("minutes")}
                      className="w-7 h-7 bg-gray-200 rounded items-center justify-center"
                    >
                      <Text className="text-sm font-bold text-gray-700">+</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Seconds */}
                  <View className="flex-row items-center mb-2">
                    <Text className="text-sm font-medium text-gray-700 w-12">
                      Sec:
                    </Text>
                    <TouchableOpacity
                      onPress={() => decrementTime("seconds")}
                      className="w-7 h-7 bg-gray-200 rounded items-center justify-center"
                    >
                      <Text className="text-sm font-bold text-gray-700">−</Text>
                    </TouchableOpacity>
                    <TextInput
                      className="bg-blue-100 mx-2 px-2 py-1 rounded text-center text-sm font-mono font-bold text-blue-800 min-w-12"
                      value={seconds.toString()}
                      onChangeText={(text) => {
                        const num = parseInt(text) || 0;
                        setSeconds(Math.min(Math.max(num, 0), 59));
                      }}
                      keyboardType="numeric"
                      maxLength={2}
                    />
                    <TouchableOpacity
                      onPress={() => incrementTime("seconds")}
                      className="w-7 h-7 bg-gray-200 rounded items-center justify-center"
                    >
                      <Text className="text-sm font-bold text-gray-700">+</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Total */}
                  <View className="border-t border-gray-200 pt-2">
                    <Text className="text-xs text-gray-600 text-center">
                      Total: {minutes}:{formatTime(seconds)}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* Mode Info for non-timed modes */}
            {!shouldShowTimer(mode) && mode && (
              <View className="flex-1">
                <Text className="font-bold mb-2 text-lg">MODE INFO</Text>
                <View className="border-2 border-blue-600 bg-blue-50 rounded-lg shadow-sm p-4">
                  <Text className="text-blue-800 font-semibold text-center mb-2">
                    {mode.toUpperCase()} MODE
                  </Text>
                  <Text className="text-blue-700 text-sm text-center">
                    {getModeDescription(mode)}
                  </Text>
                  {mode === "UNTIMED" && (
                    <Text className="text-blue-600 text-xs text-center mt-2">
                      ⏱️ No time limit applied
                    </Text>
                  )}
                  {mode === "STUDY" && (
                    <Text className="text-blue-600 text-xs text-center mt-2">
                      📚 Practice with feedback
                    </Text>
                  )}
                  {mode === "NEWS" && (
                    <Text className="text-blue-600 text-xs text-center mt-2">
                      📰 Updates and announcements
                    </Text>
                  )}
                </View>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Submit */}
      <Button
        title={isFormComplete() ? "START EXAMINATION" : "COMPLETE ALL FIELDS"}
        onPress={handleSubmit}
        className={`mb-8 py-4 ${isFormComplete() ? "bg-green-600" : "bg-gray-500"}`}
      />

      {/* Summary */}
      {isFormComplete() && (
        <View className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
          <Text className="font-bold text-green-800 mb-2">📋 Exam Summary</Text>
          <Text className="text-green-700">Mode: {mode}</Text>
          <Text className="text-green-700">Exam: {examType}</Text>
          <Text className="text-green-700">
            Subjects: {subjects.join(", ")}
          </Text>
          <Text className="text-green-700">Source: {source}</Text>
          {shouldShowTimer(mode) ? (
            <Text className="text-green-700">
              Duration: {minutes}:{formatTime(seconds)}
            </Text>
          ) : (
            <Text className="text-blue-700">Duration: No time limit</Text>
          )}
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
