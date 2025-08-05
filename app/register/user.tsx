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

const JAMB_SUBJECTS = [
  "English Language",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Agricultural Science",
  "Economics",
  "Government",
  "Literature in English",
  "History",
  "Geography",
  "Christian Religious Studies",
  "Islamic Religious Studies",
  "Hausa",
  "Igbo",
  "Yoruba",
  "French",
  "Arabic",
  "Fine Arts",
  "Music",
];

const WAEC_SUBJECTS = [
  "English Language",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Further Mathematics",
  "Agricultural Science",
  "Economics",
  "Government",
  "Literature in English",
  "History",
  "Geography",
  "Christian Religious Studies",
  "Islamic Religious Studies",
  "Commerce",
  "Accounting",
  "Book Keeping",
  "Marketing",
  "Office Practice",
  "Data Processing",
  "Technical Drawing",
  "Building Construction",
  "Metal Work",
  "Wood Work",
  "Auto Mechanics",
  "Electrical Installation",
  "Electronics",
  "Applied Electricity",
  "Home Economics",
  "Food and Nutrition",
  "Clothing and Textiles",
  "Fine Arts",
  "Music",
  "Physical Education",
  "Health Education",
];

const CLASS_LEVELS = [
  "SS1",
  "SS2",
  "SS3",
  "Graduate",
  "JAMB Candidate",
  "WAEC Candidate",
];
const EXAM_TYPES = ["JAMB UTME", "WAEC", "NECO", "NABTEB"];

