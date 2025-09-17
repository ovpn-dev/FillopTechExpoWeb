// app/services/authService.ts - Enhanced with admin role validation
import { LoginResponse, User } from "../types/auth.types";
import apiService, { TokenStorage } from "./apiService";

// Extended User type to match API response
interface ApiUser {
  id: string;
  username: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
}

// Convert API user to app User format
function convertApiUserToAppUser(apiUser: ApiUser): User {
  // Generate profile image URL based on user initials
  const initials = apiUser.username.substring(0, 2).toUpperCase();
  const profileImageUrl = `https://ui-avatars.com/api/?name=${apiUser.username}&background=3b82f6&color=ffffff&size=128`;

  return {
    id: apiUser.id,
    firstName: apiUser.username, // Using username as firstName for now
    lastName: "", // Will be empty until profile is updated
    passcode: apiUser.id.substring(0, 6), // Use first 6 chars of ID as passcode display
    profileImage: profileImageUrl,
    institution: "FILLOP TECH", // Default institution
    email: apiUser.email,
    registrationDate: apiUser.created_at.split("T")[0], // Extract date part
    username: apiUser.username,
    role: apiUser.role,
  };
}

export class AuthService {
  /**
   * Login with email and password (API-based)
   */
  static async loginWithEmailPassword(
    email: string,
    password: string
  ): Promise<LoginResponse> {
    try {
      const response = await apiService.login({ email, password });

      // Store the token
      await TokenStorage.setToken(response.token);

      // Convert API user to app user format
      const appUser = convertApiUserToAppUser(response as any);

      return {
        success: true,
        user: appUser,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Login failed. Please check your credentials.",
      };
    }
  }

  /**
   * Admin-specific login with role validation
   */
  static async loginAsAdmin(
    email: string,
    password: string
  ): Promise<LoginResponse> {
    try {
      const loginResponse = await this.loginWithEmailPassword(email, password);
      
      if (loginResponse.success && loginResponse.user) {
        // Validate admin role
        if (loginResponse.user.role !== "admin") {
          // Logout the non-admin user
          await this.logout();
          return {
            success: false,
            error: "Access denied. Administrator privileges required.",
          };
        }
        
        return loginResponse;
      }
      
      return loginResponse;
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Admin login failed.",
      };
    }
  }

  /**
   * Legacy passcode login (for backward compatibility during transition)
   */
  static async loginWithPasscode(passcode: string): Promise<LoginResponse> {
    // Mock users for transition period - remove when all users have email/password
    const MOCK_USERS: { [passcode: string]: User } = {
      "015209": {
        id: "user_001",
        firstName: "Daniel",
        lastName: "Ezekiel Sunday",
        passcode: "015209",
        profileImage:
          "https://ui-avatars.com/api/?name=Daniel+Ezekiel&background=3b82f6&color=ffffff&size=128",
        institution: "FILLOP TECH",
        email: "daniel.ezekiel@filloptech.com",
        registrationDate: "2024-01-15",
        username: "daniel_ezekiel",
        role: "student",
      },
      "123456": {
        id: "user_002",
        firstName: "Jane",
        lastName: "Smith",
        passcode: "123456",
        profileImage:
          "https://ui-avatars.com/api/?name=Jane+Smith&background=3b82f6&color=ffffff&size=128",
        institution: "FILLOP TECH",
        email: "jane.smith@filloptech.com",
        registrationDate: "2024-02-01",
        username: "jane_smith",
        role: "student",
      },
      // Add a mock admin for testing
      "admin1": {
        id: "admin_001",
        firstName: "Admin",
        lastName: "User",
        passcode: "admin1",
        profileImage:
          "https://ui-avatars.com/api/?name=Admin+User&background=dc2626&color=ffffff&size=128",
        institution: "FILLOP TECH",
        email: "admin@filloptech.com",
        registrationDate: "2024-01-01",
        username: "admin_user",
        role: "admin",
      },
    };

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (!passcode || passcode.trim().length === 0) {
      return {
        success: false,
        error: "Please enter your passcode",
      };
    }

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
   * Get current user from API using stored token
   */
  static async getCurrentUser(): Promise<User | null> {
    try {
      const token = await TokenStorage.getToken();
      if (!token) {
        return null;
      }

      const apiUser = await apiService.getMe();
      return convertApiUserToAppUser(apiUser as any);
    } catch (error) {
      console.error("Failed to get current user:", error);
      // Token might be expired, remove it
      await TokenStorage.removeToken();
      return null;
    }
  }

  /**
   * Check if user is authenticated (has valid token)
   */
  static async isAuthenticated(): Promise<boolean> {
    try {
      const user = await this.getCurrentUser();
      return !!user;
    } catch {
      return false;
    }
  }

  /**
   * Check if current user has admin role
   */
  static async isAdmin(): Promise<boolean> {
    try {
      const user = await this.getCurrentUser();
      return user?.role === "admin";
    } catch {
      return false;
    }
  }

  /**
   * Validate user role
   */
  static async hasRole(requiredRole: string): Promise<boolean> {
    try {
      const user = await this.getCurrentUser();
      return user?.role === requiredRole;
    } catch {
      return false;
    }
  }

  /**
   * Logout user
   */
  static async logout(): Promise<void> {
    try {
      await TokenStorage.removeToken();
      console.log("User logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  /**
   * Auto-login check on app startup
   */
  static async initializeAuth(): Promise<User | null> {
    try {
      const isAuth = await this.isAuthenticated();
      if (isAuth) {
        return await this.getCurrentUser();
      }
      return null;
    } catch (error) {
      console.error("Auth initialization failed:", error);
      return null;
    }
  }
}