// contexts/AuthContext.tsx
import React, { createContext, ReactNode, useContext, useReducer } from "react";
import { AuthService } from "../services/authService";
import { AuthContextType, AuthState, User } from "../types/auth.types";

// Initial authentication state
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  isLoading: false,
  error: null,
};

// Action types for auth reducer
type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: User }
  | { type: "LOGIN_FAILURE"; payload: string }
  | { type: "LOGOUT" }
  | { type: "CLEAR_ERROR" };

// Auth reducer to manage authentication state
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
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
        ...initialState, // Reset to initial state
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

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth Provider Component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, dispatch] = useReducer(authReducer, initialState);

  // Login function
  const login = async (passcode: string): Promise<boolean> => {
    dispatch({ type: "LOGIN_START" });

    try {
      const response = await AuthService.login(passcode);

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
  const contextValue: AuthContextType = {
    authState,
    login,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
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
