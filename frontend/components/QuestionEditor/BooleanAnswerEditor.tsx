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
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Correct Answer
      </label>
      <div className="flex gap-4">
        <label className="flex items-center">
          <input
            type="radio"
            name={`boolean-${index}`}
            value="true"
            checked={question.correctAnswer === "true"}
            onChange={(e) => onUpdate("correctAnswer", e.target.value)}
            className="mr-2"
          />
          True
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            name={`boolean-${index}`}
            value="false"
            checked={question.correctAnswer === "false"}
            onChange={(e) => onUpdate("correctAnswer", e.target.value)}
            className="mr-2"
          />
          False
        </label>
      </div>
    </div>
  );
}
