import { useState, useEffect } from "react";
import Link from "next/link";
import { quizService, QuizListItem } from "../../services/quizService";
import { ConfirmModal } from "../../components/Modal";

export default function QuizList() {
  const [quizzes, setQuizzes] = useState<QuizListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [quizToDelete, setQuizToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const data = await quizService.getAllQuizzes();
      setQuizzes(data);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      alert("Failed to load quizzes");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (
    id: string,
    title: string,
    e: React.MouseEvent
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setQuizToDelete({ id, title });
  };

  const handleConfirmDelete = async () => {
    if (!quizToDelete) return;

    const id = quizToDelete.id;
    setDeletingId(id);
    setQuizToDelete(null);

    try {
      await quizService.deleteQuiz(id);
      setQuizzes(quizzes.filter((q) => q.id !== id));
    } catch (error) {
      console.error("Error deleting quiz:", error);
      alert("Failed to delete quiz");
    } finally {
      setDeletingId(null);
    }
  };

  const handleCancelDelete = () => {
    setQuizToDelete(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600 mb-4"></div>
          <p className="text-gray-600 text-lg">Loading quizzes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
              All Quizzes
            </h1>
            <p className="text-gray-600">Manage and view all your quizzes</p>
          </div>
          <Link
            href="/create"
            className="mt-4 sm:mt-0 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold text-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            + Create New Quiz
          </Link>
        </div>

        {quizzes.length === 0 ? (
          <div className="bg-white shadow-xl rounded-xl p-12 text-center border-2 border-dashed border-gray-300">
            <div className="max-w-md mx-auto">
              <svg
                className="mx-auto h-16 w-16 text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No quizzes yet
              </h3>
              <p className="text-gray-600 mb-6">
                Get started by creating your first quiz
              </p>
              <Link
                href="/create"
                className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Create Your First Quiz
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {quizzes.map((quiz) => (
              <Link
                key={quiz.id}
                href={`/quizzes/${quiz.id}`}
                className="block bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition-all duration-200 border border-gray-200 hover:border-blue-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600">
                      {quiz.title}
                    </h2>
                    <div className="flex items-center gap-2 text-gray-600">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="font-medium">
                        {quiz.questionCount}{" "}
                        {quiz.questionCount === 1 ? "question" : "questions"}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDeleteClick(quiz.id, quiz.title, e)}
                    disabled={deletingId === quiz.id}
                    className="ml-4 p-2.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-transparent hover:border-red-200"
                    aria-label="Delete quiz"
                  >
                    {deletingId === quiz.id ? (
                      <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : (
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}

        <ConfirmModal
          isOpen={quizToDelete !== null}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          title="Delete Quiz"
          message={`Are you sure you want to delete "${quizToDelete?.title}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          confirmButtonColor="red"
        />
      </div>
    </div>
  );
}
