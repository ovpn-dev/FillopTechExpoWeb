// app/(admin)/exam-types/[id].tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Switch,
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
  const [durationMinutes, setDurationMinutes] = useState("");
  const [isSimultaneous, setIsSimultaneous] = useState(false);
  const [minPapersSimultaneous, setMinPapersSimultaneous] = useState("");
  const [maxPapersSimultaneous, setMaxPapersSimultaneous] = useState("");

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
          setDurationMinutes(examType.duration_minutes?.toString() || "");
          setIsSimultaneous(examType.is_simultaneous);
          setMinPapersSimultaneous(examType.min_papers_simultaneous?.toString() || "");
          setMaxPapersSimultaneous(examType.max_papers_simultaneous?.toString() || "");
        } catch (err: any) {
          setError("Failed to load exam type data: " + err.message);
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

    if (!durationMinutes || isNaN(parseInt(durationMinutes))) {
      Alert.alert("Validation Error", "Please enter a valid duration in minutes.");
      return;
    }

    setSubmitting(true);
    const examTypeData = {
      name: name.trim(),
      description: description.trim() || undefined,
      duration_minutes: parseInt(durationMinutes),
      is_simultaneous: isSimultaneous,
      min_papers_simultaneous: minPapersSimultaneous ? parseInt(minPapersSimultaneous) : undefined,
      max_papers_simultaneous: maxPapersSimultaneous ? parseInt(maxPapersSimultaneous) : undefined,
    };

    try {
      if (isNew) {
        const result = await AdminApiService.createExamType(examTypeData);
        console.log("Created exam type:", result);
        Alert.alert("Success", "Exam type created successfully!");
      } else {
        const result = await AdminApiService.updateExamType(id!, examTypeData);
        console.log("Updated exam type:", result);
        Alert.alert("Success", "Exam type updated successfully!");
      }
      router.back();
    } catch (err: any) {
      console.error("Submit error:", err);
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
          Duration (minutes) <Text className="text-red-500">*</Text>
        </Text>
        <TextInput
          value={durationMinutes}
          onChangeText={setDurationMinutes}
          placeholder="e.g., 180"
          keyboardType="numeric"
          className="bg-white p-3 border border-gray-300 rounded-lg"
        />
        <Text className="text-xs text-gray-500 mt-1">
          Duration of the exam in minutes
        </Text>
      </View>

      <View className="mb-4">
        <View className="flex-row justify-between items-center bg-white p-3 border border-gray-300 rounded-lg">
          <Text className="font-semibold text-gray-700">Simultaneous Exam</Text>
          <Switch
            value={isSimultaneous}
            onValueChange={setIsSimultaneous}
          />
        </View>
        <Text className="text-xs text-gray-500 mt-1">
          Whether multiple papers can be taken simultaneously
        </Text>
      </View>

      {isSimultaneous && (
        <>
          <View className="mb-4">
            <Text className="font-semibold mb-1 text-gray-700">
              Minimum Simultaneous Papers
            </Text>
            <TextInput
              value={minPapersSimultaneous}
              onChangeText={setMinPapersSimultaneous}
              placeholder="e.g., 2"
              keyboardType="numeric"
              className="bg-white p-3 border border-gray-300 rounded-lg"
            />
          </View>

          <View className="mb-4">
            <Text className="font-semibold mb-1 text-gray-700">
              Maximum Simultaneous Papers
            </Text>
            <TextInput
              value={maxPapersSimultaneous}
              onChangeText={setMaxPapersSimultaneous}
              placeholder="e.g., 4"
              keyboardType="numeric"
              className="bg-white p-3 border border-gray-300 rounded-lg"
            />
          </View>
        </>
      )}

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