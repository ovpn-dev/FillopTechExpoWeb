// app/(admin)/login.tsx
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { loginWithEmailPassword, loginWithPasscode, authState, logout } = useAuth();
  const router = useRouter();

  // Check if user is already logged in as admin
  useEffect(() => {
    if (!authState.isLoading && authState.isAuthenticated && authState.user?.role === "admin") {
      console.log("Admin already logged in, redirecting to dashboard");
      setTimeout(() => router.replace("/(admin)/dashboard"), 50);
    }
  }, [authState.isAuthenticated, authState.user, authState.isLoading, router]);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    setIsLoading(true);

    try {
      // First try API login
      let success = await loginWithEmailPassword(email.trim(), password);
      let user = null;

      if (!success && (email === "admin@filloptech.com" || password === "admin1")) {
        console.log("API login failed, trying mock admin login...");
        const mockSuccess = await loginWithPasscode("admin1");
        success = mockSuccess;
        user = { role: "admin" }; // we know mock user is admin
      }

      if (success) {
        // Use either user from response, or wait for authState via useEffect
        if (user?.role === "admin" || authState.user?.role === "admin") {
          console.log("Admin login successful");
          router.replace("/(admin)/dashboard");
        } else {
          Alert.alert("Access Denied", "This area is restricted to administrators only.");
          logout();
        }
      } else {
        Alert.alert(
          "Login Failed",
          authState.error || "Invalid credentials. Please check your email and password."
        );
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Login Failed", "Unable to sign in. Please check your credentials and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render if already authenticated as admin (prevents flash)
  if (authState.isAuthenticated && authState.user?.role === "admin") {
    return (
      <View className="flex-1 items-center justify-center bg-gradient-to-b from-blue-100 to-white">
        <Text className="text-lg text-gray-600">Redirecting to dashboard...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gradient-to-b from-blue-100 to-white items-center justify-center px-4">
      {/* Header */}
      <View className="absolute top-0 w-full h-16 bg-gradient-to-r from-orange-500 to-red-500 justify-center items-center">
        <Text className="text-white font-bold text-sm">
          FILLOP TECH - ADMIN PORTAL
        </Text>
      </View>

      {/* Main Card */}
      <View className="bg-blue-600 rounded-2xl shadow-md p-6 w-full max-w-md items-center">
        <Text className="text-white text-2xl font-bold mb-1">ADMIN LOGIN</Text>
        <Text className="text-white mb-6">Administrator Access Only</Text>

        {/* Email Input */}
        <Text className="text-white self-start mb-1">Email Address:</Text>
        <TextInput
          className={`bg-white rounded-lg p-4 mb-3 w-full ${
            authState.error ? "border-2 border-red-500" : ""
          }`}
          placeholder="admin@filloptech.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!isLoading}
        />

        {/* Password Input */}
        <Text className="text-white self-start mb-1">Password:</Text>
        <TextInput
          className={`bg-white rounded-lg p-4 mb-4 w-full ${
            authState.error ? "border-2 border-red-500" : ""
          }`}
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!isLoading}
        />

        {/* Demo Info */}
        <View className="mb-4 p-3 bg-blue-700 rounded-lg w-full">
          <Text className="text-blue-200 text-xs text-center mb-1">
            Demo Admin Credentials:
          </Text>
          <Text className="text-white text-sm text-center">
            admin@filloptech.com / admin1
          </Text>
        </View>

        {/* Error Display */}
        {authState.error && (
          <Text className="text-red-200 text-sm mb-4 text-center">
            {authState.error}
          </Text>
        )}

        {/* Login Button */}
        <TouchableOpacity
          className={`w-full py-3 rounded-xl items-center mb-4 ${
            isLoading ? "bg-gray-600" : "bg-black"
          }`}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <View className="flex-row items-center">
              <ActivityIndicator color="white" size="small" />
              <Text className="text-white font-bold ml-2">SIGNING IN...</Text>
            </View>
          ) : (
            <Text className="text-white font-bold">ADMIN LOGIN</Text>
          )}
        </TouchableOpacity>

        {/* Student Portal Link */}
        <TouchableOpacity onPress={() => router.push("/")}>
          <Text className="text-blue-200 text-sm underline">
            Go to Student Portal
          </Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <Text className="text-gray-600 mt-6">2025 © FILLOP TECH</Text>
    </View>
  );
}