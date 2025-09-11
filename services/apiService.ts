// services/apiService.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
const API_BASE_URL = "https://cbtapi.filloptech.com/api"; // Assuming this is correct, otherwise use http://localhost:3000

// --- AUTHENTICATION TYPES ---

// CHANGED: Aligned with the OpenAPI schema for the /auth/register endpoint.
export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  address: string;
  state: string;
  LGA: string;
  role?: "student" | "admin" | "teacher"; // optional if backend allows
}

export interface LoginRequest {
  email: string;
  password: string;
}

// CHANGED: The user object is more detailed in the schema.
export interface User {
  id: string;
  username: string;
  email: string;
  role: "student" | "admin" | "teacher";
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  id: string;
  username?: string; // backend may or may not send
  email: string;
  role?: string;
  token: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

// --- EXAM ATTEMPT TYPES ---

export interface StartAttemptRequest {
  exam_paper_id: string;
}

export interface SubmitAnswersRequest {
  answers: Array<{
    question_id: string;
    selected_option_ids?: string[];
    short_answer_text?: string;
  }>;
}

// This is defined in the schema for the completion response
export interface CompleteAttemptResponse {
  message: string;
  attemptId: string;
  score: number;
  maxPossibleScore: number;
  status: string;
}

// This is the full UserExamAttempt schema
export interface ExamAttemptResponse {
  id: string;
  user_id: string;
  exam_paper_id: string;
  start_time: string;
  end_time?: string;
  score?: number;
  status: "in_progress" | "completed" | "graded" | "abandoned";
}

// --- EXAM & QUESTION TYPES ---

// CHANGED: Updated to match the ExamType schema precisely.
export interface ExamType {
  id: string;
  name: string;
  duration_minutes: number;
  is_simultaneous: boolean;
  min_papers_simultaneous?: number;
  max_papers_simultaneous?: number;
  description?: string;
}

// ADDED: Input type for creating/updating ExamType
export interface ExamTypeInput {
  name: string;
  duration_minutes: number;
  is_simultaneous?: boolean;
  min_papers_simultaneous?: number;
  max_papers_simultaneous?: number;
  description?: string;
}

// CHANGED: Renamed and updated to match ExamPaperInput schema. Added required exam_type_id.
export interface ExamPaperInput {
  title: string;
  exam_id: string;
  exam_type_id: string; // This was missing and is required
  description?: string;
  topic_id?: string;
}

// CHANGED: Expanded to match the detailed ExamPaperResponse schema.
export interface ExamPaperResponse {
  id: string;
  title: string;
  description?: string;
  exam_id: string;
  exam_name?: string;
  exam_year?: number;
  topic_id?: string;
  topic_name?: string;
  exam_type_id: string;
  exam_type_name?: string;
  exam_type_duration_minutes?: number;
  question_count: number;
  Questions?: QuestionResponse[]; // Included for the GET by ID endpoint
}

// CHANGED: Updated property names to match QuestionInput schema.
export interface QuestionInput {
  text: string;
  question_type:
    | "MCQ_SINGLE"
    | "MCQ_MULTIPLE"
    | "True/False"
    | "Short Answer"
    | "Essay";
  difficulty_level: "Easy" | "Medium" | "Hard";
  exam_paper_id: string;
  options?: Array<{ id?: string; text: string; is_correct: boolean }>;
}

// CHANGED: Expanded to match the Question schema.
export interface QuestionResponse {
  id: string;
  text: string;
  question_type: string;
  difficulty_level: string;
  exam_paper_id: string;
  exam_paper_title?: string;
  topic_name?: string;
  options: Array<{ id: string; text: string; is_correct?: boolean }>; // is_correct might not be sent to students
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

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

      if (response.status === 204) {
        // Handle No Content response
        return {} as T;
      }

