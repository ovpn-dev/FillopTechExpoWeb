// screens/Dashboard.tsx - Refactored to use extracted constants and services
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Import our new constants and services
import {
  EXAM_MODES,
  EXAM_TYPES,
  ExamMode,
  ExamType,
  getExamTypeConfig,
  QUESTION_SOURCES,
  shouldUseTimer,
} from "../data/examTypes";
import { ALL_SUBJECTS } from "../data/subjects";
import { ExamConfig, ExamValidator } from "../utils/examValidator";
import { formatTwoDigits } from "../utils/timeFormatter";

// Import existing components
import Button from "../components/Button";
import Dropdown from "../components/Dropdown";

interface DashboardProps {
  onStartExam: (config: ExamConfig) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onStartExam }) => {
  const [mode, setMode] = useState<ExamMode | null>(null);
  const [examType, setExamType] = useState<ExamType | null>(null);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [source, setSource] = useState<string>("");
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const handleSubmit = () => {
    const examConfig: Partial<ExamConfig> = {
      mode: mode ?? undefined,
      examType: examType ?? undefined,
      subjects,
      source,
      duration: { minutes, seconds },
      numberOfQuestions: examType === "JAMB" ? 60 : 40,
      totalTime: mode && shouldUseTimer(mode) ? minutes * 60 + seconds : 0,
    };

    const validation = ExamValidator.validateExamConfig(examConfig);

    if (!validation.isValid) {
      Alert.alert("Incomplete Form", validation.errors.join("\n"));
      return;
    }

    onStartExam(examConfig as ExamConfig);
  };

  const toggleSubject = (subject: string) => {
    if (!examType) return;

    if (subjects.includes(subject)) {
      setSubjects((prev) => prev.filter((s) => s !== subject));
    } else {
      const validation = ExamValidator.canAddSubject(
        subjects,
        examType,
        subject
      );
      if (!validation.isValid) {
        Alert.alert("Subject Limit", validation.errors[0], [{ text: "OK" }]);
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

    const typeConfig = getExamTypeConfig(type);
    if (mode && shouldUseTimer(mode) && typeConfig) {
      setMinutes(typeConfig.defaultDuration.minutes);
      setSeconds(typeConfig.defaultDuration.seconds);
    } else {
      setMinutes(0);
      setSeconds(0);
    }
  };

  const handleModeChange = (selectedMode: ExamMode) => {
    setMode(selectedMode);

    if (!shouldUseTimer(selectedMode)) {
      setMinutes(0);
      setSeconds(0);
    } else if (examType) {
      handleExamTypeChange(examType);
    }
  };

  // Get available sources based on selected exam type
  const availableSources = examType ? QUESTION_SOURCES[examType] : [];

  const isFormComplete = () => {
    const config: Partial<ExamConfig> = {
      mode: mode ?? undefined,
      examType: examType ?? undefined,
      subjects,
      source,
      duration: { minutes, seconds },
    };
    return ExamValidator.isFormComplete(config);
  };

  return (
    <ScrollView className="flex-1 p-6">
      <Text className="text-4xl text-center font-bold mb-2 text-green-800">
        WELCOME TO FILLOP TECH CBT!
      </Text>
      <Text className="text-center text-gray-600 mb-8">
        Select your examination preferences
      </Text>

      {/* Mode Selection */}
      <Text className="text-red-600 mb-3 font-bold text-lg">CHOOSE MODE:</Text>
      <View className="flex-row gap-2 mb-8 flex-wrap">
        {EXAM_MODES.map((m) => (
          <TouchableOpacity
            key={m.key}
            onPress={() => handleModeChange(m.key)}
            className={`px-4 py-3 rounded-lg shadow-sm ${
              mode === m.key ? m.color : "bg-gray-400"
            }`}
          >
            <Text className="text-white font-semibold text-center">
              {m.label}
            </Text>
            <Text className="text-white text-xs text-center mt-1">
              {m.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Exam Type */}
      <Text className="text-red-600 mb-3 font-bold text-lg">
        SELECT EXAMINATION TYPE:
      </Text>
      <View className="flex-row gap-8 mb-8 flex-wrap">
        {EXAM_TYPES.map((type) => (
          <TouchableOpacity
            key={type.key}
            className="flex-row items-center gap-3 mb-2"
            onPress={() => handleExamTypeChange(type.key)}
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
              <Text className="text-sm text-gray-600">{type.description}</Text>
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
              {ExamValidator.getSubjectValidationMessage(subjects, examType)}
            </Text>
          )}
          <View className="flex-row flex-wrap gap-3">
            {ALL_SUBJECTS.map((subj) => {
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
            {/* Source */}
            <View className="flex-1" style={{ zIndex: 999 }}>
              <Dropdown
                label="SOURCE OF QUESTIONS"
                placeholder={
                  !examType
                    ? "Select exam type first"
                    : "Select question source"
                }
                options={[...availableSources]}
                selectedValue={source}
                onSelect={setSource}
                disabled={!examType}
                required
                borderColor="border-red-600"
                className="mb-4"
              />
            </View>

            {/* Timer - Only show for TIMED mode */}
            {mode && shouldUseTimer(mode) && (
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
                      Total: {minutes}:{formatTwoDigits(seconds)}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* Mode Info for non-timed modes */}
            {mode && !shouldUseTimer(mode) && (
              <View className="flex-1">
                <Text className="font-bold mb-2 text-lg">MODE INFO</Text>
                <View className="border-2 border-blue-600 bg-blue-50 rounded-lg shadow-sm p-4">
                  <Text className="text-blue-800 font-semibold text-center mb-2">
                    {mode.toUpperCase()} MODE
                  </Text>
                  <Text className="text-blue-700 text-sm text-center">
                    {EXAM_MODES.find((m) => m.key === mode)?.description}
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
          {mode && shouldUseTimer(mode) ? (
            <Text className="text-green-700">
              Duration: {minutes}:{formatTwoDigits(seconds)}
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
