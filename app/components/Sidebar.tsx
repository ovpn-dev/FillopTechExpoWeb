// components/Sidebar.tsx - Updated with Authentication and Logout
import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useAuth, useUser } from "../contexts/AuthContext";
import ConfirmModal from "./ConfirmModal";

interface SidebarProps {
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  const { authState } = useAuth();
  const user = useUser();

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutPress = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    onLogout();
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  // Fallback if user is not available (shouldn't happen if properly authenticated)
  if (!user) {
    return (
      <View className="bg-blue-400 p-6 shadow-lg">
        <View className="bg-white rounded-xl p-6 items-center shadow-md">
          <Text className="text-xl font-bold mb-4 text-red-600">
            Authentication Error
          </Text>
          <TouchableOpacity
            onPress={onLogout}
            className="bg-red-600 px-4 py-2 rounded-lg"
          >
            <Text className="text-white font-bold">Return to Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <>
      <View className="bg-blue-400 p-6 shadow-lg">
        <View className="bg-white rounded-xl p-6 items-center shadow-md">
          <View className="bg-blue-600 rounded-full p-4 mb-4 shadow-sm">
            <Image
              source={{ uri: user.profileImage }}
              className="w-16 h-16 rounded-full"
            />
          </View>
          <Text className="text-xl font-bold mb-4 text-blue-800">
            Your Profile
          </Text>

          {/* User Profile Section */}
          <View className="bg-gray-50 rounded-lg p-4 w-full items-center mb-4 border border-gray-200">
            <Image
              source={{ uri: user.profileImage }}
              className="w-32 h-32 rounded-lg mb-4 border-2 border-blue-200"
            />
            <Text className="text-3xl font-bold text-gray-800">
              {user.firstName}
            </Text>
            <Text className="text-lg text-gray-600">{user.lastName}</Text>
            <Text className="text-sm text-blue-600 mt-2">
              {user.institution}
            </Text>
            {user.email && (
              <Text className="text-xs text-gray-500 mt-1">{user.email}</Text>
            )}
          </View>

          {/* Student ID Section */}
          <View className="w-full mb-4">
            <Text className="text-lg font-bold text-blue-800 mb-2 text-center">
              Student ID:
            </Text>
            <View className="bg-blue-100 rounded-lg p-3">
              <Text className="text-3xl font-bold text-blue-900 text-center">
                {user.passcode}
              </Text>
            </View>
          </View>

          {/* User Status */}
          <View className="w-full mb-4 bg-green-50 rounded-lg p-3 border border-green-200">
            <Text className="text-green-800 font-semibold text-center mb-1">
              ✅ Authenticated
            </Text>
            <Text className="text-green-600 text-xs text-center">
              Session Active
            </Text>
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            onPress={handleLogoutPress}
            className="w-full bg-red-600 py-3 px-4 rounded-lg mb-4 shadow-sm"
          >
            <Text className="text-white font-bold text-center text-lg">
              🚪 LOGOUT
            </Text>
          </TouchableOpacity>

          {/* App Branding */}
          <View className="mt-6 items-center">
            <Text className="text-blue-700 font-bold text-lg">
              FILLOP CBT GURU
            </Text>
            <Text className="text-xs text-gray-600 text-center">
              Advanced CBT Solution
            </Text>
            <Text className="text-xs text-gray-500 mt-1">v1.0.0</Text>
          </View>

          {/* Registration Info */}
          {user.registrationDate && (
            <View className="mt-4 w-full">
              <Text className="text-xs text-gray-500 text-center">
                Member since:{" "}
                {new Date(user.registrationDate).toLocaleDateString()}
              </Text>
            </View>
          )}
        </View>
      </View>

      <ConfirmModal
        visible={showLogoutModal}
        title="Confirm Logout"
        message="Are you sure you want to logout? Any unsaved progress will be lost."
        confirmText="Logout"
        cancelText="Cancel"
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
      />
    </>
  );
};

export default Sidebar;
