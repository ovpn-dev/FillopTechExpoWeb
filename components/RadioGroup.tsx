import { Text, TouchableOpacity, View } from 'react-native';

type Props = {
  label: string;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
};

export default function RadioGroup({ label, options, selected, onSelect }: Props) {
  return (
    <View className="mb-4">
      <Text className="mb-2 font-medium">{label}</Text>
      <View className="flex-row gap-4">
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            className={`flex-row items-center px-4 py-2 rounded-full border ${
              selected === option ? 'border-blue-600 bg-blue-100' : 'border-gray-300'
            }`}
            onPress={() => onSelect(option)}
          >
            <Text className="text-sm">{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
