// app/(admin)/questions/[id].tsx
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AdminApiService from "../../../services/adminApiService";
import ApiService, { ExamPaperResponse } from "../../../services/apiService";

interface Option {
  text: string;
  is_correct: boolean;
}

export default function EditQuestionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const isNew = id === "new";

  const [text, setText] = useState("");
  const [type, setType] = useState<string>("MCQ_SINGLE");
  const [examPaperId, setExamPaperId] = useState("");
  const [difficulty, setDifficulty] = useState<string>("Medium");
  const [options, setOptions] = useState<Option[]>([
    { text: "", is_correct: false },
    { text: "", is_correct: false },
    { text: "", is_correct: false },
    { text: "", is_correct: false },
  ]);

  const [examPapers, setExamPapers] = useState<ExamPaperResponse[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const questionTypes = [
    "MCQ_SINGLE",
    "MCQ_MULTIPLE",
    "True/False",
    "Short Answer",
    "Essay",
  ];

  const difficulties = ["Easy", "Medium", "Hard"];

  useEffect(() => {
    // Load exam papers for dropdown
    const fetchExamPapers = async () => {
      try {
        const papers = await ApiService.getExamPapers();
        setExamPapers(papers);
      } catch (err) {
        console.error("Failed to load exam papers:", err);
      }
    };
    fetchExamPapers();

    // Load question data if editing
    if (!isNew && id) {
      const fetchQuestion = async () => {
        try {
          const question = await ApiService.getQuestion(id);
          setText(question.text);
          setType(question.type);

          if (question.options && question.options.length > 0) {
            const loadedOptions = question.options.map((opt) => ({
              text: opt.text,
              is_correct: opt.is_correct,
            }));
            // Pad with empty options if less than 4
            while (loadedOptions.length < 4) {
              loadedOptions.push({ text: "", is_correct: false });
            }
            setOptions(loadedOptions);
          }
        } catch (err: any) {
          setError("Failed to load question data.");
        } finally {
          setLoading(false);
        }
      };
      fetchQuestion();
    }
  }, [id, isNew]);

  const updateOption = (
    index: number,
    field: keyof Option,
    value: string | boolean
  ) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setOptions(newOptions);
  };

  const setCorrectOption = (index: number) => {
    if (type === "MCQ_SINGLE") {
      // For single choice, only one can be correct
      const newOptions = options.map((opt, i) => ({
        ...opt,
        is_correct: i === index,
      }));
      setOptions(newOptions);
    } else {
      // For multiple choice, toggle the option
      updateOption(index, "is_correct", !options[index].is_correct);
    }
  };

  const handleSubmit = async () => {
    if (!text.trim()) {
      Alert.alert("Validation Error", "Please enter the question text.");
      return;
    }

    if (
      (type === "MCQ_SINGLE" || type === "MCQ_MULTIPLE") &&
      options.every((opt) => !opt.text.trim())
    ) {
      Alert.alert(
        "Validation Error",
        "Please add at least one option for multiple choice questions."
      );
      return;
    }

    if (type === "MCQ_SINGLE" && !options.some((opt) => opt.is_correct)) {
      Alert.alert(
        "Validation Error",
        "Please mark the correct answer for single choice questions."
      );
      return;
    }

    setSubmitting(true);

    const validOptions = options
      .filter((opt) => opt.text.trim())
      .map((opt) => ({
        text: opt.text.trim(),
        is_correct: opt.is_correct,
      }));

    const questionData = {
      text: text.trim(),
      type,
      exam_paper_id: examPaperId || undefined,
      difficulty: difficulty as "Easy" | "Medium" | "Hard",
      options:
        type === "MCQ_SINGLE" || type === "MCQ_MULTIPLE"
          ? validOptions
          : undefined,
    };

    try {
      if (isNew) {
        await AdminApiService.createQuestion(questionData);
        Alert.alert("Success", "Question created successfully!");
      } else {
        await AdminApiService.updateQuestion(id!, questionData);
        Alert.alert("Success", "Question updated successfully!");
      }
      router.back();
    } catch (err: any) {
      Alert.alert(
        "Submission Error",
        err.message || "An unknown error occurred."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" className="mt-8" />;
  }

  if (error) {
    return <Text className="text-red-500 p-4 text-center">{error}</Text>;
  }

  return (
    <ScrollView className="flex-1 p-4 bg-gray-50">
      <Text className="text-2xl font-bold mb-6">
        {isNew ? "Create New Question" : "Edit Question"}
      </Text>

      <View className="mb-4">
        <Text className="font-semibold mb-1 text-gray-700">
          Question Text <Text className="text-red-500">*</Text>
        </Text>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Enter your question here..."
          multiline
          numberOfLines={4}
          className="bg-white p-3 border border-gray-300 rounded-lg"
        />
      </View>

      <View className="mb-4">
        <Text className="font-semibold mb-1 text-gray-700">Question Type</Text>
        <View className="bg-white border border-gray-300 rounded-lg">
          <Picker
            selectedValue={type}
            onValueChange={setType}
            style={{ height: 50 }}
          >
            {questionTypes.map((qt) => (
              <Picker.Item key={qt} label={qt} value={qt} />
            ))}
          </Picker>
        </View>
      </View>

      <View className="mb-4">
        <Text className="font-semibold mb-1 text-gray-700">Difficulty</Text>
        <View className="bg-white border border-gray-300 rounded-lg">
          <Picker
            selectedValue={difficulty}
            onValueChange={setDifficulty}
            style={{ height: 50 }}
          >
            {difficulties.map((d) => (
              <Picker.Item key={d} label={d} value={d} />
            ))}
          </Picker>
        </View>
      </View>

      <View className="mb-4">
        <Text className="font-semibold mb-1 text-gray-700">
          Exam Paper (Optional)
        </Text>
        <View className="bg-white border border-gray-300 rounded-lg">
          <Picker
            selectedValue={examPaperId}
            onValueChange={setExamPaperId}
            style={{ height: 50 }}
          >
            <Picker.Item label="Select an exam paper..." value="" />
            {examPapers.map((paper) => (
              <Picker.Item
                key={paper.id}
                label={paper.title}
                value={paper.id}
              />
            ))}
          </Picker>
        </View>
      </View>

      {(type === "MCQ_SINGLE" || type === "MCQ_MULTIPLE") && (
        <View className="mb-6">
          <Text className="font-semibold mb-3 text-gray-700">
            Answer Options
            {type === "MCQ_SINGLE"
              ? " (Select one correct answer)"
              : " (Select all correct answers)"}
          </Text>
          {options.map((option, index) => (
            <View
              key={index}
              className="mb-3 p-3 bg-white border border-gray-200 rounded-lg"
            >
              <View className="flex-row items-center mb-2">
                <Text className="font-medium text-gray-700 mr-2">
                  Option {String.fromCharCode(65 + index)}:
                </Text>
                <TouchableOpacity
                  onPress={() => setCorrectOption(index)}
                  className={`px-3 py-1 rounded ${
                    option.is_correct ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <Text
                    className={
                      option.is_correct ? "text-white" : "text-gray-700"
                    }
                  >
                    {option.is_correct ? "Correct" : "Mark as Correct"}
                  </Text>
                </TouchableOpacity>
              </View>
              <TextInput
                value={option.text}
                onChangeText={(text) => updateOption(index, "text", text)}
                placeholder={`Enter option ${String.fromCharCode(65 + index)}...`}
                multiline
                className="border border-gray-300 rounded p-2"
              />
            </View>
          ))}
        </View>
      )}

      {type === "True/False" && (
        <View className="mb-6">
          <Text className="font-semibold mb-3 text-gray-700">
            Correct Answer
          </Text>
          <View className="flex-row space-x-4">
            <TouchableOpacity
              onPress={() =>
                setOptions([
                  { text: "True", is_correct: true },
                  { text: "False", is_correct: false },
                ])
              }
              className={`flex-1 p-3 rounded-lg ${
                options[0]?.is_correct ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <Text
                className={`text-center font-semibold ${
                  options[0]?.is_correct ? "text-white" : "text-gray-700"
                }`}
              >
                True
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                setOptions([
                  { text: "True", is_correct: false },
                  { text: "False", is_correct: true },
                ])
              }
              className={`flex-1 p-3 rounded-lg ${
                options[1]?.is_correct ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <Text
                className={`text-center font-semibold ${
                  options[1]?.is_correct ? "text-white" : "text-gray-700"
                }`}
              >
                False
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {(type === "Short Answer" || type === "Essay") && (
        <View className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <Text className="text-blue-800 font-medium mb-2">
            {type === "Short Answer"
              ? "Short Answer Question"
              : "Essay Question"}
          </Text>
          <Text className="text-blue-600 text-sm">
            {type === "Short Answer"
              ? "Students will type a brief response to this question."
              : "Students will write a detailed essay response to this question."}
          </Text>
        </View>
      )}

      <TouchableOpacity
        onPress={handleSubmit}
        disabled={submitting}
        className={`p-4 rounded-lg ${submitting ? "bg-gray-400" : "bg-green-600"}`}
      >
        <Text className="text-white text-center font-bold text-lg">
          {submitting ? "Saving..." : "Save Question"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
