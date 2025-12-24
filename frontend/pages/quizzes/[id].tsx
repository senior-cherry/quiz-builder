import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { quizService, Quiz } from "../../services/quizService";

export default function QuizDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async (quizId: string) => {
      try {
        const data = await quizService.getQuizById(quizId);
        setQuiz(data);
      } catch (error) {
        console.error("Error fetching quiz:", error);
        if (error instanceof Error && error.message === "Quiz not found") {
          router.push("/quizzes");
          return;
        }
        alert("Failed to load quiz");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchQuiz(id as string);
    }
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600 mb-4"></div>
          <p className="text-gray-600 text-lg">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg border-2 border-gray-200">
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
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Quiz not found
          </h3>
          <p className="text-gray-600 mb-6">
            The quiz you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/quizzes"
            className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
          >
            Back to Quizzes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            href="/quizzes"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold mb-4 transition-colors duration-200 group"
          >
            <svg
              className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Quizzes
          </Link>
        </div>

        <div className="bg-white shadow-xl rounded-xl p-6 sm:p-8 border border-gray-200">
          <div className="mb-8 pb-6 border-b border-gray-200">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
              {quiz.title}
            </h1>
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
                {quiz.questions.length}{" "}
                {quiz.questions.length === 1 ? "question" : "questions"}
              </span>
            </div>
          </div>

          <div className="space-y-6">
            {quiz.questions.map((question, index) => (
              <div
                key={question.id}
                className="border-2 border-gray-200 rounded-xl p-5 sm:p-6 bg-gradient-to-br from-white to-gray-50 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">
                    Question {index + 1}
                  </h3>
                  <span className="px-3 py-1.5 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 text-xs font-semibold rounded-full border border-blue-200">
                    {question.type === "BOOLEAN"
                      ? "True/False"
                      : question.type === "INPUT"
                        ? "Short Answer"
                        : "Multiple Choice"}
                  </span>
                </div>

                <p className="text-gray-800 mb-6 text-lg leading-relaxed font-medium">
                  {question.text}
                </p>

                {question.type === "BOOLEAN" && (
                  <div className="mt-4">
                    <p className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                      Correct Answer:
                    </p>
                    <div className="flex gap-3">
                      <div
                        className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                          question.correctAnswer === "true"
                            ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg transform scale-105"
                            : "bg-gray-100 text-gray-500 border-2 border-gray-200"
                        }`}
                      >
                        True
                      </div>
                      <div
                        className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                          question.correctAnswer === "false"
                            ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg transform scale-105"
                            : "bg-gray-100 text-gray-500 border-2 border-gray-200"
                        }`}
                      >
                        False
                      </div>
                    </div>
                  </div>
                )}

                {question.type === "INPUT" && (
                  <div className="mt-4">
                    <p className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                      Correct Answer:
                    </p>
                    <div className="px-5 py-3 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-400 rounded-lg text-gray-900 font-medium shadow-sm">
                      {question.correctAnswer}
                    </div>
                  </div>
                )}

                {question.type === "CHECKBOX" && (
                  <div className="mt-4">
                    <p className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
                      Options:
                    </p>
                    <div className="space-y-3">
                      {question.options.map((option, optIndex) => {
                        const isCorrect = question.correctOptions.includes(
                          optIndex.toString()
                        );
                        return (
                          <div
                            key={optIndex}
                            className={`flex items-center px-5 py-3 rounded-lg transition-all ${
                              isCorrect
                                ? "bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-400 shadow-md"
                                : "bg-gray-50 border-2 border-gray-200"
                            }`}
                          >
                            <div
                              className={`h-5 w-5 rounded border-2 mr-4 flex items-center justify-center flex-shrink-0 ${
                                isCorrect
                                  ? "border-green-500 bg-green-500 shadow-sm"
                                  : "border-gray-300 bg-white"
                              }`}
                            >
                              {isCorrect && (
                                <svg
                                  className="h-3.5 w-3.5 text-white"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
                            </div>
                            <span
                              className={`flex-1 ${
                                isCorrect
                                  ? "text-green-900 font-semibold"
                                  : "text-gray-700"
                              }`}
                            >
                              {option}
                            </span>
                            {isCorrect && (
                              <span className="ml-3 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-sm">
                                Correct
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
