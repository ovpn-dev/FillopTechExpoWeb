// screens/InstructionScreen.tsx
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { ExamConfig } from "../examInterface/welcome";

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
  return (
    <View className="flex-1 p-6">
      <Text className="text-2xl font-bold mb-4">Instructions</Text>

      {/* Keyboard Usage Guide */}
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

      {/* Instructions Text */}
      <ScrollView className="flex-1 mb-6">
        <Text className="text-base leading-6">
          <Text className="font-bold">Exam Details:</Text>
          {"\n"}• Subjects: {examConfig.subjects.join(", ")}
          {"\n"}• Questions per subject: 40{"\n"}• Total questions:{" "}
          {examConfig.subjects.length * 40}
          {"\n"}• Duration: {examConfig.duration.minutes} minutes and{" "}
          {examConfig.duration.seconds} seconds{"\n\n"}
          <Text className="font-bold">Instructions:</Text>
          {"\n"}
          1. Read each question carefully and select the best answer.{"\n"}
          2. You can navigate between questions using the Previous and Next
          buttons.{"\n"}
          3. You can switch between subjects by clicking on the subject tabs.
          {"\n"}
          4. Each subject has 40 questions numbered 1-40.{"\n"}
          5. Make sure to submit your exam before time runs out.{"\n"}
          6. Once submitted, you cannot make changes to your answers.{"\n\n"}
          <Text className="font-bold text-red-600">
            The timer will start only when you click "START EXAM" button.
          </Text>
        </Text>
      </ScrollView>

      {/* Action Buttons */}
      <View className="flex-row gap-4">
        <TouchableOpacity
          onPress={onCancel}
          className="flex-1 bg-orange-500 p-4 rounded-lg"
        >
          <Text className="text-white text-center font-bold">CANCEL</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onStartExam}
          className="flex-1 bg-red-600 p-4 rounded-lg"
        >
          <Text className="text-white text-center font-bold">START EXAM</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
