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
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Quiz Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter quiz title"
          required
        />
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Questions</h2>
          <button
            type="button"
            onClick={addQuestion}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
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

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 sm:flex-none px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Creating..." : "Create Quiz"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/quizzes")}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
