import * as ImagePickerLib from 'expo-image-picker';
import { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  label: string;
  gender?: string;
  onPick: (uri: string) => void;
};

export default function ImagePicker({ label, gender = 'Male', onPick }: Props) {
  const [imageUri, setImageUri] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePickerLib.launchImageLibraryAsync({
      mediaTypes: ImagePickerLib.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      onPick(uri);
    }
  };

  const defaultImage =
    gender === 'Female'
      ? 'https://via.placeholder.com/100x100.png?text=F'
      : 'https://via.placeholder.com/100x100.png?text=M';

  return (
    <View className="mb-4">
      <Text className="mb-2 font-medium">{label}</Text>
      <TouchableOpacity onPress={pickImage}>
        <Image
          source={{ uri: imageUri || defaultImage }}
          className="w-24 h-24 rounded-full bg-gray-200"
        />
        <Text className="text-blue-500 mt-2">Choose Image</Text>
      </TouchableOpacity>
    </View>
  );
}
