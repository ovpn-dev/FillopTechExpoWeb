// app/register/index.tsx - Updated to match document requirements exactly
import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import Button from "../../components/Button";

export default function RegisterTypeScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 justify-center items-center bg-white px-6">
      {/* Header */}
      <View className="bg-blue-50 p-6 rounded-lg mb-10 w-full">
        <Text className="text-2xl font-bold text-blue-800 text-center mb-2">
          FILLOP CBT GURU
        </Text>
        <Text className="text-blue-600 text-center mb-4">
          Computer-Based Test Software
        </Text>
        <Text className="text-gray-600 text-center">
          The Candidate must register while the system is online
        </Text>
      </View>

      {/* Selection Title */}
      <Text className="text-2xl font-bold mb-8 text-center">SELECT TYPE:</Text>

      {/* Registration Options */}
      <View className="w-full space-y-4">
        <Button
          title="New User Registration"
          onPress={() => router.push("/register/user")}
          className="w-full mb-4 bg-blue-600 py-4"
        />

        <Button
          title="Corporate (multiple user)"
          onPress={() => router.push("/register/corporate")}
          className="w-full bg-green-600 py-4"
        />
      </View>

      {/* Footer */}
      <View className="mt-10 pt-6 border-t border-gray-200 w-full">
        <Text className="text-sm text-gray-500 text-center">
          For support and assistance:
        </Text>
        <Text className="text-sm text-gray-600 text-center font-medium">
          WhatsApp: 08026414352 | Email: filloptech@gmail.com
        </Text>
      </View>
    </View>
  );
}
