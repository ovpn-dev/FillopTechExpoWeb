import { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

type Props = {};

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

export default function WelcomeMain({}: Props) {
  const [mode, setMode] = useState<
    "TIMED" | "UNTIMED" | "STUDY" | "NEWS" | null
  >(null);
  const [examType, setExamType] = useState<
    "JAMB" | "WAEC" | "NECO" | "OTHER" | null
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
    <ScrollView className="flex-1 bg-gray p-5">
      <Text className="text-4xl text-center font-bold mb-2 text-green-800">
        WELCOME TO CBT!
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
            onPress={() => setMode(m.key as any)}
            className={`px-4 py-3 rounded-lg shadow-sm ${
              mode === m.key ? m.color : "bg-gray-400"
            }`}
          >
            <Text className="text-white font-semibold">{m.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

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
            // const isRequired =
            //   examType === "JAMB" &&
            //   ["ENGLISH LANGUAGE", "MATHEMATICS"].includes(subj);

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
}
