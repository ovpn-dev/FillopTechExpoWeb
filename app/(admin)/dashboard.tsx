// app/(admin)/dashboard.tsx
import { Link } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function AdminDashboard() {
  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Enhanced Header */}
      <View className="bg-gradient-to-r from-slate-800 to-slate-900 shadow-lg">
        <View className="p-6 pt-12">
          <Text className="text-3xl font-bold text-white mb-2">
            Admin Control Panel
          </Text>
          <Text className="text-slate-300 text-lg">
            Manage your exam system efficiently
          </Text>
        </View>
      </View>

      {/* Main Content */}
      <View className="p-6">
        <Text className="text-xl font-semibold text-gray-800 mb-6">
          System Management
        </Text>
        
        <View className="space-y-4">
          {/* Exam Types Management */}
          <Link href="/exam-types" asChild>
            <TouchableOpacity className="bg-white rounded-xl shadow-md border border-gray-100 active:scale-95 transition-transform">
              <View className="p-5">
                <View className="flex-row items-center mb-3">
                  <View className="w-12 h-12 bg-purple-600 rounded-lg items-center justify-center mr-4">
                    <Text className="text-white text-lg font-bold">ET</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-900 font-semibold text-lg">
                      Manage Exam Types
                    </Text>
                    <Text className="text-gray-500 text-sm">
                      JAMB, WAEC, NECO, etc.
                    </Text>
                  </View>
                  <View className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center">
                    <Text className="text-gray-600 font-bold">›</Text>
                  </View>
                </View>
                <View className="h-1 bg-purple-100 rounded-full">
                  <View className="h-1 bg-purple-600 rounded-full w-0" />
                </View>
              </View>
            </TouchableOpacity>
          </Link>

          {/* Exam Papers Management */}
          <Link href="/exams" asChild>
            <TouchableOpacity className="bg-white rounded-xl shadow-md border border-gray-100 active:scale-95 transition-transform">
              <View className="p-5">
                <View className="flex-row items-center mb-3">
                  <View className="w-12 h-12 bg-blue-600 rounded-lg items-center justify-center mr-4">
                    <Text className="text-white text-lg font-bold">EP</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-900 font-semibold text-lg">
                      Manage Exam Papers
                    </Text>
                    <Text className="text-gray-500 text-sm">
                      Create specific exam papers
                    </Text>
                  </View>
                  <View className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center">
                    <Text className="text-gray-600 font-bold">›</Text>
                  </View>
                </View>
                <View className="h-1 bg-blue-100 rounded-full">
                  <View className="h-1 bg-blue-600 rounded-full w-0" />
                </View>
              </View>
            </TouchableOpacity>
          </Link>

          {/* Questions Management */}
          <Link href="/questions" asChild>
            <TouchableOpacity className="bg-white rounded-xl shadow-md border border-gray-100 active:scale-95 transition-transform">
              <View className="p-5">
                <View className="flex-row items-center mb-3">
                  <View className="w-12 h-12 bg-green-600 rounded-lg items-center justify-center mr-4">
                    <Text className="text-white text-lg font-bold">Q</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-900 font-semibold text-lg">
                      Manage Questions
                    </Text>
                    <Text className="text-gray-500 text-sm">
                      Add questions to exam papers
                    </Text>
                  </View>
                  <View className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center">
                    <Text className="text-gray-600 font-bold">›</Text>
                  </View>
                </View>
                <View className="h-1 bg-green-100 rounded-full">
                  <View className="h-1 bg-green-600 rounded-full w-0" />
                </View>
              </View>
            </TouchableOpacity>
          </Link>

          {/* User Management - Coming Soon */}
          <View className="bg-white rounded-xl shadow-md border border-gray-100 opacity-60">
            <View className="p-5">
              <View className="flex-row items-center mb-3">
                <View className="w-12 h-12 bg-gray-400 rounded-lg items-center justify-center mr-4">
                  <Text className="text-white text-lg font-bold">U</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-gray-600 font-semibold text-lg">
                    Manage Users
                  </Text>
                  <Text className="text-gray-400 text-sm">
                    Coming Soon
                  </Text>
                </View>
                <View className="w-8 h-8 bg-gray-50 rounded-full items-center justify-center">
                  <Text className="text-gray-400 font-bold">›</Text>
                </View>
              </View>
              <View className="h-1 bg-gray-100 rounded-full">
                <View className="h-1 bg-gray-300 rounded-full w-1/4" />
              </View>
            </View>
          </View>
        </View>

        {/* Welcome Message */}
        <View className="bg-blue-50 border border-blue-200 rounded-xl p-5 mt-8">
          <Text className="text-blue-800 font-medium text-base mb-2">
            Welcome to the Admin Panel
          </Text>
          <Text className="text-blue-600 text-sm leading-5">
            From here you can manage exam types, exam papers, questions, and users. 
            Select any option above to get started with your exam management tasks.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}