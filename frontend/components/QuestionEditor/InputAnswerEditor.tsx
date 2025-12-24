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
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        Correct Answer
      </label>
      <input
        type="text"
        id={`answer-${index}`}
        value={question.correctAnswer || ""}
        onChange={(e) => onUpdate("correctAnswer", e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        placeholder="Enter the correct answer"
        required
      />
    </div>
  );
}
