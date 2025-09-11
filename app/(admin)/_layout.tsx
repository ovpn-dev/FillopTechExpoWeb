// app/(admin)/_layout.tsx
import { Stack, useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { Text, View } from "react-native";
import { useAuth } from "../../contexts/AuthContext";

// Set this to true while developing admin features
const BYPASS_ADMIN_CHECK = true;

export default function AdminLayout() {
  const { authState } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(!BYPASS_ADMIN_CHECK);

  useFocusEffect(
    useCallback(() => {
      if (BYPASS_ADMIN_CHECK) {
        console.log("Admin check bypassed for development");
        setIsChecking(false);
        return;
      }

      // Wait for auth state to be loaded
      if (!authState.isLoading) {
        if (authState.user?.role !== "admin") {
          console.log("User is not an admin, redirecting.");
          router.replace("/cbtApp");
          return;
        }
        setIsChecking(false);
      }
    }, [authState.isLoading, authState.user, router])
  );

  // Show loading screen while checking authentication
  if (authState.isLoading || isChecking) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <Text className="text-lg text-gray-600">
          {BYPASS_ADMIN_CHECK ? "Loading admin..." : "Verifying access..."}
        </Text>
      </View>
    );
  }

  // If the user is an admin (or bypass is enabled), render the admin screens
  return (
    <Stack>
      <Stack.Screen name="dashboard" options={{ title: "Admin Dashboard" }} />

      {/* Exam Types Management */}
      <Stack.Screen
        name="exam-types/index"
        options={{ title: "Manage Exam Types" }}
      />
      <Stack.Screen
        name="exam-types/[id]"
        options={{ title: "Edit Exam Type" }}
      />

      {/* Exam Papers Management */}
      <Stack.Screen
        name="exams/index"
        options={{ title: "Manage Exam Papers" }}
      />
      <Stack.Screen name="exams/[id]" options={{ title: "Edit Exam Paper" }} />

      {/* Questions Management */}
      <Stack.Screen
        name="questions/index"
        options={{ title: "Manage Questions" }}
      />
      <Stack.Screen
        name="questions/[id]"
        options={{ title: "Edit Question" }}
      />
    </Stack>
  );
}
