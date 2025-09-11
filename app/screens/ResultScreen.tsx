// app/screens/ResultScreen.tsx - Integrated with apiService for attempt results
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

// Import API service and utilities
import apiService from "../../services/apiService";
import { ScoreCalculator } from "../../utils/scoreCalculator";
import { formatLongTime } from "../../utils/timeFormatter";

interface ResultScreenProps {
  attemptId: string;
  onRetakeExam: () => void;
  onReturnToDashboard: () => void;
}

// API Attempt interface
interface ApiAttempt {
  id: string;
  status: string;
  score: number;
  total_questions: number;
  time_taken: number;
  started_at: string;
  completed_at: string;
  exam_paper: {
    id: string;
    title: string;
    exam: {
      name: string;
    };
  };
  user_answers: ApiUserAnswer[];
}

interface ApiUserAnswer {
  id: string;
  question_id: string;
  selected_option_ids: string[];
  is_correct: boolean;
  question: {
    id: string;
    text: string;
    topic: {
      id: string;
      name: string;
    };
    options: ApiOption[];
  };
}

interface ApiOption {
  id: string;
  text: string;
  is_correct: boolean;
}

// Local results interface (mapped from API)
interface ExamResults {
  score: number;
  totalQuestions: number;
  timeUsed: number;
  examMode: string;
  subjectBreakdown: { [subject: string]: { correct: number; total: number } };
  percentage: number;
  examTitle: string;
  completedAt: string;
}

