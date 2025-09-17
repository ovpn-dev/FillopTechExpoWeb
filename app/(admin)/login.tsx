// app/(admin)/login.tsx
import { Link, useRouter } from "expo-router";
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
      // ✅ Use either user from response, or wait for authState via useEffect
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
      <View className="flex-1 items-center justify-center bg-gray-100">
        <Text className="text-lg text-gray-600">Redirecting to dashboard...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 px-6 py-8">
      {/* Header */}
      <View className="mb-12 mt-16">
        <Text className="text-3xl font-bold text-gray-800 text-center mb-2">
          Admin Portal
        </Text>
        <Text className="text-lg text-gray-600 text-center">
          Sign in to access the admin dashboard
        </Text>
      </View>

      {/* Login Form */}
      <View className="mb-8">
        <View className="mb-4">
          <Text className="text-gray-700 text-base font-medium mb-2">
            Email Address
          </Text>
          <TextInput
            className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-base"
            placeholder="admin@filloptech.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isLoading}
          />
        </View>

        <View className="mb-6">
          <Text className="text-gray-700 text-base font-medium mb-2">
            Password
          </Text>
          <TextInput
            className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-base"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!isLoading}
          />
        </View>

        {/* Error Display */}
        {authState.error && (
          <View className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg">
            <Text className="text-red-700 text-sm">{authState.error}</Text>
          </View>
        )}

        {/* Login Button */}
        <TouchableOpacity
          className={`py-4 rounded-lg ${
            isLoading 
              ? "bg-gray-400" 
              : "bg-blue-600 active:bg-blue-700"
          }`}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <View className="flex-row items-center justify-center">
              <ActivityIndicator color="white" size="small" />
              <Text className="text-white text-lg font-semibold ml-2">
                Signing In...
              </Text>
            </View>
          ) : (
            <Text className="text-white text-lg font-semibold text-center">
              Sign In
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View className="mt-auto">
        <Text className="text-gray-500 text-center mb-4">
          Not an administrator?
        </Text>
        <Link href="/cbtApp" asChild>
          <TouchableOpacity className="py-3">
            <Text className="text-blue-600 text-center font-medium">
              Go to Student Portal →
            </Text>
          </TouchableOpacity>
        </Link>
      </View>

      {/* Debug Info (remove in production) */}
      {__DEV__ && (
        <View className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
          <Text className="text-yellow-800 text-xs font-medium mb-1">
            DEV: Test Admin Credentials
          </Text>
          <Text className="text-yellow-700 text-xs">
            Email: admin@filloptech.com | Password: admin1
          </Text>
          <Text className="text-yellow-700 text-xs">
            (Falls back to mock data if API fails)
          </Text>
        </View>
      )}
    </View>
  );
}