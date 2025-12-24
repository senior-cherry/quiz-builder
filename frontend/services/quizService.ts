const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export interface Question {
  text: string;
  type: "BOOLEAN" | "INPUT" | "CHECKBOX";
  correctAnswer?: string;
  options?: string[];
  correctOptions?: string[];
}

export interface QuestionResponse {
  id: string;
  text: string;
  type: "BOOLEAN" | "INPUT" | "CHECKBOX";
  correctAnswer: string | null;
  options: string[];
  correctOptions: string[];
}

export interface CreateQuizRequest {
  title: string;
  questions: Question[];
}

export interface Quiz {
  id: string;
  title: string;
  questions: QuestionResponse[];
}

export interface QuizListItem {
  id: string;
  title: string;
  questionCount: number;
}

export const quizService = {
  async createQuiz(data: CreateQuizRequest): Promise<Quiz> {
    const response = await fetch(`${API_BASE_URL}/quizzes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create quiz");
    }

    return response.json();
  },

  async getAllQuizzes(): Promise<QuizListItem[]> {
    const response = await fetch(`${API_BASE_URL}/quizzes`);

    if (!response.ok) {
      throw new Error("Failed to fetch quizzes");
    }

    return response.json();
  },

  async getQuizById(id: string): Promise<Quiz> {
    const response = await fetch(`${API_BASE_URL}/quizzes/${id}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Quiz not found");
      }
      throw new Error("Failed to fetch quiz");
    }

    return response.json();
  },

  async deleteQuiz(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/quizzes/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete quiz");
    }
  },
};
