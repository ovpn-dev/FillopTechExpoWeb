// app/(admin)/exam-types/index.tsx
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
import ApiService, { ExamType } from "../../../services/apiService";

export default function ManageExamTypesScreen() {
  const [examTypes, setExamTypes] = useState<ExamType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchExamTypes = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getExamTypes();
      setExamTypes(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch exam types.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExamTypes();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    Alert.alert(
      "Delete Exam Type",
      `Are you sure you want to delete "${name}"? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await AdminApiService.deleteExamType(id);
              Alert.alert("Success", "Exam type deleted successfully.");
              fetchExamTypes(); // Refresh the list
            } catch (err: any) {
              Alert.alert("Error", "Failed to delete: " + err.message);
            }
          },
        },
      ]
    );
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
          onPress={fetchExamTypes}
          className="mt-4 bg-blue-500 p-2 rounded"
        >
          <Text className="text-white">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 p-4 bg-white">
      <Link href="/exam-types/new" asChild>
        <TouchableOpacity className="bg-purple-600 p-3 rounded-lg mb-4 shadow">
          <Text className="text-white font-bold text-center text-lg">
            + Create New Exam Type
          </Text>
        </TouchableOpacity>
      </Link>

      <FlatList
        data={examTypes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="p-4 mb-3 border border-gray-200 rounded-lg bg-white shadow-sm">
            <Text className="text-xl font-semibold text-gray-800">
              {item.name}
            </Text>
            {item.description && (
              <Text className="text-gray-600 mt-1">{item.description}</Text>
            )}
            <View className="flex-row justify-between items-center mt-3">
              <View>
                <Text className="text-gray-500 text-sm">ID: {item.id}</Text>
                {item.duration_minutes && (
                  <Text className="text-gray-500 text-sm">
                    Default Duration: {item.duration_minutes} mins
                  </Text>
                )}
                {item.max_subjects && (
                  <Text className="text-gray-500 text-sm">
                    Max Subjects: {item.max_subjects}
                  </Text>
                )}
              </View>
              <View className="flex-row space-x-2">
                <TouchableOpacity
                  onPress={() => router.push(`/exam-types/${item.id}`)}
                  className="bg-yellow-500 px-3 py-2 rounded"
                >
                  <Text className="text-white">Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDelete(item.id, item.name)}
                  className="bg-red-600 px-3 py-2 rounded"
                >
                  <Text className="text-white">Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-20">
            <Text className="text-gray-500 text-lg">No exam types found</Text>
            <Text className="text-gray-400 mt-2">
              Create your first exam type!
            </Text>
          </View>
        }
      />
    </View>
  );
}
