import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) => {
  if (!visible) return null;

  return (
    <View
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
      }}
    >
      <View
        className="bg-white rounded-lg p-6 shadow-2xl"
        style={{
          backgroundColor: "white",
          borderRadius: 8,
          padding: 24,
          maxWidth: 400,
          margin: 16,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        }}
      >
        <Text
          className="text-lg font-bold mb-4 text-gray-800"
          style={{
            fontSize: 18,
            fontWeight: "bold",
            marginBottom: 16,
            color: "#1f2937",
          }}
        >
          {title}
        </Text>
        <Text
          className="text-gray-600 mb-6"
          style={{ color: "#4b5563", marginBottom: 24 }}
        >
          {message}
        </Text>
        <View
          className="flex-row gap-3 justify-end"
          style={{
            flexDirection: "row",
            gap: 12,
            justifyContent: "flex-end",
          }}
        >
          <TouchableOpacity
            onPress={onCancel}
            className="px-4 py-2 bg-gray-300 rounded"
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              backgroundColor: "#d1d5db",
              borderRadius: 4,
            }}
          >
            <Text className="text-gray-700" style={{ color: "#374151" }}>
              {cancelText}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onConfirm}
            className="px-4 py-2 bg-red-600 rounded"
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              backgroundColor: "#dc2626",
              borderRadius: 4,
            }}
          >
            <Text className="text-white" style={{ color: "white" }}>
              {confirmText}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ConfirmModal;
