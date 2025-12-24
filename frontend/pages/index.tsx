import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
          Quiz Builder
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Create, manage, and view your quizzes with support for multiple
          question types.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/create"
            className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-lg"
          >
            Create New Quiz
          </Link>
          <Link
            href="/quizzes"
            className="px-8 py-3 bg-white text-gray-700 border-2 border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium text-lg"
          >
            View All Quizzes
          </Link>
        </div>
      </div>
    </div>
  );
}
