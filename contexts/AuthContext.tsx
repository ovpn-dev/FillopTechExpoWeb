// app/contexts/AuthContext.tsx - Updated with API integration
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { AuthService } from "../services/authService";
import { AuthContextType, AuthState, User } from "../types/auth.types";

// Initial authentication state
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  isLoading: false,
  error: null,
};

// Extended action types for auth reducer
type AuthAction =
  | { type: "INITIALIZE_START" }
  | { type: "INITIALIZE_SUCCESS"; payload: User }
  | { type: "INITIALIZE_COMPLETE" }
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: User }
  | { type: "LOGIN_FAILURE"; payload: string }
  | { type: "LOGOUT" }
  | { type: "CLEAR_ERROR" };

// Auth reducer to manage authentication state
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "INITIALIZE_START":
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case "INITIALIZE_SUCCESS":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        isLoading: false,
        error: null,
      };

    case "INITIALIZE_COMPLETE":
      return {
        ...state,
        isLoading: false,
      };

    case "LOGIN_START":
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case "LOGIN_SUCCESS":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        isLoading: false,
        error: null,
      };

    case "LOGIN_FAILURE":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: action.payload,
      };

    case "LOGOUT":
      return {
        ...initialState,
        isLoading: false, // Don't show loading after logout
      };

    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

// Extended AuthContextType
interface ExtendedAuthContextType extends AuthContextType {
  loginWithEmailPassword: (email: string, password: string) => Promise<boolean>;
  loginWithPasscode: (passcode: string) => Promise<boolean>;
}

// Create the context
const AuthContext = createContext<ExtendedAuthContextType | undefined>(
  undefined
);

// Auth Provider Props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth Provider Component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, dispatch] = useReducer(authReducer, initialState);

  // Initialize authentication on app startup
  useEffect(() => {
    const initializeAuth = async () => {
      dispatch({ type: "INITIALIZE_START" });

      try {
        const user = await AuthService.initializeAuth();
        if (user) {
          dispatch({ type: "INITIALIZE_SUCCESS", payload: user });
        } else {
          dispatch({ type: "INITIALIZE_COMPLETE" });
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
        dispatch({ type: "INITIALIZE_COMPLETE" });
      }
    };

    initializeAuth();
  }, []);

  // Login with email and password (new API-based method)
  const loginWithEmailPassword = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    dispatch({ type: "LOGIN_START" });

    try {
      const response = await AuthService.loginWithEmailPassword(
        email,
        password
      );

      if (response.success && response.user) {
        dispatch({ type: "LOGIN_SUCCESS", payload: response.user });
        console.log("Login successful:", response.user.firstName);
        return true;
      } else {
        dispatch({
          type: "LOGIN_FAILURE",
          payload: response.error || "Login failed",
        });
        return false;
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      dispatch({ type: "LOGIN_FAILURE", payload: errorMessage });
      return false;
    }
  };

  // Legacy passcode login (for backward compatibility)
  const loginWithPasscode = async (passcode: string): Promise<boolean> => {
    dispatch({ type: "LOGIN_START" });

    try {
      const response = await AuthService.loginWithPasscode(passcode);

      if (response.success && response.user) {
        dispatch({ type: "LOGIN_SUCCESS", payload: response.user });
        console.log("Login successful:", response.user.firstName);
        return true;
      } else {
        dispatch({
          type: "LOGIN_FAILURE",
          payload: response.error || "Login failed",
        });
        return false;
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      dispatch({ type: "LOGIN_FAILURE", payload: errorMessage });
      return false;
    }
  };

  // Legacy login method (maintains backward compatibility)
  const login = loginWithPasscode;

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      await AuthService.logout();
      dispatch({ type: "LOGOUT" });
      console.log("Logout successful");
    } catch (error) {
      console.error("Logout error:", error);
      // Even if logout API fails, clear local state
      dispatch({ type: "LOGOUT" });
    }
  };

  // Clear error function
  const clearError = (): void => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  // Context value
  const contextValue: ExtendedAuthContextType = {
    authState,
    login, // Legacy method
    loginWithEmailPassword, // New API method
    loginWithPasscode, // Explicit passcode method
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): ExtendedAuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

// Custom hook to get current user (convenience hook)
export const useUser = () => {
  const { authState } = useAuth();
  return authState.user;
};

// Custom hook to check authentication status (convenience hook)
export const useIsAuthenticated = () => {
  const { authState } = useAuth();
  return authState.isAuthenticated;
};
