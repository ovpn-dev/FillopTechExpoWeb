// app/index.tsx - Updated Login Screen with dual authentication
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuth } from "../contexts/AuthContext";

type LoginMode = "passcode" | "email";

export default function LoginScreen() {
  const router = useRouter();
  const { loginWithEmailPassword, loginWithPasscode, authState, clearError } =
    useAuth();

  const [loginMode, setLoginMode] = useState<LoginMode>("passcode");
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handlePasscodeLogin = async () => {
    clearError();

    if (!code.trim()) {
      Alert.alert("Error", "Please enter your passcode");
      return;
    }

    const success = await loginWithPasscode(code.trim());

    if (success) {
      router.push("/cbtApp");
      setCode("");
    } else {
      Alert.alert(
        "Login Failed",
        authState.error || "Invalid passcode. Please try again.",
        [{ text: "OK", onPress: () => clearError() }]
      );
    }
  };

  const handleEmailLogin = async () => {
    clearError();

    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    const success = await loginWithEmailPassword(email.trim(), password);

    if (success) {
      router.push("/cbtApp");
      setEmail("");
      setPassword("");
    } else {
      Alert.alert(
        "Login Failed",
        authState.error || "Invalid credentials. Please try again.",
        [{ text: "OK", onPress: () => clearError() }]
      );
    }
  };

  const handleInputChange = (field: string, text: string) => {
    if (field === "code") setCode(text);
    if (field === "email") setEmail(text);
    if (field === "password") setPassword(text);

    // Clear error when user starts typing
    if (authState.error) {
      clearError();
    }
  };

  const toggleLoginMode = () => {
    setLoginMode(loginMode === "passcode" ? "email" : "passcode");
    clearError();
    // Clear form fields when switching
    setCode("");
    setEmail("");
    setPassword("");
  };

  // Show loading state during authentication initialization
  if (authState.isLoading && !authState.user) {
    return (
      <View className="flex-1 bg-gradient-to-b from-blue-100 to-white items-center justify-center">
        <Text className="text-blue-600 text-lg">Initializing...</Text>
      </View>
    );
  }

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

        {/* Login Mode Tabs */}
        <View className="flex-row w-full mb-4 bg-blue-700 rounded-lg p-1">
          <TouchableOpacity
            className={`flex-1 py-2 rounded-lg ${
              loginMode === "passcode" ? "bg-white" : "bg-transparent"
            }`}
            onPress={() => setLoginMode("passcode")}
          >
            <Text
              className={`text-center font-semibold ${
                loginMode === "passcode" ? "text-blue-600" : "text-white"
              }`}
            >
              Passcode
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-2 rounded-lg ${
              loginMode === "email" ? "bg-white" : "bg-transparent"
            }`}
            onPress={() => setLoginMode("email")}
          >
            <Text
              className={`text-center font-semibold ${
                loginMode === "email" ? "text-blue-600" : "text-white"
              }`}
            >
              Email
            </Text>
          </TouchableOpacity>
        </View>

        {/* Passcode Login Form */}
        {loginMode === "passcode" && (
          <>
            <Text className="text-white self-start mb-1">Passcode:</Text>
            <TextInput
              className={`bg-white rounded-lg p-4 text-center font-mono text-xl tracking-widest mb-4 w-full ${
                authState.error ? "border-2 border-red-500" : ""
              }`}
              keyboardType="numeric"
              value={code}
              onChangeText={(text) => handleInputChange("code", text)}
              placeholder="••••••"
              maxLength={6}
              editable={!authState.isLoading}
            />

            {/* Demo Info for Passcode */}
            <View className="mb-4 p-3 bg-blue-700 rounded-lg w-full">
              <Text className="text-blue-200 text-xs text-center mb-1">
                Demo Passcode:
              </Text>
              <Text className="text-white text-sm text-center font-mono">
                015209
              </Text>
            </View>

            <TouchableOpacity
              className={`w-full py-3 rounded-xl items-center mb-2 ${
                authState.isLoading ? "bg-gray-600" : "bg-black"
              }`}
              onPress={handlePasscodeLogin}
              disabled={authState.isLoading}
            >
              <Text className="text-white font-bold">
                {authState.isLoading ? "LOGGING IN..." : "LOGIN WITH PASSCODE"}
              </Text>
            </TouchableOpacity>
          </>
        )}

        {/* Email Login Form */}
        {loginMode === "email" && (
          <>
            <Text className="text-white self-start mb-1">Email:</Text>
            <TextInput
              className={`bg-white rounded-lg p-4 mb-3 w-full ${
                authState.error ? "border-2 border-red-500" : ""
              }`}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={(text) => handleInputChange("email", text)}
              placeholder="Enter your email"
              editable={!authState.isLoading}
            />

            <Text className="text-white self-start mb-1">Password:</Text>
            <TextInput
              className={`bg-white rounded-lg p-4 mb-4 w-full ${
                authState.error ? "border-2 border-red-500" : ""
              }`}
              secureTextEntry
              value={password}
              onChangeText={(text) => handleInputChange("password", text)}
              placeholder="Enter your password"
              editable={!authState.isLoading}
            />

            <TouchableOpacity
              className={`w-full py-3 rounded-xl items-center mb-2 ${
                authState.isLoading ? "bg-gray-600" : "bg-black"
              }`}
              onPress={handleEmailLogin}
              disabled={authState.isLoading}
            >
              <Text className="text-white font-bold">
                {authState.isLoading ? "LOGGING IN..." : "LOGIN WITH EMAIL"}
              </Text>
            </TouchableOpacity>
          </>
        )}

        {/* Error Message */}
        {authState.error && (
          <Text className="text-red-200 text-sm mb-4 text-center">
            {authState.error}
          </Text>
        )}

        {/* Switch Login Mode */}
        <TouchableOpacity onPress={toggleLoginMode}>
          <Text className="text-blue-200 text-sm underline">
            {loginMode === "passcode"
              ? "Switch to Email Login"
              : "Switch to Passcode Login"}
          </Text>
        </TouchableOpacity>
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
