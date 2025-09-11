// services/adminApiService.ts
import type {
  ApiError,
  // CORRECTED: Import the specific 'Input' types for request bodies.
  ExamPaperInput,
  ExamPaperResponse,
  ExamType,
  ExamTypeInput, // Added this import
  QuestionInput,
  QuestionResponse,
} from "./apiService";
import { TokenStorage } from "./apiService"; // Reusing the token handler

const API_BASE_URL = "https://cbtapi.filloptech.com/api";

class AdminApiService {
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
      if (!token) {
        throw new Error("Authentication token not found. Please log in.");
      }

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      };

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers,
        ...options,
      });

      // CORRECTED: For DELETE (204), we can just return, as the promise will be of type 'void'.
      if (response.status === 204) {
        return undefined as T;
      }

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
        throw {
          message: "Network error. Please check your internet connection.",
        } as ApiError;
      }
      throw error;
    }
  }

  // --- Exam Type Management ---
  // CORRECTED: Use the specific ExamTypeInput type.
  async createExamType(data: ExamTypeInput): Promise<ExamType> {
    return this.makeRequest<ExamType>(`/exam-types`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // CORRECTED: Use the specific ExamTypeInput type for updates.
  async updateExamType(id: string, data: ExamTypeInput): Promise<ExamType> {
    return this.makeRequest<ExamType>(`/exam-types/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // CORRECTED: Methods for DELETE operations now return Promise<void> for cleaner handling.
  async deleteExamType(id: string): Promise<void> {
    await this.makeRequest<void>(`/exam-types/${id}`, {
      method: "DELETE",
    });
  }

  // --- Exam Paper Management ---
  // CORRECTED: Use ExamPaperInput.
  async createExamPaper(data: ExamPaperInput): Promise<ExamPaperResponse> {
    return this.makeRequest<ExamPaperResponse>(`/exam-papers`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // CORRECTED: Use ExamPaperInput for updates.
  async updateExamPaper(
    id: string,
    data: ExamPaperInput
  ): Promise<ExamPaperResponse> {
    return this.makeRequest<ExamPaperResponse>(`/exam-papers/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteExamPaper(id: string): Promise<void> {
    await this.makeRequest<void>(`/exam-papers/${id}`, {
      method: "DELETE",
    });
  }

  // --- Question Management ---
  // CORRECTED: Use QuestionInput.
  async createQuestion(data: QuestionInput): Promise<QuestionResponse> {
    return this.makeRequest<QuestionResponse>(`/questions`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // CORRECTED: Use QuestionInput for updates.
  async updateQuestion(
    id: string,
    data: QuestionInput
  ): Promise<QuestionResponse> {
    return this.makeRequest<QuestionResponse>(`/questions/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteQuestion(id: string): Promise<void> {
    await this.makeRequest<void>(`/questions/${id}`, {
      method: "DELETE",
    });
  }
}

export default new AdminApiService();
