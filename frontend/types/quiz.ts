export type QuestionType = "BOOLEAN" | "INPUT" | "CHECKBOX";

export interface Question {
  text: string;
  type: QuestionType;
  correctAnswer?: string;
  options?: string[];
  correctOptions?: string[];
}

export interface QuestionResponse {
  id: string;
  text: string;
  type: QuestionType;
  correctAnswer: string | null;
  options: string[];
  correctOptions: string[];
}
