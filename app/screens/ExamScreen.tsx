// app/screens/ExamScreen.tsx - Integrated with apiService for questions/answers
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

// Import API service
import apiService from "../../services/apiService";
import { ExamConfig } from "../../utils/examValidator";

// Extended interface to include API IDs
interface ExtendedExamConfig extends ExamConfig {
  paperId: string;
  attemptId: string;
}

interface ExamScreenProps {
  examConfig: ExtendedExamConfig;
  currentSubject: string;
  onSubjectChange: (subject: string) => void;
  currentQuestionInSubject: number;
  onQuestionChange: (questionNumber: number) => void;
  userAnswers: { [questionId: string]: string };
  onAnswerChange: (answers: { [questionId: string]: string }) => void;
  examStartTime: number | null;
  onExamComplete?: (results: any) => void; // New prop for handling exam completion
}

// API Question interface
interface ApiQuestion {
  id: string;
  text: string;
  type: string;
  topic_id: string;
  options: ApiOption[];
}

interface ApiOption {
  id: string;
  text: string;
  is_correct: boolean;
}

export default function ExamScreen({
  examConfig,
  currentSubject,
  onSubjectChange,
  currentQuestionInSubject,
  onQuestionChange,
  userAnswers,
  onAnswerChange,
  examStartTime,
  onExamComplete,
}: ExamScreenProps) {
  const [questions, setQuestions] = useState<ApiQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [topics, setTopics] = useState<{ [key: string]: string }>({}); // Map topic names to IDs

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (Object.keys(topics).length > 0) {
      fetchQuestions();
    }
  }, [currentSubject, topics]);

  const fetchInitialData = async () => {
    try {
      // Fetch topics to map subject names to topic IDs
      const topicsResponse = await apiService.getTopics();
      const typedTopicsResponse = topicsResponse as Array<{
        id: string;
        name: string;
      }>;
      const topicsMap = typedTopicsResponse.reduce((acc: any, topic: any) => {
        acc[topic.name] = topic.id;
        return acc;
      }, {});
      setTopics(topicsMap);
    } catch (err) {
      console.error("Failed to fetch topics:", err);
      Alert.alert("Error", "Failed to load exam data");
    }
  };

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const currentSubjectId = topics[currentSubject];

      if (!currentSubjectId) {
        console.warn(`No topic ID found for subject: ${currentSubject}`);
        setQuestions([]);
        return;
      }

      // Fetch questions for the current subject/topic
      const response = await apiService.getQuestions({
        examPaperId: examConfig.paperId,
        type: "MCQ_SINGLE",
      });

      // Cast response to ApiQuestion[] before filtering
      const filteredQuestions = (response as ApiQuestion[]).filter(
        (q) => q.topic_id === currentSubjectId
      );

      setQuestions(filteredQuestions);
    } catch (err) {
      console.error("Failed to fetch questions:", err);
      Alert.alert("Error", "Failed to load questions");
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = async (optionKey: string) => {
    if (!currentQuestion) return;

    const selectedOption =
      currentQuestion.options[optionKey.charCodeAt(0) - 65];
    if (!selectedOption) return;

    // Update local state first for immediate UI feedback
    const newAnswers = { ...userAnswers, [currentQuestion.id]: optionKey };
    onAnswerChange(newAnswers);

    try {
      // Submit answer to API
      await apiService.submitAnswers(examConfig.attemptId, {
        answers: [
          {
            question_id: currentQuestion.id,
            selected_option_ids: [selectedOption.id],
          },
        ],
      });
    } catch (err) {
      console.error("Failed to submit answer:", err);
      // Don't show alert for individual answer submissions to avoid disrupting exam flow
      // The answer is still saved locally and can be resubmitted later
    }
  };

  const handleSubmitExam = async () => {
    Alert.alert(
      "Submit Exam",
      "Are you sure you want to submit your exam? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Submit",
          style: "destructive",
          onPress: performSubmitExam,
        },
      ]
    );
  };

  const performSubmitExam = async () => {
    try {
      setSubmitting(true);
      const results = await apiService.completeAttempt(examConfig.attemptId);

      if (onExamComplete) {
        onExamComplete(results);
      } else {
        Alert.alert(
          "Exam Completed",
          "Your exam has been submitted successfully!"
        );
      }
    } catch (err) {
      console.error("Failed to complete exam:", err);
      Alert.alert("Error", "Failed to submit exam. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Navigation logic
  const goToNext = () => {
    const questionsPerSubject = questions.length;

    if (currentQuestionInSubject < questionsPerSubject - 1) {
      // Move to next question in current subject
      onQuestionChange(currentQuestionInSubject + 1);
    } else {
      // Last question in current subject, move to next subject
      const currentSubjectIndex = examConfig.subjects.indexOf(currentSubject);
      if (currentSubjectIndex < examConfig.subjects.length - 1) {
        const nextSubject = examConfig.subjects[currentSubjectIndex + 1];
        onSubjectChange(nextSubject);
        onQuestionChange(0); // Start from first question of next subject
      }
    }
  };

  const goToPrevious = () => {
    if (currentQuestionInSubject > 0) {
      // Move to previous question in current subject
      onQuestionChange(currentQuestionInSubject - 1);
    } else {
      // First question in current subject, move to previous subject's last question
      const currentSubjectIndex = examConfig.subjects.indexOf(currentSubject);
      if (currentSubjectIndex > 0) {
        const previousSubject = examConfig.subjects[currentSubjectIndex - 1];
        onSubjectChange(previousSubject);
        // We'll need to wait for questions to load, so set to 0 for now
        onQuestionChange(0);
      }
    }
  };

  const handleQuestionNavigation = (questionIndex: number) => {
    onQuestionChange(questionIndex);
  };

  const getAnsweredQuestionsInSubject = () => {
    return questions.filter((q) => userAnswers[q.id]).length;
  };

  // Navigation info
  const currentQuestion = questions[currentQuestionInSubject];
  const isFirstQuestion =
    examConfig.subjects.indexOf(currentSubject) === 0 &&
    currentQuestionInSubject === 0;
  const isLastQuestion =
    examConfig.subjects.indexOf(currentSubject) ===
      examConfig.subjects.length - 1 &&
    currentQuestionInSubject === questions.length - 1;

  // Loading state
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center p-6">
        <Text className="text-lg text-gray-600 mb-4">Loading questions...</Text>
        <Text className="text-sm text-gray-500">Subject: {currentSubject}</Text>
      </View>
    );
  }

  // No questions available
  if (questions.length === 0) {
    return (
      <View className="flex-1 justify-center items-center p-6">
        <Text className="text-lg text-red-600 mb-4">
          No questions available
        </Text>
        <Text className="text-sm text-gray-500 text-center">
          No questions found for {currentSubject}. Please check your exam
          configuration.
        </Text>
      </View>
    );
  }

  // Current question not available
  if (!currentQuestion) {
    return (
      <View className="flex-1 justify-center items-center p-6">
        <Text className="text-lg text-red-600 mb-4">Question not found</Text>
        <Text className="text-sm text-gray-500">
          Question index: {currentQuestionInSubject}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <View
        className="flex-1 p-6"
        style={{ minHeight: 0, display: "flex", flexDirection: "column" }}
      >
        {/* Current Subject Header */}
        <View style={{ flexShrink: 0 }} className="mb-6">
          <Text className="text-2xl font-bold text-green-700 mb-2">
            {currentSubject}
          </Text>
          <Text className="text-lg">
            Question {currentQuestionInSubject + 1} of {questions.length}
          </Text>
          <Text className="text-sm text-gray-600">
            Progress: {getAnsweredQuestionsInSubject()} of {questions.length}{" "}
            answered
          </Text>
        </View>

        {/* Question */}
        <View
          className="flex-1 mb-6"
          style={{
            flex: 1,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Text className="text-lg mb-6">{currentQuestion.text}</Text>

          {/* Answer Options */}
          <View className="space-y-3" style={{ flex: 1 }}>
            {currentQuestion.options.map((option, index) => {
              const optionKey = String.fromCharCode(65 + index); // A, B, C, D
              const isSelected = userAnswers[currentQuestion.id] === optionKey;

              return (
                <TouchableOpacity
                  key={option.id}
                  onPress={() => handleAnswerSelect(optionKey)}
                  className="flex-row items-center space-x-3 p-3 border border-gray-300 rounded-lg"
                  style={{ marginBottom: 12 }}
                >
                  <View
                    className={`w-6 h-6 rounded-full border-2 ${
                      isSelected
                        ? "bg-blue-600 border-blue-600"
                        : "border-gray-400"
                    }`}
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      borderWidth: 2,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {isSelected && (
                      <View
                        className="w-2 h-2 bg-white rounded-full"
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: "white",
                        }}
                      />
                    )}
                  </View>
                  <Text
                    className="text-base flex-1"
                    style={{ flex: 1, marginLeft: 12 }}
                  >
                    ({optionKey}) {option.text}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Question Navigation Grid for Current Subject */}
        <View className="mb-6" style={{ flexShrink: 0 }}>
          <Text className="font-bold mb-2">Questions in {currentSubject}:</Text>
          <View
            className="flex-row flex-wrap gap-1"
            style={{ flexDirection: "row", flexWrap: "wrap", gap: 4 }}
          >
            {questions.map((question, index) => {
              const isAnswered = userAnswers[question.id];
              const isCurrent = index === currentQuestionInSubject;

              return (
                <TouchableOpacity
                  key={question.id}
                  onPress={() => handleQuestionNavigation(index)}
                  className={`w-8 h-8 rounded items-center justify-center ${
                    isCurrent
                      ? "bg-green-600"
                      : isAnswered
                        ? "bg-blue-600"
                        : "bg-red-600"
                  }`}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 4,
                    alignItems: "center",
                    justifyContent: "center",
                    margin: 2,
                  }}
                >
                  <Text
                    className="text-white text-xs font-bold"
                    style={{ color: "white", fontSize: 12, fontWeight: "bold" }}
                  >
                    {index + 1}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text className="text-sm text-gray-600 mt-2">
            Green = Current • Blue = Answered • Red = Unanswered
          </Text>
        </View>

        {/* Navigation and Submit Buttons */}
        <View
          className="flex-row justify-between mb-4"
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <TouchableOpacity
            onPress={goToPrevious}
            disabled={isFirstQuestion}
            className={`px-6 py-3 rounded-lg ${
              isFirstQuestion ? "bg-gray-300" : "bg-blue-600"
            }`}
          >
            <Text
              className={`font-bold ${
                isFirstQuestion ? "text-gray-500" : "text-white"
              }`}
            >
              PREVIOUS
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={goToNext}
            disabled={isLastQuestion}
            className={`px-6 py-3 rounded-lg ${
              isLastQuestion ? "bg-gray-300" : "bg-blue-600"
            }`}
          >
            <Text
              className={`font-bold ${
                isLastQuestion ? "text-gray-500" : "text-white"
              }`}
            >
              NEXT
            </Text>
          </TouchableOpacity>
        </View>

        {/* Submit Exam Button */}
        <TouchableOpacity
          onPress={handleSubmitExam}
          disabled={submitting}
          className={`py-4 px-6 rounded-lg ${
            submitting ? "bg-gray-400" : "bg-red-600"
          }`}
          style={{ flexShrink: 0 }}
        >
          <Text className="text-white font-bold text-center text-lg">
            {submitting ? "SUBMITTING..." : "SUBMIT EXAM"}
          </Text>
        </TouchableOpacity>

        {/* Exam Progress Summary */}
        <View
          className="mt-4 p-4 bg-gray-50 rounded-lg"
          style={{ flexShrink: 0 }}
        >
          <Text className="font-bold text-gray-800 mb-2">📊 Exam Progress</Text>
          <Text className="text-sm text-gray-600">
            Total Questions:{" "}
            {examConfig.subjects.reduce((total, subject) => {
              return total + (questions.length > 0 ? questions.length : 0);
            }, 0)}
          </Text>
          <Text className="text-sm text-gray-600">
            Answered: {Object.keys(userAnswers).length}
          </Text>
          <Text className="text-sm text-gray-600">
            Current Subject: {currentSubject} ({getAnsweredQuestionsInSubject()}
            /{questions.length})
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
