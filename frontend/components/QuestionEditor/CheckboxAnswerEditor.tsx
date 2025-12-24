import { Question } from "../../types/quiz";

interface CheckboxAnswerEditorProps {
  question: Question;
  index: number;
  onUpdate: (
    field: keyof Question,
    value: string | string[] | undefined
  ) => void;
  onAddOption?: () => void;
  onUpdateOption?: (optionIndex: number, value: string) => void;
  onRemoveOption?: (optionIndex: number) => void;
  onToggleCorrectOption?: (optionIndex: number) => void;
}

export default function CheckboxAnswerEditor({
  question,
  onUpdate,
  onAddOption,
  onUpdateOption,
  onRemoveOption,
  onToggleCorrectOption,
}: CheckboxAnswerEditorProps) {
  const handleAddOption = () => {
    if (onAddOption) {
      onAddOption();
    } else {
      const currentOptions = question.options || [];
      onUpdate("options", [...currentOptions, ""]);
    }
  };

  const handleUpdateOption = (optionIndex: number, value: string) => {
    if (onUpdateOption) {
      onUpdateOption(optionIndex, value);
    } else {
      const updatedOptions = [...(question.options || [])];
      updatedOptions[optionIndex] = value;
      onUpdate("options", updatedOptions);
    }
  };

  const handleRemoveOption = (optionIndex: number) => {
    if (onRemoveOption) {
      onRemoveOption(optionIndex);
    } else {
      const updatedOptions = (question.options || []).filter(
        (_, i) => i !== optionIndex
      );

      const updatedCorrectOptions = (question.correctOptions || [])
        .filter((opt) => opt !== optionIndex.toString())
        .map((opt) => {
          const idx = parseInt(opt);
          if (idx > optionIndex) {
            return (idx - 1).toString();
          }
          return opt;
        });
      onUpdate("options", updatedOptions);
      onUpdate("correctOptions", updatedCorrectOptions);
    }
  };

  const handleToggleCorrectOption = (optionIndex: number) => {
    if (onToggleCorrectOption) {
      onToggleCorrectOption(optionIndex);
    } else {
      const optStr = optionIndex.toString();
      const currentOptions = question.correctOptions || [];
      const updatedOptions = currentOptions.includes(optStr)
        ? currentOptions.filter((opt) => opt !== optStr)
        : [...currentOptions, optStr];
      onUpdate("correctOptions", updatedOptions);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-gray-200">
        <label className="block text-sm font-semibold text-gray-700">
          Options
        </label>
        <button
          type="button"
          onClick={handleAddOption}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 text-sm font-semibold shadow-md hover:shadow-lg"
        >
          + Add Option
        </button>
      </div>
      {question.options?.map((option, optIndex) => (
        <div
          key={optIndex}
          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-all duration-200"
        >
          <input
            type="checkbox"
            checked={
              question.correctOptions?.includes(optIndex.toString()) || false
            }
            onChange={() => handleToggleCorrectOption(optIndex)}
            className="h-5 w-5 text-blue-600 focus:ring-2 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
          />
          <input
            type="text"
            value={option}
            onChange={(e) => handleUpdateOption(optIndex, e.target.value)}
            className="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
            placeholder={`Option ${optIndex + 1}`}
            required
          />
          {question.options && question.options.length > 2 && (
            <button
              type="button"
              onClick={() => handleRemoveOption(optIndex)}
              className="px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 font-bold text-lg border border-transparent hover:border-red-200"
              aria-label="Remove option"
            >
              ×
            </button>
          )}
        </div>
      ))}
      {question.correctOptions && question.correctOptions.length === 0 && (
        <div className="p-3 bg-red-50 border-2 border-red-200 rounded-lg">
          <p className="text-sm text-red-700 font-semibold flex items-center">
            <svg
              className="h-4 w-4 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            Please select at least one correct option
          </p>
        </div>
      )}
    </div>
  );
}
