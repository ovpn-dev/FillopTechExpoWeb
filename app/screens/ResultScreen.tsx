// app/screens/ResultScreen.tsx - Updated with ScoreCalculator service
import React from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

// Import our services and utilities
import { ExamResults } from "../types";
import { ScoreCalculator } from "../utils/scoreCalculator";
import { formatLongTime } from "../utils/timeFormatter";

interface ResultScreenProps {
  results: ExamResults;
  onRetakeExam: () => void;
  onReturnToDashboard: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({
  results,
  onRetakeExam,
  onReturnToDashboard,
}) => {
  const percentage = ScoreCalculator.calculatePercentage(
    results.score,
    results.totalQuestions
  );
  const isTimedExam = results.timeUsed > 0;
  const performanceInfo = ScoreCalculator.getPerformanceGrade(percentage);
  const studyRecommendations = ScoreCalculator.generateStudyRecommendations(
    results.subjectBreakdown
  );

  return (
    <ScrollView>
      <View className="flex-1 p-6">
        <Text className="text-3xl font-bold text-center mb-6 text-green-800">
          EXAM RESULTS
        </Text>

        {/* Score Summary */}
        <View className="bg-white rounded-lg p-6 mb-6 shadow-md border-2 border-green-200">
          <Text className="text-6xl font-bold text-center text-green-600 mb-2">
            {percentage}%
          </Text>
          <Text className="text-xl text-center text-gray-700 mb-4">
            {results.score} out of {results.totalQuestions} questions correct
          </Text>

          {/* Time Used - Only show if it was a timed exam */}
          {isTimedExam && (
            <Text className="text-center text-gray-600 mb-4">
              ⏰ Time Used: {formatLongTime(results.timeUsed)}
            </Text>
          )}

          {/* Mode indicator for non-timed exams */}
          {!isTimedExam && (
            <Text className="text-center text-blue-600 mb-4">
              🕐 Completed in {results.examMode || "Untimed"} Mode
            </Text>
          )}

          {/* Performance Message */}
          <View className={`${performanceInfo.bgColor} rounded-lg p-3 mb-4`}>
            <Text
              className={`${performanceInfo.color} font-bold text-center text-lg`}
            >
              {performanceInfo.message}
            </Text>
            <Text
              className={`${performanceInfo.color} text-center text-sm mt-1`}
            >
              {performanceInfo.description}
            </Text>
          </View>

          <View className="flex-row justify-center">
            <View
              className={`px-4 py-2 rounded-full ${performanceInfo.bgColor}`}
            >
              <Text className={`font-bold ${performanceInfo.color}`}>
                {performanceInfo.grade}
              </Text>
            </View>
          </View>
        </View>

        {/* Subject Breakdown */}
        <View className="bg-white rounded-lg p-4 mb-6 shadow-md flex-1">
          <Text className="text-lg font-bold mb-4 text-center">
            Subject Breakdown
          </Text>
          <ScrollView>
            {Object.entries(results.subjectBreakdown).map(([subject, data]) => {
              const subjectPerformance = ScoreCalculator.getSubjectPerformance(
                data.correct,
                data.total
              );

              return (
                <View
                  key={subject}
                  className="mb-4 p-3 border border-gray-200 rounded-lg"
                >
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="flex-1 font-semibold text-base">
                      {subject}
                    </Text>
                    <Text className="text-blue-600 font-bold text-lg">
                      {subjectPerformance.percentage}%
                    </Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-gray-600">
                      Correct: {data.correct}/{data.total}
                    </Text>
                    <Text
                      className={`font-semibold ${subjectPerformance.color}`}
                    >
                      {subjectPerformance.grade}
                    </Text>
                  </View>

                  {/* Progress bar */}
                  <View className="mt-2 bg-gray-200 rounded-full h-2">
                    <View
                      className={`h-2 rounded-full ${
                        subjectPerformance.percentage >= 70
                          ? "bg-green-500"
                          : subjectPerformance.percentage >= 50
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                      style={{ width: `${subjectPerformance.percentage}%` }}
                    />
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>

        {/* Study Recommendations */}
        <View className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
          <Text className="font-bold text-blue-800 mb-2">
            📚 Study Recommendations:
          </Text>
          <View>
            {studyRecommendations.map((recommendation, index) => (
              <Text key={index} className="text-blue-700 text-sm">
                • {recommendation}
              </Text>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View className="flex-row gap-4">
          <TouchableOpacity
            onPress={onReturnToDashboard}
            className="flex-1 bg-gray-600 p-4 rounded-lg"
          >
            <Text className="text-white text-center font-bold">CLOSE</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onRetakeExam}
            className="flex-1 bg-orange-600 p-4 rounded-lg"
          >
            <Text className="text-white text-center font-bold">
              RETAKE EXAM
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 bg-blue-600 p-4 rounded-lg"
            onPress={() => {
              Alert.alert(
                "Print Results",
                "Results will be prepared for printing.",
                [{ text: "OK" }]
              );
            }}
          >
            <Text className="text-white text-center font-bold">
              PRINT RESULT
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default ResultScreen;
