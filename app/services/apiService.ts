// services/apiService.ts
const API_BASE_URL = "https://cbtapi.filloptech.com/api-docs/"; // Replace with actual URL

// Types for API requests and responses
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role: "student" | "corporate";
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
  token: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  // Generic API call method
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw {
          message: data.message || "An error occurred",
          errors: data.errors || {},
          status: response.status,
        } as ApiError & { status: number };
      }

      return data;
    } catch (error) {
      if (error instanceof TypeError) {
        // Network error
        throw {
          message: "Network error. Please check your internet connection.",
          errors: {},
        } as ApiError;
      }
      throw error;
    }
  }

  // Authentication methods
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    return this.makeRequest<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return this.makeRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async getMe(token: string): Promise<AuthResponse["user"]> {
    return this.makeRequest<AuthResponse["user"]>("/auth/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Helper method to create username from form data
  static generateUsername(surname: string, firstname: string): string {
    const cleanSurname = surname.toLowerCase().replace(/[^a-z]/g, "");
    const cleanFirstname = firstname.toLowerCase().replace(/[^a-z]/g, "");
    const randomNum = Math.floor(Math.random() * 1000);
    return `${cleanFirstname}${cleanSurname}${randomNum}`;
  }

  // Helper method to generate password (you might want to let user set this)
  static generatePassword(): string {
    const length = 12;
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  }
}

// Add token storage methods
export const TokenStorage = {
  async getToken(): Promise<string | null> {
    // You'll need to install: npm install @react-native-async-storage/async-storage
    // import AsyncStorage from '@react-native-async-storage/async-storage';
    // return await AsyncStorage.getItem('authToken');

    // For now, return null - implement proper storage later
    return null;
  },

  async setToken(token: string): Promise<void> {
    // await AsyncStorage.setItem('authToken', token);
    console.log("Token stored:", token);
  },

  async removeToken(): Promise<void> {
    // await AsyncStorage.removeItem('authToken');
    console.log("Token removed");
  },
};

export default new ApiService();
