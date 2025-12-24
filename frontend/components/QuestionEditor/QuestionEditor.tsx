import { Question, QuestionType } from "../../types/quiz";
import BooleanAnswerEditor from "./BooleanAnswerEditor";
import InputAnswerEditor from "./InputAnswerEditor";
import CheckboxAnswerEditor from "./CheckboxAnswerEditor";

interface QuestionEditorProps {
  question: Question;
  index: number;
  onUpdate: (
    field: keyof Question,
    value: string | string[] | undefined
  ) => void;
  onTypeChange: (newType: QuestionType) => void;
  onRemove: () => void;
  canRemove: boolean;
  onAddOption?: () => void;
  onUpdateOption?: (optionIndex: number, value: string) => void;
  onRemoveOption?: (optionIndex: number) => void;
  onToggleCorrectOption?: (optionIndex: number) => void;
}

export default function QuestionEditor({
  question,
  index,
  onUpdate,
  onTypeChange,
  onRemove,
  canRemove,
  onAddOption,
  onUpdateOption,
  onRemoveOption,
  onToggleCorrectOption,
}: QuestionEditorProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 sm:p-6 space-y-4">
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-medium text-gray-900">
          Question {index + 1}
        </h3>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Remove
          </button>
        )}
      </div>

      <div>
        <label
          htmlFor={`question-${index}`}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Question Text
        </label>
        <textarea
          id={`question-${index}`}
          value={question.text}
          onChange={(e) => onUpdate("text", e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter your question"
          rows={2}
          required
        />
      </div>

      <div>
        <label
          htmlFor={`type-${index}`}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Question Type
        </label>
        <select
          id={`type-${index}`}
          value={question.type}
          onChange={(e) => onTypeChange(e.target.value as QuestionType)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="BOOLEAN">True/False</option>
          <option value="INPUT">Short Answer</option>
          <option value="CHECKBOX">Multiple Choice (Multiple Answers)</option>
        </select>
      </div>

      {question.type === "BOOLEAN" && (
        <BooleanAnswerEditor
          question={question}
          index={index}
          onUpdate={onUpdate}
        />
      )}

      {question.type === "INPUT" && (
        <InputAnswerEditor
          question={question}
          index={index}
          onUpdate={onUpdate}
        />
      )}

      {question.type === "CHECKBOX" && (
        <CheckboxAnswerEditor
          question={question}
          index={index}
          onUpdate={onUpdate}
          onAddOption={onAddOption}
          onUpdateOption={onUpdateOption}
          onRemoveOption={onRemoveOption}
          onToggleCorrectOption={onToggleCorrectOption}
        />
      )}
    </div>
  );
}
