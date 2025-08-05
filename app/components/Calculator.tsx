// components/Calculator.tsx - Simple Calculator for CBT Exam
import React, { useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

interface CalculatorProps {
  visible: boolean;
  onClose: () => void;
}

const Calculator: React.FC<CalculatorProps> = ({ visible, onClose }) => {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(String(num));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === "0" ? String(num) : display + num);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".");
    }
  };

  const clear = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (
    firstValue: number,
    secondValue: number,
    operation: string
  ): number => {
    switch (operation) {
      case "+":
        return firstValue + secondValue;
      case "-":
        return firstValue - secondValue;
      case "×":
        return firstValue * secondValue;
      case "÷":
        return secondValue !== 0 ? firstValue / secondValue : 0;
      case "=":
        return secondValue;
      default:
        return secondValue;
    }
  };

  const handleEquals = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const handlePercentage = () => {
    const value = parseFloat(display);
    setDisplay(String(value / 100));
  };

  const handleSquareRoot = () => {
    const value = parseFloat(display);
    if (value >= 0) {
      setDisplay(String(Math.sqrt(value)));
    }
  };

  const handleSquare = () => {
    const value = parseFloat(display);
    setDisplay(String(value * value));
  };

  const handlePlusMinus = () => {
    const value = parseFloat(display);
    setDisplay(String(-value));
  };

  const Button: React.FC<{
    onPress: () => void;
    title: string;
    style?: "number" | "operator" | "function" | "equals" | "clear";
    flex?: number;
  }> = ({ onPress, title, style = "number", flex = 1 }) => {
    const getButtonStyle = () => {
      const baseStyle = "h-12 rounded-lg mx-1 my-1 justify-center items-center";

      switch (style) {
        case "number":
          return `${baseStyle} bg-gray-200`;
        case "operator":
          return `${baseStyle} bg-blue-500`;
        case "function":
          return `${baseStyle} bg-orange-400`;
        case "equals":
          return `${baseStyle} bg-green-500`;
        case "clear":
          return `${baseStyle} bg-red-500`;
        default:
          return `${baseStyle} bg-gray-200`;
      }
    };

    const getTextStyle = () => {
      switch (style) {
        case "number":
          return "text-black text-lg font-semibold";
        case "operator":
        case "function":
        case "equals":
        case "clear":
          return "text-white text-lg font-bold";
        default:
          return "text-black text-lg font-semibold";
      }
    };

    return (
      <TouchableOpacity
        onPress={onPress}
        className={getButtonStyle()}
        style={{ flex }}
      >
        <Text className={getTextStyle()}>{title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        className="flex-1 justify-center items-center"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <View
          className="bg-white rounded-lg shadow-2xl"
          style={{
            width: 320,
            padding: 20,
            margin: 20,
          }}
        >
          {/* Header */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-gray-800">Calculator</Text>
            <TouchableOpacity
              onPress={onClose}
              className="bg-gray-300 rounded-full w-8 h-8 justify-center items-center"
            >
              <Text className="text-gray-600 font-bold">×</Text>
            </TouchableOpacity>
          </View>

          {/* Display */}
          <View className="bg-gray-100 rounded-lg p-4 mb-4">
            <Text
              className="text-right text-2xl font-mono text-gray-800"
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {display}
            </Text>
          </View>

          {/* Button Grid */}
          <View className="space-y-2">
            {/* Row 1: Functions */}
            <View className="flex-row">
              <Button onPress={clear} title="C" style="clear" />
              <Button onPress={handlePlusMinus} title="±" style="function" />
              <Button onPress={handlePercentage} title="%" style="function" />
              <Button
                onPress={() => performOperation("÷")}
                title="÷"
                style="operator"
              />
            </View>

            {/* Row 2: Numbers 7-9 */}
            <View className="flex-row">
              <Button onPress={() => inputNumber("7")} title="7" />
              <Button onPress={() => inputNumber("8")} title="8" />
              <Button onPress={() => inputNumber("9")} title="9" />
              <Button
                onPress={() => performOperation("×")}
                title="×"
                style="operator"
              />
            </View>

            {/* Row 3: Numbers 4-6 */}
            <View className="flex-row">
              <Button onPress={() => inputNumber("4")} title="4" />
              <Button onPress={() => inputNumber("5")} title="5" />
              <Button onPress={() => inputNumber("6")} title="6" />
              <Button
                onPress={() => performOperation("-")}
                title="-"
                style="operator"
              />
            </View>

            {/* Row 4: Numbers 1-3 */}
            <View className="flex-row">
              <Button onPress={() => inputNumber("1")} title="1" />
              <Button onPress={() => inputNumber("2")} title="2" />
              <Button onPress={() => inputNumber("3")} title="3" />
              <Button
                onPress={() => performOperation("+")}
                title="+"
                style="operator"
              />
            </View>

            {/* Row 5: 0, decimal, functions */}
            <View className="flex-row">
              <Button onPress={() => inputNumber("0")} title="0" flex={2} />
              <Button onPress={inputDecimal} title="." />
              <Button onPress={handleEquals} title="=" style="equals" />
            </View>

            {/* Row 6: Advanced functions */}
            <View className="flex-row">
              <Button onPress={handleSquareRoot} title="√" style="function" />
              <Button onPress={handleSquare} title="x²" style="function" />
              <View style={{ flex: 2 }} />
            </View>
          </View>

          {/* Info Text */}
          <Text className="text-xs text-gray-500 text-center mt-3">
            Basic calculator for exam use
          </Text>
        </View>
      </View>
    </Modal>
  );
};

export default Calculator;
