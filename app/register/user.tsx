import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Button from './../components/Button';
import ImagePicker from './../components/ImagePicker';
import RadioGroup from './../components/RadioGroup';

const JAMB_SUBJECTS = [
  'English Language', 'Mathematics', 'Physics', 'Chemistry', 'Biology',
  'Agricultural Science', 'Economics', 'Government', 'Literature in English',
  'History', 'Geography', 'Christian Religious Studies', 'Islamic Religious Studies',
  'Hausa', 'Igbo', 'Yoruba', 'French', 'Arabic', 'Fine Arts', 'Music'
];

const WAEC_SUBJECTS = [
  'English Language', 'Mathematics', 'Physics', 'Chemistry', 'Biology',
  'Further Mathematics', 'Agricultural Science', 'Economics', 'Government',
  'Literature in English', 'History', 'Geography', 'Christian Religious Studies',
  'Islamic Religious Studies', 'Commerce', 'Accounting', 'Book Keeping',
  'Marketing', 'Office Practice', 'Data Processing', 'Technical Drawing',
  'Building Construction', 'Metal Work', 'Wood Work', 'Auto Mechanics',
  'Electrical Installation', 'Electronics', 'Applied Electricity',
  'Home Economics', 'Food and Nutrition', 'Clothing and Textiles',
  'Fine Arts', 'Music', 'Physical Education', 'Health Education'
];

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu',
  'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi',
  'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo',
  'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara', 'FCT'
];

