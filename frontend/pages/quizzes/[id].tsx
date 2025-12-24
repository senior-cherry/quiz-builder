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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading quiz...</div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Quiz not found</p>
          <Link
            href="/quizzes"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Back to Quizzes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            href="/quizzes"
            className="text-blue-600 hover:text-blue-800 font-medium mb-4 inline-block"
          >
            ← Back to Quizzes
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg p-6 sm:p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {quiz.title}
          </h1>
          <p className="text-gray-600 mb-8">
            {quiz.questions.length}{" "}
            {quiz.questions.length === 1 ? "question" : "questions"}
          </p>

          <div className="space-y-6">
            {quiz.questions.map((question, index) => (
              <div
                key={question.id}
                className="border border-gray-200 rounded-lg p-4 sm:p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Question {index + 1}
                  </h3>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    {question.type === "BOOLEAN"
                      ? "True/False"
                      : question.type === "INPUT"
                        ? "Short Answer"
                        : "Multiple Choice"}
                  </span>
                </div>

                <p className="text-gray-700 mb-4">{question.text}</p>

                {question.type === "BOOLEAN" && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Correct Answer:
                    </p>
                    <div className="flex gap-4">
                      <div
                        className={`px-4 py-2 rounded-md ${
                          question.correctAnswer === "true"
                            ? "bg-green-100 text-green-800 border-2 border-green-500"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        True
                      </div>
                      <div
                        className={`px-4 py-2 rounded-md ${
                          question.correctAnswer === "false"
                            ? "bg-green-100 text-green-800 border-2 border-green-500"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        False
                      </div>
                    </div>
                  </div>
                )}

                {question.type === "INPUT" && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Correct Answer:
                    </p>
                    <div className="px-4 py-2 bg-green-50 border-2 border-green-500 rounded-md text-gray-900">
                      {question.correctAnswer}
                    </div>
                  </div>
                )}

                {question.type === "CHECKBOX" && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-3">
                      Options:
                    </p>
                    <div className="space-y-2">
                      {question.options.map((option, optIndex) => {
                        const isCorrect = question.correctOptions.includes(
                          optIndex.toString()
                        );
                        return (
                          <div
                            key={optIndex}
                            className={`flex items-center px-4 py-2 rounded-md ${
                              isCorrect
                                ? "bg-green-50 border-2 border-green-500"
                                : "bg-gray-50 border border-gray-200"
                            }`}
                          >
                            <div
                              className={`h-4 w-4 rounded border-2 mr-3 flex items-center justify-center ${
                                isCorrect
                                  ? "border-green-500 bg-green-500"
                                  : "border-gray-300"
                              }`}
                            >
                              {isCorrect && (
                                <svg
                                  className="h-3 w-3 text-white"
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
                              className={
                                isCorrect
                                  ? "text-green-900 font-medium"
                                  : "text-gray-700"
                              }
                            >
                              {option}
                            </span>
                            {isCorrect && (
                              <span className="ml-auto text-xs text-green-700 font-medium">
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
