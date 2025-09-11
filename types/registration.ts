// types/registration.ts - Simplified to match document requirements
export interface UserRegistrationData {
  email: string;
  surname: string;
  firstname: string;
  phone: string;
  gender: "Male" | "Female";
  address: string;
  houseNumber: string;
  lga: string;
  state: string;
  passport?: string; // Photo upload
  subjects: string[]; // Maximum 5 subjects
  examType: "JAMB" | "WAEC" | "NECO";
}

export interface CorporateRegistrationData {
  email: string;
  companyName: string;
  contactPhone: string;
  address: string;
  lga: string;
  state: string;
  logo?: string; // Logo upload
  plan: string; // Selected plan ID
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: string;
}

export interface PaymentInfo {
  systemId: string;
  amount: number;
  registrationType: "user" | "corporate";
  planDetails?: SubscriptionPlan;
  userDetails: UserRegistrationData | CorporateRegistrationData;
  examType?: string; // For user registrations
  planId?: string; // For corporate registrations
}

export interface ActivationData {
  systemId: string;
  activationCode: string;
  registrationType: "user" | "corporate";
}

export interface RegistrationContextType {
  userRegistration: UserRegistrationData | null;
  corporateRegistration: CorporateRegistrationData | null;
  paymentInfo: PaymentInfo | null;
  setUserRegistration: (data: UserRegistrationData) => void;
  setCorporateRegistration: (data: CorporateRegistrationData) => void;
  setPaymentInfo: (data: PaymentInfo) => void;
  clearRegistration: () => void;
}

// Validation interfaces
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface FormErrors {
  [key: string]: string;
}