      const data = await response.json().catch(() => ({}));

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
        throw {
          message: "Network error. Please check your internet connection.",
          errors: {},
        } as ApiError;
      }
      throw error;
    }
  }

  // --- Authentication ---
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

  async getMe(): Promise<User> {
    return this.makeRequest<User>("/auth/me");
  }

  // --- Exam Attempts ---
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

  async completeAttempt(attemptId: string): Promise<CompleteAttemptResponse> {
    return this.makeRequest<CompleteAttemptResponse>(
      `/exam-attempts/${attemptId}/complete`,
      {
        method: "POST",
      }
    );
  }

  // REMOVED: No endpoint for GET /exam-attempts/{id} in the schema.
  // async getExamAttempt(id: string) { ... }

  // --- Exam Types ---
  async getExamTypes(): Promise<ExamType[]> {
    return this.makeRequest<ExamType[]>("/exam-types");
  }

  async getExamType(id: string): Promise<ExamType> {
    return this.makeRequest<ExamType>(`/exam-types/${id}`);
  }

  async createExamType(data: ExamTypeInput): Promise<ExamType> {
    return this.makeRequest<ExamType>("/exam-types", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // ADDED: Update Exam Type endpoint.
  async updateExamType(id: string, data: ExamTypeInput): Promise<ExamType> {
    return this.makeRequest<ExamType>(`/exam-types/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // ADDED: Delete Exam Type endpoint.
  async deleteExamType(id: string): Promise<void> {
    return this.makeRequest<void>(`/exam-types/${id}`, {
      method: "DELETE",
    });
  }

  // REMOVED: No endpoints for /topics or /exams in the schema.
  // async getTopics() { ... }
  // async getExams() { ... }

  // --- Exam Papers ---
  async getExamPapers(filters?: {
    examId?: string; // CHANGED: from exam_id to examId
    topicId?: string; // CHANGED: from topic_id to topicId
  }): Promise<ExamPaperResponse[]> {
    const params = new URLSearchParams(filters as any).toString();
    const endpoint = params ? `/exam-papers?${params}` : "/exam-papers";
    return this.makeRequest<ExamPaperResponse[]>(endpoint);
  }

  async getExamPaper(id: string): Promise<ExamPaperResponse> {
    return this.makeRequest<ExamPaperResponse>(`/exam-papers/${id}`);
  }

  async createExamPaper(data: ExamPaperInput): Promise<ExamPaperResponse> {
    return this.makeRequest<ExamPaperResponse>("/exam-papers", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // ADDED: Update Exam Paper endpoint.
  async updateExamPaper(
    id: string,
    data: ExamPaperInput
  ): Promise<ExamPaperResponse> {
    return this.makeRequest<ExamPaperResponse>(`/exam-papers/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // ADDED: Delete Exam Paper endpoint.
  async deleteExamPaper(id: string): Promise<void> {
    return this.makeRequest<void>(`/exam-papers/${id}`, {
      method: "DELETE",
    });
  }

  // --- Questions ---
  async getQuestions(filters?: {
    examPaperId?: string;
    difficulty?: string;
    type?: string;
  }): Promise<QuestionResponse[]> {
    const params = new URLSearchParams(filters as any).toString();
    const endpoint = params ? `/questions?${params}` : "/questions";
    return this.makeRequest<QuestionResponse[]>(endpoint);
  }

  async getQuestion(id: string): Promise<QuestionResponse> {
    return this.makeRequest<QuestionResponse>(`/questions/${id}`);
  }

  async createQuestion(data: QuestionInput): Promise<QuestionResponse> {
    return this.makeRequest<QuestionResponse>("/questions", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // ADDED: Update Question endpoint.
  async updateQuestion(
    id: string,
    data: QuestionInput
  ): Promise<QuestionResponse> {
    return this.makeRequest<QuestionResponse>(`/questions/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // ADDED: Delete Question endpoint.
  async deleteQuestion(id: string): Promise<void> {
    return this.makeRequest<void>(`/questions/${id}`, {
      method: "DELETE",
    });
  }

  // Static helpers (unchanged)
  static generateUsername(surname: string, firstname: string): string {
    const cleanSurname = surname.toLowerCase().replace(/[^a-z]/g, "");
    const cleanFirstname = firstname.toLowerCase().replace(/[^a-z]/g, "");
    const randomNum = Math.floor(Math.random() * 1000);
    return `${cleanFirstname}${cleanSurname}${randomNum}`;
  }

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

// Token storage (unchanged)
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
