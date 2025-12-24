import { useState } from "react";
import { useRouter } from "next/router";
import { Question, QuestionType } from "../../types/quiz";
import QuestionEditor from "../QuestionEditor";
import { quizService } from "../../services/quizService";

export default function QuizForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    {
      text: "",
      type: "BOOLEAN",
      correctAnswer: "true",
    },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: "",
        type: "BOOLEAN",
        correctAnswer: "true",
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (
    index: number,
    field: keyof Question,
    value: string | string[] | undefined
  ) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const updateQuestionType = (index: number, newType: QuestionType) => {
    const updated = [...questions];
    const question = updated[index];

    if (newType === "BOOLEAN") {
      updated[index] = {
        ...question,
        type: newType,
        correctAnswer: "true",
        options: undefined,
        correctOptions: undefined,
      };
    } else if (newType === "INPUT") {
      updated[index] = {
        ...question,
        type: newType,
        correctAnswer: "",
        options: undefined,
        correctOptions: undefined,
      };
    } else if (newType === "CHECKBOX") {
      updated[index] = {
        ...question,
        type: newType,
        correctAnswer: undefined,
        options: ["", ""],
        correctOptions: [],
      };
    }

    setQuestions(updated);
  };

  const addOption = (questionIndex: number) => {
    const updated = [...questions];
    if (!updated[questionIndex].options) {
      updated[questionIndex].options = [];
    }
    updated[questionIndex].options = [
      ...(updated[questionIndex].options || []),
      "",
    ];
    setQuestions(updated);
  };

  const updateOption = (
    questionIndex: number,
    optionIndex: number,
    value: string
  ) => {
    const updated = [...questions];
    if (!updated[questionIndex].options) {
      updated[questionIndex].options = [];
    }
    updated[questionIndex].options![optionIndex] = value;
    setQuestions(updated);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const updated = [...questions];
    if (updated[questionIndex].options) {
      updated[questionIndex].options = updated[questionIndex].options!.filter(
        (_, i) => i !== optionIndex
      );

      if (updated[questionIndex].correctOptions) {
        updated[questionIndex].correctOptions = updated[
          questionIndex
        ].correctOptions!.filter((opt) => opt !== optionIndex.toString());
        updated[questionIndex].correctOptions = updated[
          questionIndex
        ].correctOptions!.map((opt) => {
          const idx = parseInt(opt);
          if (idx > optionIndex) {
            return (idx - 1).toString();
          }
          return opt;
        });
      }
    }
    setQuestions(updated);
  };

  const toggleCorrectOption = (questionIndex: number, optionIndex: number) => {
    const updated = [...questions];
    if (!updated[questionIndex].correctOptions) {
      updated[questionIndex].correctOptions = [];
    }

    const optStr = optionIndex.toString();
    const currentOptions = updated[questionIndex].correctOptions || [];

    if (currentOptions.includes(optStr)) {
      updated[questionIndex].correctOptions = currentOptions.filter(
        (opt) => opt !== optStr
      );
    } else {
      updated[questionIndex].correctOptions = [...currentOptions, optStr];
    }
    setQuestions(updated);
  };

  const validateForm = (): string | null => {
    if (!title.trim()) {
      return "Please enter a quiz title";
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.text.trim()) {
        return `Please enter text for question ${i + 1}`;
      }

      if (q.type === "BOOLEAN" && !q.correctAnswer) {
        return `Please select a correct answer for question ${i + 1}`;
      }

      if (q.type === "INPUT" && !q.correctAnswer?.trim()) {
        return `Please enter a correct answer for question ${i + 1}`;
      }

      if (q.type === "CHECKBOX") {
        if (!q.options || q.options.length < 2) {
          return `Question ${i + 1} needs at least 2 options`;
        }
        if (!q.correctOptions || q.correctOptions.length === 0) {
          return `Please select at least one correct option for question ${i + 1}`;
        }
      }
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      alert(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      const quiz = await quizService.createQuiz({
        title,
        questions,
      });
      router.push(`/quizzes/${quiz.id}`);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create quiz";
      console.error("Error creating quiz:", error);
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Quiz Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg"
          placeholder="Enter quiz title"
          required
        />
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Questions</h2>
          <button
            type="button"
            onClick={addQuestion}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            + Add Question
          </button>
        </div>

        {questions.map((question, qIndex) => (
          <QuestionEditor
            key={qIndex}
            question={question}
            index={qIndex}
            onUpdate={(field, value) => updateQuestion(qIndex, field, value)}
            onTypeChange={(newType) => updateQuestionType(qIndex, newType)}
            onRemove={() => removeQuestion(qIndex)}
            canRemove={questions.length > 1}
            onAddOption={() => addOption(qIndex)}
            onUpdateOption={(optIndex, value) =>
              updateOption(qIndex, optIndex, value)
            }
            onRemoveOption={(optIndex) => removeOption(qIndex, optIndex)}
            onToggleCorrectOption={(optIndex) =>
              toggleCorrectOption(qIndex, optIndex)
            }
          />
        ))}
      </div>

      <div className="flex gap-4 pt-6 border-t border-gray-200">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 sm:flex-none px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Creating...
            </span>
          ) : (
            "Create Quiz"
          )}
        </button>
        <button
          type="button"
          onClick={() => router.push("/quizzes")}
          className="px-8 py-3.5 bg-white text-gray-700 border-2 border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
