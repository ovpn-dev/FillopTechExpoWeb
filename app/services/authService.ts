// services/authService.ts
import { LoginResponse, User } from "../types/auth.types";

// Mock user database - in future this will be API calls
const MOCK_USERS: { [passcode: string]: User } = {
  "015209": {
    id: "user_001",
    firstName: "Daniel",
    lastName: "Ezekiel Sunday",
    passcode: "015209",
    profileImage: "https://via.placeholder.com/120x120.png?text=DE",
    institution: "FILLOP TECH",
    email: "daniel.ezekiel@filloptech.com",
    registrationDate: "2024-01-15",
  },
  // Can add more mock users later
  "123456": {
    id: "user_002",
    firstName: "Jane",
    lastName: "Smith",
    passcode: "123456",
    profileImage: "https://via.placeholder.com/120x120.png?text=JS",
    institution: "FILLOP TECH",
    email: "jane.smith@filloptech.com",
    registrationDate: "2024-02-01",
  },
};

export class AuthService {
  /**
   * Mock login function - validates passcode and returns user data
   * In future: Replace with API call to authentication endpoint
   */
  static async login(passcode: string): Promise<LoginResponse> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Validate passcode format
    if (!passcode || passcode.trim().length === 0) {
      return {
        success: false,
        error: "Please enter your passcode",
      };
    }

    // Check if passcode exists in mock database
    const user = MOCK_USERS[passcode.trim()];

    if (!user) {
      return {
        success: false,
        error: "Invalid passcode. Please check and try again.",
      };
    }

    return {
      success: true,
      user: user,
    };
  }

  /**
   * Mock logout function
   * In future: Call API to invalidate session tokens
   */
  static async logout(): Promise<void> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 200));

    // In future: Clear tokens, invalidate sessions, etc.
    console.log("User logged out successfully");
  }

  /**
   * Get user by passcode (for development/testing)
   */
  static getUserByPasscode(passcode: string): User | null {
    return MOCK_USERS[passcode] || null;
  }

  /**
   * Check if passcode is valid (without returning user data)
   */
  static isValidPasscode(passcode: string): boolean {
    return !!MOCK_USERS[passcode];
  }

  /**
   * Future: Add methods for registration, password reset, etc.
   */

  // static async register(userData: RegisterData): Promise<LoginResponse> { ... }
  // static async resetPassword(email: string): Promise<boolean> { ... }
  // static async refreshToken(): Promise<string> { ... }
}
