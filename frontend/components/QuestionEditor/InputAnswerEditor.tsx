import { Question } from "../../types/quiz";

interface InputAnswerEditorProps {
  question: Question;
  index: number;
  onUpdate: (
    field: keyof Question,
    value: string | string[] | undefined
  ) => void;
}

export default function InputAnswerEditor({
  question,
  index,
  onUpdate,
}: InputAnswerEditorProps) {
  return (
    <div>
      <label
        htmlFor={`answer-${index}`}
        className="block text-sm font-semibold text-gray-700 mb-2"
      >
        Correct Answer
      </label>
      <input
        type="text"
        id={`answer-${index}`}
        value={question.correctAnswer || ""}
        onChange={(e) => onUpdate("correctAnswer", e.target.value)}
        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
        placeholder="Enter the correct answer"
        required
      />
    </div>
  );
}
