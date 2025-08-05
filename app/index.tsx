// index.tsx - Updated Login Screen with Authentication
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuth } from "./contexts/AuthContext";

export default function LoginScreen() {
  const router = useRouter();
  const { login, authState, clearError } = useAuth();
  const [code, setCode] = useState("");

  const handleLogin = async () => {
    // Clear any previous errors
    clearError();

    // Basic validation
    if (!code.trim()) {
      Alert.alert("Error", "Please enter your passcode");
      return;
    }

    // Attempt login
    const success = await login(code.trim());

    if (success) {
      // Login successful - navigate to main app
      router.push("/cbtApp");
      setCode(""); // Clear the input
    } else {
      // Login failed - show error
      Alert.alert(
        "Login Failed",
        authState.error || "Invalid passcode. Please try again.",
        [
          {
            text: "OK",
            onPress: () => clearError(),
          },
        ]
      );
    }
  };

  const handlePasscodeChange = (text: string) => {
    setCode(text);
    // Clear error when user starts typing
    if (authState.error) {
      clearError();
    }
  };

  return (
    <View className="flex-1 bg-gradient-to-b from-blue-100 to-white items-center justify-center px-4">
      {/* Header */}
      <View className="absolute top-0 w-full h-16 bg-gradient-to-r from-orange-500 to-red-500 justify-center items-center">
        <Text className="text-white font-bold text-sm">
          FILLOP TECH (HANDS-ON CBT)
        </Text>
      </View>

      {/* Card */}
      <View className="bg-blue-600 rounded-2xl shadow-md p-6 w-full max-w-md items-center">
        <Text className="text-white text-2xl font-bold mb-1">WELCOME!</Text>
        <Text className="text-white mb-4">CBT - EXPERIENCE IT PROPER</Text>

        <Text className="text-white self-start mb-1">Passcode:</Text>
        <TextInput
          className={`bg-white rounded-lg p-4 text-center font-mono text-xl tracking-widest mb-4 w-full ${
            authState.error ? "border-2 border-red-500" : ""
          }`}
          keyboardType="numeric"
          value={code}
          onChangeText={handlePasscodeChange}
          placeholder="••••••"
          maxLength={6}
          editable={!authState.isLoading}
        />

        {/* Error Message */}
        {authState.error && (
          <Text className="text-red-200 text-sm mb-4 text-center">
            {authState.error}
          </Text>
        )}

        {/* Login Button */}
        <TouchableOpacity
          className={`w-full py-3 rounded-xl items-center ${
            authState.isLoading ? "bg-gray-600" : "bg-black"
          }`}
          onPress={handleLogin}
          disabled={authState.isLoading}
        >
          <Text className="text-white font-bold">
            {authState.isLoading ? "LOGGING IN..." : "USER LOG IN"}
          </Text>
        </TouchableOpacity>

        {/* Demo Info */}
        <View className="mt-4 p-3 bg-blue-700 rounded-lg w-full">
          <Text className="text-blue-200 text-xs text-center mb-1">
            Demo Passcode:
          </Text>
          <Text className="text-white text-sm text-center font-mono">
            015209
          </Text>
        </View>
      </View>

      {/* Footer */}
      <Text className="text-gray-600 mt-6">2025 © FILLOP TECH</Text>
      <TouchableOpacity onPress={() => router.push("/register")}>
        <Text className="text-blue-600 mt-1">
          Don't have an account? Register here
        </Text>
      </TouchableOpacity>
    </View>
  );
}