const ResultScreen: React.FC<ResultScreenProps> = ({
  attemptId,
  onRetakeExam,
  onReturnToDashboard,
}) => {
  const [results, setResults] = useState<ExamResults | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const attempt = (await apiService.getExamAttempt(
        attemptId
      )) as ApiAttempt;

      // Map API attempt to local ExamResults format
      const mappedResults = mapApiAttemptToResults(attempt);
      setResults(mappedResults);
    } catch (err) {
      console.error("Failed to fetch results:", err);
      Alert.alert("Error", "Failed to load exam results. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const mapApiAttemptToResults = (attempt: ApiAttempt): ExamResults => {
    // Calculate subject breakdown from user answers
    const subjectBreakdown: {
      [subject: string]: { correct: number; total: number };
    } = {};

    attempt.user_answers.forEach((answer) => {
      const subjectName = answer.question.topic.name;

      if (!subjectBreakdown[subjectName]) {
        subjectBreakdown[subjectName] = { correct: 0, total: 0 };
      }

      subjectBreakdown[subjectName].total++;
      if (answer.is_correct) {
        subjectBreakdown[subjectName].correct++;
      }
    });

    // Calculate time used (in seconds)
    const timeUsed = attempt.time_taken || 0;

    // Determine exam mode (you might want to store this in the attempt or paper)
    const examMode = timeUsed > 0 ? "Timed" : "Untimed";

    return {
      score: attempt.score || 0,
      totalQuestions: attempt.total_questions || attempt.user_answers.length,
      timeUsed,
      examMode,
      subjectBreakdown,
      percentage: ScoreCalculator.calculatePercentage(
        attempt.score || 0,
        attempt.total_questions || attempt.user_answers.length
      ),
      examTitle: attempt.exam_paper?.title || "Exam",
      completedAt: attempt.completed_at || new Date().toISOString(),
    };
  };

  const handlePrintResults = () => {
    Alert.alert("Print Results", "Results will be prepared for printing.", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Print",
        onPress: () => {
          // TODO: Implement print functionality
          // You might want to integrate with a printing service or
          // generate a PDF version of the results
          Alert.alert("Info", "Print functionality will be implemented soon.");
        },
      },
    ]);
  };

  const handleShareResults = () => {
    Alert.alert("Share Results", "How would you like to share your results?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Email",
        onPress: () => {
          // TODO: Implement email sharing
          Alert.alert("Info", "Email sharing will be implemented soon.");
        },
      },
      {
        text: "Download PDF",
        onPress: () => {
          // TODO: Implement PDF download
          Alert.alert("Info", "PDF download will be implemented soon.");
        },
      },
    ]);
  };

  // Loading state
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center p-6">
        <Text className="text-lg text-gray-600 mb-4">Loading results...</Text>
        <Text className="text-sm text-gray-500">
          Please wait while we calculate your scores.
        </Text>
      </View>
    );
  }

  // Error state - no results
  if (!results) {
    return (
      <View className="flex-1 justify-center items-center p-6">
        <Text className="text-lg text-red-600 mb-4">Results Not Available</Text>
        <Text className="text-sm text-gray-500 mb-6 text-center">
          We couldn't load your exam results. Please try again.
        </Text>
        <TouchableOpacity
          onPress={onReturnToDashboard}
          className="bg-blue-600 px-6 py-3 rounded-lg"
        >
          <Text className="text-white font-bold">Return to Dashboard</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isTimedExam = results.timeUsed > 0;
  const performanceInfo = ScoreCalculator.getPerformanceGrade(
    results.percentage
  );
  const studyRecommendations = ScoreCalculator.generateStudyRecommendations(
    results.subjectBreakdown
  );

  return (
    <ScrollView>
      <View className="flex-1 p-6">
        <Text className="text-3xl font-bold text-center mb-2 text-green-800">
          EXAM RESULTS
        </Text>
        <Text className="text-center text-gray-600 mb-6">
          {results.examTitle}
        </Text>

        {/* Score Summary */}
        <View className="bg-white rounded-lg p-6 mb-6 shadow-md border-2 border-green-200">
          <Text className="text-6xl font-bold text-center text-green-600 mb-2">
            {results.percentage}%
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
              🕐 Completed in {results.examMode} Mode
            </Text>
          )}

          {/* Completion timestamp */}
          <Text className="text-center text-gray-500 text-sm mb-4">
            📅 Completed: {new Date(results.completedAt).toLocaleString()}
          </Text>

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
        {studyRecommendations.length > 0 && (
          <View className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
            <Text className="font-bold text-blue-800 mb-2">
              📚 Study Recommendations:
            </Text>
            <View>
              {studyRecommendations.map((recommendation, index) => (
                <Text key={index} className="text-blue-700 text-sm mb-1">
                  • {recommendation}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Detailed Statistics */}
        <View className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
          <Text className="font-bold text-gray-800 mb-2">
            📊 Detailed Statistics:
          </Text>
          <View className="flex-row justify-between mb-1">
            <Text className="text-gray-600">Questions Attempted:</Text>
            <Text className="text-gray-800 font-semibold">
              {results.totalQuestions}
            </Text>
          </View>
          <View className="flex-row justify-between mb-1">
            <Text className="text-gray-600">Correct Answers:</Text>
            <Text className="text-green-600 font-semibold">
              {results.score}
            </Text>
          </View>
          <View className="flex-row justify-between mb-1">
            <Text className="text-gray-600">Incorrect Answers:</Text>
            <Text className="text-red-600 font-semibold">
              {results.totalQuestions - results.score}
            </Text>
          </View>
          <View className="flex-row justify-between mb-1">
            <Text className="text-gray-600">Accuracy Rate:</Text>
            <Text className="text-blue-600 font-semibold">
              {results.percentage}%
            </Text>
          </View>
          {isTimedExam && (
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Time per Question:</Text>
              <Text className="text-purple-600 font-semibold">
                {Math.round(results.timeUsed / results.totalQuestions)}s avg
              </Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View className="flex-row gap-2 mb-4">
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
        </View>

        {/* Additional Action Buttons */}
        <View className="flex-row gap-2">
          <TouchableOpacity
            className="flex-1 bg-blue-600 p-4 rounded-lg"
            onPress={handlePrintResults}
          >
            <Text className="text-white text-center font-bold">
              PRINT RESULT
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 bg-purple-600 p-4 rounded-lg"
            onPress={handleShareResults}
          >
            <Text className="text-white text-center font-bold">
              SHARE RESULTS
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View className="mt-6 pt-4 border-t border-gray-200">
          <Text className="text-center text-sm text-gray-500">
            Keep up the great work! 🎓
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default ResultScreen;
