import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Button from "./components/Button";

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

// Mock user data - would come from authentication in real app
const mockUser = {
  firstName: "Daniel",
  lastName: "Ezekiel Sunday",
  passcode: "015209",
  profileImage: "https://via.placeholder.com/120x120.png?text=DE",
  accountType: "student",
  institution: "FILLOP TECH",
  totalTests: 45,
  averageScore: 78,
};

export default function Dashboard() {
  const [mode, setMode] = useState<
    "TIMED" | "UNTIMED" | "STUDY" | "NEWS" | null
  >(null);
  const [examType, setExamType] = useState<
    "JAMB" | "WAEC" | "NECO" | "NABTEB" | "OTHER" | null
  >(null);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [source, setSource] = useState<string>("");
  const [showSourceDropdown, setShowSourceDropdown] = useState(false);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [numberOfQuestions, setNumberOfQuestions] = useState(20);

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

  const handleSourceSelect = (selectedSource: string) => {
    setSource(selectedSource);
    setShowSourceDropdown(false);
  };

  const handleExamTypeChange = (
    type: "JAMB" | "WAEC" | "NECO" | "NABTEB" | "OTHER"
  ) => {
    setExamType(type);
    setSource(""); // Reset source when exam type changes
    setSubjects([]); // Reset subjects when exam type changes

    // Set default time based on exam type
    if (type === "JAMB") {
      setMinutes(180); // 3 hours for JAMB
      setSeconds(0);
      setNumberOfQuestions(60); // 60 questions for JAMB (15 per subject)
    } else if (["WAEC", "NECO", "NABTEB"].includes(type)) {
      setMinutes(120); // 2 hours for other exams
      setSeconds(0);
      setNumberOfQuestions(40);
    } else {
      setMinutes(60); // 1 hour for custom
      setSeconds(0);
      setNumberOfQuestions(20);
    }
  };

  const handleSubmit = () => {
    if (!isFormComplete) {
      Alert.alert(
        "Incomplete Form",
        "Please fill all required fields before proceeding."
      );
      return;
    }

    const examConfig = {
      mode,
      examType,
      subjects,
      source,
      duration: { minutes, seconds },
      numberOfQuestions,
      totalTime: minutes * 60 + seconds,
    };

    Alert.alert(
      "Start Examination",
      `You are about to start a ${mode} ${examType} examination with ${subjects.length} subject(s) for ${minutes}:${seconds.toString().padStart(2, "0")}`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Start Exam",
          onPress: () => {
            // Navigate to exam screen with config
            console.log("Starting exam with config:", examConfig);
            // router.push('/exam-screen', { examConfig });
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert("Logout Confirmation", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        onPress: () => {
          // Handle logout logic
          console.log("User logged out");
          // router.push('/login');
        },
      },
    ]);
  };

  const availableSources = examType ? questionSources[examType] : [];

  // Check if all required fields are filled
  const isFormComplete =
    mode &&
    examType &&
    subjects.length > 0 &&
    source &&
    (minutes > 0 || seconds > 0);

  const formatTime = (value: number) => value.toString().padStart(2, "0");

  // Get subject validation message
  const getSubjectValidationMessage = () => {
    if (!examType) return "";

    const maxSubjects = examType === "JAMB" ? 4 : 9;
    const minSubjects = examType === "JAMB" ? 4 : 1;

    if (examType === "JAMB" && subjects.length > 0 && subjects.length < 4) {
      // const missing = ['ENGLISH LANGUAGE', 'MATHEMATICS'].filter(req => !subjects.includes(req));
      // if (missing.length > 0) {
      //   return `JAMB requires English Language and Mathematics. Missing: ${missing.join(', ')}`;
      // }
      return `JAMB requires exactly 4 subjects. Selected: ${subjects.length}/4`;
    }

    return `Selected: ${subjects.length}/${maxSubjects} subjects`;
  };

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="bg-blue-800 px-4 py-3 flex-row justify-between items-center shadow-lg">
        <TouchableOpacity className="p-2" onPress={() => router.back()}>
          <Text className="text-white text-lg">◀</Text>
        </TouchableOpacity>
        <Text className="text-white text-lg font-bold tracking-wide">
          FILLOP CBT GURU - HANDS-ON CBT
        </Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text className="text-white font-semibold">Log out</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-1 flex-row">
        {/* Main Content */}
        <ScrollView className="flex-1 bg-gray-100 p-6">
          <Text className="text-4xl text-center font-bold mb-2 text-green-800">
            WELCOME TO CBT!
          </Text>
          <Text className="text-center text-gray-600 mb-8">
            Select your examination preferences
          </Text>

          {/* Mode Selection */}
          <Text className="text-red-600 mb-3 font-bold text-lg">
            CHOOSE MODE:
          </Text>
          <View className="flex-row gap-2 mb-8 flex-wrap">
            {[
              { key: "TIMED", label: "TIMED EXAMS", color: "bg-gray-700" },
              { key: "UNTIMED", label: "UNTIMED EXAMS", color: "bg-blue-600" },
              { key: "STUDY", label: "STUDY MODE", color: "bg-green-600" },
              { key: "NEWS", label: "NEWS & UPDATES", color: "bg-purple-600" },
            ].map((m) => (
              <TouchableOpacity
                key={m.key}
                onPress={() => setMode(m.key as any)}
                className={`px-4 py-3 rounded-lg shadow-sm ${
                  mode === m.key ? m.color : "bg-gray-400"
                }`}
              >
                <Text className="text-white font-semibold">{m.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Exam Type Selection */}
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
                onPress={() => handleExamTypeChange(type.key as any)}
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
                    <Text className={`text-base flex-1`}>{subj}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Question source and Timer Section*/}
          <View className="flex-row justify-between items-center mb-5">
            {/* Question Source */}
            <View className="mb-6 relative">
              <Text className="font-bold mb-2 text-lg">
                SOURCE OF QUESTIONS
              </Text>
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

            {/* Time Settings */}
            <View className="mb-8">
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
                      <Text className="text-sm text-gray-600 mt-1">
                        Minutes
                      </Text>
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
                      <Text className="text-sm text-gray-600 mt-1">
                        Seconds
                      </Text>
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

          {/* Submit Button */}
          <Button
            title={isFormComplete ? "START EXAMINATION" : "COMPLETE ALL FIELDS"}
            onPress={handleSubmit}
            className={`mb-8 py-4 ${isFormComplete ? "bg-green-600" : "bg-gray-500"}`}
          />

          {/* Status Summary */}
          {isFormComplete && (
            <View className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
              <Text className="font-bold text-green-800 mb-2">
                📋 Exam Summary
              </Text>
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
          <Text className="text-center text-lg font-bold text-gray-700">
            2025 © FILLOP TECH LIMITED
          </Text>
          <Text className="text-center text-sm text-gray-500">
            Touching Lives Through CBT Technology
          </Text>
        </ScrollView>

        {/* Profile Sidebar */}
        <View className="w-80 bg-blue-400 p-6 shadow-lg">
          <View className="bg-white rounded-xl p-6 items-center shadow-md">
            <View className="bg-blue-600 rounded-full p-4 mb-4 shadow-sm">
              <Image
                source={{ uri: mockUser.profileImage }}
                className="w-16 h-16 rounded-full"
              />
            </View>
            <Text className="text-xl font-bold mb-4 text-blue-800">
              Your Profile
            </Text>

            <View className="bg-gray-50 rounded-lg p-4 w-full items-center mb-4 border border-gray-200">
              <Image
                source={{ uri: mockUser.profileImage }}
                className="w-32 h-32 rounded-lg mb-4 border-2 border-blue-200"
              />
              <Text className="text-3xl font-bold text-gray-800">
                {mockUser.firstName}
              </Text>
              <Text className="text-lg text-gray-600">{mockUser.lastName}</Text>
              <Text className="text-sm text-blue-600 mt-2">
                {mockUser.institution}
              </Text>
            </View>

            <View className="w-full mb-4">
              <Text className="text-lg font-bold text-blue-800 mb-2 text-center">
                Student ID:
              </Text>
              <View className="bg-blue-100 rounded-lg p-3">
                <Text className="text-3xl font-bold text-blue-900 text-center">
                  {mockUser.passcode}
                </Text>
              </View>
            </View>

            {/* Quick Stats */}
            {/* <View className="w-full bg-gray-50 rounded-lg p-4 border border-gray-200">
              <Text className="font-bold text-center mb-3 text-gray-800">Performance</Text>
              <View className="flex-row justify-between mb-2">
                <Text className="text-sm text-gray-600">Tests Taken:</Text>
                <Text className="text-sm font-bold">{mockUser.totalTests}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-gray-600">Average Score:</Text>
                <Text className="text-sm font-bold text-green-600">{mockUser.averageScore}%</Text>
              </View>
            </View> */}

            <View className="mt-6 items-center">
              <Text className="text-blue-700 font-bold text-lg">
                FILLOP CBT GURU
              </Text>
              <Text className="text-xs text-gray-600 text-center">
                Advanced CBT Solution
              </Text>
              <Text className="text-xs text-gray-500 mt-1">v1.0.0</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
