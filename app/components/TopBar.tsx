// components/TopBar.tsx
import React, { useEffect, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { ExamConfig } from "../examInterface/welcome";

interface TopBarProps {
  examConfig: ExamConfig;
  showSubmit?: boolean;
  onSubmit?: () => void;
  onBack: () => void;
  currentSubject?: string;
  onSubjectChange?: (subject: string) => void;
  examStartTime?: number | null;
  showTimer?: boolean; // Only show active timer in exam screen
}

const TopBar: React.FC<TopBarProps> = ({
  examConfig,
  showSubmit,
  onSubmit,
  onBack,
  currentSubject,
  onSubjectChange,
  examStartTime,
  showTimer = false,
}) => {
  const [timeRemaining, setTimeRemaining] = useState(examConfig.totalTime);

  useEffect(() => {
    if (!showTimer || !examStartTime) return;

    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - examStartTime) / 1000);
      const remaining = Math.max(0, examConfig.totalTime - elapsed);

      setTimeRemaining(remaining);

      if (remaining <= 0) {
        clearInterval(timer);
        onSubmit?.(); // Auto-submit when time runs out
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [showTimer, examStartTime, examConfig.totalTime, onSubmit]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")} min`;
  };

  const handleSubmitConfirmation = () => {
    console.log("=== SUBMIT CONFIRMATION TRIGGERED ===");
    console.log("onSubmit function exists:", typeof onSubmit === "function");

    Alert.alert("Submit Exam", "Are you sure you want to submit this exam?", [
      {
        text: "No",
        style: "cancel",
        onPress: () => console.log("Submit cancelled"),
      },
      {
        text: "Yes",
        onPress: () => {
          console.log("Submit confirmed, calling onSubmit");
          onSubmit?.();
        },
      },
    ]);
  };

  const displayTime = showTimer
    ? formatTime(timeRemaining)
    : `${examConfig.duration.minutes.toString().padStart(2, "0")}:${examConfig.duration.seconds.toString().padStart(2, "0")} min`;

  return (
    <View className="bg-blue-800 px-4 py-3 flex-row items-center shadow-lg">
      {/* Back Button */}
      <TouchableOpacity onPress={onBack} className="mr-4">
        <Text className="text-white text-xl font-bold">◀</Text>
      </TouchableOpacity>

      {/* Subject Tags - Clickable in exam mode */}
      <View className="flex-1 flex-row flex-wrap gap-2">
        {examConfig.subjects.map((subject, index) => {
          const isActive = currentSubject === subject;
          const isClickable = showSubmit && onSubjectChange; // Only clickable in exam mode

          return (
            <TouchableOpacity
              key={subject}
              onPress={() =>
                isClickable ? onSubjectChange(subject) : undefined
              }
              disabled={!isClickable}
              className={`px-3 py-1 rounded ${
                isActive && showSubmit ? "bg-green-600" : "bg-blue-600"
              }`}
            >
              <Text className="text-white text-sm font-semibold">
                {subject.length > 12
                  ? subject.substring(0, 12) + "..."
                  : subject}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Calculator Button */}
      <TouchableOpacity className="bg-blue-600 px-3 py-2 rounded mx-2">
        <Text className="text-white text-sm">Calculator</Text>
      </TouchableOpacity>

      {/* Timer */}
      <View
        className={`flex-row items-center px-3 py-2 rounded ${
          showTimer && timeRemaining < 300 ? "bg-red-100" : "bg-white" // Red background when less than 5 minutes
        }`}
      >
        <Text className="text-lg font-bold mr-2">⏰</Text>
        <Text
          className={`font-bold ${
            showTimer && timeRemaining < 300 ? "text-red-600" : "text-blue-800"
          }`}
        >
          {displayTime}
        </Text>
      </View>

      {/* Submit Button (only show in exam mode) */}
      {showSubmit && (
        <TouchableOpacity
          onPress={handleSubmitConfirmation}
          className="bg-red-600 px-4 py-2 rounded ml-2"
        >
          <Text className="text-white font-bold">Submit</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default TopBar;
