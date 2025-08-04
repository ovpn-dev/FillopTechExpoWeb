import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Text, TextInput, View } from 'react-native';
import Button from './components/Button';

export default function Activate() {
  const router = useRouter();
  const [code, setCode] = useState('');

  const handleActivate = () => {
    if (code === '123456') {
      Alert.alert('Success', 'CBT Guru is successfully activated');
      router.push('/dashboard');
    } else {
      Alert.alert('Error', 'This passcode is incorrect');
    }
  };

  return (
    <View className="flex-1 bg-white p-6 justify-center">
      <Text className="text-xl font-bold mb-6">Enter Activation Code</Text>

      <TextInput
        placeholder="Enter code"
        className="border p-3 rounded mb-4"
        value={code}
        onChangeText={setCode}
      />

      <Button title="Activate" onPress={handleActivate} />
    </View>
  );
}
