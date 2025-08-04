import { Text, TouchableOpacity } from 'react-native';
import { cn } from '../lib/utils';

type Props = {
  title: string;
  onPress: () => void;
  className?: string;
};

export default function Button({ title, onPress, className }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={cn('bg-blue-600 px-8 py-3 rounded items-center', className)}
    >
      <Text className="text-white font-bold text-lg">{title}</Text>
    </TouchableOpacity>
  );
}