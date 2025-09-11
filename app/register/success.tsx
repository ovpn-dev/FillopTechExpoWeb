// app/register/success.tsx
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Animated,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Button from "../../components/Button";

interface SuccessProps {
  // In real app, these would come from navigation params or context
  registrationType?: "user" | "corporate";
  systemId?: string;
  planDetails?: any;
  userDetails?: any;
}

export default function RegistrationSuccessScreen({
  registrationType = "user",
  systemId = "FLT-2025-ABCD-1234",
  planDetails = null,
  userDetails = {},
}: SuccessProps) {
  const router = useRouter();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.5));

  useEffect(() => {
    // Animate entrance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleContinueToApp = () => {
    // Clear any registration data and navigate to main app
    router.replace("/cbtApp");
  };

  const openUserGuide = () => {
    // In a real app, this would open a help/guide section
    Linking.openURL("https://fillop.com/user-guide").catch(() => {
      console.log("Unable to open user guide");
    });
  };

  const downloadApp = () => {
    // Link to app store or download page
    Linking.openURL("https://fillop.com/download").catch(() => {
      console.log("Unable to open download page");
    });
  };

  return (
    <ScrollView className="flex-1 bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }}
        className="bg-white rounded-lg shadow-lg"
      >
        {/* Success Header */}
        <View className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-t-lg">
          <View className="items-center">
            <Text className="text-6xl mb-2">🎉</Text>
            <Text className="text-2xl font-bold text-white text-center">
              Welcome to FILLOP CBT GURU!
            </Text>
            <Text className="text-green-100 text-center mt-2">
              Your account has been successfully activated
            </Text>
          </View>
        </View>

        <View className="p-6">
          {/* Account Information */}
          <View className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
            <Text className="text-lg font-bold text-blue-800 mb-3 text-center">
              🆔 Account Details
            </Text>

            <View className="space-y-3">
              <View className="flex-row justify-between items-center">
                <Text className="font-medium text-blue-700">System ID:</Text>
                <Text className="font-mono font-bold text-blue-900">
                  {systemId}
                </Text>
              </View>

              <View className="flex-row justify-between items-center">
                <Text className="font-medium text-blue-700">Account Type:</Text>
                <Text className="font-bold text-blue-900">
                  {registrationType === "corporate"
                    ? "Corporate"
                    : "Individual"}
                </Text>
              </View>

              {registrationType === "corporate" && planDetails && (
                <View className="flex-row justify-between items-center">
                  <Text className="font-medium text-blue-700">Plan:</Text>
                  <Text className="font-bold text-blue-900">
                    {planDetails.name}
                  </Text>
                </View>
              )}

              <View className="flex-row justify-between items-center">
                <Text className="font-medium text-blue-700">Status:</Text>
                <View className="bg-green-500 px-3 py-1 rounded-full">
                  <Text className="text-white font-bold text-sm">
                    ✅ ACTIVE
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* What's Next */}
          <View className="mb-6">
            <Text className="text-xl font-bold mb-4 text-gray-800 text-center">
              🚀 What's Next?
            </Text>

            <View className="space-y-4">
              {registrationType === "corporate" ? (
                <View>
                  <View className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                    <Text className="font-bold text-green-800 mb-2">
                      👥 Manage Your Students
                    </Text>
                    <Text className="text-green-700 text-sm">
                      Add and manage student accounts, monitor their progress,
                      and generate reports
                    </Text>
                  </View>

                  <View className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                    <Text className="font-bold text-blue-800 mb-2">
                      📊 Access Admin Dashboard
                    </Text>
                    <Text className="text-blue-700 text-sm">
                      View comprehensive analytics, exam statistics, and
                      institutional performance
                    </Text>
                  </View>

                  <View className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg">
                    <Text className="font-bold text-purple-800 mb-2">
                      🎯 Customize Exams
                    </Text>
                    <Text className="text-purple-700 text-sm">
                      Create custom practice sessions and mock exams for your
                      students
                    </Text>
                  </View>
                </View>
              ) : (
                <View>
                  <View className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                    <Text className="font-bold text-green-800 mb-2">
                      📚 Start Practicing
                    </Text>
                    <Text className="text-green-700 text-sm">
                      Take practice tests for JAMB, WAEC, or NECO to improve
                      your performance
                    </Text>
                  </View>

                  <View className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                    <Text className="font-bold text-blue-800 mb-2">
                      📈 Track Progress
                    </Text>
                    <Text className="text-blue-700 text-sm">
                      Monitor your scores, identify weak areas, and track
                      improvement over time
                    </Text>
                  </View>

                  <View className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg">
                    <Text className="font-bold text-purple-800 mb-2">
                      🎯 Timed Practice
                    </Text>
                    <Text className="text-purple-700 text-sm">
                      Simulate real exam conditions with timed practice sessions
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* Features Available */}
          <View className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <Text className="font-bold text-gray-800 mb-3 text-center">
              ✨ Available Features
            </Text>
            <View className="grid grid-cols-2 gap-2">
              {[
                "📝 Practice Tests",
                "⏱️ Timed Exams",
                "📊 Score Analytics",
                "📚 Study Mode",
                "🎯 Mock Exams",
                "📱 Mobile Access",
                "🔄 Instant Results",
                "💾 Progress Saving",
              ].map((feature, index) => (
                <View key={index} className="flex-row items-center py-1">
                  <Text className="text-sm text-gray-700">{feature}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Action Buttons */}
          <View className="space-y-3 mb-6">
            <Button
              title="🎯 Start Using CBT GURU"
              onPress={handleContinueToApp}
              className="bg-green-600 py-4"
            />

            <View className="flex-row gap-2">
              <Button
                title="📖 User Guide"
                onPress={openUserGuide}
                className="flex-1 bg-blue-500"
              />

              <Button
                title="📱 Download App"
                onPress={downloadApp}
                className="flex-1 bg-purple-500"
              />
            </View>
          </View>

          {/* Tips for Success */}
          <View className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mb-6">
            <Text className="font-bold text-yellow-800 mb-2">
              💡 Tips for Success
            </Text>
            <View className="space-y-2">
              <Text className="text-yellow-700 text-sm">
                • Take regular practice tests to build confidence
              </Text>
              <Text className="text-yellow-700 text-sm">
                • Review your mistakes to learn from them
              </Text>
              <Text className="text-yellow-700 text-sm">
                • Use timed mode to prepare for real exam conditions
              </Text>
              <Text className="text-yellow-700 text-sm">
                • Focus on your weak subjects for maximum improvement
              </Text>
            </View>
          </View>

          {/* Support Information */}
          <View className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <Text className="font-bold text-blue-800 mb-2 text-center">
              🆘 Need Help?
            </Text>
            <Text className="text-blue-700 text-center text-sm mb-3">
              Our support team is here to help you succeed
            </Text>

            <View className="flex-row justify-center gap-4">
              <TouchableOpacity
                onPress={() => Linking.openURL(`https://wa.me/08026414352`)}
                className="flex-1 bg-green-500 p-3 rounded-lg"
              >
                <Text className="text-white text-center font-bold">
                  📱 WhatsApp
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => Linking.openURL(`mailto:filloptech@gmail.com`)}
                className="flex-1 bg-blue-500 p-3 rounded-lg"
              >
                <Text className="text-white text-center font-bold">
                  📧 Email
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer */}
          <View className="pt-4 border-t border-gray-200">
            <Text className="text-center font-bold text-gray-700 text-lg">
              2025 © FILLOP TECH LIMITED
            </Text>
            <Text className="text-center text-gray-500 text-sm mt-1">
              Touching Lives Through CBT Technology
            </Text>
            <Text className="text-center text-gray-400 text-xs mt-2">
              Thank you for choosing FILLOP CBT GURU for your exam preparation!
            </Text>
          </View>
        </View>
      </Animated.View>
    </ScrollView>
  );
}
