import QuizForm from "../components/QuizForm";

export default function CreateQuiz() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6 sm:p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Create New Quiz
          </h1>
          <QuizForm />
        </div>
      </div>
    </div>
  );
}
