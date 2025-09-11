// app/services/questionService.ts
export interface Question {
  id: string;
  subject: string;
  text: string;
  options: string[];
  correctAnswer: string;
}

export class QuestionService {
  /**
   * Generate questions for a specific subject
   */
  static generateQuestionsForSubject(
    subject: string,
    count: number = 40
  ): Question[] {
    return Array.from({ length: count }, (_, i) => ({
      id: `${subject}_q_${i + 1}`,
      subject: subject,
      text: `${subject} - Sample question ${i + 1}. This is a sample question for demonstration purposes.`,
      options: [
        `${subject} Option A for question ${i + 1}`,
        `${subject} Option B for question ${i + 1}`,
        `${subject} Option C for question ${i + 1}`,
        `${subject} Option D for question ${i + 1}`,
      ],
      correctAnswer: "A", // Mock correct answer
    }));
  }

  /**
   * Generate all questions for an exam configuration
   */
  static generateExamQuestions(
    subjects: string[],
    questionsPerSubject: number = 40
  ): Question[] {
    const allQuestions: Question[] = [];

    subjects.forEach((subject) => {
      const subjectQuestions = this.generateQuestionsForSubject(
        subject,
        questionsPerSubject
      );
      allQuestions.push(...subjectQuestions);
    });

    return allQuestions;
  }

  /**
   * Get questions for a specific subject from exam questions
   */
  static getQuestionsForSubject(
    allQuestions: Question[],
    subject: string
  ): Question[] {
    return allQuestions.filter((q) => q.subject === subject);
  }

  /**
   * Get a specific question by ID
   */
  static getQuestionById(
    allQuestions: Question[],
    questionId: string
  ): Question | undefined {
    return allQuestions.find((q) => q.id === questionId);
  }

  /**
   * Calculate total questions for exam configuration
   */
  static getTotalQuestions(
    subjects: string[],
    questionsPerSubject: number = 40
  ): number {
    return subjects.length * questionsPerSubject;
  }

  /**
   * Get answered questions count for a subject
   */
  static getAnsweredQuestionsInSubject(
    allQuestions: Question[],
    subject: string,
    userAnswers: Record<string, string>
  ): number {
    const subjectQuestions = this.getQuestionsForSubject(allQuestions, subject);
    return subjectQuestions.filter((q) => userAnswers[q.id]).length;
  }

  /**
   * Get question navigation info
   */
  static getQuestionNavigation(
    subjects: string[],
    currentSubject: string,
    currentQuestionInSubject: number,
    questionsPerSubject: number = 40
  ) {
    const currentSubjectIndex = subjects.indexOf(currentSubject);
    const isFirstQuestion =
      currentQuestionInSubject === 0 && currentSubjectIndex === 0;
    const isLastQuestion =
      currentQuestionInSubject === questionsPerSubject - 1 &&
      currentSubjectIndex === subjects.length - 1;

    return {
      isFirstQuestion,
      isLastQuestion,
      currentSubjectIndex,
      totalSubjects: subjects.length,
      currentQuestionNumber: currentQuestionInSubject + 1,
      totalQuestionsInSubject: questionsPerSubject,
    };
  }
}
