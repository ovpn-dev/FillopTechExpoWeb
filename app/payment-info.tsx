import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, View } from 'react-native';
import Button from './components/Button';
import RadioGroup from './components/RadioGroup';

const PAYMENT_METHODS = [
  { id: 'card', name: 'Debit/Credit Card', icon: '💳' },
  { id: 'bank_transfer', name: 'Bank Transfer', icon: '🏦' },
  { id: 'ussd', name: 'USSD Payment', icon: '📱' },
  { id: 'paystack', name: 'Paystack', icon: '💰' },
  { id: 'flutterwave', name: 'Flutterwave', icon: '🌊' },
];

const SUBSCRIPTION_PLANS = {
  individual: { name: 'Individual Student', price: 2500, duration: '6 Months' },
  corporate_5: { name: '5 Students Plan', price: 15000, duration: '1 Year' },
  corporate_10: { name: '10 Students Plan', price: 25000, duration: '1 Year' },
  corporate_20: { name: '20 Students Plan', price: 45000, duration: '1 Year' },
  corporate_50: { name: '50 Students Plan', price: 100000, duration: '1 Year' },
  corporate_100: { name: '100 Students Plan', price: 180000, duration: '1 Year' },
  corporate_unlimited: { name: 'Unlimited Plan', price: 300000, duration: '1 Year' },
};

