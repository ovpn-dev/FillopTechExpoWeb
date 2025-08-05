// components/TopBar.tsx - Updated with Calculator Integration
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ExamConfig } from "../cbtApp";
import Calculator from "./Calculator";
import ConfirmModal from "./ConfirmModal";

interface TopBarProps {
  examConfig: ExamConfig;
  showSubmit?: boolean;
  onSubmit?: () => void;
  onBack: () => void;
  currentSubject?: string;
  onSubjectChange?: (subject: string) => void;
  examStartTime?: number | null;
  showTimer?: boolean;
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
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);

  useEffect(() => {
    if (!showTimer || !examStartTime) return;

    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - examStartTime) / 1000);
      const remaining = Math.max(0, examConfig.totalTime - elapsed);

      setTimeRemaining(remaining);

      if (remaining <= 0) {
        clearInterval(timer);
        console.log("Time's up! Auto-submitting...");
        onSubmit?.();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [showTimer, examStartTime, examConfig.totalTime, onSubmit]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")} min`;
  };

  const handleSubmitClick = () => {
    console.log("=== SUBMIT BUTTON CLICKED ===");
    console.log("onSubmit function exists:", typeof onSubmit === "function");
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = () => {
    console.log("User confirmed submit - calling onSubmit");
    setShowConfirmModal(false);
    if (onSubmit && typeof onSubmit === "function") {
      onSubmit();
    } else {
      console.error("onSubmit is not a valid function!");
    }
  };

  const handleCancelSubmit = () => {
    console.log("Submit cancelled by user");
    setShowConfirmModal(false);
  };

  const handleCalculatorToggle = () => {
    setShowCalculator(!showCalculator);
  };

  const displayTime = showTimer
    ? formatTime(timeRemaining)
    : `${examConfig.duration.minutes.toString().padStart(2, "0")}:${examConfig.duration.seconds.toString().padStart(2, "0")} min`;

  // Check if calculator should be shown (only in exam modes, not NEWS mode)
  const shouldShowCalculator = examConfig.mode !== "NEWS";

  return (
    <>
      <View className="bg-blue-800 px-4 py-3 flex-row items-center shadow-lg">
        {/* Back Button */}
        <TouchableOpacity onPress={onBack} className="mr-4">
          <Text className="text-white text-xl font-bold">◀</Text>
        </TouchableOpacity>

        {/* Subject Tags */}
        <View className="flex-1 flex-row flex-wrap gap-2">
          {examConfig.subjects.map((subject, index) => {
            const isActive = currentSubject === subject;
            const isClickable = showSubmit && onSubjectChange;

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

        {/* Calculator Button - Only show for exam modes */}
        {shouldShowCalculator && (
          <TouchableOpacity
            onPress={handleCalculatorToggle}
            className={`px-3 py-2 rounded mx-2 ${
              showCalculator ? "bg-green-600" : "bg-blue-600"
            }`}
          >
            <Text className="text-white text-sm font-semibold">
              {showCalculator ? "Close Calc" : "Calculator"}
            </Text>
          </TouchableOpacity>
        )}

        {/* Timer */}
        <View
          className={`flex-row items-center px-3 py-2 rounded ${
            showTimer && timeRemaining < 300 ? "bg-red-100" : "bg-white"
          }`}
        >
          <Text className="text-lg font-bold mr-2">⏰</Text>
          <Text
            className={`font-bold ${
              showTimer && timeRemaining < 300
                ? "text-red-600"
                : "text-blue-800"
            }`}
          >
            {displayTime}
          </Text>
        </View>

        {/* Submit Button */}
        {showSubmit && (
          <TouchableOpacity
            onPress={handleSubmitClick}
            className="bg-red-600 px-4 py-2 rounded ml-2"
          >
            <Text className="text-white font-bold">Submit</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Calculator Component */}
      <Calculator
        visible={showCalculator}
        onClose={() => setShowCalculator(false)}
      />

      {/* Confirmation Modal */}
      <ConfirmModal
        visible={showConfirmModal}
        title="Submit Exam"
        message="Are you sure you want to submit this exam? You won't be able to make changes after submission."
        confirmText="Submit Exam"
        cancelText="Cancel"
        onConfirm={handleConfirmSubmit}
        onCancel={handleCancelSubmit}
      />
    </>
  );
};

export default TopBar;
