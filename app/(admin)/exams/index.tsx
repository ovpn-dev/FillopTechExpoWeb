// app/(admin)/exams/index.tsx
import { Link, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AdminApiService from "../../../services/adminApiService"; // Admin service for delete action
import type { ExamPaperResponse } from "../../../services/apiService";
import ApiService from "../../../services/apiService"; // Your main API service

export default function ManageExamsScreen() {
  const [papers, setPapers] = useState<ExamPaperResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchPapers = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getExamPapers();
      setPapers(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch exam papers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPapers();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this exam paper?")) {
      try {
        await AdminApiService.deleteExamPaper(id);
        alert("Exam paper deleted successfully.");
        fetchPapers(); // Refresh the list
      } catch (err: any) {
        alert("Failed to delete: " + err.message);
      }
    }
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
          <View className="flex-row items-center p-3 mb-2 border border-gray-200 rounded-lg">
            <View className="flex-1">
              <Text className="text-lg font-semibold">{item.title}</Text>
              <Text className="text-gray-600">ID: {item.id}</Text>
              <Text className="text-gray-600">
                Duration: {item.duration_minutes} mins
              </Text>
            </View>
            <View className="flex-row space-x-2">
              <TouchableOpacity
                onPress={() => router.push(`/exams/${item.id}`)}
                className="bg-yellow-500 p-2 rounded"
              >
                <Text className="text-white">Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDelete(item.id)}
                className="bg-red-600 p-2 rounded"
              >
                <Text className="text-white">Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}