export default function NewUserRegistration() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    surname: "",
    firstname: "",
    middlename: "",
    phone: "",
    parentPhone: "",
    gender: "",
    dateOfBirth: "",
    address: "",
    lga: "",
    state: "",
    nationality: "Nigerian",
    passport: "",
    subjects: [] as string[],
    examType: "",
    schoolName: "",
    classLevel: "",
    previousExamNumber: "",
    disability: "",
    emergencyContact: "",
    emergencyPhone: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showSubjects, setShowSubjects] = useState(false);

  const handleChange = (field: string, value: string | string[]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }

    if (field === "examType" && value) {
      setShowSubjects(true);
      setForm((prev) => ({ ...prev, subjects: [] }));
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

  const handleSubjectToggle = (subject: string) => {
    const currentSubjects = form.subjects;
    const maxSubjects = form.examType === "JAMB UTME" ? 4 : 9;

    if (currentSubjects.includes(subject)) {
      handleChange(
        "subjects",
        currentSubjects.filter((s) => s !== subject)
      );
    } else {
      if (currentSubjects.length < maxSubjects) {
        handleChange("subjects", [...currentSubjects, subject]);
      } else {
        Alert.alert(
          "Subject Limit Reached",
          `You can only select maximum ${maxSubjects} subjects for ${form.examType}`
        );
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Invalid email format";

    if (!form.surname) newErrors.surname = "Surname is required";
    if (!form.firstname) newErrors.firstname = "First name is required";
    if (!form.phone) newErrors.phone = "Phone number is required";
    if (!form.gender) newErrors.gender = "Gender is required";
    if (!form.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    if (!form.address) newErrors.address = "Address is required";
    if (!form.lga) newErrors.lga = "LGA is required";
    if (!form.state) newErrors.state = "State is required";
    if (!form.examType) newErrors.examType = "Exam type is required";
    if (!form.schoolName) newErrors.schoolName = "School name is required";
    if (!form.classLevel) newErrors.classLevel = "Class/Level is required";
    if (!form.emergencyContact)
      newErrors.emergencyContact = "Emergency contact is required";
    if (!form.emergencyPhone)
      newErrors.emergencyPhone = "Emergency phone is required";

    if (form.examType === "JAMB UTME" && form.subjects.length !== 4) {
      newErrors.subjects = "Please select exactly 4 subjects for JAMB UTME";
    } else if (form.examType === "WAEC" && form.subjects.length < 5) {
      newErrors.subjects = "Please select at least 5 subjects for WAEC";
    }

    if (form.examType === "JAMB UTME") {
      if (!form.subjects.includes("English Language")) {
        newErrors.subjects = "English Language is compulsory for JAMB UTME";
      }
      if (!form.subjects.includes("Mathematics")) {
        newErrors.subjects = "Mathematics is compulsory for JAMB UTME";
      }
    }

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
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("User registration data:", form);

      Alert.alert(
        "Registration Successful",
        "Your registration has been submitted successfully. You will be redirected to payment.",
        [{ text: "OK", onPress: () => router.push("/payment-info") }]
      );
    } catch (error) {
      Alert.alert("Error", "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getAvailableSubjects = () => {
    return form.examType === "JAMB UTME" ? JAMB_SUBJECTS : WAEC_SUBJECTS;
  };

  const getRequiredSubjectsText = () => {
    if (form.examType === "JAMB UTME") {
      return "Select exactly 4 subjects (English & Math compulsory)";
    } else if (form.examType === "WAEC") {
      return "Select 5-9 subjects (English & Math recommended)";
    }
    return "";
  };

  function onBack() {
    router.back();
  }
  return (
    <ScrollView
      className="flex-1 bg-gray-50 p-4"
      showsVerticalScrollIndicator={false}
    >
      <View className="bg-white rounded-lg shadow-sm">
        {/* Header */}
        <View className="flex-row bg-blue-600 p-4 rounded-t-lg">
          {/* Back Button */}
          <TouchableOpacity onPress={onBack} className="mr-4">
            <Text className="text-white text-xl font-bold">◀</Text>
          </TouchableOpacity>
          <View className="flex-column">
            <Text className="text-xl font-bold text-white">
              Student Registration
            </Text>
            <Text className="text-blue-100">
              FILLOP CBT GURU - Register for JAMB/WAEC Practice
            </Text>
          </View>
        </View>

        <View className="p-4">
          {/* Personal Information */}
          <View className="mb-6">
            <Text className="text-lg font-semibold mb-3 text-gray-800 border-b border-gray-200 pb-2">
              👤 Personal Information
            </Text>

            {/* Email */}
            <TextInput
              placeholder="Email Address *"
              className={`border p-3 rounded-lg mb-3 text-sm ${errors.email ? "border-red-500" : "border-gray-300"}`}
              keyboardType="email-address"
              autoCapitalize="none"
              value={form.email}
              onChangeText={(text) => handleChange("email", text)}
            />
            {errors.email && (
              <Text className="text-red-500 text-xs mb-2">{errors.email}</Text>
            )}

            {/* Name Row */}
            <View className="flex-row gap-2 mb-3">
              <View className="flex-1">
                <TextInput
                  placeholder="Surname *"
                  className={`border p-3 rounded-lg text-sm ${errors.surname ? "border-red-500" : "border-gray-300"}`}
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
                  className={`border p-3 rounded-lg text-sm ${errors.firstname ? "border-red-500" : "border-gray-300"}`}
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
              placeholder="Middle Name (Optional)"
              className="border border-gray-300 p-3 rounded-lg mb-3 text-sm"
              value={form.middlename}
              onChangeText={(text) => handleChange("middlename", text)}
            />

            {/* Phone Numbers Row */}
            <View className="flex-row gap-2 mb-3">
              <View className="flex-1">
                <TextInput
                  placeholder="Your Phone *"
                  className={`border p-3 rounded-lg text-sm ${errors.phone ? "border-red-500" : "border-gray-300"}`}
                  keyboardType="phone-pad"
                  value={form.phone}
                  onChangeText={(text) => handleChange("phone", text)}
                />
                {errors.phone && (
                  <Text className="text-red-500 text-xs mt-1">
                    {errors.phone}
                  </Text>
                )}
              </View>
              <View className="flex-1">
                <TextInput
                  placeholder="Parent's Phone"
                  className="border border-gray-300 p-3 rounded-lg text-sm"
                  keyboardType="phone-pad"
                  value={form.parentPhone}
                  onChangeText={(text) => handleChange("parentPhone", text)}
                />
              </View>
            </View>

            {/* Gender and DOB Row */}
            <View className="flex-row gap-2 mb-3">
              <View className="flex-1">
                <Text className="text-sm font-medium mb-1">Gender *</Text>
                <View className="flex-row gap-2">
                  {["Male", "Female"].map((gender) => (
                    <TouchableOpacity
                      key={gender}
                      className={`flex-1 p-3 rounded-lg border ${
                        form.gender === gender
                          ? "bg-blue-500 border-blue-500"
                          : "bg-white border-gray-300"
                      }`}
                      onPress={() => handleChange("gender", gender)}
                    >
                      <Text
                        className={`text-center text-sm ${
                          form.gender === gender
                            ? "text-white"
                            : "text-gray-600"
                        }`}
                      >
                        {gender}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {errors.gender && (
                  <Text className="text-red-500 text-xs mt-1">
                    {errors.gender}
                  </Text>
                )}
              </View>
              <View className="flex-1">
                <TextInput
                  placeholder="DOB (DD/MM/YYYY) *"
                  className={`border p-3 rounded-lg text-sm ${errors.dateOfBirth ? "border-red-500" : "border-gray-300"}`}
                  value={form.dateOfBirth}
                  onChangeText={(text) => handleChange("dateOfBirth", text)}
                />
                {errors.dateOfBirth && (
                  <Text className="text-red-500 text-xs mt-1">
                    {errors.dateOfBirth}
                  </Text>
                )}
              </View>
            </View>

            {/* Address */}
            <TextInput
              placeholder="Home Address *"
              className={`border p-3 rounded-lg mb-3 text-sm ${errors.address ? "border-red-500" : "border-gray-300"}`}
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

            {/* Nationality and Disability Row */}
            <View className="flex-row gap-2 mb-3">
              <View className="flex-1">
                <TextInput
                  placeholder="Nationality"
                  className="border border-gray-300 p-3 rounded-lg text-sm"
                  value={form.nationality}
                  onChangeText={(text) => handleChange("nationality", text)}
                />
              </View>
              <View className="flex-1">
                <TextInput
                  placeholder="Disability (Optional)"
                  className="border border-gray-300 p-3 rounded-lg text-sm"
                  value={form.disability}
                  onChangeText={(text) => handleChange("disability", text)}
                />
              </View>
            </View>

            <View className="mb-3">
              <Text className="text-sm font-medium mb-2">Passport Photo *</Text>
              <TouchableOpacity className="border-2 border-dashed border-gray-300 p-4 rounded-lg items-center">
                <Text className="text-gray-500 text-sm">
                  Tap to upload photo
                </Text>
                <Text className="text-xs text-gray-400 mt-1">
                  JPG, PNG (Max 2MB)
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Academic Information */}
          <View className="mb-6">
            <Text className="text-lg font-semibold mb-3 text-gray-800 border-b border-gray-200 pb-2">
              🎓 Academic Information
            </Text>

            <TextInput
              placeholder="Current School Name *"
              className={`border p-3 rounded-lg mb-3 text-sm ${errors.schoolName ? "border-red-500" : "border-gray-300"}`}
              value={form.schoolName}
              onChangeText={(text) => handleChange("schoolName", text)}
            />
            {errors.schoolName && (
              <Text className="text-red-500 text-xs mb-2">
                {errors.schoolName}
              </Text>
            )}

            {/* Class Level and Exam Type Row */}
            <View className="flex-row gap-2 mb-3">
              <View className="flex-1">
                <Text className="text-sm font-medium mb-1">Class/Level *</Text>
                <View className="flex-row flex-wrap gap-1">
                  {CLASS_LEVELS.slice(0, 3).map((level) => (
                    <TouchableOpacity
                      key={level}
                      className={`px-3 py-2 rounded-full border ${
                        form.classLevel === level
                          ? "bg-blue-500 border-blue-500"
                          : "bg-white border-gray-300"
                      }`}
                      onPress={() => handleChange("classLevel", level)}
                    >
                      <Text
                        className={`text-xs ${
                          form.classLevel === level
                            ? "text-white"
                            : "text-gray-600"
                        }`}
                      >
                        {level}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <View className="flex-row flex-wrap gap-1 mt-1">
                  {CLASS_LEVELS.slice(3).map((level) => (
                    <TouchableOpacity
                      key={level}
                      className={`px-3 py-2 rounded-full border ${
                        form.classLevel === level
                          ? "bg-blue-500 border-blue-500"
                          : "bg-white border-gray-300"
                      }`}
                      onPress={() => handleChange("classLevel", level)}
                    >
                      <Text
                        className={`text-xs ${
                          form.classLevel === level
                            ? "text-white"
                            : "text-gray-600"
                        }`}
                      >
                        {level}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {errors.classLevel && (
                  <Text className="text-red-500 text-xs mt-1">
                    {errors.classLevel}
                  </Text>
                )}
              </View>
              <View className="flex-1">
                <Text className="text-sm font-medium mb-1">Exam Type *</Text>
                <View className="flex-row flex-wrap gap-1">
                  {EXAM_TYPES.slice(0, 2).map((exam) => (
                    <TouchableOpacity
                      key={exam}
                      className={`px-3 py-2 rounded-full border ${
                        form.examType === exam
                          ? "bg-green-500 border-green-500"
                          : "bg-white border-gray-300"
                      }`}
                      onPress={() => handleChange("examType", exam)}
                    >
                      <Text
                        className={`text-xs ${
                          form.examType === exam
                            ? "text-white"
                            : "text-gray-600"
                        }`}
                      >
                        {exam}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <View className="flex-row flex-wrap gap-1 mt-1">
                  {EXAM_TYPES.slice(2).map((exam) => (
                    <TouchableOpacity
                      key={exam}
                      className={`px-3 py-2 rounded-full border ${
                        form.examType === exam
                          ? "bg-green-500 border-green-500"
                          : "bg-white border-gray-300"
                      }`}
                      onPress={() => handleChange("examType", exam)}
                    >
                      <Text
                        className={`text-xs ${
                          form.examType === exam
                            ? "text-white"
                            : "text-gray-600"
                        }`}
                      >
                        {exam}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {errors.examType && (
                  <Text className="text-red-500 text-xs mt-1">
                    {errors.examType}
                  </Text>
                )}
              </View>
            </View>

            <TextInput
              placeholder="Previous Exam Number (if any)"
              className="border border-gray-300 p-3 rounded-lg mb-3 text-sm"
              value={form.previousExamNumber}
              onChangeText={(text) => handleChange("previousExamNumber", text)}
            />

            {/* Subject Selection */}
            {showSubjects && form.examType && (
              <View className="mb-4">
                <Text className="font-semibold mb-2 text-sm">
                  Select Subjects *
                </Text>
                <Text className="text-xs text-blue-600 mb-2">
                  {getRequiredSubjectsText()}
                </Text>
                <Text className="text-xs text-gray-600 mb-3">
                  Selected: {form.subjects.length}/
                  {form.examType === "JAMB UTME" ? "4" : "9"}
                </Text>

                {form.subjects.length > 0 && (
                  <View className="flex-row flex-wrap gap-1 mb-3 p-2 bg-blue-50 rounded-lg">
                    {form.subjects.map((subject) => (
                      <View
                        key={subject}
                        className="bg-blue-500 px-2 py-1 rounded-full"
                      >
                        <Text className="text-white text-xs">{subject}</Text>
                      </View>
                    ))}
                  </View>
                )}

                <View className="border border-gray-300 rounded-lg max-h-48">
                  <ScrollView className="p-2">
                    <View className="flex-row flex-wrap gap-1">
                      {getAvailableSubjects().map((subject) => (
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
            )}
          </View>

          {/* Emergency Contact */}
          <View className="mb-6">
            <Text className="text-lg font-semibold mb-3 text-gray-800 border-b border-gray-200 pb-2">
              🚨 Emergency Contact
            </Text>

            <View className="flex-row gap-2 mb-3">
              <View className="flex-2">
                <TextInput
                  placeholder="Emergency Contact Name *"
                  className={`border p-3 rounded-lg text-sm ${errors.emergencyContact ? "border-red-500" : "border-gray-300"}`}
                  value={form.emergencyContact}
                  onChangeText={(text) =>
                    handleChange("emergencyContact", text)
                  }
                />
                {errors.emergencyContact && (
                  <Text className="text-red-500 text-xs mt-1">
                    {errors.emergencyContact}
                  </Text>
                )}
              </View>
              <View className="flex-1">
                <TextInput
                  placeholder="Phone *"
                  className={`border p-3 rounded-lg text-sm ${errors.emergencyPhone ? "border-red-500" : "border-gray-300"}`}
                  keyboardType="phone-pad"
                  value={form.emergencyPhone}
                  onChangeText={(text) => handleChange("emergencyPhone", text)}
                />
                {errors.emergencyPhone && (
                  <Text className="text-red-500 text-xs mt-1">
                    {errors.emergencyPhone}
                  </Text>
                )}
              </View>
            </View>
          </View>

          {/* Summary */}
          {form.examType && form.subjects.length > 0 && (
            <View className="bg-green-50 p-3 rounded-lg mb-6">
              <Text className="font-semibold text-green-800 mb-2 text-sm">
                Registration Summary
              </Text>
              <Text className="text-green-700 text-xs">
                Name: {form.firstname} {form.surname}
              </Text>
              <Text className="text-green-700 text-xs">
                Exam: {form.examType}
              </Text>
              <Text className="text-green-700 text-xs">
                Subjects: {form.subjects.join(", ")}
              </Text>
              <Text className="text-green-700 text-xs">
                School: {form.schoolName}
              </Text>
            </View>
          )}

          <View className="mb-6">
            <Text className="text-xs text-gray-600 mb-4 leading-4">
              By registering, you agree to our Terms of Service and Privacy
              Policy. Your data will be handled securely according to Fillop
              Tech Limited's privacy standards.
            </Text>

            <Button
              title={
                loading ? "Processing Registration..." : "Continue to Payment"
              }
              onPress={handleRegistration}
              className={`${loading ? "bg-gray-400" : "bg-blue-600"} mb-3`}
            />

            <Text className="text-xs text-center text-gray-500">
              Need help? Contact support@fillop.com or call +234-XXX-XXX-XXXX
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
