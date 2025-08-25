// app/types/auth.types.ts - Updated to support API integration
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  passcode: string; // For display purposes (legacy)
  profileImage: string;
  institution: string;
  email: string;
  registrationDate: string;
  // New API fields
  username: string;
  role: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType {
  authState: AuthState;
  login: (passcode: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

export interface LoginResponse {
  success: boolean;
  user?: User;
  error?: string;
}
