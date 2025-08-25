// app/register/user.tsx - Updated with API integration
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  NIGERIAN_STATES,
  NIGERIAN_STATES_AND_LGAS,
} from "../data/nigerianStatesAndLGAs";
import { ALL_SUBJECTS } from "../data/subjects";
import apiService, { ApiError } from "../services/apiService";
import { PricingCalculator } from "../utils/pricingCalculator";
import Button from "./../components/Button";
import Dropdown from "./../components/Dropdown";

const EXAM_TYPES = ["JAMB", "WAEC", "NECO"];

export default function NewUserRegistration() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    surname: "",
    firstname: "",
    phone: "",
    gender: "Male" as "Male" | "Female",
    address: "",
    houseNumber: "",
    lga: "",
    state: "",
    subjects: [] as string[],
    examType: "JAMB",
    passport: "", // For photo upload
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  const handleChange = (field: string, value: string | string[]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }

    // Reset LGA when state changes
    if (field === "state") {
      setForm((prev) => ({ ...prev, lga: "" }));
    }

    // Reset subjects when exam type changes
    if (field === "examType") {
      setForm((prev) => ({ ...prev, subjects: [] }));
    }
  };

  // Get available LGAs based on selected state
  const getAvailableLGAs = () => {
    if (!form.state) return [];
    return (
      NIGERIAN_STATES_AND_LGAS[
        form.state as keyof typeof NIGERIAN_STATES_AND_LGAS
      ] || []
    );
  };

  const handleSubjectToggle = (subject: string) => {
    const currentSubjects = form.subjects;

    if (currentSubjects.includes(subject)) {
      handleChange(
        "subjects",
        currentSubjects.filter((s) => s !== subject)
      );
    } else {
      if (currentSubjects.length < 5) {
        handleChange("subjects", [...currentSubjects, subject]);
      } else {
        Alert.alert("Subject Limit", "You can only select maximum 5 subjects");
      }
    }
  };

  const verifyEmail = async () => {
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    // TODO: Implement actual email verification with backend
    // For now, simulate verification
    Alert.alert(
      "Email Verification",
      "A verification code has been sent to your email. Please check and confirm.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Verified",
          onPress: () => {
            setEmailVerified(true);
            Alert.alert("Success", "Email verified successfully!");
          },
        },
      ]
    );
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Other validations
    if (!form.surname) newErrors.surname = "Surname is required";
    if (!form.firstname) newErrors.firstname = "First name is required";
    if (!form.phone) newErrors.phone = "Phone number is required";
    if (!form.address) newErrors.address = "Address is required";
    if (!form.houseNumber) newErrors.houseNumber = "House number is required";
    if (!form.lga) newErrors.lga = "LGA is required";
    if (!form.state) newErrors.state = "State is required";
    if (!form.examType) newErrors.examType = "Exam type is required";
    if (form.subjects.length === 0)
      newErrors.subjects = "Please select at least 1 subject";
    if (form.subjects.length > 5)
      newErrors.subjects = "Maximum 5 subjects allowed";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegistration = async () => {
    if (!validateForm()) {
      Alert.alert("Error", "Please fill in all required fields correctly");
      return;
    }

    setLoading(true);

    try {
      // Generate username from name
      const username = apiService.generateUsername(
        form.surname,
        form.firstname
      );

      // Prepare registration data for API
      const registrationData = {
        username,
        email: form.email,
        password: form.password,
        role: "student" as const,
      };

      // Call registration API
      const response = await apiService.register(registrationData);

      // Store the token (you might want to use AsyncStorage or SecureStore)
      // await AsyncStorage.setItem('authToken', response.token);

      // Store additional user data locally for later profile update
      const additionalData = {
        surname: form.surname,
        firstname: form.firstname,
        phone: form.phone,
        gender: form.gender,
        address: form.address,
        houseNumber: form.houseNumber,
        lga: form.lga,
        state: form.state,
        subjects: form.subjects,
        examType: form.examType,
      };

      // Navigate with consistent parameters
      router.push({
        pathname: "/register/payment-info",
        params: {
          registrationType: "user",
          examType: form.examType,
          userDetails: JSON.stringify({
            ...additionalData,
            userId: response.user.id,
            username: response.user.username,
            email: response.user.email,
          }),
          authToken: response.token,
        },
      });

      Alert.alert(
        "Success",
        "Registration successful! Please proceed to payment."
      );
    } catch (error) {
      const apiError = error as ApiError & { status?: number };

      if (apiError.status === 400 && apiError.errors) {
        // Handle validation errors from backend
        const backendErrors: Record<string, string> = {};
        Object.entries(apiError.errors).forEach(([field, messages]) => {
          backendErrors[field] = messages[0]; // Take first error message
        });
        setErrors(backendErrors);
      } else {
        Alert.alert(
          "Registration Failed",
          apiError.message || "An error occurred during registration"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const getEstimatedPrice = (): number => {
    return PricingCalculator.calculateUserPrice(form.examType);
  };

  return (
    <ScrollView
      className="flex-1 bg-gray-50 p-4"
      showsVerticalScrollIndicator={false}
    >
      <View className="bg-white rounded-lg shadow-sm">
        {/* Header */}
        <View className="flex-row bg-blue-600 p-4 rounded-t-lg">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Text className="text-white text-xl font-bold">←</Text>
          </TouchableOpacity>
          <View className="flex-column">
            <Text className="text-xl font-bold text-white">
              New User Registration
            </Text>
            <Text className="text-blue-100">FILLOP CBT GURU</Text>
          </View>
        </View>

        <View className="p-4">
          {/* Price Banner */}
          <View className="bg-green-50 border-2 border-green-200 rounded-lg p-3 mb-6">
            <Text className="text-green-800 font-bold text-center">
              Registration Fee:{" "}
              {PricingCalculator.formatCurrency(getEstimatedPrice())}
            </Text>
            <Text className="text-green-600 text-center text-sm">
              One-time payment for {form.examType} access
            </Text>
          </View>

          {/* Email and Password Section */}
          <View className="mb-6">
            <Text className="text-lg font-semibold mb-3 text-gray-800 border-b border-gray-200 pb-2">
              Account Information
            </Text>

            <TextInput
              placeholder="Email Address *"
              className={`border p-3 rounded-lg mb-3 text-sm ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              keyboardType="email-address"
              autoCapitalize="none"
              value={form.email}
              onChangeText={(text) => handleChange("email", text)}
            />
            {errors.email && (
              <Text className="text-red-500 text-xs mb-2">{errors.email}</Text>
            )}

            <TextInput
              placeholder="Password (minimum 6 characters) *"
              className={`border p-3 rounded-lg mb-3 text-sm ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              secureTextEntry
              value={form.password}
              onChangeText={(text) => handleChange("password", text)}
            />
            {errors.password && (
              <Text className="text-red-500 text-xs mb-2">
                {errors.password}
              </Text>
            )}

            <TextInput
              placeholder="Confirm Password *"
              className={`border p-3 rounded-lg mb-3 text-sm ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              }`}
              secureTextEntry
              value={form.confirmPassword}
              onChangeText={(text) => handleChange("confirmPassword", text)}
            />
            {errors.confirmPassword && (
              <Text className="text-red-500 text-xs mb-2">
                {errors.confirmPassword}
              </Text>
            )}
          </View>

          {/* Personal Information */}
          <View className="mb-6">
            <Text className="text-lg font-semibold mb-3 text-gray-800 border-b border-gray-200 pb-2">
              Personal Information
            </Text>

            {/* Name Row */}
            <View className="flex-row gap-2 mb-3">
              <View className="flex-1">
                <TextInput
                  placeholder="Surname *"
                  className={`border p-3 rounded-lg text-sm ${
                    errors.surname ? "border-red-500" : "border-gray-300"
                  }`}
                  value={form.surname}
                  onChangeText={(text) => handleChange("surname", text)}
                />
                {errors.surname && (
                  <Text className="text-red-500 text-xs mt-1">
                    {errors.surname}
                  </Text>
                )}
              </View>
              <View className="flex-1">
                <TextInput
                  placeholder="First Name *"
                  className={`border p-3 rounded-lg text-sm ${
                    errors.firstname ? "border-red-500" : "border-gray-300"
                  }`}
                  value={form.firstname}
                  onChangeText={(text) => handleChange("firstname", text)}
                />
                {errors.firstname && (
                  <Text className="text-red-500 text-xs mt-1">
                    {errors.firstname}
                  </Text>
                )}
              </View>
            </View>

            <TextInput
              placeholder="Phone Number *"
              className={`border p-3 rounded-lg mb-3 text-sm ${
                errors.phone ? "border-red-500" : "border-gray-300"
              }`}
              keyboardType="phone-pad"
              value={form.phone}
              onChangeText={(text) => handleChange("phone", text)}
            />
            {errors.phone && (
              <Text className="text-red-500 text-xs mb-2">{errors.phone}</Text>
            )}

            {/* Gender Selection */}
            <View className="mb-3">
              <Text className="text-sm font-medium mb-2">Gender *</Text>
              <View className="flex-row gap-2">
                {["Male", "Female"].map((gender) => (
                  <TouchableOpacity
                    key={gender}
                    className={`flex-1 p-3 rounded-lg border ${
                      form.gender === gender
                        ? "bg-blue-500 border-blue-500"
                        : "bg-white border-gray-300"
                    }`}
                    onPress={() =>
                      handleChange("gender", gender as "Male" | "Female")
                    }
                  >
                    <Text
                      className={`text-center text-sm ${
                        form.gender === gender ? "text-white" : "text-gray-600"
                      }`}
                    >
                      {gender}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Address Information */}
          <View className="mb-6">
            <Text className="text-lg font-semibold mb-3 text-gray-800 border-b border-gray-200 pb-2">
              Address Information
            </Text>

            <View className="flex-row gap-2 mb-3">
              <View className="flex-2">
                <TextInput
                  placeholder="House Number *"
                  className={`border p-3 rounded-lg text-sm ${
                    errors.houseNumber ? "border-red-500" : "border-gray-300"
                  }`}
                  value={form.houseNumber}
                  onChangeText={(text) => handleChange("houseNumber", text)}
                />
                {errors.houseNumber && (
                  <Text className="text-red-500 text-xs mt-1">
                    {errors.houseNumber}
                  </Text>
                )}
              </View>
              <View className="flex-1">
                <TextInput
                  placeholder="Street Address *"
                  className={`border p-3 rounded-lg text-sm ${
                    errors.address ? "border-red-500" : "border-gray-300"
                  }`}
                  value={form.address}
                  onChangeText={(text) => handleChange("address", text)}
                />
                {errors.address && (
                  <Text className="text-red-500 text-xs mt-1">
                    {errors.address}
                  </Text>
                )}
              </View>
            </View>

            {/* State and LGA */}
            <View className="flex-row gap-2 mb-3" style={{ zIndex: 999 }}>
              <View className="flex-1">
                <Dropdown
                  label="State"
                  options={NIGERIAN_STATES}
                  selectedValue={form.state}
                  onSelect={(value) => handleChange("state", value)}
                  placeholder="Select state"
                  required
                  borderColor="border-blue-500"
                />
                {errors.state && (
                  <Text className="text-red-500 text-xs mt-1">
                    {errors.state}
                  </Text>
                )}
              </View>
              <View className="flex-1">
                <Dropdown
                  label="LGA"
                  options={getAvailableLGAs()}
                  selectedValue={form.lga}
                  onSelect={(value) => handleChange("lga", value)}
                  placeholder={form.state ? "Select LGA" : "Select state first"}
                  disabled={!form.state}
                  required
                  borderColor="border-blue-500"
                />
                {errors.lga && (
                  <Text className="text-red-500 text-xs mt-1">
                    {errors.lga}
                  </Text>
                )}
              </View>
            </View>
          </View>

          {/* Passport Photo */}
          <View className="mb-6">
            <Text className="text-lg font-semibold mb-3 text-gray-800 border-b border-gray-200 pb-2">
              Passport Photo
            </Text>
            <TouchableOpacity className="border-2 border-dashed border-gray-300 p-6 rounded-lg items-center">
              <Text className="text-gray-500 text-sm mb-1">
                Tap to upload photo
              </Text>
              <Text className="text-xs text-gray-400">
                {form.gender === "Male"
                  ? "Default male image"
                  : "Default female image"}{" "}
                will be used if not provided
              </Text>
            </TouchableOpacity>
          </View>

          {/* Exam Selection */}
          <View className="mb-6">
            <Text className="text-lg font-semibold mb-3 text-gray-800 border-b border-gray-200 pb-2">
              Exam Information
            </Text>

            <Text className="text-sm font-medium mb-2">Select Exam Type *</Text>
            <View className="flex-row gap-2 mb-4">
              {EXAM_TYPES.map((exam) => (
                <TouchableOpacity
                  key={exam}
                  className={`flex-1 p-3 rounded-lg border ${
                    form.examType === exam
                      ? "bg-green-500 border-green-500"
                      : "bg-white border-gray-300"
                  }`}
                  onPress={() => handleChange("examType", exam)}
                >
                  <Text
                    className={`text-center text-sm ${
                      form.examType === exam ? "text-white" : "text-gray-600"
                    }`}
                  >
                    {exam}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.examType && (
              <Text className="text-red-500 text-xs mb-2">
                {errors.examType}
              </Text>
            )}

            {/* Subject Selection */}
            <Text className="text-sm font-medium mb-2">
              Select Subjects * (Maximum 5)
            </Text>
            <Text className="text-xs text-blue-600 mb-2">
              Selected: {form.subjects.length}/5
            </Text>

            {form.subjects.length > 0 && (
              <View className="flex-row flex-wrap gap-1 mb-3 p-2 bg-blue-50 rounded-lg">
                {form.subjects.map((subject) => (
                  <View
                    key={subject}
                    className="bg-blue-500 px-2 py-1 rounded-full flex-row items-center"
                  >
                    <Text className="text-white text-xs">{subject}</Text>
                    <TouchableOpacity
                      onPress={() => handleSubjectToggle(subject)}
                      className="ml-2 bg-blue-700 rounded-full w-4 h-4 items-center justify-center"
                    >
                      <Text className="text-white text-xs">×</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            <View className="border border-gray-300 rounded-lg max-h-48">
              <ScrollView className="p-2">
                <View className="flex-row flex-wrap gap-1">
                  {ALL_SUBJECTS.map((subject) => (
                    <TouchableOpacity
                      key={subject}
                      className={`px-3 py-2 rounded-full border m-1 ${
                        form.subjects.includes(subject)
                          ? "bg-blue-500 border-blue-500"
                          : "bg-white border-gray-300"
                      }`}
                      onPress={() => handleSubjectToggle(subject)}
                    >
                      <Text
                        className={`text-xs ${
                          form.subjects.includes(subject)
                            ? "text-white"
                            : "text-gray-600"
                        }`}
                      >
                        {subject}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
            {errors.subjects && (
              <Text className="text-red-500 text-xs mt-2">
                {errors.subjects}
              </Text>
            )}
          </View>

          {/* Submit Button */}
          <View className="mb-6">
            <Button
              title={
                loading
                  ? "Creating Account..."
                  : "Register & Continue to Payment"
              }
              onPress={handleRegistration}
              className={`${loading ? "bg-gray-400" : "bg-blue-600"} mb-3`}
              disabled={loading}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
