import QuizForm from "../components/QuizForm";

export default function CreateQuiz() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-xl rounded-xl p-6 sm:p-8 border border-gray-200">
          <div className="mb-8 pb-6 border-b border-gray-200">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
              Create New Quiz
            </h1>
            <p className="text-gray-600">
              Build your quiz with multiple question types
            </p>
          </div>
          <QuizForm />
        </div>
      </div>
    </div>
  );
}
