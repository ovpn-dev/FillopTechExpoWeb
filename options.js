var options = {
  swaggerDoc: {
    openapi: "3.0.0",
    info: {
      title: "Exam Question & Management API",
      version: "1.0.0",
      description:
        "An API for managing exam questions, papers, user attempts, and authentication.",
      contact: {
        name: "Your Name/Team",
        email: "your_email@example.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token in the format: Bearer <token>",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              readOnly: true,
            },
            username: {
              type: "string",
              example: "testuser",
            },
            email: {
              type: "string",
              format: "email",
              example: "test@example.com",
            },
            role: {
              type: "string",
              enum: ["student", "admin"],
              example: "student",
            },
            created_at: {
              type: "string",
              format: "date-time",
              readOnly: true,
            },
            updated_at: {
              type: "string",
              format: "date-time",
              readOnly: true,
            },
          },
          required: ["username", "email", "password_hash", "role"],
        },
        Exam: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              readOnly: true,
            },
            name: {
              type: "string",
              example: "Annual Math Exam",
            },
            exam_year: {
              type: "integer",
              example: 2024,
            },
            description: {
              type: "string",
              nullable: true,
              example: "Comprehensive exam covering all math topics.",
            },
            created_at: {
              type: "string",
              format: "date-time",
              readOnly: true,
            },
            updated_at: {
              type: "string",
              format: "date-time",
              readOnly: true,
            },
          },
          required: ["name", "exam_year"],
        },
        Topic: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              readOnly: true,
            },
            name: {
              type: "string",
              example: "Algebra",
            },
            description: {
              type: "string",
              nullable: true,
              example: "Basic and advanced algebra topics.",
            },
            created_at: {
              type: "string",
              format: "date-time",
              readOnly: true,
            },
            updated_at: {
              type: "string",
              format: "date-time",
              readOnly: true,
            },
          },
        },
        ExamPaper: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              readOnly: true,
            },
            title: {
              type: "string",
              example: "Algebra Paper 1",
            },
            description: {
              type: "string",
              nullable: true,
              example: "Questions on linear equations and inequalities.",
            },
            duration_minutes: {
              type: "integer",
              example: 90,
            },
            exam_id: {
              type: "string",
              format: "uuid",
              description: "ID of the parent Exam",
            },
            topic_id: {
              type: "string",
              format: "uuid",
              nullable: true,
              description: "ID of the related Topic",
            },
            created_at: {
              type: "string",
              format: "date-time",
              readOnly: true,
            },
            updated_at: {
              type: "string",
              format: "date-time",
              readOnly: true,
            },
          },
          required: ["title", "exam_id"],
        },
        Option: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              readOnly: true,
            },
            text: {
              type: "string",
              example: "Option A text",
            },
            is_correct: {
              type: "boolean",
              example: false,
            },
            question_id: {
              type: "string",
              format: "uuid",
              readOnly: true,
            },
            created_at: {
              type: "string",
              format: "date-time",
              readOnly: true,
            },
            updated_at: {
              type: "string",
              format: "date-time",
              readOnly: true,
            },
          },
        },
        UserExamAttempt: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              readOnly: true,
            },
            user_id: {
              type: "string",
              format: "uuid",
              readOnly: true,
            },
            exam_paper_id: {
              type: "string",
              format: "uuid",
              readOnly: true,
            },
            start_time: {
              type: "string",
              format: "date-time",
              readOnly: true,
            },
            end_time: {
              type: "string",
              format: "date-time",
              nullable: true,
            },
            score: {
              type: "number",
              format: "float",
              nullable: true,
            },
            status: {
              type: "string",
              enum: ["in_progress", "completed", "graded", "abandoned"],
              example: "in_progress",
            },
            created_at: {
              type: "string",
              format: "date-time",
              readOnly: true,
            },
            updated_at: {
              type: "string",
              format: "date-time",
              readOnly: true,
            },
          },
        },
        UserAnswer: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              readOnly: true,
            },
            user_exam_attempt_id: {
              type: "string",
              format: "uuid",
              readOnly: true,
            },
            question_id: {
              type: "string",
              format: "uuid",
              readOnly: true,
            },
            selected_option_ids: {
              type: "array",
              items: {
                type: "string",
                format: "uuid",
              },
              nullable: true,
              description: "Array of selected option IDs for MCQ types.",
            },
            short_answer_text: {
              type: "string",
              nullable: true,
              description: "User's text answer for short answer/essay types.",
            },
            is_correct: {
              type: "boolean",
              nullable: true,
              description:
                "True if answer is correct (for auto-graded questions).",
            },
            score_obtained: {
              type: "number",
              format: "float",
              nullable: true,
              description: "Score obtained for this specific question.",
            },
            created_at: {
              type: "string",
              format: "date-time",
              readOnly: true,
            },
            updated_at: {
              type: "string",
              format: "date-time",
              readOnly: true,
            },
          },
        },
        ExamPaperInput: {
          type: "object",
          required: ["title", "exam_id", "exam_type_id"],
          properties: {
            title: {
              type: "string",
              description: "The title of the exam paper.",
              example: "Midterm Exam - Calculus",
            },
            description: {
              type: "string",
              nullable: true,
              description: "A brief description of the exam paper.",
              example:
                "Covers differential and integral calculus up to single variable.",
            },
            exam_id: {
              type: "string",
              format: "uuid",
              description: "The ID of the parent Exam this paper belongs to.",
              example: "e1e2e3e4-f5f6-7890-1234-567890abcdef",
            },
            topic_id: {
              type: "string",
              format: "uuid",
              nullable: true,
              description: "The ID of the primary topic this paper covers.",
              example: "t1t2t3t4-a5a6-7890-1234-567890abcdef",
            },
            exam_type_id: {
              type: "string",
              format: "uuid",
              description: "The ID of the ExamType for this paper.",
              example: "ty1ty2ty3ty4-ty5ty6-7890-1234-567890abcdef",
            },
          },
        },
        ExamPaperResponse: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              readOnly: true,
            },
            title: {
              type: "string",
            },
            description: {
              type: "string",
              nullable: true,
            },
            exam_id: {
              type: "string",
              format: "uuid",
            },
            exam_name: {
              type: "string",
              nullable: true,
              description: "Name of the parent exam",
            },
            exam_year: {
              type: "integer",
              nullable: true,
              description: "Year of the parent exam",
            },
            topic_id: {
              type: "string",
              format: "uuid",
              nullable: true,
            },
            topic_name: {
              type: "string",
              nullable: true,
              description: "Name of the associated topic",
            },
            exam_type_id: {
              type: "string",
              format: "uuid",
            },
            exam_type_name: {
              type: "string",
              nullable: true,
              description: "Name of the associated exam type",
            },
            exam_type_duration_minutes: {
              type: "integer",
              nullable: true,
              description: "Default duration from associated exam type",
            },
            exam_type_is_simultaneous: {
              type: "boolean",
              nullable: true,
              description: "From associated exam type",
            },
            exam_type_min_papers_simultaneous: {
              type: "integer",
              nullable: true,
              description: "From associated exam type",
            },
            exam_type_max_papers_simultaneous: {
              type: "integer",
              nullable: true,
              description: "From associated exam type",
            },
            question_count: {
              type: "integer",
              description: "Number of questions in this paper",
              readOnly: true,
              example: 15,
            },
            created_at: {
              type: "string",
              format: "date-time",
              readOnly: true,
            },
            updated_at: {
              type: "string",
              format: "date-time",
              readOnly: true,
            },
            Questions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: {
                    type: "string",
                    format: "uuid",
                  },
                  text: {
                    type: "string",
                  },
                  question_type: {
                    type: "string",
                  },
                  difficulty_level: {
                    type: "string",
                  },
                  options: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: {
                          type: "string",
                          format: "uuid",
                        },
                        text: {
                          type: "string",
                        },
                        is_correct: {
                          type: "boolean",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        ExamTypeInput: {
          type: "object",
          required: ["name", "duration_minutes"],
          properties: {
            name: {
              type: "string",
              description:
                'The name of the exam type (e.g., "Standard MCQ", "Essay Exam").',
              example: "Standard MCQ",
            },
            duration_minutes: {
              type: "integer",
              description:
                "The default duration in minutes for papers of this type.",
              example: 60,
            },
            is_simultaneous: {
              type: "boolean",
              description:
                "If true, multiple selected papers of this type are taken at once.",
              example: false,
            },
            min_papers_simultaneous: {
              type: "integer",
              nullable: true,
              description:
                "Minimum number of papers required to be selected if simultaneous.",
              example: 2,
            },
            max_papers_simultaneous: {
              type: "integer",
              nullable: true,
              description:
                "Maximum number of papers allowed to be selected if simultaneous.",
              example: 5,
            },
            description: {
              type: "string",
              nullable: true,
              description: "A brief description of this exam type.",
              example: "A standard multiple choice questionnaire type exam.",
            },
          },
        },
        ExamType: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              readOnly: true,
            },
            name: {
              type: "string",
            },
            duration_minutes: {
              type: "integer",
            },
            is_simultaneous: {
              type: "boolean",
            },
            min_papers_simultaneous: {
              type: "integer",
              nullable: true,
            },
            max_papers_simultaneous: {
              type: "integer",
              nullable: true,
            },
            description: {
              type: "string",
              nullable: true,
            },
            created_at: {
              type: "string",
              format: "date-time",
              readOnly: true,
            },
            updated_at: {
              type: "string",
              format: "date-time",
              readOnly: true,
            },
          },
        },
        OptionInput: {
          type: "object",
          required: ["text", "is_correct"],
          properties: {
            id: {
              type: "string",
              format: "uuid",
              description: "Optional. Only used for updating existing options.",
            },
            text: {
              type: "string",
              description: "The text of the option.",
              example: "Paris",
            },
            is_correct: {
              type: "boolean",
              description: "True if this is a correct answer option.",
              example: true,
            },
          },
        },
        QuestionInput: {
          type: "object",
          required: [
            "text",
            "question_type",
            "difficulty_level",
            "exam_paper_id",
          ],
          properties: {
            text: {
              type: "string",
              description: "The text of the question.",
              example: "What is the capital of France?",
            },
            question_type: {
              type: "string",
              enum: [
                "MCQ_SINGLE",
                "MCQ_MULTIPLE",
                "True/False",
                "Short Answer",
                "Essay",
              ],
              description: "The type of the question.",
              example: "MCQ_SINGLE",
            },
            difficulty_level: {
              type: "string",
              enum: ["Easy", "Medium", "Hard"],
              description: "The difficulty level of the question.",
              example: "Easy",
            },
            exam_paper_id: {
              type: "string",
              format: "uuid",
              description: "The ID of the exam paper this question belongs to.",
              example: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
            },
            options: {
              type: "array",
              items: {
                $ref: "#/components/schemas/OptionInput",
              },
              description: "Array of options for MCQ questions.",
            },
          },
        },
        Question: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              readOnly: true,
            },
            text: {
              type: "string",
            },
            question_type: {
              type: "string",
              enum: [
                "MCQ_SINGLE",
                "MCQ_MULTIPLE",
                "True/False",
                "Short Answer",
                "Essay",
              ],
            },
            difficulty_level: {
              type: "string",
              enum: ["Easy", "Medium", "Hard"],
            },
            exam_paper_id: {
              type: "string",
              format: "uuid",
            },
            exam_paper_title: {
              type: "string",
              nullable: true,
            },
            topic_name: {
              type: "string",
              nullable: true,
            },
            options: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: {
                    type: "string",
                    format: "uuid",
                  },
                  text: {
                    type: "string",
                  },
                  is_correct: {
                    type: "boolean",
                  },
                },
              },
            },
            created_at: {
              type: "string",
              format: "date-time",
              readOnly: true,
            },
            updated_at: {
              type: "string",
              format: "date-time",
              readOnly: true,
            },
          },
        },
      },
    },
    paths: {
      "/api/auth/register": {
        post: {
          summary: "Register a new user",
          tags: ["Authentication"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["username", "email", "password"],
                  properties: {
                    username: {
                      type: "string",
                      example: "johndoe",
                    },
                    email: {
                      type: "string",
                      format: "email",
                      example: "john@example.com",
                    },
                    password: {
                      type: "string",
                      format: "password",
                      example: "password123",
                    },
                    role: {
                      type: "string",
                      enum: ["student", "admin", "teacher"],
                      default: "student",
                      example: "student",
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "User registered successfully.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      id: {
                        type: "string",
                        format: "uuid",
                      },
                      username: {
                        type: "string",
                      },
                      email: {
                        type: "string",
                      },
                      role: {
                        type: "string",
                      },
                      token: {
                        type: "string",
                      },
                    },
                  },
                },
              },
            },
            400: {
              description: "Invalid input or user already exists.",
            },
            500: {
              description: "Server error.",
            },
          },
        },
      },
      "/api/auth/login": {
        post: {
          summary: "Log in a user",
          tags: ["Authentication"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "password"],
                  properties: {
                    email: {
                      type: "string",
                      format: "email",
                      example: "john@example.com",
                    },
                    password: {
                      type: "string",
                      format: "password",
                      example: "password123",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "User logged in successfully.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      id: {
                        type: "string",
                        format: "uuid",
                      },
                      username: {
                        type: "string",
                      },
                      email: {
                        type: "string",
                      },
                      role: {
                        type: "string",
                      },
                      token: {
                        type: "string",
                      },
                    },
                  },
                },
              },
            },
            400: {
              description: "Invalid credentials or missing fields.",
            },
            500: {
              description: "Server error.",
            },
          },
        },
      },
      "/api/auth/me": {
        get: {
          summary: "Get current logged-in user's profile",
          tags: ["Authentication"],
          security: [
            {
              bearerAuth: [],
            },
          ],
          responses: {
            200: {
              description: "Current user profile.",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/User",
                  },
                },
              },
            },
            401: {
              description: "Not authorized, token missing or invalid.",
            },
            500: {
              description: "Server error.",
            },
          },
        },
      },
      "/api/exam-attempts/start": {
        post: {
          summary: "Start a new exam attempt for a paper",
          tags: ["Exam Attempts"],
          security: [
            {
              bearerAuth: [],
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["exam_paper_id"],
                  properties: {
                    exam_paper_id: {
                      type: "string",
                      format: "uuid",
                      description: "The ID of the exam paper to attempt.",
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "Exam attempt started successfully.",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/UserExamAttempt",
                  },
                },
              },
            },
            400: {
              description: "Bad request (e.g., attempt already in progress).",
            },
            401: {
              description: "Unauthorized.",
            },
            500: {
              description: "Internal server error.",
            },
          },
        },
      },
      "/api/exam-attempts/{attemptId}/submit-answers": {
        post: {
          summary: "Submit answers for an ongoing exam attempt",
          tags: ["Exam Attempts"],
          security: [
            {
              bearerAuth: [],
            },
          ],
          parameters: [
            {
              in: "path",
              name: "attemptId",
              schema: {
                type: "string",
                format: "uuid",
              },
              required: true,
              description: "The ID of the exam attempt.",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    answers: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          question_id: {
                            type: "string",
                            format: "uuid",
                            description: "The ID of the question.",
                          },
                          selected_option_ids: {
                            type: "array",
                            items: {
                              type: "string",
                              format: "uuid",
                            },
                            description:
                              "Array of IDs of selected options for MCQ.",
                          },
                          short_answer_text: {
                            type: "string",
                            description:
                              "User's text answer for short answer/essay questions.",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Answers submitted successfully.",
            },
            401: {
              description: "Unauthorized.",
            },
            403: {
              description: "Forbidden (attempt not found or not in progress).",
            },
            500: {
              description: "Internal server error.",
            },
          },
        },
      },
      "/api/exam-attempts/{attemptId}/complete": {
        post: {
          summary:
            "Complete an exam attempt and calculate score for auto-graded questions",
          tags: ["Exam Attempts"],
          security: [
            {
              bearerAuth: [],
            },
          ],
          parameters: [
            {
              in: "path",
              name: "attemptId",
              schema: {
                type: "string",
                format: "uuid",
              },
              required: true,
              description: "The ID of the exam attempt.",
            },
          ],
          responses: {
            200: {
              description: "Exam attempt completed and scored.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                      },
                      attemptId: {
                        type: "string",
                        format: "uuid",
                      },
                      score: {
                        type: "number",
                      },
                      maxPossibleScore: {
                        type: "number",
                      },
                      status: {
                        type: "string",
                      },
                    },
                  },
                },
              },
            },
            401: {
              description: "Unauthorized.",
            },
            403: {
              description: "Forbidden (attempt not found or not in progress).",
            },
            500: {
              description: "Internal server error.",
            },
          },
        },
      },
      "/api/exam-papers": {
        get: {
          summary: "Retrieve a list of exam papers",
          tags: ["Exam Papers"],
          parameters: [
            {
              in: "query",
              name: "examId",
              schema: {
                type: "string",
                format: "uuid",
              },
              description: "Filter exam papers by parent Exam ID",
            },
            {
              in: "query",
              name: "topicId",
              schema: {
                type: "string",
                format: "uuid",
              },
              description: "Filter exam papers by Topic ID",
            },
          ],
          responses: {
            200: {
              description: "A list of exam papers.",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/ExamPaperResponse",
                    },
                  },
                },
              },
            },
            500: {
              description: "Internal server error.",
            },
          },
        },
        post: {
          summary: "Create a new exam paper",
          tags: ["Exam Papers"],
          security: [
            {
              bearerAuth: [],
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ExamPaperInput",
                },
              },
            },
          },
          responses: {
            201: {
              description: "Exam paper created successfully.",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ExamPaperResponse",
                  },
                },
              },
            },
            400: {
              description: "Invalid input or missing required fields.",
            },
            401: {
              description: "Unauthorized.",
            },
            403: {
              description: "Forbidden (insufficient role).",
            },
            500: {
              description: "Internal server error.",
            },
          },
        },
      },
      "/api/exam-papers/{id}": {
        get: {
          summary:
            "Get a single exam paper by ID with its questions and options",
          tags: ["Exam Papers"],
          parameters: [
            {
              in: "path",
              name: "id",
              schema: {
                type: "string",
                format: "uuid",
              },
              required: true,
              description: "The ID of the exam paper",
            },
          ],
          responses: {
            200: {
              description:
                "A single exam paper object with its questions and options.",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ExamPaperResponse",
                  },
                },
              },
            },
            404: {
              description: "Exam paper not found.",
            },
            500: {
              description: "Internal server error.",
            },
          },
        },
        put: {
          summary: "Update an existing exam paper",
          tags: ["Exam Papers"],
          security: [
            {
              bearerAuth: [],
            },
          ],
          parameters: [
            {
              in: "path",
              name: "id",
              schema: {
                type: "string",
                format: "uuid",
              },
              required: true,
              description: "The ID of the exam paper to update",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ExamPaperInput",
                },
              },
            },
          },
          responses: {
            200: {
              description: "Exam paper updated successfully.",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ExamPaperResponse",
                  },
                },
              },
            },
            400: {
              description: "Invalid input.",
            },
            401: {
              description: "Unauthorized.",
            },
            403: {
              description: "Forbidden (insufficient role).",
            },
            404: {
              description: "Exam paper not found.",
            },
            500: {
              description: "Internal server error.",
            },
          },
        },
        delete: {
          summary: "Delete an exam paper by ID",
          tags: ["Exam Papers"],
          security: [
            {
              bearerAuth: [],
            },
          ],
          parameters: [
            {
              in: "path",
              name: "id",
              schema: {
                type: "string",
                format: "uuid",
              },
              required: true,
              description: "The ID of the exam paper to delete",
            },
          ],
          responses: {
            204: {
              description: "Exam paper deleted successfully. (No content)",
            },
            401: {
              description: "Unauthorized.",
            },
            403: {
              description: "Forbidden (insufficient role).",
            },
            404: {
              description: "Exam paper not found.",
            },
            500: {
              description: "Internal server error.",
            },
          },
        },
      },
      "/api/exam-types": {
        get: {
          summary: "Retrieve a list of all exam types",
          tags: ["Exam Types"],
          responses: {
            200: {
              description: "A list of exam types.",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/ExamType",
                    },
                  },
                },
              },
            },
            500: {
              description: "Internal server error.",
            },
          },
        },
        post: {
          summary: "Create a new exam type",
          tags: ["Exam Types"],
          security: [
            {
              bearerAuth: [],
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ExamTypeInput",
                },
              },
            },
          },
          responses: {
            201: {
              description: "Exam type created successfully.",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ExamType",
                  },
                },
              },
            },
            400: {
              description: "Invalid input.",
            },
            401: {
              description: "Unauthorized.",
            },
            403: {
              description: "Forbidden (insufficient role).",
            },
            500: {
              description: "Internal server error.",
            },
          },
        },
      },
      "/api/exam-types/{id}": {
        get: {
          summary: "Get an exam type by ID",
          tags: ["Exam Types"],
          parameters: [
            {
              in: "path",
              name: "id",
              schema: {
                type: "string",
                format: "uuid",
              },
              required: true,
              description: "The ID of the exam type",
            },
          ],
          responses: {
            200: {
              description: "A single exam type object.",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ExamType",
                  },
                },
              },
            },
            404: {
              description: "Exam Type not found.",
            },
            500: {
              description: "Internal server error.",
            },
          },
        },
        put: {
          summary: "Update an existing exam type",
          tags: ["Exam Types"],
          security: [
            {
              bearerAuth: [],
            },
          ],
          parameters: [
            {
              in: "path",
              name: "id",
              schema: {
                type: "string",
                format: "uuid",
              },
              required: true,
              description: "The ID of the exam type to update",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ExamTypeInput",
                },
              },
            },
          },
          responses: {
            200: {
              description: "Exam type updated successfully.",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ExamType",
                  },
                },
              },
            },
            400: {
              description: "Invalid input.",
            },
            401: {
              description: "Unauthorized.",
            },
            403: {
              description: "Forbidden (insufficient role).",
            },
            404: {
              description: "Exam Type not found.",
            },
            500: {
              description: "Internal server error.",
            },
          },
        },
        delete: {
          summary: "Delete an exam type by ID",
          tags: ["Exam Types"],
          security: [
            {
              bearerAuth: [],
            },
          ],
          parameters: [
            {
              in: "path",
              name: "id",
              schema: {
                type: "string",
                format: "uuid",
              },
              required: true,
              description: "The ID of the exam type to delete",
            },
          ],
          responses: {
            204: {
              description: "Exam type deleted successfully. (No content)",
            },
            400: {
              description:
                "Cannot delete exam type as it is associated with existing exam papers.",
            },
            401: {
              description: "Unauthorized.",
            },
            403: {
              description: "Forbidden (insufficient role).",
            },
            404: {
              description: "Exam Type not found.",
            },
            500: {
              description: "Internal server error.",
            },
          },
        },
      },
      "/api/questions": {
        get: {
          summary: "Retrieve a list of questions",
          tags: ["Questions"],
          parameters: [
            {
              in: "query",
              name: "examPaperId",
              schema: {
                type: "string",
                format: "uuid",
              },
              description: "Filter questions by Exam Paper ID",
            },
            {
              in: "query",
              name: "difficulty",
              schema: {
                type: "string",
                enum: ["Easy", "Medium", "Hard"],
              },
              description: "Filter questions by difficulty level",
            },
            {
              in: "query",
              name: "type",
              schema: {
                type: "string",
                enum: [
                  "MCQ_SINGLE",
                  "MCQ_MULTIPLE",
                  "True/False",
                  "Short Answer",
                  "Essay",
                ],
              },
              description: "Filter questions by question type",
            },
          ],
          responses: {
            200: {
              description: "A list of questions.",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/Question",
                    },
                  },
                },
              },
            },
            500: {
              description: "Internal server error.",
            },
          },
        },
        post: {
          summary: "Create a new question with options",
          tags: ["Questions"],
          security: [
            {
              bearerAuth: [],
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/QuestionInput",
                },
              },
            },
          },
          responses: {
            201: {
              description: "Question created successfully.",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Question",
                  },
                },
              },
            },
            400: {
              description: "Invalid input.",
            },
            401: {
              description: "Unauthorized.",
            },
            403: {
              description: "Forbidden (insufficient role).",
            },
            500: {
              description: "Internal server error.",
            },
          },
        },
      },
      "/api/questions/{id}": {
        get: {
          summary: "Get a question by ID",
          tags: ["Questions"],
          parameters: [
            {
              in: "path",
              name: "id",
              schema: {
                type: "string",
                format: "uuid",
              },
              required: true,
              description: "The ID of the question",
            },
          ],
          responses: {
            200: {
              description: "A single question object.",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Question",
                  },
                },
              },
            },
            404: {
              description: "Question not found.",
            },
            500: {
              description: "Internal server error.",
            },
          },
        },
        put: {
          summary: "Update an existing question and its options",
          tags: ["Questions"],
          security: [
            {
              bearerAuth: [],
            },
          ],
          parameters: [
            {
              in: "path",
              name: "id",
              schema: {
                type: "string",
                format: "uuid",
              },
              required: true,
              description: "The ID of the question to update",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/QuestionInput",
                },
              },
            },
          },
          responses: {
            200: {
              description: "Question updated successfully.",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Question",
                  },
                },
              },
            },
            400: {
              description: "No fields to update provided or invalid input.",
            },
            401: {
              description: "Unauthorized.",
            },
            403: {
              description: "Forbidden (insufficient role).",
            },
            404: {
              description: "Question not found.",
            },
            500: {
              description: "Internal server error.",
            },
          },
        },
        delete: {
          summary: "Delete a question by ID",
          tags: ["Questions"],
          security: [
            {
              bearerAuth: [],
            },
          ],
          parameters: [
            {
              in: "path",
              name: "id",
              schema: {
                type: "string",
                format: "uuid",
              },
              required: true,
              description: "The ID of the question to delete",
            },
          ],
          responses: {
            204: {
              description: "Question deleted successfully. (No content)",
            },
            401: {
              description: "Unauthorized.",
            },
            403: {
              description: "Forbidden (insufficient role).",
            },
            404: {
              description: "Question not found.",
            },
            500: {
              description: "Internal server error.",
            },
          },
        },
      },
    },
    tags: [
      {
        name: "Authentication",
        description: "User authentication and authorization",
      },
      {
        name: "Exam Attempts",
        description:
          "API for users to start, submit, and complete exam attempts",
      },
      {
        name: "Exam Types",
        description:
          "API for managing predefined types of exams (e.g., duration, simultaneous taking rules)",
      },
      {
        name: "Questions",
        description: "API for managing exam questions with options",
      },
    ],
  },
  customOptions: {},
};
