// app/register/payment-info.tsx
import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Linking,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Button from "../../components/Button";
import { PricingCalculator } from "../../utils/pricingCalculator";
import { SystemIdGenerator } from "../../utils/systemIdGenerator";

// Bank details for payment
const BANK_DETAILS = {
  accountName: "FILLOP TECH LIMITED",
  accountNumber: "1234567890",
  bankName: "First Bank of Nigeria",
  sortCode: "011",
};

const CONTACT_INFO = {
  whatsapp: "08026414352",
  email: "filloptech@gmail.com",
  supportPhone: "+234-802-641-4352",
};

interface PaymentInfoProps {
  // In a real app, this would come from navigation params or context
  registrationType?: "user" | "corporate";
  examType?: string;
  planId?: string;
  userDetails?: any;
}

export default function PaymentInfoScreen({
  registrationType = "user",
  examType = "JAMB UTME",
  planId = "5",
  userDetails = {},
}: PaymentInfoProps) {
  const router = useRouter();
  const [systemId, setSystemId] = useState("");
  const [amount, setAmount] = useState(0);
  const [transactionRef, setTransactionRef] = useState("");
  const [planDetails, setPlanDetails] = useState<any>(null);

  useEffect(() => {
    // Generate system ID and calculate amount
    const generatedId = SystemIdGenerator.generateSystemId();
    const generatedRef = SystemIdGenerator.generateTransactionRef();

    setSystemId(generatedId);
    setTransactionRef(generatedRef);

    if (registrationType === "corporate") {
      const plan = PricingCalculator.getSubscriptionPlan(planId);
      setPlanDetails(plan);
      setAmount(plan?.price || 0);
    } else {
      setAmount(PricingCalculator.calculateUserPrice(examType));
    }
  }, [registrationType, examType, planId]);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await Clipboard.setStringAsync(text);
      Alert.alert("Copied!", `${label} copied to clipboard`);
    } catch (error) {
      Alert.alert("Error", "Failed to copy to clipboard");
    }
  };

  const openWhatsApp = () => {
    const message = `Hi, I have completed my registration for FILLOP CBT GURU.

Registration Details:
- System ID: ${systemId}
- Transaction Ref: ${transactionRef}
- Type: ${registrationType === "corporate" ? "Corporate" : "Individual User"}
- Amount: ${PricingCalculator.formatCurrency(amount)}
${registrationType === "corporate" && planDetails ? `- Plan: ${planDetails.name}` : `- Exam Type: ${examType}`}

I have made the payment. Please find attached proof of payment.`;

    const whatsappUrl = `https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent(message)}`;

    Linking.openURL(whatsappUrl).catch(() => {
      Alert.alert(
        "Error",
        "Unable to open WhatsApp. Please install WhatsApp or contact us via email."
      );
    });
  };

  const sendEmail = () => {
    const subject = `FILLOP CBT Payment Confirmation - ${systemId}`;
    const body = `Dear Fillop Tech Team,

I have completed my registration and payment for FILLOP CBT GURU.

Registration Details:
System ID: ${systemId}
Transaction Reference: ${transactionRef}
Registration Type: ${registrationType === "corporate" ? "Corporate" : "Individual User"}
Amount Paid: ${PricingCalculator.formatCurrency(amount)}
${registrationType === "corporate" && planDetails ? `Subscription Plan: ${planDetails.name}` : `Exam Type: ${examType}`}

Please find attached the proof of payment.

Thank you.`;

    const emailUrl = `mailto:${CONTACT_INFO.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    Linking.openURL(emailUrl).catch(() => {
      Alert.alert(
        "Error",
        "Unable to open email app. Please contact us directly."
      );
    });
  };

  const sharePaymentDetails = async () => {
    try {
      const message = `FILLOP CBT GURU Payment Details

System ID: ${systemId}
Amount: ${PricingCalculator.formatCurrency(amount)}
Account: ${BANK_DETAILS.accountNumber}
Bank: ${BANK_DETAILS.bankName}
Account Name: ${BANK_DETAILS.accountName}

Contact: ${CONTACT_INFO.whatsapp}`;

      await Share.share({
        message,
        title: "FILLOP CBT Payment Details",
      });
    } catch (error) {
      console.log("Error sharing:", error);
    }
  };

  const proceedToActivation = () => {
    Alert.alert(
      "Payment Confirmation",
      "Have you completed the payment and sent proof to our team?",
      [
        {
          text: "Not Yet",
          style: "cancel",
        },
        {
          text: "Yes, Continue",
          onPress: () => router.push("/register/activation"),
        },
      ]
    );
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      <View className="bg-white rounded-lg shadow-sm">
        {/* Header */}
        <View className="bg-green-600 p-4 rounded-t-lg">
          <Text className="text-xl font-bold text-white text-center">
            💳 Payment Information
          </Text>
          <Text className="text-green-100 text-center mt-1">
            Complete your payment to activate your account
          </Text>
        </View>

        <View className="p-4">
          {/* System ID Card */}
          <View className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
            <Text className="text-lg font-bold text-blue-800 mb-2 text-center">
              🆔 Your System ID
            </Text>
            <TouchableOpacity
              onPress={() => copyToClipboard(systemId, "System ID")}
              className="bg-blue-600 p-3 rounded-lg"
            >
              <Text className="text-white text-center font-mono text-lg font-bold">
                {systemId}
              </Text>
              <Text className="text-blue-200 text-center text-xs mt-1">
                Tap to copy
              </Text>
            </TouchableOpacity>
          </View>

          {/* Payment Amount */}
          <View className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-6">
            <Text className="text-lg font-bold text-green-800 mb-2 text-center">
              💰 Amount to Pay
            </Text>
            <Text className="text-3xl font-bold text-green-600 text-center">
              {PricingCalculator.formatCurrency(amount)}
            </Text>
            <Text className="text-green-700 text-center mt-1">
              {registrationType === "corporate"
                ? `${planDetails?.name} - ${planDetails?.duration}`
                : `Individual Registration - ${examType}`}
            </Text>
          </View>

          {/* Bank Details */}
          <View className="mb-6">
            <Text className="text-lg font-bold mb-3 text-gray-800 border-b border-gray-200 pb-2">
              🏦 Bank Transfer Details
            </Text>

            <View className="space-y-3">
              <View className="flex-row justify-between items-center p-3 bg-gray-50 rounded-lg">
                <Text className="font-medium text-gray-700">Account Name</Text>
                <TouchableOpacity
                  onPress={() =>
                    copyToClipboard(BANK_DETAILS.accountName, "Account Name")
                  }
                  className="flex-1 ml-2"
                >
                  <Text className="text-right font-mono font-bold text-blue-600">
                    {BANK_DETAILS.accountName}
                  </Text>
                </TouchableOpacity>
              </View>

              <View className="flex-row justify-between items-center p-3 bg-gray-50 rounded-lg">
                <Text className="font-medium text-gray-700">
                  Account Number
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    copyToClipboard(
                      BANK_DETAILS.accountNumber,
                      "Account Number"
                    )
                  }
                  className="flex-1 ml-2"
                >
                  <Text className="text-right font-mono font-bold text-blue-600 text-lg">
                    {BANK_DETAILS.accountNumber}
                  </Text>
                </TouchableOpacity>
              </View>

              <View className="flex-row justify-between items-center p-3 bg-gray-50 rounded-lg">
                <Text className="font-medium text-gray-700">Bank Name</Text>
                <TouchableOpacity
                  onPress={() =>
                    copyToClipboard(BANK_DETAILS.bankName, "Bank Name")
                  }
                  className="flex-1 ml-2"
                >
                  <Text className="text-right font-bold text-gray-800">
                    {BANK_DETAILS.bankName}
                  </Text>
                </TouchableOpacity>
              </View>

              <View className="flex-row justify-between items-center p-3 bg-gray-50 rounded-lg">
                <Text className="font-medium text-gray-700">
                  Transaction Ref
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    copyToClipboard(transactionRef, "Transaction Reference")
                  }
                  className="flex-1 ml-2"
                >
                  <Text className="text-right font-mono text-sm text-blue-600">
                    {transactionRef}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text className="text-xs text-gray-500 mt-3 text-center">
              Use the transaction reference when making payment
            </Text>
          </View>

          {/* Instructions */}
          <View className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mb-6">
            <Text className="text-lg font-bold text-yellow-800 mb-2">
              📋 Payment Instructions
            </Text>
            <View className="space-y-2">
              <Text className="text-yellow-700">
                • Make payment to the above account details
              </Text>
              <Text className="text-yellow-700">
                • Include your System ID in payment description
              </Text>
              <Text className="text-yellow-700">
                • Take a screenshot of payment confirmation
              </Text>
              <Text className="text-yellow-700">
                • Send proof via WhatsApp or Email below
              </Text>
              <Text className="text-yellow-700">
                • Wait for account activation (usually within 24 hours)
              </Text>
            </View>
          </View>

          {/* Contact Actions */}
          <View className="mb-6">
            <Text className="text-lg font-bold mb-3 text-gray-800 text-center">
              📞 Send Payment Proof
            </Text>

            <View className="space-y-3">
              <Button
                title="📱 Send via WhatsApp"
                onPress={openWhatsApp}
                className="bg-green-500"
              />

              <Button
                title="📧 Send via Email"
                onPress={sendEmail}
                className="bg-blue-500"
              />

              <Button
                title="📤 Share Payment Details"
                onPress={sharePaymentDetails}
                className="bg-gray-500"
              />
            </View>
          </View>

          {/* Important Note */}
          <View className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6">
            <Text className="text-red-800 font-bold mb-2 text-center">
              ⚠️ Important
            </Text>
            <Text className="text-red-700 text-sm text-center">
              Your account will be activated only after payment confirmation.
              Please ensure you send proof of payment to avoid delays.
            </Text>
          </View>

          {/* Action Buttons */}
          <View className="space-y-3">
            <Button
              title="✅ I Have Sent Payment Proof"
              onPress={proceedToActivation}
              className="bg-green-600"
            />

            <Button
              title="← Back to Registration"
              onPress={() => router.back()}
              className="bg-gray-500"
            />
          </View>

          {/* Support Contact */}
          <View className="mt-6 pt-4 border-t border-gray-200">
            <Text className="text-center text-sm text-gray-600 mb-2">
              Need assistance?
            </Text>
            <Text className="text-center text-sm text-gray-500">
              WhatsApp: {CONTACT_INFO.whatsapp} | Email: {CONTACT_INFO.email}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
