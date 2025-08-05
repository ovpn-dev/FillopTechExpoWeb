// components/Dropdown.tsx
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

interface DropdownProps {
  label?: string;
  placeholder?: string;
  options: string[];
  selectedValue?: string;
  onSelect: (value: string) => void;
  disabled?: boolean;
  maxHeight?: number;
  borderColor?: string;
  backgroundColor?: string;
  className?: string;
  dropdownClassName?: string;
  optionClassName?: string;
  textClassName?: string;
  icon?: string;
  required?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  label,
  placeholder = "Select an option",
  options = [],
  selectedValue,
  onSelect,
  disabled = false,
  maxHeight = 200,
  borderColor = "border-red-600",
  backgroundColor = "bg-white",
  className = "",
  dropdownClassName = "",
  optionClassName = "",
  textClassName = "",
  icon = "▼",
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (value: string) => {
    onSelect(value);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    if (!disabled && options.length > 0) {
      setIsOpen(!isOpen);
    }
  };

  const getDisplayText = () => {
    if (selectedValue) return selectedValue;
    if (disabled && !selectedValue) return placeholder;
    return placeholder;
  };

  const getTextColor = () => {
    if (disabled) return "text-gray-400";
    if (selectedValue) return "text-gray-800";
    return "text-gray-500";
  };

  return (
    <View
      className={`relative ${className}`}
      style={{ zIndex: isOpen ? 1000 : 1 }}
    >
      {label && (
        <Text className="font-bold mb-2 text-lg">
          {label}
          {required && <Text className="text-red-500"> *</Text>}
        </Text>
      )}

      <View className={`relative`} style={{ zIndex: isOpen ? 1000 : 1 }}>
        {/* Main Button */}
        <View
          className={`border-2 ${borderColor} ${backgroundColor} rounded-lg shadow-sm`}
        >
          <TouchableOpacity
            className="p-3 flex-row justify-between items-center"
            onPress={toggleDropdown}
            disabled={disabled}
            activeOpacity={0.7}
          >
            <Text
              className={`text-sm flex-1 ${getTextColor()} ${textClassName}`}
              numberOfLines={1}
            >
              {getDisplayText()}
            </Text>
            <Text
              className={`text-base transition-transform ${
                isOpen ? "rotate-180" : "rotate-0"
              } ${disabled ? "text-gray-400" : "text-black"}`}
            >
              {icon}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Dropdown Options */}
        {isOpen && options.length > 0 && (
          <View
            className={`absolute ${backgroundColor} border-2 ${borderColor} border-t-0 rounded-b-lg shadow-lg ${dropdownClassName}`}
            style={{
              top: "100%",
              left: 0,
              right: 0,
              zIndex: 9999,
              elevation: 10,
              maxHeight: maxHeight,
            }}
          >
            <ScrollView style={{ maxHeight: maxHeight }} nestedScrollEnabled>
              {options.map((option, index) => (
                <TouchableOpacity
                  key={`${option}-${index}`}
                  className={`p-3 ${
                    index < options.length - 1 ? "border-b border-gray-200" : ""
                  } ${
                    selectedValue === option ? "bg-blue-50" : "bg-white"
                  } ${optionClassName}`}
                  onPress={() => handleSelect(option)}
                  activeOpacity={0.7}
                >
                  <Text
                    className={`text-sm ${
                      selectedValue === option
                        ? "text-blue-600 font-semibold"
                        : "text-gray-800"
                    }`}
                  >
                    {option}
                    {selectedValue === option && " ✓"}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Empty State */}
        {isOpen && options.length === 0 && (
          <View
            className={`absolute ${backgroundColor} border-2 ${borderColor} border-t-0 rounded-b-lg shadow-lg p-3`}
            style={{
              top: "100%",
              left: 0,
              right: 0,
              zIndex: 9999,
              elevation: 10,
            }}
          >
            <Text className="text-sm text-gray-500 text-center">
              No options available
            </Text>
          </View>
        )}
      </View>

      {/* Overlay to close dropdown when clicking outside */}
      {isOpen && (
        <TouchableOpacity
          className="absolute inset-0 w-screen h-screen"
          style={{
            position: "absolute",
            top: -1000,
            left: -1000,
            right: -1000,
            bottom: -1000,
            zIndex: 999,
          }}
          onPress={() => setIsOpen(false)}
          activeOpacity={1}
        />
      )}
    </View>
  );
};

export default Dropdown;
