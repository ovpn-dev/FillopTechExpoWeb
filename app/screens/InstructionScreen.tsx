// app/screens/InstructionScreen.tsx - Updated with extracted constants
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

// Import our new types and utilities
import { getModeConfig, shouldUseTimer } from "../data/examTypes";
import { ExamConfig } from "../utils/examValidator";

interface InstructionScreenProps {
  examConfig: ExamConfig;
  onStartExam: () => void;
  onCancel: () => void;
}

export default function InstructionScreen({
  examConfig,
  onStartExam,
  onCancel,
}: InstructionScreenProps) {
  const isTimedExam = shouldUseTimer(examConfig.mode);
  const isStudyMode = examConfig.mode === "STUDY";
  const isNewsMode = examConfig.mode === "NEWS";
  const modeConfig = getModeConfig(examConfig.mode);

  const getModeSpecificInstructions = () => {
    switch (examConfig.mode) {
      case "TIMED":
        return (
          <View className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <Text className="font-bold text-red-800 mb-2">
              ⏰ TIMED EXAM MODE
            </Text>
            <Text className="text-red-700">
              • You have {examConfig.duration.minutes} minutes and{" "}
              {examConfig.duration.seconds} seconds to complete this exam{"\n"}•
              The timer will start when you click "START EXAM"{"\n"}• Make sure
              to submit before time runs out{"\n"}• Time remaining will be
              displayed at the top of the screen
            </Text>
          </View>
        );
      case "UNTIMED":
        return (
          <View className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <Text className="font-bold text-blue-800 mb-2">
              🕐 UNTIMED EXAM MODE
            </Text>
            <Text className="text-blue-700">
              • Take as much time as you need to complete this exam{"\n"}• No
              time pressure - focus on accuracy{"\n"}• You can review and change
              answers before submitting{"\n"}• Submit when you're satisfied with
              your answers
            </Text>
          </View>
        );
      case "STUDY":
        return (
          <View className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <Text className="font-bold text-green-800 mb-2">📚 STUDY MODE</Text>
            <Text className="text-green-700">
              • Practice mode with instant feedback{"\n"}• Learn at your own
              pace{"\n"}• Review explanations after each question{"\n"}• Perfect
              for exam preparation and skill building
            </Text>
          </View>
        );
      case "NEWS":
        return (
          <View className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
            <Text className="font-bold text-purple-800 mb-2">
              📰 NEWS & UPDATES MODE
            </Text>
            <Text className="text-purple-700">
              • Access latest exam information and updates{"\n"}• Current
              affairs and educational news{"\n"}• Important announcements and
              notices{"\n"}• Stay informed about examination changes
            </Text>
          </View>
        );
      default:
        return null;
    }
  };

  const getButtonColor = () => {
    switch (examConfig.mode) {
      case "TIMED":
        return "bg-red-600";
      case "STUDY":
        return "bg-green-600";
      case "NEWS":
        return "bg-purple-600";
      default:
        return "bg-blue-600";
    }
  };

  const getButtonText = () => {
    if (isNewsMode) return "VIEW NEWS";
    if (isTimedExam) return "START TIMED EXAM";
    return `START ${examConfig.mode}`;
  };

  return (
    <ScrollView className="flex-1 items-center mt-5 p-6 ">
      <Text className="text-2xl font-bold mb-4">Instructions</Text>

      <View className="column items-center">
        {/* UI Layout */}
        <View className="flex-row w-full">
          {/* Instructions Text */}
          <ScrollView className="flex-1 mb-6 w-[70%]">
            <Text className="text-base leading-6">
              <Text className="font-bold">Exam Details:</Text>
              {"\n"}• Mode: {examConfig.mode}
              {"\n"}• Exam Type: {examConfig.examType}
              {"\n"}• Subjects: {examConfig.subjects.join(", ")}
              {"\n"}• Questions per subject:{" "}
              {examConfig.numberOfQuestions || 40}
              {"\n"}• Total questions:{" "}
              {examConfig.subjects.length *
                (examConfig.numberOfQuestions || 40)}
              {isTimedExam && (
                <>
                  {"\n"}• Duration: {examConfig.duration.minutes} minutes and{" "}
                  {examConfig.duration.seconds} seconds
                </>
              )}
              {!isTimedExam && <>{"\n"}• Duration: No time limit</>}
              {"\n\n"}
              {!isNewsMode && (
                <>
                  <Text className="font-bold">Instructions:</Text>
                  {"\n"}
                  1. Read each question carefully and select the best answer.
                  {"\n"}
                  2. You can navigate between questions using the Previous and
                  Next buttons.{"\n"}
                  3. You can switch between subjects by clicking on the subject
                  tabs.{"\n"}
                  4. Each subject has {examConfig.numberOfQuestions || 40}{" "}
                  questions numbered 1-{examConfig.numberOfQuestions || 40}.
                  {"\n"}
                  {isStudyMode ? (
                    <>
                      5. In Study Mode, you'll receive instant feedback after
                      each answer.{"\n"}
                    </>
                  ) : (
                    <>
                      5. Make sure to submit your exam when you're finished.
                      {"\n"}
                    </>
                  )}
                  {!isStudyMode && (
                    <>
                      6. Once submitted, you cannot make changes to your
                      answers.
                      {"\n"}
                    </>
                  )}
                  {"\n\n"}
                </>
              )}
              {isTimedExam && (
                <Text className="font-bold text-red-600">
                  ⚠️ IMPORTANT: The timer will start only when you click "START
                  EXAM" button. Make sure you're ready!
                </Text>
              )}
              {examConfig.mode === "UNTIMED" && (
                <Text className="font-bold text-blue-600">
                  ✨ UNTIMED MODE: Take your time and focus on accuracy. There's
                  no rush!
                </Text>
              )}
              {isStudyMode && (
                <Text className="font-bold text-green-600">
                  📖 STUDY MODE: Perfect for learning! Use this mode to
                  understand concepts and improve your knowledge.
                </Text>
              )}
              {isNewsMode && (
                <Text className="font-bold text-purple-600">
                  📰 NEWS MODE: Stay updated with the latest educational news
                  and examination information.
                </Text>
              )}
            </Text>
          </ScrollView>

          {/* Mode-specific instructions and Keyboard Guide */}
          <View className="flex-column justify-between w-[30%]">
            {/* Mode-specific information */}
            {getModeSpecificInstructions()}

            {/* Keyboard Usage Guide - Only show for exam modes */}
            {!isNewsMode && (
              <View className="bg-pink-100 rounded-lg p-4 mb-6">
                <Text className="font-bold mb-2 text-lg">Keyboard Usage</Text>
                <View className="space-y-1">
                  <Text>
                    <Text className="font-bold">A</Text> - Select option A
                  </Text>
                  <Text>
                    <Text className="font-bold">B</Text> - Select option B
                  </Text>
                  <Text>
                    <Text className="font-bold">C</Text> - Select option C
                  </Text>
                  <Text>
                    <Text className="font-bold">D</Text> - Select option D
                  </Text>
                  <Text>
                    <Text className="font-bold">N</Text> - Next/Forward
                  </Text>
                  <Text>
                    <Text className="font-bold">P</Text> - Previous/Back
                  </Text>
                  <Text>
                    <Text className="font-bold">S</Text> - Submit/End Exam
                  </Text>
                  <Text>
                    <Text className="font-bold">Y</Text> - Confirm/End Exam
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
        {/* Action Buttons */}
        <View className="w-[50%] flex-row gap-4 mt-5">
          <TouchableOpacity
            onPress={onCancel}
            className="flex-1 bg-orange-500 p-4 rounded-lg"
          >
            <Text className="text-white text-center font-bold">CANCEL</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onStartExam}
            className={`flex-1 p-4 rounded-lg ${getButtonColor()}`}
          >
            <Text className="text-white text-center font-bold">
              {getButtonText()}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
