import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Button from './../components/Button';
import ImagePicker from './../components/ImagePicker';
import RadioGroup from './../components/RadioGroup';

const SUBSCRIPTION_PLANS = [
  { id: '5', name: '5 Students Plan', price: 15000, duration: '1 Year' },
  { id: '10', name: '10 Students Plan', price: 25000, duration: '1 Year' },
  { id: '20', name: '20 Students Plan', price: 45000, duration: '1 Year' },
  { id: '50', name: '50 Students Plan', price: 100000, duration: '1 Year' },
  { id: '100', name: '100 Students Plan', price: 180000, duration: '1 Year' },
  { id: 'unlimited', name: 'Unlimited Plan', price: 300000, duration: '1 Year' },
];

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu',
  'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi',
  'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo',
  'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara', 'FCT'
];

export default function CorporateRegistration() {
  const router = useRouter();

  const [mode, setMode] = useState<'new' | 'activate' | null>(null);
  const [form, setForm] = useState({
    email: '',
    companyName: '',
    companyType: '',
    rcNumber: '',
    phone: '',
    alternativePhone: '',
    address: '',
    lga: '',
    state: '',
    logo: '',
    plan: '',
    activationCode: '',
    contactPersonName: '',
    contactPersonRole: '',
    website: '',
    yearsOfOperation: '',
    numberOfStudents: '',
    preferredExamTypes: [] as string[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string | string[]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Invalid email format';
    
    if (!form.companyName) newErrors.companyName = 'Company name is required';
    if (!form.companyType) newErrors.companyType = 'Company type is required';
    if (!form.phone) newErrors.phone = 'Phone number is required';
    if (!form.address) newErrors.address = 'Address is required';
    if (!form.lga) newErrors.lga = 'LGA is required';
    if (!form.state) newErrors.state = 'State is required';
    if (!form.plan) newErrors.plan = 'Subscription plan is required';
    if (!form.contactPersonName) newErrors.contactPersonName = 'Contact person name is required';
    if (!form.contactPersonRole) newErrors.contactPersonRole = 'Contact person role is required';
    if (!form.numberOfStudents) newErrors.numberOfStudents = 'Expected number of students is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleActivation = async () => {
    if (!form.activationCode.trim()) {
      Alert.alert('Error', 'Please enter activation code');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call for activation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real implementation, validate activation code with backend
      if (form.activationCode.length < 6) {
        Alert.alert('Error', 'Invalid activation code');
        return;
      }

      router.push('/dashboard');
    } catch (error) {
      Alert.alert('Error', 'Failed to activate account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegistration = async () => {
    if (!validateForm()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call for registration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real implementation, send data to backend
      console.log('Registration data:', form);
      
      router.push('/payment-info');
    } catch (error) {
      Alert.alert('Error', 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getSelectedPlan = () => {
    return SUBSCRIPTION_PLANS.find(plan => plan.id === form.plan);
  };

  if (!mode) {
    return (
      <View className="flex-1 bg-white p-6 justify-center">
        <View className="bg-blue-50 p-6 rounded-lg mb-8">
          <Text className="text-2xl font-bold text-blue-800 mb-2">FILLOP CBT GURU</Text>
          <Text className="text-blue-600 mb-4">Professional JAMB/WAEC CBT Software</Text>
          <Text className="text-gray-600">
            Choose your registration option below to get started with our comprehensive 
            Computer-Based Test platform for educational institutions.
          </Text>
        </View>

        <Text className="text-xl font-bold mb-6 text-center">Corporate Registration Options</Text>
        
        <Button 
          title="New School/Institution Registration" 
          onPress={() => setMode('new')} 
          className="mb-4 bg-blue-600" 
        />
        <Button 
          title="I Have an Activation Code" 
          onPress={() => setMode('activate')} 
          className="bg-green-600"
        />

        <Text className="text-sm text-gray-500 text-center mt-6">
          For support, contact: support@fillop.com
        </Text>
      </View>
    );
  }

  if (mode === 'activate') {
    return (
      <View className="flex-1 bg-white p-6 justify-center">
        <View className="bg-green-50 p-4 rounded-lg mb-6">
          <Text className="text-xl font-bold mb-2 text-green-800">Account Activation</Text>
          <Text className="text-green-600">
            Enter the activation code provided by your administrator
          </Text>
        </View>

        <TextInput
          placeholder="Enter 12-digit Activation Code"
          className="border border-gray-300 p-4 rounded-lg mb-4 text-center text-lg"
          value={form.activationCode}
          onChangeText={(text) => handleChange('activationCode', text.toUpperCase())}
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

  return (
    <ScrollView className="flex-1 bg-white p-6">
      <View className="bg-blue-50 p-4 rounded-lg mb-6">
        <Text className="text-xl font-bold mb-2 text-blue-800">Corporate Registration</Text>
        <Text className="text-blue-600">Register your institution for FILLOP CBT GURU</Text>
      </View>

      {/* Company Information */}
      <View className="mb-6">
        <Text className="text-lg font-semibold mb-4 text-gray-800">Company Information</Text>
        
        <TextInput
          placeholder="Company/Institution Email *"
          className={`border p-4 rounded-lg mb-3 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
          value={form.email}
          onChangeText={(text) => handleChange('email', text)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email && <Text className="text-red-500 text-sm mb-3">{errors.email}</Text>}

        <TextInput
          placeholder="Company/Institution Name *"
          className={`border p-4 rounded-lg mb-3 ${errors.companyName ? 'border-red-500' : 'border-gray-300'}`}
          value={form.companyName}
          onChangeText={(text) => handleChange('companyName', text)}
        />
        {errors.companyName && <Text className="text-red-500 text-sm mb-3">{errors.companyName}</Text>}

        <RadioGroup
          label="Institution Type *"
          options={['Secondary School', 'Tertiary Institution', 'Tutorial Center', 'Training Institute', 'Other']}
          selected={form.companyType}
          onSelect={(val) => handleChange('companyType', val)}
        />

        <TextInput
          placeholder="RC Number (Optional)"
          className="border border-gray-300 p-4 rounded-lg mb-3"
          value={form.rcNumber}
          onChangeText={(text) => handleChange('rcNumber', text)}
        />

        <TextInput
          placeholder="Primary Phone Number *"
          className={`border p-4 rounded-lg mb-3 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
          value={form.phone}
          onChangeText={(text) => handleChange('phone', text)}
          keyboardType="phone-pad"
        />
        {errors.phone && <Text className="text-red-500 text-sm mb-3">{errors.phone}</Text>}

        <TextInput
          placeholder="Alternative Phone Number"
          className="border border-gray-300 p-4 rounded-lg mb-3"
          value={form.alternativePhone}
          onChangeText={(text) => handleChange('alternativePhone', text)}
          keyboardType="phone-pad"
        />

        <TextInput
          placeholder="Institution Address *"
          className={`border p-4 rounded-lg mb-3 ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
          value={form.address}
          onChangeText={(text) => handleChange('address', text)}
          multiline
          numberOfLines={3}
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

        <TextInput
          placeholder="Website (Optional)"
          className="border border-gray-300 p-4 rounded-lg mb-3"
          value={form.website}
          onChangeText={(text) => handleChange('website', text)}
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Years of Operation"
          className="border border-gray-300 p-4 rounded-lg mb-3"
          value={form.yearsOfOperation}
          onChangeText={(text) => handleChange('yearsOfOperation', text)}
          keyboardType="numeric"
        />

        <ImagePicker 
          label="Company/Institution Logo" 
          onPick={(uri) => handleChange('logo', uri)} 
        />
      </View>

      {/* Contact Person Information */}
      <View className="mb-6">
        <Text className="text-lg font-semibold mb-4 text-gray-800">Contact Person Information</Text>
        
        <TextInput
          placeholder="Contact Person Full Name *"
          className={`border p-4 rounded-lg mb-3 ${errors.contactPersonName ? 'border-red-500' : 'border-gray-300'}`}
          value={form.contactPersonName}
          onChangeText={(text) => handleChange('contactPersonName', text)}
        />
        {errors.contactPersonName && <Text className="text-red-500 text-sm mb-3">{errors.contactPersonName}</Text>}

        <TextInput
          placeholder="Role/Position *"
          className={`border p-4 rounded-lg mb-3 ${errors.contactPersonRole ? 'border-red-500' : 'border-gray-300'}`}
          value={form.contactPersonRole}
          onChangeText={(text) => handleChange('contactPersonRole', text)}
        />
        {errors.contactPersonRole && <Text className="text-red-500 text-sm mb-3">{errors.contactPersonRole}</Text>}
      </View>

      {/* Subscription Plan */}
      <View className="mb-6">
        <Text className="text-lg font-semibold mb-4 text-gray-800">Subscription Plan</Text>
        
        <TextInput
          placeholder="Expected Number of Students *"
          className={`border p-4 rounded-lg mb-3 ${errors.numberOfStudents ? 'border-red-500' : 'border-gray-300'}`}
          value={form.numberOfStudents}
          onChangeText={(text) => handleChange('numberOfStudents', text)}
          keyboardType="numeric"
        />
        {errors.numberOfStudents && <Text className="text-red-500 text-sm mb-3">{errors.numberOfStudents}</Text>}

        <Text className="mb-3 font-medium">Select Subscription Plan *</Text>
        {SUBSCRIPTION_PLANS.map((plan) => (
          <TouchableOpacity
            key={plan.id}
            className={`border p-4 rounded-lg mb-3 ${
              form.plan === plan.id ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
            onPress={() => handleChange('plan', plan.id)}
          >
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="font-semibold text-lg">{plan.name}</Text>
                <Text className="text-gray-600">{plan.duration}</Text>
              </View>
              <Text className="font-bold text-blue-600">₦{plan.price.toLocaleString()}</Text>
            </View>
          </TouchableOpacity>
        ))}

        {getSelectedPlan() && (
          <View className="bg-green-50 p-4 rounded-lg mt-3">
            <Text className="font-semibold text-green-800">Selected Plan: {getSelectedPlan()?.name}</Text>
            <Text className="text-green-600">Amount: ₦{getSelectedPlan()?.price.toLocaleString()}</Text>
          </View>
        )}
      </View>

      {/* Exam Types */}
      <View className="mb-6">
        <Text className="text-lg font-semibold mb-4 text-gray-800">Preferred Exam Types</Text>
        <RadioGroup
          label=""
          options={['JAMB UTME', 'WAEC', 'NECO', 'NABTEB', 'All Exams']}
          selected={form.preferredExamTypes[0] || ''}
          onSelect={(val) => handleChange('preferredExamTypes', [val])}
        />
      </View>

      <View className="mb-8">
        <Text className="text-sm text-gray-600 mb-4">
          By registering, you agree to our Terms of Service and Privacy Policy. 
          All intellectual property rights belong to Fillop Tech Limited as stated in our agreement.
        </Text>
        
        <Button 
          title={loading ? "Processing..." : "Continue to Payment"} 
          onPress={handleRegistration}
          className={`${loading ? "bg-gray-400" : "bg-blue-600"} mb-4`}
        />
        
        <Button 
          title="Back to Options" 
          onPress={() => setMode(null)}
          className="bg-gray-500"
        />
      </View>
    </ScrollView>
  );
}