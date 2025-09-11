// app/register/activation.tsx
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Linking,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import Button from "../../components/Button";
import { SystemIdGenerator } from "../../utils/systemIdGenerator";

const CONTACT_INFO = {
  whatsapp: "08026414352",
  email: "filloptech@gmail.com",
};

interface ActivationProps {
  // In real app, these would come from navigation params or context
  registrationType?: "user" | "corporate";
  systemId?: string;
}

export default function ActivationScreen({
  registrationType = "user",
  systemId = "FLT-2025-ABCD-1234",
}: ActivationProps) {
  const router = useRouter();
  const [activationCode, setActivationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const maxAttempts = 5;
  const lockDuration = 300; // 5 minutes in seconds

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (isLocked && countdown === 0) {
      setIsLocked(false);
      setAttempts(0);
    }
    return () => clearTimeout(timer);
  }, [countdown, isLocked]);

  const handleActivation = async () => {
    if (!activationCode.trim()) {
      Alert.alert("Error", "Please enter your activation code");
      return;
    }

    if (isLocked) {
      Alert.alert(
        "Account Temporarily Locked",
        `Too many failed attempts. Please wait ${Math.ceil(countdown / 60)} minutes before trying again.`
      );
      return;
    }

    // Validate code format
    const isValidFormat =
      registrationType === "corporate"
        ? SystemIdGenerator.validateActivationCode(activationCode)
        : SystemIdGenerator.validateUserPasscode(activationCode);

    if (!isValidFormat) {
      const expectedFormat =
        registrationType === "corporate"
          ? "12-character alphanumeric code"
          : "8-digit numeric code";
      Alert.alert("Invalid Format", `Please enter a valid ${expectedFormat}`);
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // For demo purposes, accept specific codes or any code with correct format
      const isValidCode =
        activationCode === "DEMO12345678" || // Demo code
        activationCode === "12345678" || // Demo user code
        activationCode.length >= 8; // Any code with correct length for demo

      if (isValidCode) {
        Alert.alert(
          "🎉 Activation Successful!",
          `Congratulations! Your FILLOP CBT GURU account has been successfully activated.`,
          [
            {
              text: "Continue to App",
              onPress: () => router.push("/register/success"),
            },
          ]
        );
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);

        if (newAttempts >= maxAttempts) {
          setIsLocked(true);
          setCountdown(lockDuration);
          Alert.alert(
            "Account Locked",
            `Too many failed attempts. Your account has been temporarily locked for ${lockDuration / 60} minutes. Please contact support if you continue to have issues.`
          );
        } else {
          Alert.alert(
            "Invalid Activation Code",
            `The activation code you entered is incorrect. You have ${maxAttempts - newAttempts} attempts remaining.\n\nPlease check your email or WhatsApp for the correct code.`
          );
        }
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "Activation failed. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (text: string) => {
    // Format input based on registration type
    if (registrationType === "corporate") {
      // Corporate: uppercase alphanumeric, max 12 chars
      const formatted = text
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "")
        .slice(0, 12);
      setActivationCode(formatted);
    } else {
      // User: numeric only, max 8 digits
      const formatted = text.replace(/[^0-9]/g, "").slice(0, 8);
      setActivationCode(formatted);
    }
  };

  const contactSupport = (method: "whatsapp" | "email") => {
    const message = `Hi, I need help with account activation.

System ID: ${systemId}
Registration Type: ${registrationType === "corporate" ? "Corporate" : "Individual User"}
Issue: Having trouble with activation code

Please assist me with activation.`;

    if (method === "whatsapp") {
      const whatsappUrl = `https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent(message)}`;
      Linking.openURL(whatsappUrl).catch(() => {
        Alert.alert(
          "Error",
          "Unable to open WhatsApp. Please try email instead."
        );
      });
    } else {
      const subject = `Account Activation Help - ${systemId}`;
      const emailUrl = `mailto:${CONTACT_INFO.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
      Linking.openURL(emailUrl).catch(() => {
        Alert.alert(
          "Error",
          "Unable to open email app. Please contact us directly."
        );
      });
    }
  };

  const formatCountdown = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      <View className="bg-white rounded-lg shadow-sm">
        {/* Header */}
        <View className="bg-blue-600 p-4 rounded-t-lg">
          <Text className="text-xl font-bold text-white text-center">
            🔐 Account Activation
          </Text>
          <Text className="text-blue-100 text-center mt-1">
            Enter your activation code to access FILLOP CBT GURU
          </Text>
        </View>

        <View className="p-4">
          {/* System ID Display */}
          <View className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <Text className="text-sm font-medium text-gray-600 mb-1">
              System ID
            </Text>
            <Text className="text-lg font-mono font-bold text-gray-800">
              {systemId}
            </Text>
            <Text className="text-xs text-gray-500 mt-1">
              {registrationType === "corporate"
                ? "Corporate Account"
                : "Individual Account"}
            </Text>
          </View>

          {/* Instructions */}
          <View className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
            <Text className="text-blue-800 font-bold mb-2">
              📋 Instructions
            </Text>
            {registrationType === "corporate" ? (
              <View>
                <Text className="text-blue-700 mb-2">
                  Your 12-character activation code has been sent to your
                  registered email and WhatsApp after payment confirmation.
                </Text>
                <Text className="text-blue-700 mb-2">
                  Format: XXXX-XXXX-XXXX (letters and numbers)
                </Text>
                <Text className="text-blue-600 text-sm">
                  Corporate accounts may take up to 24 hours to process after
                  payment.
                </Text>
              </View>
            ) : (
              <View>
                <Text className="text-blue-700 mb-2">
                  Your 8-digit activation code has been sent to your registered
                  phone number and email after payment confirmation.
                </Text>
                <Text className="text-blue-700 mb-2">
                  Format: 12345678 (numbers only)
                </Text>
                <Text className="text-blue-600 text-sm">
                  Individual accounts are usually activated within 2-6 hours
                  after payment.
                </Text>
              </View>
            )}
          </View>

          {/* Activation Code Input */}
          <View className="mb-6">
            <Text className="text-lg font-bold mb-3 text-gray-800">
              Enter Activation Code
            </Text>

            <TextInput
              placeholder={
                registrationType === "corporate"
                  ? "Enter 12-character code (e.g. ABC123DEF456)"
                  : "Enter 8-digit code (e.g. 12345678)"
              }
              className={`border-2 p-4 rounded-lg text-center text-lg font-mono ${
                isLocked ? "border-red-300 bg-red-50" : "border-blue-300"
              }`}
              value={activationCode}
              onChangeText={handleCodeChange}
              maxLength={registrationType === "corporate" ? 12 : 8}
              autoCapitalize={
                registrationType === "corporate" ? "characters" : "none"
              }
              keyboardType={
                registrationType === "corporate" ? "default" : "numeric"
              }
              editable={!isLocked && !loading}
            />

            {/* Character/Digit Counter */}
            <Text className="text-sm text-gray-500 text-center mt-2">
              {activationCode.length}/
              {registrationType === "corporate" ? 12 : 8} characters
            </Text>

            {/* Attempts Counter */}
            {attempts > 0 && (
              <Text className="text-sm text-orange-600 text-center mt-2">
                ⚠️ {attempts}/{maxAttempts} attempts used
              </Text>
            )}

            {/* Lock Countdown */}
            {isLocked && countdown > 0 && (
              <View className="bg-red-50 border border-red-200 rounded-lg p-3 mt-3">
                <Text className="text-red-800 text-center font-bold">
                  🔒 Account Locked
                </Text>
                <Text className="text-red-700 text-center text-sm mt-1">
                  Retry in: {formatCountdown(countdown)}
                </Text>
              </View>
            )}
          </View>

          {/* Demo Codes (for testing) */}
          {__DEV__ && (
            <View className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
              <Text className="text-yellow-800 font-bold mb-2">
                🧪 Demo Codes (Dev Only)
              </Text>
              <Text className="text-yellow-700 text-sm">
                Corporate: DEMO12345678
              </Text>
              <Text className="text-yellow-700 text-sm">
                Individual: 12345678
              </Text>
            </View>
          )}

          {/* Activation Button */}
          <Button
            title={
              loading
                ? "Activating..."
                : isLocked
                  ? `Locked (${formatCountdown(countdown)})`
                  : "Activate Account"
            }
            onPress={handleActivation}
            className={`mb-4 ${
              loading || isLocked
                ? "bg-gray-400"
                : activationCode.length ===
                    (registrationType === "corporate" ? 12 : 8)
                  ? "bg-green-600"
                  : "bg-blue-600"
            }`}
            disabled={loading || isLocked}
          />

          {/* Support Options */}
          <View className="mb-6">
            <Text className="text-lg font-bold mb-3 text-gray-800 text-center">
              Need Help?
            </Text>

            <View className="space-y-3">
              <Button
                title="📱 Contact via WhatsApp"
                onPress={() => contactSupport("whatsapp")}
                className="bg-green-500"
              />

              <Button
                title="📧 Send Email Support"
                onPress={() => contactSupport("email")}
                className="bg-blue-500"
              />
            </View>
          </View>

          {/* Help Information */}
          <View className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <Text className="font-bold text-gray-800 mb-2">
              ❓ Common Issues
            </Text>
            <View className="space-y-2">
              <Text className="text-gray-700 text-sm">
                • Check your email spam/junk folder for the activation code
              </Text>
              <Text className="text-gray-700 text-sm">
                • Ensure your payment has been confirmed by our team
              </Text>
              <Text className="text-gray-700 text-sm">
                • Wait 24 hours after payment before contacting support
              </Text>
              <Text className="text-gray-700 text-sm">
                • Verify you're using the correct System ID: {systemId}
              </Text>
            </View>
          </View>

          {/* Back Button */}
          <Button
            title="← Back to Payment Info"
            onPress={() => router.back()}
            className="bg-gray-500"
          />

          {/* Support Contact */}
          <View className="mt-6 pt-4 border-t border-gray-200">
            <Text className="text-center text-sm text-gray-600 mb-2">
              24/7 Support Available
            </Text>
            <Text className="text-center text-sm text-gray-500">
              WhatsApp: {CONTACT_INFO.whatsapp} | Email: {CONTACT_INFO.email}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
