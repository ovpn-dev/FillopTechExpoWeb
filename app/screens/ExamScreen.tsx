// app/screens/ExamScreen.tsx - Cleaned version without subject switcher
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

// Import our new services and types
import { QuestionService } from "../services/questionService";
import { ExamConfig } from "../utils/examValidator";

interface ExamScreenProps {
  examConfig: ExamConfig;
  currentSubject: string;
  onSubjectChange: (subject: string) => void;
  currentQuestionInSubject: number;
  onQuestionChange: (questionNumber: number) => void;
  userAnswers: { [questionId: string]: string };
  onAnswerChange: (answers: { [questionId: string]: string }) => void;
  examStartTime: number | null;
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
}: ExamScreenProps) {
  // Use QuestionService to generate questions
  const currentSubjectQuestions = QuestionService.generateQuestionsForSubject(
    currentSubject,
    examConfig.numberOfQuestions || 40
  );

  const currentQuestion = currentSubjectQuestions[currentQuestionInSubject];

  // Get navigation info using QuestionService
  const navigationInfo = QuestionService.getQuestionNavigation(
    examConfig.subjects,
    currentSubject,
    currentQuestionInSubject,
    examConfig.numberOfQuestions || 40
  );

  const handleAnswerSelect = (answer: string) => {
    const newAnswers = { ...userAnswers, [currentQuestion.id]: answer };
    onAnswerChange(newAnswers);
  };

  const goToNext = () => {
    const questionsPerSubject = examConfig.numberOfQuestions || 40;

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
    const questionsPerSubject = examConfig.numberOfQuestions || 40;

    if (currentQuestionInSubject > 0) {
      // Move to previous question in current subject
      onQuestionChange(currentQuestionInSubject - 1);
    } else {
      // First question in current subject, move to previous subject's last question
      const currentSubjectIndex = examConfig.subjects.indexOf(currentSubject);
      if (currentSubjectIndex > 0) {
        const previousSubject = examConfig.subjects[currentSubjectIndex - 1];
        onSubjectChange(previousSubject);
        onQuestionChange(questionsPerSubject - 1); // Go to last question of previous subject
      }
    }
  };

  const handleQuestionNavigation = (questionIndex: number) => {
    onQuestionChange(questionIndex);
  };

  const getAnsweredQuestionsInSubject = (subject: string) => {
    const allQuestions = QuestionService.generateQuestionsForSubject(
      subject,
      examConfig.numberOfQuestions || 40
    );
    return QuestionService.getAnsweredQuestionsInSubject(
      allQuestions,
      subject,
      userAnswers
    );
  };

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
            Question {navigationInfo.currentQuestionNumber} of{" "}
            {navigationInfo.totalQuestionsInSubject}
          </Text>
          <Text className="text-sm text-gray-600">
            Progress: {getAnsweredQuestionsInSubject(currentSubject)} of{" "}
            {examConfig.numberOfQuestions || 40} answered
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
                  key={optionKey}
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
                    ({optionKey}) {option}
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
            {currentSubjectQuestions.map((_, index) => {
              const isAnswered = userAnswers[currentSubjectQuestions[index].id];
              const isCurrent = index === currentQuestionInSubject;

              return (
                <TouchableOpacity
                  key={index}
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

        {/* Navigation Buttons */}
        <View
          className="flex-row justify-between"
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <TouchableOpacity
            onPress={goToPrevious}
            disabled={navigationInfo.isFirstQuestion}
            className={`px-6 py-3 rounded-lg ${
              navigationInfo.isFirstQuestion ? "bg-gray-300" : "bg-blue-600"
            }`}
          >
            <Text
              className={`font-bold ${
                navigationInfo.isFirstQuestion ? "text-gray-500" : "text-white"
              }`}
            >
              PREVIOUS
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={goToNext}
            disabled={navigationInfo.isLastQuestion}
            className={`px-6 py-3 rounded-lg ${
              navigationInfo.isLastQuestion ? "bg-gray-300" : "bg-blue-600"
            }`}
          >
            <Text
              className={`font-bold ${
                navigationInfo.isLastQuestion ? "text-gray-500" : "text-white"
              }`}
            >
              NEXT
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