export default function PaymentInfo() {
  const router = useRouter();
  
  const [paymentData, setPaymentData] = useState({
    paymentMethod: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolderName: '',
    bankName: '',
    accountNumber: '',
    accountName: '',
    phoneNumber: '',
    email: '',
  });

  const [selectedPlan, setSelectedPlan] = useState('individual');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setPaymentData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validatePayment = () => {
    const newErrors: Record<string, string> = {};

    if (!paymentData.paymentMethod) {
      newErrors.paymentMethod = 'Please select a payment method';
    }

    if (!paymentData.email) {
      newErrors.email = 'Email is required for payment confirmation';
    } else if (!/\S+@\S+\.\S+/.test(paymentData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (paymentData.paymentMethod === 'card') {
      if (!paymentData.cardNumber) newErrors.cardNumber = 'Card number is required';
      if (!paymentData.expiryDate) newErrors.expiryDate = 'Expiry date is required';
      if (!paymentData.cvv) newErrors.cvv = 'CVV is required';
      if (!paymentData.cardHolderName) newErrors.cardHolderName = 'Card holder name is required';
    }

    if (paymentData.paymentMethod === 'bank_transfer') {
      if (!paymentData.bankName) newErrors.bankName = 'Bank name is required';
      if (!paymentData.accountNumber) newErrors.accountNumber = 'Account number is required';
      if (!paymentData.accountName) newErrors.accountName = 'Account name is required';
    }

    if (['ussd', 'paystack', 'flutterwave'].includes(paymentData.paymentMethod)) {
      if (!paymentData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const processPayment = async () => {
    if (!validatePayment()) {
      Alert.alert('Error', 'Please fill in all required payment details');
      return;
    }

    setLoading(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // In real implementation, integrate with payment gateway
      const paymentReference = 'FILLOP_' + Date.now();
      
      Alert.alert(
        'Payment Successful!',
        `Your payment has been processed successfully.\n\nReference: ${paymentReference}\n\nYou will receive an activation code via email shortly.`,
        [
          {
            text: 'Continue to Dashboard',
            onPress: () => router.push('/dashboard')
          }
        ]
      );
    } catch (error) {
      Alert.alert('Payment Failed', 'There was an error processing your payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateBankDetails = () => {
    // Fillop Tech Limited bank details (example)
    return {
      bankName: 'First Bank Nigeria',
      accountNumber: '2031234567',
      accountName: 'FILLOP TECH LIMITED',
      sortCode: '011151234'
    };
  };

  const plan = SUBSCRIPTION_PLANS[selectedPlan as keyof typeof SUBSCRIPTION_PLANS];

  return (
    <ScrollView className="flex-1 bg-white p-6">
      <View className="bg-blue-50 p-4 rounded-lg mb-6">
        <Text className="text-xl font-bold text-blue-800 mb-2">Payment Information</Text>
        <Text className="text-blue-600">Complete your FILLOP CBT GURU subscription</Text>
      </View>

      {/* Plan Summary */}
      <View className="bg-green-50 p-4 rounded-lg mb-6">
        <Text className="text-lg font-semibold text-green-800 mb-2">Subscription Summary</Text>
        <Text className="text-green-700">Plan: {plan.name}</Text>
        <Text className="text-green-700">Duration: {plan.duration}</Text>
        <Text className="text-green-700 text-xl font-bold">Amount: ₦{plan.price.toLocaleString()}</Text>
        
        <View className="mt-3 pt-3 border-t border-green-200">
          <Text className="text-green-600 text-sm">
            ✓ Access to JAMB/WAEC practice questions
          </Text>
          <Text className="text-green-600 text-sm">
            ✓ AI-powered tutor and explanations
          </Text>
          <Text className="text-green-600 text-sm">
            ✓ Performance analytics and progress tracking
          </Text>
          <Text className="text-green-600 text-sm">
            ✓ Mock examinations and timed tests
          </Text>
          <Text className="text-green-600 text-sm">
            ✓ 24/7 technical support
          </Text>
        </View>
      </View>

      {/* Contact Information */}
      <View className="mb-6">
        <Text className="text-lg font-semibold mb-4 text-gray-800">Contact Information</Text>
        
        <TextInput
          placeholder="Email Address *"
          className={`border p-4 rounded-lg mb-3 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
          keyboardType="email-address"
          autoCapitalize="none"
          value={paymentData.email}
          onChangeText={(text) => handleChange('email', text)}
        />
        {errors.email && <Text className="text-red-500 text-sm mb-3">{errors.email}</Text>}
      </View>

      {/* Payment Method Selection */}
      <View className="mb-6">
        <Text className="text-lg font-semibold mb-4 text-gray-800">Payment Method</Text>
        
        <RadioGroup
          label=""
          options={PAYMENT_METHODS.map(method => `${method.icon} ${method.name}`)}
          selected={paymentData.paymentMethod ? 
            PAYMENT_METHODS.find(m => m.id === paymentData.paymentMethod)?.icon + ' ' + 
            PAYMENT_METHODS.find(m => m.id === paymentData.paymentMethod)?.name || '' : ''}
          onSelect={(val) => {
            const method = PAYMENT_METHODS.find(m => val.includes(m.name));
            if (method) handleChange('paymentMethod', method.id);
          }}
        />
        {errors.paymentMethod && <Text className="text-red-500 text-sm mt-2">{errors.paymentMethod}</Text>}
      </View>

      {/* Payment Details */}
      {paymentData.paymentMethod === 'card' && (
        <View className="mb-6">
          <Text className="text-lg font-semibold mb-4 text-gray-800">Card Details</Text>
          
          <TextInput
            placeholder="Card Number *"
            className={`border p-4 rounded-lg mb-3 ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'}`}
            keyboardType="numeric"
            value={paymentData.cardNumber}
            onChangeText={(text) => handleChange('cardNumber', text)}
            maxLength={19}
          />
          {errors.cardNumber && <Text className="text-red-500 text-sm mb-3">{errors.cardNumber}</Text>}

          <View className="flex-row gap-3 mb-3">
            <TextInput
              placeholder="MM/YY *"
              className={`border p-4 rounded-lg flex-1 ${errors.expiryDate ? 'border-red-500' : 'border-gray-300'}`}
              value={paymentData.expiryDate}
              onChangeText={(text) => handleChange('expiryDate', text)}
              maxLength={5}
            />
            <TextInput
              placeholder="CVV *"
              className={`border p-4 rounded-lg flex-1 ${errors.cvv ? 'border-red-500' : 'border-gray-300'}`}
              keyboardType="numeric"
              value={paymentData.cvv}
              onChangeText={(text) => handleChange('cvv', text)}
              maxLength={4}
              secureTextEntry
            />
          </View>
          {(errors.expiryDate || errors.cvv) && (
            <Text className="text-red-500 text-sm mb-3">
              {errors.expiryDate || errors.cvv}
            </Text>
          )}

          <TextInput
            placeholder="Card Holder Name *"
            className={`border p-4 rounded-lg mb-3 ${errors.cardHolderName ? 'border-red-500' : 'border-gray-300'}`}
            value={paymentData.cardHolderName}
            onChangeText={(text) => handleChange('cardHolderName', text)}
          />
          {errors.cardHolderName && <Text className="text-red-500 text-sm mb-3">{errors.cardHolderName}</Text>}
        </View>
      )}

      {paymentData.paymentMethod === 'bank_transfer' && (
        <View className="mb-6">
          <Text className="text-lg font-semibold mb-4 text-gray-800">Bank Transfer Details</Text>
          
          <View className="bg-yellow-50 p-4 rounded-lg mb-4">
            <Text className="font-semibold text-yellow-800 mb-2">Transfer to:</Text>
            <Text className="text-yellow-700">Bank: {generateBankDetails().bankName}</Text>
            <Text className="text-yellow-700">Account Number: {generateBankDetails().accountNumber}</Text>
            <Text className="text-yellow-700">Account Name: {generateBankDetails().accountName}</Text>
            <Text className="text-yellow-700">Amount: ₦{plan.price.toLocaleString()}</Text>
            <Text className="text-yellow-600 text-sm mt-2">
              Please use your email as payment reference
            </Text>
          </View>

          <Text className="text-sm text-gray-600 mb-3">
            After making the transfer, please provide your payment details below:
          </Text>

          <TextInput
            placeholder="Your Bank Name *"
            className={`border p-4 rounded-lg mb-3 ${errors.bankName ? 'border-red-500' : 'border-gray-300'}`}
            value={paymentData.bankName}
            onChangeText={(text) => handleChange('bankName', text)}
          />
          {errors.bankName && <Text className="text-red-500 text-sm mb-3">{errors.bankName}</Text>}

          <TextInput
            placeholder="Your Account Number *"
            className={`border p-4 rounded-lg mb-3 ${errors.accountNumber ? 'border-red-500' : 'border-gray-300'}`}
            keyboardType="numeric"
            value={paymentData.accountNumber}
            onChangeText={(text) => handleChange('accountNumber', text)}
          />
          {errors.accountNumber && <Text className="text-red-500 text-sm mb-3">{errors.accountNumber}</Text>}

          <TextInput
            placeholder="Account Holder Name *"
            className={`border p-4 rounded-lg mb-3 ${errors.accountName ? 'border-red-500' : 'border-gray-300'}`}
            value={paymentData.accountName}
            onChangeText={(text) => handleChange('accountName', text)}
          />
          {errors.accountName && <Text className="text-red-500 text-sm mb-3">{errors.accountName}</Text>}
        </View>
      )}

      {['ussd', 'paystack', 'flutterwave'].includes(paymentData.paymentMethod) && (
        <View className="mb-6">
          <Text className="text-lg font-semibold mb-4 text-gray-800">Phone Payment</Text>
          
          <TextInput
            placeholder="Phone Number *"
            className={`border p-4 rounded-lg mb-3 ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'}`}
            keyboardType="phone-pad"
            value={paymentData.phoneNumber}
            onChangeText={(text) => handleChange('phoneNumber', text)}
          />
          {errors.phoneNumber && <Text className="text-red-500 text-sm mb-3">{errors.phoneNumber}</Text>}

          <View className="bg-blue-50 p-4 rounded-lg">
            <Text className="text-blue-800 font-semibold mb-2">Payment Instructions:</Text>
            <Text className="text-blue-700 text-sm">
              1. Click "Process Payment" below
            </Text>
            <Text className="text-blue-700 text-sm">
              2. You will receive a payment prompt on your phone
            </Text>
            <Text className="text-blue-700 text-sm">
              3. Follow the instructions to complete payment
            </Text>
            <Text className="text-blue-700 text-sm">
              4. Your account will be activated automatically
            </Text>
          </View>
        </View>
      )}

      {/* Security Notice */}
      <View className="bg-gray-50 p-4 rounded-lg mb-6">
        <Text className="font-semibold text-gray-800 mb-2">🔒 Security Notice</Text>
        <Text className="text-gray-600 text-sm">
          Your payment information is encrypted and secure. Fillop Tech Limited uses 
          industry-standard security measures to protect your data. We do not store 
          your card details on our servers.
        </Text>
      </View>

      {/* Action Buttons */}
      <View className="mb-8">
        <Button
          title={loading ? "Processing Payment..." : `Pay ₦${plan.price.toLocaleString()}`}
          onPress={processPayment}
          className={`${loading ? "bg-gray-400" : "bg-green-600"} mb-4`}
        />
        
        <Button
          title="Back to Registration"
          onPress={() => router.back()}
          className="bg-gray-500"
        />
      </View>

      {/* Support */}
      <View className="border-t border-gray-200 pt-4">
        <Text className="text-center text-gray-600 text-sm mb-2">
          Need help with payment?
        </Text>
        <Text className="text-center text-blue-600 text-sm">
          Contact: support@fillop.com | +234-XXX-XXX-XXXX
        </Text>
        <Text className="text-center text-gray-500 text-xs mt-2">
          Fillop Tech Limited - Registered in Nigeria
        </Text>
      </View>
    </ScrollView>
  );
}