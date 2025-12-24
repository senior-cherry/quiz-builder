import { Question } from "../../types/quiz";

interface BooleanAnswerEditorProps {
  question: Question;
  index: number;
  onUpdate: (
    field: keyof Question,
    value: string | string[] | undefined
  ) => void;
}

export default function BooleanAnswerEditor({
  question,
  index,
  onUpdate,
}: BooleanAnswerEditorProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        Correct Answer
      </label>
      <div className="flex gap-3">
        <label className="flex items-center cursor-pointer">
          <input
            type="radio"
            name={`boolean-${index}`}
            value="true"
            checked={question.correctAnswer === "true"}
            onChange={(e) => onUpdate("correctAnswer", e.target.value)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 mr-3"
          />
          <span className="text-gray-700 font-medium">True</span>
        </label>
        <label className="flex items-center cursor-pointer">
          <input
            type="radio"
            name={`boolean-${index}`}
            value="false"
            checked={question.correctAnswer === "false"}
            onChange={(e) => onUpdate("correctAnswer", e.target.value)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 mr-3"
          />
          <span className="text-gray-700 font-medium">False</span>
        </label>
      </div>
    </div>
  );
}
