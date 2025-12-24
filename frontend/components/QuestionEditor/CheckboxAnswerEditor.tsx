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
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Options
        </label>
        <button
          type="button"
          onClick={handleAddOption}
          className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm"
        >
          + Add Option
        </button>
      </div>
      {question.options?.map((option, optIndex) => (
        <div key={optIndex} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={
              question.correctOptions?.includes(optIndex.toString()) || false
            }
            onChange={() => handleToggleCorrectOption(optIndex)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <input
            type="text"
            value={option}
            onChange={(e) => handleUpdateOption(optIndex, e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder={`Option ${optIndex + 1}`}
            required
          />
          {question.options && question.options.length > 2 && (
            <button
              type="button"
              onClick={() => handleRemoveOption(optIndex)}
              className="text-red-600 hover:text-red-800 px-2"
            >
              ×
            </button>
          )}
        </div>
      ))}
      {question.correctOptions && question.correctOptions.length === 0 && (
        <p className="text-sm text-red-600">
          Please select at least one correct option
        </p>
      )}
    </div>
  );
}
