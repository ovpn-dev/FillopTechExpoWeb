// app/(admin)/dashboard.tsx
import { Link } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function AdminDashboard() {
  return (
    <View className="flex-1 p-6 bg-gray-50">
      <Text className="text-3xl font-bold mb-6 text-gray-800">
        Admin Control Panel
      </Text>

      <Text className="text-lg text-gray-600 mb-8">
        Welcome! From here you can manage exam types, exam papers, questions,
        and users.
      </Text>

      <View className="space-y-4">
        <Link href="/exam-types" asChild>
          <TouchableOpacity className="bg-purple-600 p-4 rounded-lg shadow-lg">
            <Text className="text-white text-lg font-semibold text-center">
              Manage Exam Types
            </Text>
            <Text className="text-purple-100 text-sm text-center mt-1">
              JAMB, WAEC, NECO, etc.
            </Text>
          </TouchableOpacity>
        </Link>

        <Link href="/exams" asChild>
          <TouchableOpacity className="bg-blue-600 p-4 rounded-lg shadow-lg">
            <Text className="text-white text-lg font-semibold text-center">
              Manage Exam Papers
            </Text>
            <Text className="text-blue-100 text-sm text-center mt-1">
              Create specific exam papers
            </Text>
          </TouchableOpacity>
        </Link>

        <Link href="/questions" asChild>
          <TouchableOpacity className="bg-green-600 p-4 rounded-lg shadow-lg">
            <Text className="text-white text-lg font-semibold text-center">
              Manage Questions
            </Text>
            <Text className="text-green-100 text-sm text-center mt-1">
              Add questions to exam papers
            </Text>
          </TouchableOpacity>
        </Link>

        <TouchableOpacity className="bg-gray-400 p-4 rounded-lg shadow-lg">
          <Text className="text-white text-lg font-semibold text-center">
            Manage Users (Coming Soon)
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
