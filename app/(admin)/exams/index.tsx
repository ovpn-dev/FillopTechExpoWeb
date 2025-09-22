// app/(admin)/exams/index.tsx - Updated with Add Questions functionality
import { Link, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AdminApiService from "../../../services/adminApiService";
import type { ExamPaperResponse } from "../../../services/apiService";
import ApiService from "../../../services/apiService";

export default function ManageExamsScreen() {
  const [papers, setPapers] = useState<ExamPaperResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchPapers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ApiService.getExamPapers();
      setPapers(data);
    } catch (err: any) {
      console.error("Fetch papers error:", err);
      setError(err.message || "Failed to fetch exam papers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPapers();
  }, []);

  const handleDelete = async (id: string) => {
    Alert.alert(
      "Delete Exam Paper",
      "Are you sure you want to delete this exam paper?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await AdminApiService.deleteExamPaper(id);
              Alert.alert("Success", "Exam paper deleted successfully.");
              fetchPapers();
            } catch (err: any) {
              console.error("Delete error:", err);
              Alert.alert("Error", "Failed to delete: " + (err.message || "Unknown error"));
            }
          }
        }
      ]
    );
  };

  const navigateToQuestions = (paperId: string) => {
    // Navigate to the specific exam paper's questions page
    router.push(`/exam-papers/${paperId}/questions`);
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-red-600 text-center">{error}</Text>
        <TouchableOpacity
          onPress={fetchPapers}
          className="mt-4 bg-blue-500 p-2 rounded"
        >
          <Text className="text-white">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 p-4 bg-white">
      <Link href="/exams/new" asChild>
        <TouchableOpacity className="bg-green-600 p-3 rounded-lg mb-4 shadow">
          <Text className="text-white font-bold text-center text-lg">
            + Create New Exam Paper
          </Text>
        </TouchableOpacity>
      </Link>
      
      <FlatList
        data={papers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="p-4 mb-3 border border-gray-200 rounded-lg bg-white shadow-sm">
            <View className="mb-3">
              <Text className="text-lg font-semibold text-gray-800">{item.title}</Text>
              {item.description && (
                <Text className="text-gray-600 mt-1">{item.description}</Text>
              )}
            </View>
            
            <View className="mb-3">
              <Text className="text-gray-600 text-sm">ID: {item.id}</Text>
              <Text className="text-gray-600 text-sm">
                Duration: {item.exam_type_duration_minutes || 'N/A'} mins
              </Text>
              <Text className="text-gray-600 text-sm">
                Type: {item.exam_type_name || 'N/A'}
              </Text>
              <Text className="text-gray-600 text-sm">
                Questions: {item.question_count || 0}
              </Text>
            </View>
            
            {/* Action buttons */}
            <View className="flex-row flex-wrap gap-2">
              {/* Add Questions - Primary Action */}
              <TouchableOpacity
                onPress={() => navigateToQuestions(item.id)}
                className="bg-green-600 px-4 py-2 rounded flex-1 min-w-0"
              >
                <Text className="text-white text-center font-medium">
                  Add Questions
                </Text>
              </TouchableOpacity>
              
              {/* Edit */}
              <TouchableOpacity
                onPress={() => router.push(`/exams/${item.id}`)}
                className="bg-yellow-500 px-4 py-2 rounded"
              >
                <Text className="text-white">Edit</Text>
              </TouchableOpacity>
              
              {/* Delete */}
              <TouchableOpacity
                onPress={() => handleDelete(item.id)}
                className="bg-red-600 px-4 py-2 rounded"
              >
                <Text className="text-white">Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-20">
            <Text className="text-gray-500 text-lg">No exam papers found</Text>
            <Text className="text-gray-400 mt-2">
              Create your first exam paper!
            </Text>
          </View>
        }
      />
    </View>
  );
}