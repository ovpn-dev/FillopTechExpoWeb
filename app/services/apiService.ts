// services/apiService.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
const API_BASE_URL = "https://cbtapi.filloptech.com:3000";

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

// Exam-related types (added)
export interface StartAttemptRequest {
  exam_paper_id: string; // UUID from ExamPaper
}

export interface SubmitAnswersRequest {
  answers: Array<{
    question_id: string; // UUID
    selected_option_ids?: string[]; // For MCQ; array of Option UUIDs
    short_answer_text?: string; // For essay/short
  }>;
}

export interface CompleteAttemptRequest {
  // Empty body? Or { end_time?: string } if manual
}

export interface ExamAttemptResponse {
  id: string; // UserExamAttempt.id
  user_id: string;
  exam_paper_id: string;
  start_time: string;
  end_time?: string;
  score?: number;
  status: "in_progress" | "completed" | "graded" | "abandoned";
}

export interface ExamType {
  id: string;
  name: string; // e.g., "JAMB"
  description?: string;
  max_subjects?: number;
  duration_minutes?: number;
  // Add from schema if more
}

export interface ExamPaperRequest {
  title: string; // e.g., "JAMB Math 2025"
  exam_id: string; // UUID from Exam
  topic_id?: string; // UUID from Topic (subject)
  description?: string;
  duration_minutes?: number;
}

export interface ExamPaperResponse {
  id: string;
  title: string;
  exam_id: string;
  topic_id?: string;
  duration_minutes?: number;
  // Questions/options via nested or separate GET
}

export interface QuestionRequest {
  text: string;
  type: "MCQ_SINGLE" | "MCQ_MULTIPLE" | "True/False" | "Short Answer" | "Essay";
  exam_paper_id?: string;
  difficulty?: "Easy" | "Medium" | "Hard";
  options?: Array<{ text: string; is_correct: boolean }>; // For MCQ
  // Add topic_id for subject filtering
}

export interface QuestionResponse {
  id: string;
  text: string;
  type: string;
  options: Array<{ id: string; text: string; is_correct: boolean }>;
  // From Option schema
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
      const token = await TokenStorage.getToken();
      const headers = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      };

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers,
        ...options,
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw {
          message: data.message || "An error occurred",
          errors: data.errors || {},
          status: response.status,
        } as ApiError & { status: number };
      }

      return response.json();
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

  async getMe(): Promise<AuthResponse["user"]> {
    return this.makeRequest<AuthResponse["user"]>("/auth/me");
  }

  // Exam Attempts (added)
  async startAttempt(req: StartAttemptRequest): Promise<ExamAttemptResponse> {
    return this.makeRequest<ExamAttemptResponse>("/exam-attempts/start", {
      method: "POST",
      body: JSON.stringify(req),
    });
  }

  async submitAnswers(
    attemptId: string,
    req: SubmitAnswersRequest
  ): Promise<{ message: string }> {
    return this.makeRequest<{ message: string }>(
      `/exam-attempts/${attemptId}/submit-answers`,
      {
        method: "POST",
        body: JSON.stringify(req),
      }
    );
  }

  async completeAttempt(
    attemptId: string,
    req?: CompleteAttemptRequest
  ): Promise<ExamAttemptResponse> {
    return this.makeRequest<ExamAttemptResponse>(
      `/exam-attempts/${attemptId}/complete`,
      {
        method: "POST",
        body: req ? JSON.stringify(req) : undefined,
      }
    );
  }

  // Exam Types (added; admin for POST/PUT/DELETE)
  async getExamTypes(): Promise<ExamType[]> {
    return this.makeRequest<ExamType[]>("/exam-types");
  }

  async createExamType(type: Partial<ExamType>): Promise<ExamType> {
    return this.makeRequest<ExamType>("/exam-types", {
      method: "POST",
      body: JSON.stringify(type),
    });
  }

  // Exam Papers (added)
  async getExamPapers(filters?: {
    exam_id?: string;
    topic_id?: string;
  }): Promise<ExamPaperResponse[]> {
    const params = new URLSearchParams(filters as any).toString();
    const endpoint = params ? `/exam-papers?${params}` : "/exam-papers";
    return this.makeRequest<ExamPaperResponse[]>(endpoint);
  }

  async createExamPaper(req: ExamPaperRequest): Promise<ExamPaperResponse> {
    return this.makeRequest<ExamPaperResponse>("/exam-papers", {
      method: "POST",
      body: JSON.stringify(req),
    });
  }

  async getExamPaper(
    id: string
  ): Promise<ExamPaperResponse & { questions: QuestionResponse[] }> {
    return this.makeRequest(`/exam-papers/${id}`);
  }

  // Questions (added)
  async getQuestions(filters?: {
    examPaperId?: string;
    difficulty?: string;
    type?: string;
  }): Promise<QuestionResponse[]> {
    const params = new URLSearchParams(filters as any).toString();
    const endpoint = params ? `/questions?${params}` : "/questions";
    return this.makeRequest<QuestionResponse[]>(endpoint);
  }

  async createQuestion(req: QuestionRequest): Promise<QuestionResponse> {
    return this.makeRequest<QuestionResponse>("/questions", {
      method: "POST",
      body: JSON.stringify(req),
    });
  }

  async getQuestion(id: string): Promise<QuestionResponse> {
    return this.makeRequest<QuestionResponse>(`/questions/${id}`);
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

// Token storage (updated with AsyncStorage)
export const TokenStorage = {
  async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem("authToken");
  },

  async setToken(token: string): Promise<void> {
    await AsyncStorage.setItem("authToken", token);
    console.log("Token stored:", token);
  },

  async removeToken(): Promise<void> {
    await AsyncStorage.removeItem("authToken");
    console.log("Token removed");
  },
};

export default new ApiService();
