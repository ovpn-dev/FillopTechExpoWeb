// app/(admin)/_layout.tsx - Fixed navigation timing issues
import { Stack, useRouter, useSegments } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../contexts/AuthContext";

export default function AdminLayout() {
  const { authState, logout } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Wait for both router and auth to be ready
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isInitialized || authState.isLoading) {
      return;
    }

    const currentRoute = segments[segments.length - 1];
    console.log("Admin layout check:", {
      isAuthenticated: authState.isAuthenticated,
      userRole: authState.user?.role,
      currentRoute,
      segments
    });

    // If we're on login page and user is already authenticated admin, go to dashboard
    if (currentRoute === "login" && authState.isAuthenticated && authState.user?.role === "admin") {
      console.log("Admin already logged in, redirecting to dashboard");
      setTimeout(() => router.replace("/(admin)/dashboard"), 50);
      return;
    }

    // If we're not on login page, check authentication
    if (currentRoute !== "login") {
      // If user is not authenticated, redirect to admin login
      if (!authState.isAuthenticated || !authState.user) {
        console.log("User not authenticated, redirecting to admin login");
        setTimeout(() => router.replace("/(admin)/login"), 50);
        return;
      }

      // If user is authenticated but not an admin, redirect to student portal
      if (authState.user.role !== "admin") {
        console.log("User is not an admin, redirecting to student portal");
        setTimeout(() => router.replace("/cbtApp"), 50);
        return;
      }
    }

    console.log("Admin access granted or on login page");
  }, [isInitialized, authState.isLoading, authState.isAuthenticated, authState.user, segments, router]);

  // Show loading screen while initializing or checking authentication
  if (!isInitialized || authState.isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <Text className="text-lg text-gray-600 mb-4">Loading admin portal...</Text>
      </View>
    );
  }

  // Render the stack navigator
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#f3f4f6" },
        headerTintColor: "#374151",
        headerTitleStyle: { fontWeight: "600" },
      }}
    >
      <Stack.Screen 
        name="login" 
        options={{ 
          title: "Admin Login",
          headerShown: false // Hide header for login screen
        }} 
      />
      
      <Stack.Screen 
        name="dashboard" 
        options={{ 
          title: "Admin Dashboard",
          headerRight: () => (
            <TouchableOpacity
              onPress={async () => {
                await logout();
                router.replace("/(admin)/login");
              }}
              className="mr-2"
            >
              <Text className="text-blue-600 font-medium">Logout</Text>
            </TouchableOpacity>
          ),
        }} 
      />

      {/* Exam Types Management */}
      <Stack.Screen
        name="exam-types/index"
        options={{ 
          title: "Manage Exam Types",
          headerRight: () => (
            <TouchableOpacity
              onPress={async () => {
                await logout();
                router.replace("/(admin)/login");
              }}
              className="mr-2"
            >
              <Text className="text-blue-600 font-medium">Logout</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="exam-types/[id]"
        options={{ title: "Edit Exam Type" }}
      />

      {/* Exam Papers Management */}
      <Stack.Screen
        name="exams/index"
        options={{ 
          title: "Manage Exam Papers",
          headerRight: () => (
            <TouchableOpacity
              onPress={async () => {
                await logout();
                router.replace("/(admin)/login");
              }}
              className="mr-2"
            >
              <Text className="text-blue-600 font-medium">Logout</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen name="exams/[id]" options={{ title: "Edit Exam Paper" }} />

      {/* Questions Management */}
      <Stack.Screen
        name="questions/index"
        options={{ 
          title: "Manage Questions",
          headerRight: () => (
            <TouchableOpacity
              onPress={async () => {
                await logout();
                router.replace("/(admin)/login");
              }}
              className="mr-2"
            >
              <Text className="text-blue-600 font-medium">Logout</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="questions/[id]"
        options={{ title: "Edit Question" }}
      />
    </Stack>
  );
}