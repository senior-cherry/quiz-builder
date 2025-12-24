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
    <div className="border-2 border-gray-200 rounded-xl p-5 sm:p-6 space-y-5 bg-gradient-to-br from-white to-gray-50 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between pb-4 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-900">
          Question {index + 1}
        </h3>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="px-3 py-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg text-sm font-semibold transition-all duration-200 border border-transparent hover:border-red-200"
          >
            Remove
          </button>
        )}
      </div>

      <div>
        <label
          htmlFor={`question-${index}`}
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Question Text
        </label>
        <textarea
          id={`question-${index}`}
          value={question.text}
          onChange={(e) => onUpdate("text", e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
          placeholder="Enter your question"
          rows={3}
          required
        />
      </div>

      <div>
        <label
          htmlFor={`type-${index}`}
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Question Type
        </label>
        <select
          id={`type-${index}`}
          value={question.type}
          onChange={(e) => onTypeChange(e.target.value as QuestionType)}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 font-medium bg-white"
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
