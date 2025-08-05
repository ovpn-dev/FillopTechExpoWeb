// components/ResultScreen.tsx - Updated with mode-based time display
import React from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

interface ResultScreenProps {
  results: {
    score: number;
    totalQuestions: number;
    timeUsed: number;
    subjectBreakdown: { [subject: string]: { correct: number; total: number } };
    examMode?: string; // Add examMode to know if it was timed
  };
  onRetakeExam: () => void;
  onReturnToDashboard: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({
  results,
  onRetakeExam,
  onReturnToDashboard,
}) => {
  const percentage = Math.round((results.score / results.totalQuestions) * 100);
  const isTimedExam = results.timeUsed > 0; // If timeUsed is 0, it wasn't a timed exam

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  const getPerformanceMessage = () => {
    if (percentage >= 70) {
      return {
        message: "EXCELLENT PERFORMANCE!",
        description:
          "Outstanding work! You've demonstrated strong mastery of the subjects.",
        color: "text-green-800",
        bgColor: "bg-green-100",
      };
    } else if (percentage >= 50) {
      return {
        message: "GOOD PERFORMANCE!",
        description:
          "Well done! With some more practice, you can achieve excellence.",
        color: "text-yellow-800",
        bgColor: "bg-yellow-100",
      };
    } else {
      return {
        message: "NEEDS IMPROVEMENT",
        description: "Keep practicing! Focus on areas where you scored lower.",
        color: "text-red-800",
        bgColor: "bg-red-100",
      };
    }
  };

  const performanceInfo = getPerformanceMessage();

  return (
    <ScrollView>
      {" "}
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
              ⏰ Time Used: {formatTime(results.timeUsed)}
            </Text>
          )}

          {/* Mode indicator for non-timed exams */}
          {!isTimedExam && (
            <Text className="text-center text-blue-600 mb-4">
              🕐 Completed in Untimed Mode
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
              className={`px-4 py-2 rounded-full ${
                percentage >= 70
                  ? "bg-green-100"
                  : percentage >= 50
                    ? "bg-yellow-100"
                    : "bg-red-100"
              }`}
            >
              <Text
                className={`font-bold ${
                  percentage >= 70
                    ? "text-green-800"
                    : percentage >= 50
                      ? "text-yellow-800"
                      : "text-red-800"
                }`}
              >
                {percentage >= 70
                  ? "EXCELLENT"
                  : percentage >= 50
                    ? "GOOD"
                    : "NEEDS IMPROVEMENT"}
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
              const subjectPercentage = Math.round(
                (data.correct / data.total) * 100
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
                      {subjectPercentage}%
                    </Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-gray-600">
                      Correct: {data.correct}/{data.total}
                    </Text>
                    <Text
                      className={`font-semibold ${
                        subjectPercentage >= 70
                          ? "text-green-600"
                          : subjectPercentage >= 50
                            ? "text-yellow-600"
                            : "text-red-600"
                      }`}
                    >
                      {subjectPercentage >= 70
                        ? "Excellent"
                        : subjectPercentage >= 50
                          ? "Good"
                          : "Poor"}
                    </Text>
                  </View>

                  {/* Progress bar */}
                  <View className="mt-2 bg-gray-200 rounded-full h-2">
                    <View
                      className={`h-2 rounded-full ${
                        subjectPercentage >= 70
                          ? "bg-green-500"
                          : subjectPercentage >= 50
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                      style={{ width: `${subjectPercentage}%` }}
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
            {Object.entries(results.subjectBreakdown)
              .filter(([_, data]) => data.correct / data.total < 0.7)
              .map(([subject, data]) => {
                const subjectPercentage = Math.round(
                  (data.correct / data.total) * 100
                );
                return (
                  <Text key={subject} className="text-blue-700 text-sm">
                    • Focus more on {subject} (scored {subjectPercentage}%)
                  </Text>
                );
              })}
            {Object.entries(results.subjectBreakdown).every(
              ([_, data]) => data.correct / data.total >= 0.7
            ) && (
              <Text className="text-blue-700 text-sm">
                • Great job! You've performed well across all subjects. Keep
                practicing to maintain your level.
              </Text>
            )}
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
