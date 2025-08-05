// types/auth.types.ts
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImage: string;
  institution: string;
  passcode: string;
  registrationDate: string;
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
