// app/register/index.tsx
import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import Button from "./../components/Button";

export default function RegisterTypeScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 justify-center items-center bg-white px-6">
      <Text className="text-2xl font-bold mb-8">Register as</Text>

      <Button
        title="New User"
        onPress={() => router.push("/register/user")}
        className="w-full mb-4"
      />
      <Button
        title="Corporate"
        onPress={() => router.push("/register/corporate")}
        className="w-full"
      />
    </View>
  );
}
