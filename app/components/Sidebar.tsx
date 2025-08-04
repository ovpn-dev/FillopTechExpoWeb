// components/Sidebar.tsx
import React from "react";
import { Image, Text, View } from "react-native";

const mockUser = {
  firstName: "Daniel",
  lastName: "Ezekiel Sunday",
  passcode: "015209",
  profileImage: "https://via.placeholder.com/120x120.png?text=DE",
  institution: "FILLOP TECH",
};

const Sidebar: React.FC = () => {
  return (
    <View className="w-80 bg-blue-400 p-6 shadow-lg">
      <View className="bg-white rounded-xl p-6 items-center shadow-md">
        <View className="bg-blue-600 rounded-full p-4 mb-4 shadow-sm">
          <Image
            source={{ uri: mockUser.profileImage }}
            className="w-16 h-16 rounded-full"
          />
        </View>
        <Text className="text-xl font-bold mb-4 text-blue-800">
          Your Profile
        </Text>

        <View className="bg-gray-50 rounded-lg p-4 w-full items-center mb-4 border border-gray-200">
          <Image
            source={{ uri: mockUser.profileImage }}
            className="w-32 h-32 rounded-lg mb-4 border-2 border-blue-200"
          />
          <Text className="text-3xl font-bold text-gray-800">
            {mockUser.firstName}
          </Text>
          <Text className="text-lg text-gray-600">{mockUser.lastName}</Text>
          <Text className="text-sm text-blue-600 mt-2">
            {mockUser.institution}
          </Text>
        </View>

        <View className="w-full mb-4">
          <Text className="text-lg font-bold text-blue-800 mb-2 text-center">
            Student ID:
          </Text>
          <View className="bg-blue-100 rounded-lg p-3">
            <Text className="text-3xl font-bold text-blue-900 text-center">
              {mockUser.passcode}
            </Text>
          </View>
        </View>

        <View className="mt-6 items-center">
          <Text className="text-blue-700 font-bold text-lg">
            FILLOP CBT GURU
          </Text>
          <Text className="text-xs text-gray-600 text-center">
            Advanced CBT Solution
          </Text>
          <Text className="text-xs text-gray-500 mt-1">v1.0.0</Text>
        </View>
      </View>
    </View>
  );
};

export default Sidebar;
