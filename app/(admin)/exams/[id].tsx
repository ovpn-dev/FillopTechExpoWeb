// app/(admin)/exams/[id].tsx - FIXED VERSION
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
import AdminApiService from "../../../services/adminApiService";
import ApiService from "../../../services/apiService";

export default function EditExamScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const isNew = id === "new";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [examId, setExamId] = useState(""); 
  const [examTypeId, setExamTypeId] = useState(""); // FIXED: Use exam_type_id instead
  const [topicId, setTopicId] = useState("");

  const [loading, setLoading] = useState(!isNew);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isNew && id) {
      const fetchPaper = async () => {
        try {
          const paper = await ApiService.getExamPaper(id);
          setTitle(paper.title);
          setDescription(paper.description || "");
          setExamId(paper.exam_id);
          setExamTypeId(paper.exam_type_id); // FIXED: Get exam_type_id
          setTopicId(paper.topic_id || "");
        } catch (err: any) {
          console.error("Fetch error:", err); // ADDED: Better debugging
          setError("Failed to load exam paper data: " + (err.message || "Unknown error"));
        } finally {
          setLoading(false);
        }
      };
      fetchPaper();
    }
  }, [id, isNew]);

  const handleSubmit = async () => {
    // FIXED: Validate correct required fields
    if (!title || !examId || !examTypeId) {
      Alert.alert("Validation Error", "Please fill in title, exam ID, and exam type ID.");
      return;
    }

    setSubmitting(true);
    
    // FIXED: Use correct ExamPaperInput schema
    const paperData = {
      title,
      exam_id: examId,
      exam_type_id: examTypeId, // FIXED: This is required
      description: description || undefined,
      topic_id: topicId || undefined,
    };

    try {
      if (isNew) {
        await AdminApiService.createExamPaper(paperData);
        Alert.alert("Success", "Exam paper created successfully!");
      } else {
        await AdminApiService.updateExamPaper(id!, paperData);
        Alert.alert("Success", "Exam paper updated successfully!");
      }
      router.back();
    } catch (err: any) {
      console.error("Submit error:", err); // ADDED: Better debugging
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
        <Text className="font-semibold mb-1 text-gray-700">Title *</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="e.g., JAMB Mathematics 2025"
          className="bg-white p-3 border border-gray-300 rounded-lg"
        />
      </View>

      <View className="mb-4">
        <Text className="font-semibold mb-1 text-gray-700">Description</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Brief description of the exam paper"
          multiline={true}
          numberOfLines={3}
          className="bg-white p-3 border border-gray-300 rounded-lg"
        />
      </View>

      <View className="mb-4">
        <Text className="font-semibold mb-1 text-gray-700">Exam ID *</Text>
        <TextInput
          value={examId}
          onChangeText={setExamId}
          placeholder="Enter the UUID of the Exam"
          className="bg-white p-3 border border-gray-300 rounded-lg"
        />
      </View>

      <View className="mb-4">
        <Text className="font-semibold mb-1 text-gray-700">Exam Type ID *</Text>
        <TextInput
          value={examTypeId}
          onChangeText={setExamTypeId}
          placeholder="Enter the UUID of the Exam Type (determines duration)"
          className="bg-white p-3 border border-gray-300 rounded-lg"
        />
        <Text className="text-xs text-gray-500 mt-1">
          The duration comes from the selected exam type, not set here.
        </Text>
      </View>

      <View className="mb-8">
        <Text className="font-semibold mb-1 text-gray-700">
          Topic/Subject ID (Optional)
        </Text>
        <TextInput
          value={topicId}
          onChangeText={setTopicId}
          placeholder="Enter the UUID of the Topic"
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