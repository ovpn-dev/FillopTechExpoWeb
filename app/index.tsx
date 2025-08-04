import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const [code, setCode] = useState('');

  return (
    <View className="flex-1 bg-gradient-to-b from-blue-100 to-white items-center justify-center px-4">
      {/* Header */}
      <View className="absolute top-0 w-full h-16 bg-gradient-to-r from-orange-500 to-red-500 justify-center items-center">
        <Text className="text-white font-bold text-sm">FILLOP TECH (HANDS-ON CBT)</Text>
      </View>

      {/* Card */}
      <View className="bg-blue-600 rounded-2xl shadow-md p-6 w-full max-w-md items-center">
        <Text className="text-white text-2xl font-bold mb-1">WELCOME!</Text>
        <Text className="text-white mb-4">CBT - EXPERIENCE IT PROPER</Text>

        <Text className="text-white self-start mb-1">Passcode:</Text>
        <TextInput
          className="bg-white rounded-lg p-4 text-center font-mono text-xl tracking-widest mb-4 w-full"
          keyboardType="numeric"
          value={code}
          onChangeText={setCode}
          placeholder="••••••"
        />

        <TouchableOpacity
          className="bg-black w-full py-3 rounded-xl items-center"
          onPress={() => router.push('/examInterface/welcome')}
        >
          <Text className="text-white font-bold">USER LOG IN</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <Text className="text-gray-600 mt-6">2025 © FILLOP TECH</Text>
      <TouchableOpacity onPress={() => router.push('/register')}>
        <Text className="text-blue-600 mt-1">Don't have an account? Register here</Text>
      </TouchableOpacity>
    </View>
  );
}
