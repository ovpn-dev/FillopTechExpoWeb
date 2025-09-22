// app/(admin)/exam-papers/[id]/questions.tsx - Questions page with pre-selected exam paper
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import AdminApiService from "../../../../services/adminApiService";
import ApiService, { ExamPaperResponse, QuestionResponse } from "../../../../services/apiService";

interface Option {
  text: string;
  is_correct: boolean;
}

export default function ExamPaperQuestionsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  
  // Exam paper and questions state
  const [examPaper, setExamPaper] = useState<ExamPaperResponse | null>(null);
  const [questions, setQuestions] = useState<QuestionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuestionResponse | null>(null);
  const [text, setText] = useState("");
  const [type, setType] = useState<string>("MCQ_SINGLE");
  const [difficulty, setDifficulty] = useState<string>("Medium");
  const [options, setOptions] = useState<Option[]>([
    { text: "", is_correct: false },
    { text: "", is_correct: false },
    { text: "", is_correct: false },
    { text: "", is_correct: false },
  ]);
  const [submitting, setSubmitting] = useState(false);

  const questionTypes = [
    "MCQ_SINGLE",
    "MCQ_MULTIPLE",
    "True/False",
    "Short Answer",
    "Essay",
  ];

  const difficulties = ["Easy", "Medium", "Hard"];

  const fetchData = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const [examPaperData, questionsData] = await Promise.all([
        ApiService.getExamPaper(id),
        ApiService.getQuestions({ examPaperId: id })
      ]);
      
      setExamPaper(examPaperData);
      setQuestions(questionsData);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleDelete = async (questionId: string, text: string) => {
    Alert.alert(
      "Delete Question",
      `Are you sure you want to delete this question?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await AdminApiService.deleteQuestion(questionId);
              Alert.alert("Success", "Question deleted successfully.");
              fetchData();
            } catch (err: any) {
              Alert.alert("Error", "Failed to delete: " + err.message);
            }
          },
        },
      ]
    );
  };

  const startEdit = (question: QuestionResponse) => {
    setEditingQuestion(question);
    setText(question.text);
    setType(question.question_type || "MCQ_SINGLE");
    setDifficulty(question.difficulty_level || "Medium");
    
    if (question.options && question.options.length > 0) {
      const loadedOptions = question.options.map((opt) => ({
        text: opt.text,
        is_correct: opt.is_correct || false,
      }));
      while (loadedOptions.length < 4) {
        loadedOptions.push({ text: "", is_correct: false });
      }
      setOptions(loadedOptions);
    } else {
      resetOptions();
    }
    setShowForm(true);
  };

  const startCreate = () => {
    setEditingQuestion(null);
    setText("");
    setType("MCQ_SINGLE");
    setDifficulty("Medium");
    resetOptions();
    setShowForm(true);
  };

  const resetOptions = () => {
    setOptions([
      { text: "", is_correct: false },
      { text: "", is_correct: false },
      { text: "", is_correct: false },
      { text: "", is_correct: false },
    ]);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingQuestion(null);
    setText("");
    setType("MCQ_SINGLE");
    setDifficulty("Medium");
    resetOptions();
  };

  const updateOption = (index: number, field: keyof Option, value: string | boolean) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setOptions(newOptions);
  };

  const setCorrectOption = (index: number) => {
    if (type === "MCQ_SINGLE") {
      const newOptions = options.map((opt, i) => ({
        ...opt,
        is_correct: i === index,
      }));
      setOptions(newOptions);
    } else {
      updateOption(index, "is_correct", !options[index].is_correct);
    }
  };

  const handleSubmit = async () => {
    if (!text.trim()) {
      Alert.alert("Validation Error", "Please enter the question text.");
      return;
    }

    if (!id) {
      Alert.alert("Error", "No exam paper selected.");
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
      question_type: type as any,
      exam_paper_id: id, // Automatically use the selected exam paper
      difficulty_level: difficulty as "Easy" | "Medium" | "Hard",
      options:
        type === "MCQ_SINGLE" || type === "MCQ_MULTIPLE"
          ? validOptions
          : undefined,
    };

    try {
      if (editingQuestion) {
        await AdminApiService.updateQuestion(editingQuestion.id, questionData);
        Alert.alert("Success", "Question updated successfully!");
      } else {
        await AdminApiService.createQuestion(questionData);
        Alert.alert("Success", "Question created successfully!");
      }
      cancelForm();
      fetchData();
    } catch (err: any) {
      Alert.alert(
        "Submission Error",
        err.message || "An unknown error occurred."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
        <Text className="mt-2 text-gray-600">Loading exam paper...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-red-600 text-center">{error}</Text>
        <TouchableOpacity
          onPress={fetchData}
          className="mt-4 bg-blue-500 p-2 rounded"
        >
          <Text className="text-white">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!examPaper) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-red-600 text-center">Exam paper not found</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-4 bg-gray-500 p-2 rounded"
        >
          <Text className="text-white">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (showForm) {
    return (
      <ScrollView className="flex-1 p-4 bg-gray-50">
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-2xl font-bold">
            {editingQuestion ? "Edit Question" : "Add Question"}
          </Text>
          <TouchableOpacity
            onPress={cancelForm}
            className="bg-gray-500 px-4 py-2 rounded"
          >
            <Text className="text-white">Cancel</Text>
          </TouchableOpacity>
        </View>

        {/* Exam Paper Info */}
        <View className="bg-blue-50 p-4 rounded-lg mb-4">
          <Text className="text-blue-800 font-medium mb-1">
            Adding question to:
          </Text>
          <Text className="text-blue-600 font-semibold">
            {examPaper.title}
          </Text>
          <Text className="text-blue-500 text-sm">
            {examPaper.exam_type_name} • {examPaper.exam_type_duration_minutes} minutes
          </Text>
        </View>

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

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={submitting}
          className={`p-4 rounded-lg ${submitting ? "bg-gray-400" : "bg-green-600"}`}
        >
          <Text className="text-white text-center font-bold text-lg">
            {submitting 
              ? "Saving..." 
              : editingQuestion 
                ? "Update Question" 
                : "Add Question"
            }
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <View className="flex-1 p-4 bg-white">
      {/* Exam Paper Header */}
      <View className="bg-gradient-to-r from-green-600 to-green-700 p-4 rounded-lg mb-4 shadow">
        <Text className="text-white text-xl font-bold">{examPaper.title}</Text>
        <Text className="text-green-100 text-sm">
          {examPaper.exam_type_name} • {examPaper.exam_type_duration_minutes} minutes
        </Text>
        <Text className="text-green-100 text-sm">
          {questions.length} question{questions.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Add Question Button */}
      <TouchableOpacity 
        onPress={startCreate}
        className="bg-green-600 p-3 rounded-lg mb-4 shadow"
      >
        <Text className="text-white font-bold text-center text-lg">
          + Add Question to This Paper
        </Text>
      </TouchableOpacity>

      {/* Questions List */}
      <FlatList
        data={questions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="p-4 mb-3 border border-gray-200 rounded-lg bg-white shadow-sm">
            <Text className="text-lg font-semibold text-gray-800 mb-2">
              {truncateText(item.text)}
            </Text>

            <View className="flex-row justify-between items-start mb-2">
              <View className="flex-1">
                <Text className="text-gray-600 text-sm">Type: {item.question_type}</Text>
                <Text className="text-gray-600 text-sm">Level: {item.difficulty_level}</Text>
                {item.options && item.options.length > 0 && (
                  <Text className="text-gray-600 text-sm mt-1">
                    {item.options.length} options
                  </Text>
                )}
              </View>
            </View>

            {item.options && item.options.length > 0 && (
              <View className="mb-3">
                <Text className="text-gray-700 font-medium text-sm mb-1">
                  Options:
                </Text>
                {item.options.slice(0, 2).map((option, index) => (
                  <Text key={option.id} className="text-gray-600 text-xs ml-2">
                    {String.fromCharCode(65 + index)}.{" "}
                    {truncateText(option.text, 50)}
                    {option.is_correct && (
                      <Text className="text-green-600"> ✓</Text>
                    )}
                  </Text>
                ))}
                {item.options.length > 2 && (
                  <Text className="text-gray-500 text-xs ml-2">
                    +{item.options.length - 2} more options
                  </Text>
                )}
              </View>
            )}

            <View className="flex-row justify-end space-x-2">
              <TouchableOpacity
                onPress={() => startEdit(item)}
                className="bg-yellow-500 px-3 py-2 rounded"
              >
                <Text className="text-white">Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDelete(item.id, item.text)}
                className="bg-red-600 px-3 py-2 rounded"
              >
                <Text className="text-white">Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-20">
            <Text className="text-gray-500 text-lg">No questions added yet</Text>
            <Text className="text-gray-400 mt-2">
              Add the first question to this exam paper!
            </Text>
          </View>
        }
      />
    </View>
  );
}