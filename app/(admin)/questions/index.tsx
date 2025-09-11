// app/(admin)/questions/index.tsx
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
import ApiService, { QuestionResponse } from "../../../services/apiService";

export default function ManageQuestionsScreen() {
  const [questions, setQuestions] = useState<QuestionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getQuestions();
      setQuestions(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch questions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleDelete = async (id: string, text: string) => {
    Alert.alert(
      "Delete Question",
      `Are you sure you want to delete this question? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await AdminApiService.deleteQuestion(id);
              Alert.alert("Success", "Question deleted successfully.");
              fetchQuestions(); // Refresh the list
            } catch (err: any) {
              Alert.alert("Error", "Failed to delete: " + err.message);
            }
          },
        },
      ]
    );
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
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
          onPress={fetchQuestions}
          className="mt-4 bg-blue-500 p-2 rounded"
        >
          <Text className="text-white">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 p-4 bg-white">
      <Link href="/questions/new" asChild>
        <TouchableOpacity className="bg-green-600 p-3 rounded-lg mb-4 shadow">
          <Text className="text-white font-bold text-center text-lg">
            + Create New Question
          </Text>
        </TouchableOpacity>
      </Link>

      <FlatList
        data={questions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="p-4 mb-3 border border-gray-200 rounded-lg bg-white shadow-sm">
            <Text className="text-lg font-semibold text-gray-800 mb-2">
              {truncateText(item.text)}
            </Text>

            <View className="flex-row justify-between items-start mb-2">
              <View className="flex-1">
                <Text className="text-gray-600 text-sm">Type: {item.type}</Text>
                <Text className="text-gray-500 text-xs">ID: {item.id}</Text>
                {item.options && item.options.length > 0 && (
                  <Text className="text-gray-600 text-sm mt-1">
                    {item.options.length} options
                  </Text>
                )}
              </View>
            </View>

            {item.options && item.options.length > 0 && (
              <View className="mb-3">
                <Text className="text-gray-700 font-medium text-sm mb-1">
                  Options:
                </Text>
                {item.options.slice(0, 2).map((option, index) => (
                  <Text key={option.id} className="text-gray-600 text-xs ml-2">
                    {String.fromCharCode(65 + index)}.{" "}
                    {truncateText(option.text, 50)}
                    {option.is_correct && (
                      <Text className="text-green-600"> ✓</Text>
                    )}
                  </Text>
                ))}
                {item.options.length > 2 && (
                  <Text className="text-gray-500 text-xs ml-2">
                    +{item.options.length - 2} more options
                  </Text>
                )}
              </View>
            )}

            <View className="flex-row justify-end space-x-2">
              <TouchableOpacity
                onPress={() => router.push(`/questions/${item.id}`)}
                className="bg-yellow-500 px-3 py-2 rounded"
              >
                <Text className="text-white">Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDelete(item.id, item.text)}
                className="bg-red-600 px-3 py-2 rounded"
              >
                <Text className="text-white">Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-20">
            <Text className="text-gray-500 text-lg">No questions found</Text>
            <Text className="text-gray-400 mt-2">
              Create your first question!
            </Text>
          </View>
        }
      />
    </View>
  );
}