export default function NewUserRegistration() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: '',
    surname: '',
    firstname: '',
    middlename: '',
    phone: '',
    parentPhone: '',
    gender: '',
    dateOfBirth: '',
    address: '',
    lga: '',
    state: '',
    nationality: 'Nigerian',
    passport: '',
    subjects: [] as string[],
    examType: '',
    schoolName: '',
    classLevel: '',
    previousExamNumber: '',
    disability: '',
    emergencyContact: '',
    emergencyPhone: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showSubjects, setShowSubjects] = useState(false);

  const handleChange = (field: string, value: string | string[]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Show subjects when exam type is selected
    if (field === 'examType' && value) {
      setShowSubjects(true);
      setForm(prev => ({ ...prev, subjects: [] })); // Reset subjects when exam type changes
    }
  };

  const handleSubjectToggle = (subject: string) => {
    const currentSubjects = form.subjects;
    const maxSubjects = form.examType === 'JAMB UTME' ? 4 : 9;

    if (currentSubjects.includes(subject)) {
      // Remove subject
      handleChange('subjects', currentSubjects.filter(s => s !== subject));
    } else {
      // Add subject if under limit
      if (currentSubjects.length < maxSubjects) {
        handleChange('subjects', [...currentSubjects, subject]);
      } else {
        Alert.alert(
          'Subject Limit Reached',
          `You can only select maximum ${maxSubjects} subjects for ${form.examType}`
        );
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Invalid email format';
    
    if (!form.surname) newErrors.surname = 'Surname is required';
    if (!form.firstname) newErrors.firstname = 'First name is required';
    if (!form.phone) newErrors.phone = 'Phone number is required';
    if (!form.gender) newErrors.gender = 'Gender is required';
    if (!form.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!form.address) newErrors.address = 'Address is required';
    if (!form.lga) newErrors.lga = 'LGA is required';
    if (!form.state) newErrors.state = 'State is required';
    if (!form.examType) newErrors.examType = 'Exam type is required';
    if (!form.schoolName) newErrors.schoolName = 'School name is required';
    if (!form.classLevel) newErrors.classLevel = 'Class/Level is required';
    if (!form.emergencyContact) newErrors.emergencyContact = 'Emergency contact is required';
    if (!form.emergencyPhone) newErrors.emergencyPhone = 'Emergency phone is required';

    // Subject validation
    if (form.examType === 'JAMB UTME' && form.subjects.length !== 4) {
      newErrors.subjects = 'Please select exactly 4 subjects for JAMB UTME';
    } else if (form.examType === 'WAEC' && form.subjects.length < 5) {
      newErrors.subjects = 'Please select at least 5 subjects for WAEC';
    }

    // Ensure English and Mathematics are selected for JAMB
    if (form.examType === 'JAMB UTME') {
      if (!form.subjects.includes('English Language')) {
        newErrors.subjects = 'English Language is compulsory for JAMB UTME';
      }
      if (!form.subjects.includes('Mathematics')) {
        newErrors.subjects = 'Mathematics is compulsory for JAMB UTME';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegistration = async () => {
    if (!validateForm()) {
      Alert.alert('Error', 'Please fill in all required fields correctly');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call for registration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real implementation, send data to backend
      console.log('User registration data:', form);
      
      Alert.alert(
        'Registration Successful',
        'Your registration has been submitted successfully. You will be redirected to payment.',
        [{ text: 'OK', onPress: () => router.push('/payment-info') }]
      );
    } catch (error) {
      Alert.alert('Error', 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getAvailableSubjects = () => {
    return form.examType === 'JAMB UTME' ? JAMB_SUBJECTS : WAEC_SUBJECTS;
  };

  const getRequiredSubjectsText = () => {
    if (form.examType === 'JAMB UTME') {
      return 'Select exactly 4 subjects (English Language and Mathematics are compulsory)';
    } else if (form.examType === 'WAEC') {
      return 'Select 5-9 subjects (English Language and Mathematics recommended)';
    }
    return '';
  };

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <View className="bg-blue-50 p-4 rounded-lg mb-6">
        <Text className="text-xl font-bold text-blue-800 mb-2">Student Registration</Text>
        <Text className="text-blue-600">FILLOP CBT GURU - Register for JAMB/WAEC Practice</Text>
      </View>

      {/* Personal Information */}
      <View className="mb-6">
        <Text className="text-lg font-semibold mb-4 text-gray-800">Personal Information</Text>
        
        <TextInput
          placeholder="Email Address *"
          className={`border p-4 rounded-lg mb-3 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
          keyboardType="email-address"
          autoCapitalize="none"
          value={form.email}
          onChangeText={(text) => handleChange('email', text)}
        />
        {errors.email && <Text className="text-red-500 text-sm mb-3">{errors.email}</Text>}

        <TextInput
          placeholder="Surname *"
          className={`border p-4 rounded-lg mb-3 ${errors.surname ? 'border-red-500' : 'border-gray-300'}`}
          value={form.surname}
          onChangeText={(text) => handleChange('surname', text)}
        />
        {errors.surname && <Text className="text-red-500 text-sm mb-3">{errors.surname}</Text>}

        <TextInput
          placeholder="First Name *"
          className={`border p-4 rounded-lg mb-3 ${errors.firstname ? 'border-red-500' : 'border-gray-300'}`}
          value={form.firstname}
          onChangeText={(text) => handleChange('firstname', text)}
        />
        {errors.firstname && <Text className="text-red-500 text-sm mb-3">{errors.firstname}</Text>}

        <TextInput
          placeholder="Middle Name (Optional)"
          className="border border-gray-300 p-4 rounded-lg mb-3"
          value={form.middlename}
          onChangeText={(text) => handleChange('middlename', text)}
        />

        <TextInput
          placeholder="Phone Number *"
          className={`border p-4 rounded-lg mb-3 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
          keyboardType="phone-pad"
          value={form.phone}
          onChangeText={(text) => handleChange('phone', text)}
        />
        {errors.phone && <Text className="text-red-500 text-sm mb-3">{errors.phone}</Text>}

        <TextInput
          placeholder="Parent/Guardian Phone Number"
          className="border border-gray-300 p-4 rounded-lg mb-3"
          keyboardType="phone-pad"
          value={form.parentPhone}
          onChangeText={(text) => handleChange('parentPhone', text)}
        />

        <RadioGroup
          label="Gender *"
          options={['Male', 'Female']}
          selected={form.gender}
          onSelect={(val) => handleChange('gender', val)}
        />
        {errors.gender && <Text className="text-red-500 text-sm mb-3">{errors.gender}</Text>}

        <TextInput
          placeholder="Date of Birth (DD/MM/YYYY) *"
          className={`border p-4 rounded-lg mb-3 ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'}`}
          value={form.dateOfBirth}
          onChangeText={(text) => handleChange('dateOfBirth', text)}
        />
        {errors.dateOfBirth && <Text className="text-red-500 text-sm mb-3">{errors.dateOfBirth}</Text>}

        <TextInput
          placeholder="Home Address *"
          className={`border p-4 rounded-lg mb-3 ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
          multiline
          numberOfLines={3}
          value={form.address}
          onChangeText={(text) => handleChange('address', text)}
        />
        {errors.address && <Text className="text-red-500 text-sm mb-3">{errors.address}</Text>}

        <TextInput
          placeholder="Local Government Area (LGA) *"
          className={`border p-4 rounded-lg mb-3 ${errors.lga ? 'border-red-500' : 'border-gray-300'}`}
          value={form.lga}
          onChangeText={(text) => handleChange('lga', text)}
        />
        {errors.lga && <Text className="text-red-500 text-sm mb-3">{errors.lga}</Text>}

        <View className="mb-3">
          <Text className="mb-2 font-medium">State *</Text>
          <RadioGroup
            label=""
            options={NIGERIAN_STATES.slice(0, 5)} // Show first 5 states as example
            selected={form.state}
            onSelect={(val) => handleChange('state', val)}
          />
          <Text className="text-sm text-gray-500 mt-1">
            In real implementation, this would be a dropdown with all Nigerian states
          </Text>
        </View>
        {errors.state && <Text className="text-red-500 text-sm mb-3">{errors.state}</Text>}

        <TextInput
          placeholder="Nationality"
          className="border border-gray-300 p-4 rounded-lg mb-3"
          value={form.nationality}
          onChangeText={(text) => handleChange('nationality', text)}
        />

        <TextInput
          placeholder="Any Disability? (Optional)"
          className="border border-gray-300 p-4 rounded-lg mb-3"
          value={form.disability}
          onChangeText={(text) => handleChange('disability', text)}
        />

        <ImagePicker
          label="Passport Photo *"
          gender={form.gender}
          onPick={(uri) => handleChange('passport', uri)}
        />
      </View>

      {/* Academic Information */}
      <View className="mb-6">
        <Text className="text-lg font-semibold mb-4 text-gray-800">Academic Information</Text>
        
        <TextInput
          placeholder="Current School Name *"
          className={`border p-4 rounded-lg mb-3 ${errors.schoolName ? 'border-red-500' : 'border-gray-300'}`}
          value={form.schoolName}
          onChangeText={(text) => handleChange('schoolName', text)}
        />
        {errors.schoolName && <Text className="text-red-500 text-sm mb-3">{errors.schoolName}</Text>}

        <RadioGroup
          label="Class/Level *"
          options={['SS1', 'SS2', 'SS3', 'Graduate', 'JAMB Candidate', 'WAEC Candidate']}
          selected={form.classLevel}
          onSelect={(val) => handleChange('classLevel', val)}
        />
        {errors.classLevel && <Text className="text-red-500 text-sm mb-3">{errors.classLevel}</Text>}

        <RadioGroup
          label="Exam Type *"
          options={['JAMB UTME', 'WAEC', 'NECO', 'NABTEB']}
          selected={form.examType}
          onSelect={(val) => handleChange('examType', val)}
        />
        {errors.examType && <Text className="text-red-500 text-sm mb-3">{errors.examType}</Text>}

        <TextInput
          placeholder="Previous Exam Number (if any)"
          className="border border-gray-300 p-4 rounded-lg mb-3"
          value={form.previousExamNumber}
          onChangeText={(text) => handleChange('previousExamNumber', text)}
        />

        {/* Subject Selection */}
        {showSubjects && form.examType && (
          <View className="mb-6">
            <Text className="font-semibold mb-2">Select Subjects *</Text>
            <Text className="text-sm text-blue-600 mb-3">{getRequiredSubjectsText()}</Text>
            <Text className="text-sm text-gray-600 mb-3">
              Selected: {form.subjects.length}/{form.examType === 'JAMB UTME' ? '4' : '9'}
            </Text>
            
            <View className="flex-row flex-wrap gap-2 mb-4">
              {form.subjects.map((subject) => (
                <View key={subject} className="bg-blue-500 px-3 py-1 rounded-full">
                  <Text className="text-white text-sm">{subject}</Text>
                </View>
              ))}
            </View>

            <View className="border border-gray-300 rounded-lg p-3 max-h-60">
              <ScrollView>
                {getAvailableSubjects().map((subject) => (
                  <TouchableOpacity
                    key={subject}
                    className={`p-3 border-b border-gray-200 ${
                      form.subjects.includes(subject) ? 'bg-blue-50' : ''
                    }`}
                    onPress={() => handleSubjectToggle(subject)}
                  >
                    <Text className={`${
                      form.subjects.includes(subject) ? 'text-blue-600 font-semibold' : 'text-gray-800'
                    }`}>
                      {subject} {form.subjects.includes(subject) ? '✓' : ''}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            {errors.subjects && <Text className="text-red-500 text-sm mt-2">{errors.subjects}</Text>}
          </View>
        )}
      </View>

      {/* Emergency Contact */}
      <View className="mb-6">
        <Text className="text-lg font-semibold mb-4 text-gray-800">Emergency Contact</Text>
        
        <TextInput
          placeholder="Emergency Contact Name *"
          className={`border p-4 rounded-lg mb-3 ${errors.emergencyContact ? 'border-red-500' : 'border-gray-300'}`}
          value={form.emergencyContact}
          onChangeText={(text) => handleChange('emergencyContact', text)}
        />
        {errors.emergencyContact && <Text className="text-red-500 text-sm mb-3">{errors.emergencyContact}</Text>}

        <TextInput
          placeholder="Emergency Contact Phone *"
          className={`border p-4 rounded-lg mb-3 ${errors.emergencyPhone ? 'border-red-500' : 'border-gray-300'}`}
          keyboardType="phone-pad"
          value={form.emergencyPhone}
          onChangeText={(text) => handleChange('emergencyPhone', text)}
        />
        {errors.emergencyPhone && <Text className="text-red-500 text-sm mb-3">{errors.emergencyPhone}</Text>}
      </View>

      {/* Summary */}
      {form.examType && form.subjects.length > 0 && (
        <View className="bg-green-50 p-4 rounded-lg mb-6">
          <Text className="font-semibold text-green-800 mb-2">Registration Summary</Text>
          <Text className="text-green-700">Name: {form.firstname} {form.surname}</Text>
          <Text className="text-green-700">Exam: {form.examType}</Text>
          <Text className="text-green-700">Subjects: {form.subjects.join(', ')}</Text>
          <Text className="text-green-700">School: {form.schoolName}</Text>
        </View>
      )}

      <View className="mb-8">
        <Text className="text-sm text-gray-600 mb-4">
          By registering, you agree to our Terms of Service and Privacy Policy. 
          Your data will be handled securely according to Fillop Tech Limited's privacy standards.
        </Text>
        
        <Button
          title={loading ? "Processing Registration..." : "Continue to Payment"}
          onPress={handleRegistration}
          className={`${loading ? "bg-gray-400" : "bg-blue-600"} mb-4`}
        />
        
        <Text className="text-sm text-center text-gray-500">
          Need help? Contact support@fillop.com or call +234-XXX-XXX-XXXX
        </Text>
      </View>
    </ScrollView>
  );
}