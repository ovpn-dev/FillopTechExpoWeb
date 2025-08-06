// app/register/corporate.tsx
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
import Button from "./../components/Button";
import Dropdown from "./../components/Dropdown";

const SUBSCRIPTION_PLANS = [
  { id: "5", name: "5 Students Plan", price: 15000, duration: "1 Year" },
  { id: "10", name: "10 Students Plan", price: 25000, duration: "1 Year" },
  { id: "20", name: "20 Students Plan", price: 45000, duration: "1 Year" },
  { id: "50", name: "50 Students Plan", price: 100000, duration: "1 Year" },
  { id: "100", name: "100 Students Plan", price: 180000, duration: "1 Year" },
  {
    id: "unlimited",
    name: "Unlimited Plan",
    price: 300000,
    duration: "1 Year",
  },
];

const INSTITUTION_TYPES = [
  "Secondary School",
  "Tertiary Institution",
  "Tutorial Center",
  "Training Institute",
  "Other",
];
const EXAM_TYPES = ["JAMB UTME", "WAEC", "NECO", "All Exams"];

export default function CorporateRegistration() {
  const router = useRouter();

  const [mode, setMode] = useState<"new" | "activate" | null>(null);
  const [form, setForm] = useState({
    email: "",
    companyName: "",
    companyType: "",
    rcNumber: "",
    phone: "",
    alternativePhone: "",
    address: "",
    lga: "",
    state: "",
    logo: "",
    plan: "",
    activationCode: "",
    contactPersonName: "",
    contactPersonRole: "",
    website: "",
    yearsOfOperation: "",
    numberOfStudents: "",
    preferredExamTypes: [] as string[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string | string[]) => {
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Invalid email format";

    if (!form.companyName) newErrors.companyName = "Company name is required";
    if (!form.companyType) newErrors.companyType = "Company type is required";
    if (!form.phone) newErrors.phone = "Phone number is required";
    if (!form.address) newErrors.address = "Address is required";
    if (!form.lga) newErrors.lga = "LGA is required";
    if (!form.state) newErrors.state = "State is required";
    if (!form.plan) newErrors.plan = "Subscription plan is required";
    if (!form.contactPersonName)
      newErrors.contactPersonName = "Contact person name is required";
    if (!form.contactPersonRole)
      newErrors.contactPersonRole = "Contact person role is required";
    if (!form.numberOfStudents)
      newErrors.numberOfStudents = "Expected number of students is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleActivation = async () => {
    if (!form.activationCode.trim()) {
      Alert.alert("Error", "Please enter activation code");
      return;
    }

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (form.activationCode.length < 6) {
        Alert.alert("Error", "Invalid activation code");
        return;
      }

      router.push("/dashboard");
    } catch (error) {
      Alert.alert("Error", "Failed to activate account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegistration = async () => {
    if (!validateForm()) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Registration data:", form);
      router.push("/payment-info");
    } catch (error) {
      Alert.alert("Error", "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getSelectedPlan = () => {
    return SUBSCRIPTION_PLANS.find((plan) => plan.id === form.plan);
  };

  if (!mode) {
    return (
      <View className="flex-1 bg-white p-6 justify-center">
        <View className="flex-row bg-blue-50 p-6 rounded-lg mb-10 ">
          {/* Back Button */}
          <TouchableOpacity onPress={onBack} className="mr-4">
            <Text className="text-blue-800 text-xl font-bold">◀</Text>
          </TouchableOpacity>
          <View className="flex-column">
            <Text className="text-2xl font-bold text-blue-800 mb-2">
              FILLOP CBT GURU
            </Text>
            <Text className="text-blue-600 mb-4">
              Professional JAMB/WAEC CBT Software
            </Text>
            <Text className="text-gray-600">
              Choose your registration option below to get started with our
              comprehensive Computer-Based Test platform for educational
              institutions.
            </Text>
          </View>
        </View>

        <Text className="text-xl font-bold mb-6 text-center">
          Corporate Registration Options
        </Text>

        <Button
          title="New School/Institution Registration"
          onPress={() => setMode("new")}
          className="mb-4 bg-blue-600"
        />
        <Button
          title="I Have an Activation Code"
          onPress={() => setMode("activate")}
          className="bg-green-600"
        />

        <Text className="text-sm text-gray-500 text-center mt-6">
          For support, contact: support@fillop.com
        </Text>
      </View>
    );
  }

  if (mode === "activate") {
    return (
      <View className="flex-1 bg-white p-6 justify-center">
        <View className="bg-green-50 p-4 rounded-lg mb-6">
          <Text className="text-xl font-bold mb-2 text-green-800">
            Account Activation
          </Text>
          <Text className="text-green-600">
            Enter the activation code provided by your administrator
          </Text>
        </View>

        <TextInput
          placeholder="Enter 12-digit Activation Code"
          className="border border-gray-300 p-4 rounded-lg mb-4 text-center text-lg"
          value={form.activationCode}
          onChangeText={(text) =>
            handleChange("activationCode", text.toUpperCase())
          }
          maxLength={12}
          autoCapitalize="characters"
        />

        <Button
          title={loading ? "Activating..." : "Activate Account"}
          onPress={handleActivation}
          className={loading ? "bg-gray-400" : "bg-green-600"}
        />

        <Button
          title="Back to Options"
          onPress={() => setMode(null)}
          className="mt-4 bg-gray-500"
        />
      </View>
    );
  }

  function onBack() {
    setMode(null);
  }

  return (
    <ScrollView
      className="flex-1 bg-gray-50 p-4"
      showsVerticalScrollIndicator={false}
    >
      <View className="bg-white rounded-lg shadow-sm">
        {/* Header */}
        <View className=" flex-row bg-blue-600 p-4 rounded-t-lg">
          {/* Back Button */}
          <TouchableOpacity onPress={onBack} className="mr-4">
            <Text className="text-white text-xl font-bold">◀</Text>
          </TouchableOpacity>
          <View className="flex-column">
            <Text className="text-xl font-bold text-white">
              Corporate Registration
            </Text>
            <Text className="text-blue-100">
              Register your institution for FILLOP CBT GURU
            </Text>
          </View>
        </View>

        <View className="p-4">
          {/* Company Information */}
          <View className="mb-6">
            <Text className="text-lg font-semibold mb-3 text-gray-800 border-b border-gray-200 pb-2">
              🏢 Institution Details
            </Text>

            {/* Email and Company Name */}
            <TextInput
              placeholder="Institution Email *"
              className={`border p-3 rounded-lg mb-3 text-sm ${errors.email ? "border-red-500" : "border-gray-300"}`}
              value={form.email}
              onChangeText={(text) => handleChange("email", text)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email && (
              <Text className="text-red-500 text-xs mb-2">{errors.email}</Text>
            )}

            <TextInput
              placeholder="Institution Name *"
              className={`border p-3 rounded-lg mb-3 text-sm ${errors.companyName ? "border-red-500" : "border-gray-300"}`}
              value={form.companyName}
              onChangeText={(text) => handleChange("companyName", text)}
            />
            {errors.companyName && (
              <Text className="text-red-500 text-xs mb-2">
                {errors.companyName}
              </Text>
            )}

            {/* Institution Type Dropdown */}
            <View style={{ zIndex: 999 }}>
              <Dropdown
                label="Institution Type"
                options={INSTITUTION_TYPES}
                selectedValue={form.companyType}
                onSelect={(value) => handleChange("companyType", value)}
                placeholder="Select institution type"
                required
                className="mb-3"
              />
              {errors.companyType && (
                <Text className="text-red-500 text-xs mb-2">
                  {errors.companyType}
                </Text>
              )}
            </View>

            <TextInput
              placeholder="RC Number (Optional)"
              className="border border-gray-300 p-3 rounded-lg mb-3 text-sm"
              value={form.rcNumber}
              onChangeText={(text) => handleChange("rcNumber", text)}
            />

            {/* Phone Numbers Row */}
            <View className="flex-row gap-2 mb-3">
              <View className="flex-1">
                <TextInput
                  placeholder="Primary Phone *"
                  className={`border p-3 rounded-lg text-sm ${errors.phone ? "border-red-500" : "border-gray-300"}`}
                  value={form.phone}
                  onChangeText={(text) => handleChange("phone", text)}
                  keyboardType="phone-pad"
                />
                {errors.phone && (
                  <Text className="text-red-500 text-xs mt-1">
                    {errors.phone}
                  </Text>
                )}
              </View>
              <View className="flex-1">
                <TextInput
                  placeholder="Alt. Phone"
                  className="border border-gray-300 p-3 rounded-lg text-sm"
                  value={form.alternativePhone}
                  onChangeText={(text) =>
                    handleChange("alternativePhone", text)
                  }
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            {/* Address */}
            <TextInput
              placeholder="Institution Address *"
              className={`border p-3 rounded-lg mb-3 text-sm ${errors.address ? "border-red-500" : "border-gray-300"}`}
              value={form.address}
              onChangeText={(text) => handleChange("address", text)}
              multiline
              numberOfLines={2}
            />
            {errors.address && (
              <Text className="text-red-500 text-xs mb-2">
                {errors.address}
              </Text>
            )}

            {/* State and LGA Dropdowns */}
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

            {/* Website and Years Row */}
            <View className="flex-row gap-2 mb-3">
              <View className="flex-2">
                <TextInput
                  placeholder="Website (Optional)"
                  className="border border-gray-300 p-3 rounded-lg text-sm"
                  value={form.website}
                  onChangeText={(text) => handleChange("website", text)}
                  autoCapitalize="none"
                />
              </View>
              <View className="flex-1">
                <TextInput
                  placeholder="Years Active"
                  className="border border-gray-300 p-3 rounded-lg text-sm"
                  value={form.yearsOfOperation}
                  onChangeText={(text) =>
                    handleChange("yearsOfOperation", text)
                  }
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          {/* Contact Person */}
          <View className="mb-6">
            <Text className="text-lg font-semibold mb-3 text-gray-800 border-b border-gray-200 pb-2">
              👤 Contact Person
            </Text>

            <View className="flex-row gap-2 mb-3">
              <View className="flex-2">
                <TextInput
                  placeholder="Contact Person Name *"
                  className={`border p-3 rounded-lg text-sm ${errors.contactPersonName ? "border-red-500" : "border-gray-300"}`}
                  value={form.contactPersonName}
                  onChangeText={(text) =>
                    handleChange("contactPersonName", text)
                  }
                />
                {errors.contactPersonName && (
                  <Text className="text-red-500 text-xs mt-1">
                    {errors.contactPersonName}
                  </Text>
                )}
              </View>
              <View className="flex-1">
                <TextInput
                  placeholder="Role/Position *"
                  className={`border p-3 rounded-lg text-sm ${errors.contactPersonRole ? "border-red-500" : "border-gray-300"}`}
                  value={form.contactPersonRole}
                  onChangeText={(text) =>
                    handleChange("contactPersonRole", text)
                  }
                />
                {errors.contactPersonRole && (
                  <Text className="text-red-500 text-xs mt-1">
                    {errors.contactPersonRole}
                  </Text>
                )}
              </View>
            </View>
          </View>

          {/* Subscription Plan */}
          <View className="mb-6">
            <Text className="text-lg font-semibold mb-3 text-gray-800 border-b border-gray-200 pb-2">
              📋 Subscription Plan
            </Text>

            <TextInput
              placeholder="Expected Number of Students *"
              className={`border p-3 rounded-lg mb-3 text-sm ${errors.numberOfStudents ? "border-red-500" : "border-gray-300"}`}
              value={form.numberOfStudents}
              onChangeText={(text) => handleChange("numberOfStudents", text)}
              keyboardType="numeric"
            />
            {errors.numberOfStudents && (
              <Text className="text-red-500 text-xs mb-2">
                {errors.numberOfStudents}
              </Text>
            )}

            <Text className="text-sm font-medium mb-2">Select Plan *</Text>
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
          </View>

          {/* Exam Types */}
          <View className="mb-6">
            <Text className="text-lg font-semibold mb-3 text-gray-800 border-b border-gray-200 pb-2">
              📝 Preferred Exam Types
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {EXAM_TYPES.map((exam) => (
                <TouchableOpacity
                  key={exam}
                  className={`px-3 py-2 rounded-full border ${
                    form.preferredExamTypes.includes(exam)
                      ? "bg-blue-500 border-blue-500"
                      : "bg-white border-gray-300"
                  }`}
                  onPress={() => {
                    const current = form.preferredExamTypes;
                    if (current.includes(exam)) {
                      handleChange(
                        "preferredExamTypes",
                        current.filter((e) => e !== exam)
                      );
                    } else {
                      handleChange("preferredExamTypes", [...current, exam]);
                    }
                  }}
                >
                  <Text
                    className={`text-sm ${
                      form.preferredExamTypes.includes(exam)
                        ? "text-white"
                        : "text-gray-600"
                    }`}
                  >
                    {exam}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Submit Buttons */}
          <View className="mb-6">
            <Text className="text-xs text-gray-600 mb-4 leading-5">
              By registering, you agree to our Terms of Service and Privacy
              Policy. All intellectual property rights belong to Fillop Tech
              Limited.
            </Text>

            <Button
              title={loading ? "Processing..." : "Continue to Payment"}
              onPress={handleRegistration}
              className={`${loading ? "bg-gray-400" : "bg-blue-600"} mb-3`}
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
