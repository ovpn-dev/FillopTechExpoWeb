// types/registration.ts
export interface UserRegistrationData {
  email: string;
  surname: string;
  firstname: string;
  middlename?: string;
  phone: string;
  parentPhone?: string;
  gender: "Male" | "Female";
  dateOfBirth: string;
  address: string;
  lga: string;
  state: string;
  nationality: string;
  passport?: string;
  subjects: string[];
  examType: "JAMB UTME" | "WAEC" | "NECO";
  schoolName: string;
  classLevel: string;
  previousExamNumber?: string;
  disability?: string;
  emergencyContact: string;
  emergencyPhone: string;
}

export interface CorporateRegistrationData {
  email: string;
  companyName: string;
  companyType: string;
  rcNumber?: string;
  phone: string;
  alternativePhone?: string;
  address: string;
  lga: string;
  state: string;
  logo?: string;
  plan: string;
  contactPersonName: string;
  contactPersonRole: string;
  website?: string;
  yearsOfOperation?: string;
  numberOfStudents: string;
  preferredExamTypes: string[];
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: string;
  maxStudents: number;
}

export interface PaymentInfo {
  systemId: string;
  amount: number;
  registrationType: "user" | "corporate";
  planDetails?: SubscriptionPlan;
  userDetails: UserRegistrationData | CorporateRegistrationData;
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
