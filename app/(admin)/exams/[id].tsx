// app/(admin)/exams/[id].tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AdminApiService from "../../../services/adminApiService"; // Admin service for create/update
import ApiService from "../../../services/apiService"; // Main service for fetching

export default function EditExamScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const isNew = id === "new";

  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [examId, setExamId] = useState(""); // This would be a dropdown in a real app
  const [topicId, setTopicId] = useState(""); // Also a dropdown

  const [loading, setLoading] = useState(!isNew);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isNew && id) {
      const fetchPaper = async () => {
        try {
          const paper = await ApiService.getExamPaper(id);
          setTitle(paper.title);
          setDuration(paper.duration_minutes?.toString() || "");
          setExamId(paper.exam_id);
          setTopicId(paper.topic_id || "");
        } catch (err: any) {
          setError("Failed to load exam paper data.");
        } finally {
          setLoading(false);
        }
      };
      fetchPaper();
    }
  }, [id, isNew]);

  const handleSubmit = async () => {
    if (!title || !duration || !examId) {
      Alert.alert("Validation Error", "Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    const paperData = {
      title,
      duration_minutes: parseInt(duration),
      exam_id: examId, // This should come from a dropdown of available ExamTypes
      topic_id: topicId || undefined, // Optional
    };

    try {
      if (isNew) {
        await AdminApiService.createExamPaper(paperData);
        Alert.alert("Success", "Exam paper created successfully!");
      } else {
        await AdminApiService.updateExamPaper(id!, paperData);
        Alert.alert("Success", "Exam paper updated successfully!");
      }
      router.back(); // Go back to the list screen
    } catch (err: any) {
      Alert.alert(
        "Submission Error",
        err.message || "An unknown error occurred."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" className="mt-8" />;
  }

  if (error) {
    return <Text className="text-red-500 p-4 text-center">{error}</Text>;
  }

  return (
    <ScrollView className="flex-1 p-4 bg-gray-50">
      <Text className="text-2xl font-bold mb-6">
        {isNew ? "Create New Exam Paper" : `Editing: ${title}`}
      </Text>

      <View className="mb-4">
        <Text className="font-semibold mb-1 text-gray-700">Title</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="e.g., JAMB Mathematics 2025"
          className="bg-white p-3 border border-gray-300 rounded-lg"
        />
      </View>

      <View className="mb-4">
        <Text className="font-semibold mb-1 text-gray-700">
          Duration (minutes)
        </Text>
        <TextInput
          value={duration}
          onChangeText={setDuration}
          placeholder="e.g., 120"
          keyboardType="numeric"
          className="bg-white p-3 border border-gray-300 rounded-lg"
        />
      </View>

      <View className="mb-4">
        <Text className="font-semibold mb-1 text-gray-700">Exam Type ID</Text>
        <TextInput
          value={examId}
          onChangeText={setExamId}
          placeholder="Enter the UUID of the Exam Type (e.g., JAMB)"
          className="bg-white p-3 border border-gray-300 rounded-lg"
        />
        <Text className="text-xs text-gray-500 mt-1">
          Note: This should be a dropdown in the future.
        </Text>
      </View>

      <View className="mb-8">
        <Text className="font-semibold mb-1 text-gray-700">
          Topic/Subject ID (Optional)
        </Text>
        <TextInput
          value={topicId}
          onChangeText={setTopicId}
          placeholder="Enter the UUID of the Topic (e.g., Mathematics)"
          className="bg-white p-3 border border-gray-300 rounded-lg"
        />
      </View>

      <TouchableOpacity
        onPress={handleSubmit}
        disabled={submitting}
        className={`p-4 rounded-lg ${submitting ? "bg-gray-400" : "bg-blue-600"}`}
      >
        <Text className="text-white text-center font-bold text-lg">
          {submitting ? "Saving..." : "Save Exam Paper"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
