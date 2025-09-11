// screens/Dashboard.tsx - Integrated with apiService for exam types/papers/attempts
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Import API service
import apiService from "../../services/apiService";

// Import utilities and components
import Button from "../../components/Button";
import Dropdown from "../../components/Dropdown";
import { ExamConfig, ExamValidator } from "../../utils/examValidator";
import { formatTwoDigits } from "../../utils/timeFormatter";

// Import constants (we'll keep some for fallback/validation)
import {
  EXAM_MODES,
  ExamMode,
  QUESTION_SOURCES,
  shouldUseTimer,
} from "../../data/examTypes";

// Extended interface to include API IDs
interface ExtendedExamConfig extends ExamConfig {
  paperId: string;
  attemptId: string;
}

interface DashboardProps {
  onStartExam: (config: ExtendedExamConfig) => void;
}

// Dynamic exam type interface
interface ApiExamType {
  key: string;
  label: string;
  description: string;
  maxSubjects: number;
  questionsPerSubject: number;
  defaultDuration: { minutes: number; seconds: number };
}

// Dynamic topic interface
interface ApiTopic {
  id: string;
  name: string;
}

const Dashboard: React.FC<DashboardProps> = ({ onStartExam }) => {
  const [mode, setMode] = useState<ExamMode | null>(null);
  const [examType, setExamType] = useState<string | null>(null);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [source, setSource] = useState<string>("");
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  // API-driven state
  const [examTypes, setExamTypes] = useState<ApiExamType[]>([]);
  const [topics, setTopics] = useState<ApiTopic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExamData();
  }, []);

  const fetchExamData = async () => {
    try {
      setLoading(true);

      // Fetch exam types from API
      const typesResponse = await apiService.getExamTypes();
      const formattedTypes = typesResponse.map((t: any) => ({
        key: t.id,
        label: t.name,
        description: t.description || "",
        maxSubjects: t.max_subjects || 4,
        questionsPerSubject: t.questions_per_subject || 40,
        defaultDuration: {
          minutes: t.duration_minutes || 120,
          seconds: 0,
        },
      }));
      setExamTypes(formattedTypes);

      // Fetch topics/subjects from API
      const topicsResponse = await apiService.getTopics();
      const formattedTopics = topicsResponse.map((topic: any) => ({
        id: topic.id,
        name: topic.name,
      }));
      setTopics(formattedTopics);
    } catch (err) {
      console.error("Failed to load exam data:", err);
      Alert.alert("Error", "Failed to load exam data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
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

    try {
      // Map selected exam type to API ID
      const selectedExamType = examTypes.find((t) => t.label === examType);
      if (!selectedExamType) {
        Alert.alert("Error", "Invalid exam type selected");
        return;
      }

      // Map selected subjects to topic IDs
      const topicIds = subjects
        .map((subjectName) => topics.find((t) => t.name === subjectName)?.id)
        .filter(Boolean) as string[];

      if (topicIds.length === 0) {
        Alert.alert("Error", "No valid subjects selected");
        return;
      }

      // For multi-subject exams, we'll create one paper with the first topic
      // TODO: Enhance this to handle multiple subjects properly based on your API design
      const paperRequest = {
        title: `${examType} - ${source} - ${subjects.join(", ")}`,
        exam_id: selectedExamType.key,
        topic_id: topicIds[0], // Using first topic for now
        duration_minutes: minutes + seconds / 60,
        // Add any other required fields based on your API
      };

      // Create exam paper
      const paper = await apiService.createExamPaper(paperRequest);

      // Start attempt
      const attempt = await apiService.startAttempt({
        exam_paper_id: paper.id,
      });

      // Start exam with extended config
      const extendedConfig: ExtendedExamConfig = {
        ...(examConfig as ExamConfig),
        paperId: paper.id,
        attemptId: attempt.id,
      };

      onStartExam(extendedConfig);
    } catch (err: any) {
      console.error("Failed to start exam:", err);
      Alert.alert(
        "Error",
        err.message || "Failed to start exam. Please try again."
      );
    }
  };

  const toggleSubject = (subject: string) => {
    if (!examType) return;

    const selectedExamType = examTypes.find((t) => t.label === examType);
    if (!selectedExamType) return;

    if (subjects.includes(subject)) {
      setSubjects((prev) => prev.filter((s) => s !== subject));
    } else {
      // Use API-driven max subjects limit
      if (subjects.length >= selectedExamType.maxSubjects) {
        Alert.alert(
          "Subject Limit",
          `You can only select up to ${selectedExamType.maxSubjects} subjects for ${examType}.`,
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

  const handleExamTypeChange = (typeName: string) => {
    setExamType(typeName);
    setSource(""); // Reset source when exam type changes
    setSubjects([]);

    const selectedType = examTypes.find((t) => t.label === typeName);
    if (mode && shouldUseTimer(mode) && selectedType) {
      setMinutes(selectedType.defaultDuration.minutes);
      setSeconds(selectedType.defaultDuration.seconds);
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
      const selectedType = examTypes.find((t) => t.label === examType);
      if (selectedType) {
        setMinutes(selectedType.defaultDuration.minutes);
        setSeconds(selectedType.defaultDuration.seconds);
      }
    }
  };

  // Get available sources based on selected exam type (fallback to static data)
  const availableSources = examType
    ? QUESTION_SOURCES[examType as keyof typeof QUESTION_SOURCES] || []
    : [];

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

  const getSubjectValidationMessage = (
    selectedSubjects: string[],
    examTypeName: string
  ) => {
    const selectedType = examTypes.find((t) => t.label === examTypeName);
    if (!selectedType) return "";

    const remaining = selectedType.maxSubjects - selectedSubjects.length;
    if (remaining > 0) {
      return `Select ${remaining} more subject${remaining === 1 ? "" : "s"} (${selectedSubjects.length}/${selectedType.maxSubjects})`;
    }
    return `Maximum subjects selected (${selectedSubjects.length}/${selectedType.maxSubjects})`;
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg text-gray-600">Loading exam data...</Text>
      </View>
    );
  }

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

      {/* Exam Type - Now using API data */}
      <Text className="text-red-600 mb-3 font-bold text-lg">
        SELECT EXAMINATION TYPE:
      </Text>
      <View className="flex-row gap-8 mb-8 flex-wrap">
        {examTypes.map((type) => (
          <TouchableOpacity
            key={type.key}
            className="flex-row items-center gap-3 mb-2"
            onPress={() => handleExamTypeChange(type.label)}
          >
            <View
              className={`w-6 h-6 rounded-full border-2 border-black items-center justify-center ${
                examType === type.label ? "bg-red-600" : "bg-white"
              }`}
            >
              {examType === type.label && (
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
        {/* Subject Selection - Now using API data */}
        <View className="mb-8 w-[70%]">
          <Text className="font-bold mb-2 text-lg">CHOOSE SUBJECT(S)</Text>
          {examType && (
            <Text className="text-sm text-blue-600 mb-3">
              {getSubjectValidationMessage(subjects, examType)}
            </Text>
          )}
          <View className="flex-row flex-wrap gap-3">
            {topics.map((topic) => {
              const isSelected = subjects.includes(topic.name);
              return (
                <View
                  key={topic.id}
                  className="flex-row items-center gap-2 mb-2 w-full max-w-xs"
                >
                  <TouchableOpacity
                    onPress={() => toggleSubject(topic.name)}
                    className={`w-5 h-5 border-2 border-black items-center justify-center ${
                      isSelected ? "bg-black" : "bg-white"
                    }`}
                  >
                    {isSelected && (
                      <Text className="text-white text-xs font-bold">✓</Text>
                    )}
                  </TouchableOpacity>
                  <Text className="text-base flex-1">{topic.name}</Text>
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
