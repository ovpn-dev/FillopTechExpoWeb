// app/(admin)/exam-types/[id].tsx
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

export default function EditExamTypeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const isNew = id === "new";

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [maxSubjects, setMaxSubjects] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");

  const [loading, setLoading] = useState(!isNew);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isNew && id) {
      const fetchExamType = async () => {
        try {
          const examType = await ApiService.getExamType(id);
          setName(examType.name);
          setDescription(examType.description || "");
          setMaxSubjects(examType.max_subjects?.toString() || "");
          setDurationMinutes(examType.duration_minutes?.toString() || "");
        } catch (err: any) {
          setError("Failed to load exam type data.");
        } finally {
          setLoading(false);
        }
      };
      fetchExamType();
    }
  }, [id, isNew]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert("Validation Error", "Please enter a name for the exam type.");
      return;
    }

    setSubmitting(true);
    const examTypeData = {
      name: name.trim(),
      description: description.trim() || undefined,
      max_subjects: maxSubjects ? parseInt(maxSubjects) : undefined,
      duration_minutes: durationMinutes ? parseInt(durationMinutes) : undefined,
    };

    try {
      if (isNew) {
        await AdminApiService.createExamType(examTypeData);
        Alert.alert("Success", "Exam type created successfully!");
      } else {
        await AdminApiService.updateExamType(id!, examTypeData);
        Alert.alert("Success", "Exam type updated successfully!");
      }
      router.back();
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
        {isNew ? "Create New Exam Type" : `Editing: ${name}`}
      </Text>

      <View className="mb-4">
        <Text className="font-semibold mb-1 text-gray-700">
          Name <Text className="text-red-500">*</Text>
        </Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="e.g., JAMB, WAEC, NECO"
          className="bg-white p-3 border border-gray-300 rounded-lg"
        />
      </View>

      <View className="mb-4">
        <Text className="font-semibold mb-1 text-gray-700">Description</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Brief description of this exam type"
          multiline
          numberOfLines={3}
          className="bg-white p-3 border border-gray-300 rounded-lg"
        />
      </View>

      <View className="mb-4">
        <Text className="font-semibold mb-1 text-gray-700">
          Maximum Subjects
        </Text>
        <TextInput
          value={maxSubjects}
          onChangeText={setMaxSubjects}
          placeholder="e.g., 4 (leave empty if no limit)"
          keyboardType="numeric"
          className="bg-white p-3 border border-gray-300 rounded-lg"
        />
        <Text className="text-xs text-gray-500 mt-1">
          Maximum number of subjects a student can take
        </Text>
      </View>

      <View className="mb-8">
        <Text className="font-semibold mb-1 text-gray-700">
          Default Duration (minutes)
        </Text>
        <TextInput
          value={durationMinutes}
          onChangeText={setDurationMinutes}
          placeholder="e.g., 180 (leave empty if varies by paper)"
          keyboardType="numeric"
          className="bg-white p-3 border border-gray-300 rounded-lg"
        />
        <Text className="text-xs text-gray-500 mt-1">
          Default time allocation for this exam type
        </Text>
      </View>

      <TouchableOpacity
        onPress={handleSubmit}
        disabled={submitting}
        className={`p-4 rounded-lg ${submitting ? "bg-gray-400" : "bg-purple-600"}`}
      >
        <Text className="text-white text-center font-bold text-lg">
          {submitting ? "Saving..." : "Save Exam Type"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
