// app/register/corporate.tsx - Updated with API integration
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
import Button from "../../components/Button";
import Dropdown from "../../components/Dropdown";
import {
  NIGERIAN_STATES,
  NIGERIAN_STATES_AND_LGAS,
} from "../../data/nigerianStatesAndLGAs";
import apiService, { ApiError } from "../../services/apiService";

const SUBSCRIPTION_PLANS = [
  { id: "5", name: "5 Students Plan", price: 15000, duration: "1 Year" },
  { id: "10", name: "10 Students Plan", price: 25000, duration: "1 Year" },
  { id: "20", name: "20 Students Plan", price: 45000, duration: "1 Year" },
  { id: "50", name: "50 Students Plan", price: 100000, duration: "1 Year" },
  { id: "100", name: "100 Students Plan", price: 180000, duration: "1 Year" },
];

export default function CorporateRegistration() {
  const router = useRouter();

  const [mode, setMode] = useState<"new" | "activate" | null>(null);
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    contactPhone: "",
    address: "",
    lga: "",
    state: "",
    logo: "",
    plan: "",
    activationCode: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }

    // Reset LGA when state changes
    if (field === "state") {
      setForm((prev) => ({ ...prev, lga: "" }));
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

  const handleActivation = async () => {
    if (!form.activationCode.trim()) {
      Alert.alert("Error", "Please enter activation code");
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement actual activation API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (form.activationCode.length < 6) {
        Alert.alert("Error", "This passcode is incorrect");
        return;
      }

      Alert.alert("Congratulations!", "CBT Guru is successfully activated", [
        {
          text: "Continue",
          onPress: () => router.push("/cbtApp"),
        },
      ]);
    } catch (error) {
      Alert.alert("Error", "This passcode is incorrect");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
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
    if (!form.companyName) newErrors.companyName = "Company name is required";
    if (!form.contactPhone)
      newErrors.contactPhone = "Contact phone is required";
    if (!form.address) newErrors.address = "Company address is required";
    if (!form.lga) newErrors.lga = "LGA is required";
    if (!form.state) newErrors.state = "State is required";
    if (!form.plan) newErrors.plan = "Plan selection is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegistration = async () => {
    if (!validateForm()) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      // Generate username from company name
      const username =
        form.companyName
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "")
          .substring(0, 15) + Math.floor(Math.random() * 1000);

      // Prepare registration data for API
      const registrationData = {
        username,
        email: form.email,
        password: form.password,
        role: "corporate" as const,
      };

      // Call registration API
      const response = await apiService.register(registrationData);

      // Store additional corporate data locally for later profile update
      const additionalData = {
        companyName: form.companyName,
        contactPhone: form.contactPhone,
        address: form.address,
        lga: form.lga,
        state: form.state,
        plan: form.plan,
      };

      // Navigate to payment with updated parameters
      router.push({
        pathname: "/register/payment-info",
        params: {
          registrationType: "corporate",
          planId: form.plan,
          corporateDetails: JSON.stringify({
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

  const getSelectedPlan = () => {
    return SUBSCRIPTION_PLANS.find((plan) => plan.id === form.plan);
  };

  const onBack = () => {
    if (mode) {
      setMode(null);
    } else {
      router.back();
    }
  };

  if (!mode) {
    return (
      <View className="flex-1 bg-white p-6 justify-center">
        <View className="flex-row bg-blue-50 p-6 rounded-lg mb-10">
          <TouchableOpacity onPress={onBack} className="mr-4">
            <Text className="text-blue-800 text-xl font-bold">←</Text>
          </TouchableOpacity>
          <View className="flex-column">
            <Text className="text-2xl font-bold text-blue-800 mb-2">
              FILLOP CBT GURU
            </Text>
            <Text className="text-blue-600 mb-4">Corporate Registration</Text>
            <Text className="text-gray-600">
              Choose your option below to get started
            </Text>
          </View>
        </View>

        <Text className="text-xl font-bold mb-6 text-center">
          Corporate (multiple user)
        </Text>

        <Button
          title="New Registration"
          onPress={() => setMode("new")}
          className="mb-4 bg-blue-600"
        />
        <Button
          title="Activated User"
          onPress={() => setMode("activate")}
          className="bg-green-600"
        />

        <Text className="text-sm text-gray-500 text-center mt-6">
          For support, contact: filloptech@gmail.com
        </Text>
      </View>
    );
  }

  if (mode === "activate") {
    return (
      <View className="flex-1 bg-white p-6 justify-center">
        <View className="flex-row bg-green-50 p-4 rounded-lg mb-6">
          <TouchableOpacity onPress={onBack} className="mr-4">
            <Text className="text-green-800 text-xl font-bold">←</Text>
          </TouchableOpacity>
          <View className="flex-column">
            <Text className="text-xl font-bold mb-2 text-green-800">
              Activated User
            </Text>
            <Text className="text-green-600">
              Enter the passcode provided by your administrator
            </Text>
          </View>
        </View>

        <TextInput
          placeholder="Enter passcode"
          className="border border-gray-300 p-4 rounded-lg mb-4 text-center text-lg"
          value={form.activationCode}
          onChangeText={(text) => handleChange("activationCode", text)}
          maxLength={20}
        />

        <Button
          title={loading ? "Activating..." : "ACTIVATE"}
          onPress={handleActivation}
          className={loading ? "bg-gray-400" : "bg-green-600"}
          disabled={loading}
        />

        <Button
          title="Back to Options"
          onPress={() => setMode(null)}
          className="mt-4 bg-gray-500"
        />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-gray-50 p-4"
      showsVerticalScrollIndicator={false}
    >
      <View className="bg-white rounded-lg shadow-sm">
        {/* Header */}
        <View className="flex-row bg-blue-600 p-4 rounded-t-lg">
          <TouchableOpacity onPress={onBack} className="mr-4">
            <Text className="text-white text-xl font-bold">←</Text>
          </TouchableOpacity>
          <View className="flex-column">
            <Text className="text-xl font-bold text-white">
              New Registration
            </Text>
            <Text className="text-blue-100">
              Register your institution for FILLOP CBT GURU
            </Text>
          </View>
        </View>

        <View className="p-4">
          {/* Account Information */}
          <View className="mb-6">
            <Text className="text-lg font-semibold mb-3 text-gray-800 border-b border-gray-200 pb-2">
              Account Information
            </Text>

            <TextInput
              placeholder="Institution Email Address *"
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

          {/* Company Information */}
          <View className="mb-6">
            <Text className="text-lg font-semibold mb-3 text-gray-800 border-b border-gray-200 pb-2">
              Company Information
            </Text>

            <TextInput
              placeholder="Company or Corporate Name *"
              className={`border p-3 rounded-lg mb-3 text-sm ${
                errors.companyName ? "border-red-500" : "border-gray-300"
              }`}
              value={form.companyName}
              onChangeText={(text) => handleChange("companyName", text)}
            />
            {errors.companyName && (
              <Text className="text-red-500 text-xs mb-2">
                {errors.companyName}
              </Text>
            )}

            <TextInput
              placeholder="Contact Phone Number *"
              className={`border p-3 rounded-lg mb-3 text-sm ${
                errors.contactPhone ? "border-red-500" : "border-gray-300"
              }`}
              keyboardType="phone-pad"
              value={form.contactPhone}
              onChangeText={(text) => handleChange("contactPhone", text)}
            />
            {errors.contactPhone && (
              <Text className="text-red-500 text-xs mb-2">
                {errors.contactPhone}
              </Text>
            )}

            <TextInput
              placeholder="Company Address *"
              className={`border p-3 rounded-lg mb-3 text-sm ${
                errors.address ? "border-red-500" : "border-gray-300"
              }`}
              multiline
              numberOfLines={2}
              value={form.address}
              onChangeText={(text) => handleChange("address", text)}
            />
            {errors.address && (
              <Text className="text-red-500 text-xs mb-2">
                {errors.address}
              </Text>
            )}

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

          {/* Company Logo */}
          <View className="mb-6">
            <Text className="text-lg font-semibold mb-3 text-gray-800 border-b border-gray-200 pb-2">
              Company Logo
            </Text>
            <TouchableOpacity className="border-2 border-dashed border-gray-300 p-6 rounded-lg items-center">
              <Text className="text-gray-500 text-sm mb-1">
                Tap to upload logo
              </Text>
              <Text className="text-xs text-gray-400">
                Default photo will be used if not provided
              </Text>
            </TouchableOpacity>
          </View>

          {/* Plan Selection */}
          <View className="mb-6">
            <Text className="text-lg font-semibold mb-3 text-gray-800 border-b border-gray-200 pb-2">
              Select Plan
            </Text>

            <Text className="text-sm font-medium mb-2">
              Choose your subscription plan *
            </Text>
            <View className="gap-2">
              {SUBSCRIPTION_PLANS.map((plan) => (
                <TouchableOpacity
                  key={plan.id}
                  className={`border p-3 rounded-lg flex-row justify-between items-center ${
                    form.plan === plan.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 bg-white"
                  }`}
                  onPress={() => handleChange("plan", plan.id)}
                >
                  <View>
                    <Text className="font-semibold text-sm">{plan.name}</Text>
                    <Text className="text-gray-600 text-xs">
                      {plan.duration}
                    </Text>
                  </View>
                  <Text className="font-bold text-blue-600 text-sm">
                    ₦{plan.price.toLocaleString()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.plan && (
              <Text className="text-red-500 text-xs mt-2">{errors.plan}</Text>
            )}
          </View>

          {/* Selected Plan Summary */}
          {getSelectedPlan() && (
            <View className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-6">
              <Text className="text-green-800 font-bold text-center mb-2">
                Selected Plan Summary
              </Text>
              <Text className="text-green-700 text-center">
                Plan: {getSelectedPlan()?.name}
              </Text>
              <Text className="text-green-700 text-center">
                Price: ₦{getSelectedPlan()?.price.toLocaleString()}
              </Text>
              <Text className="text-green-700 text-center">
                Duration: {getSelectedPlan()?.duration}
              </Text>
            </View>
          )}

          {/* Submit Button */}
          <View className="mb-6">
            <Text className="text-xs text-gray-600 mb-4 leading-5">
              By registering, you agree to our Terms of Service and Privacy
              Policy.
            </Text>

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

            <Button
              title="Back to Options"
              onPress={() => setMode(null)}
              className="bg-gray-500"
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
