// components/course-learn/MCQModal.tsx
import React, { useState, useEffect } from "react";
import { X, Clock, CheckCircle2, AlertCircle, Shuffle } from "lucide-react";

interface MCQModalProps {
  show: boolean;
  chapter: any | null;
  userAnswers: { [mcqId: number]: number };
  submittingMCQ: boolean;
  onAnswerSelect: (mcqId: number, optionIndex: number) => void;
  onSubmit: () => void;
  onClose: () => void;
}

const MCQModal: React.FC<MCQModalProps> = ({
  show,
  chapter,
  userAnswers,
  submittingMCQ,
  onAnswerSelect,
  onSubmit,
  onClose,
}) => {
  const [shuffledMCQs, setShuffledMCQs] = useState<any[]>([]);

  // Shuffle MCQs and options when modal opens or chapter changes
  useEffect(() => {
    if (show && chapter) {
      const shuffled = shuffleMCQs([...chapter.mcqs]);
      setShuffledMCQs(shuffled);
    }
  }, [show, chapter]);

  // Fisher-Yates shuffle algorithm
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const shuffleMCQs = (mcqs: any[]): any[] => {
    return shuffleArray(mcqs).map((mcq) => ({
      ...mcq,
      options: shuffleArray(mcq.options),
    }));
  };

  // Reset shuffled MCQs when modal closes
  useEffect(() => {
    if (!show) {
      setShuffledMCQs([]);
    }
  }, [show]);

  if (!show || !chapter || shuffledMCQs.length === 0) return null;

  const answeredCount = Object.keys(userAnswers).length;
  const totalQuestions = shuffledMCQs.length;
  const allAnswersSelected = answeredCount === totalQuestions;

  const handleSubmit = () => {
    if (allAnswersSelected) {
      onSubmit();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-800">
        {/* Header */}
        <div className="border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600 p-6 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-white/20 p-2">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  Chapter {chapter.order} Assessment
                </h2>
                <p className="text-blue-100">
                  Test your knowledge from "{chapter.title}"
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Shuffle Indicator */}
              <div className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs text-white">
                <Shuffle className="h-3 w-3" />
                <span>Randomized</span>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-white/80 hover:bg-white/20 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-3 dark:border-gray-700 dark:bg-gray-700/50">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Progress: {answeredCount}/{totalQuestions} questions
            </span>
            <div className="flex items-center gap-2">
              <div className="w-32 rounded-full bg-gray-200 dark:bg-gray-600">
                <div
                  className="h-2 rounded-full bg-green-500 transition-all duration-300"
                  style={{
                    width: `${(answeredCount / totalQuestions) * 100}%`,
                  }}
                />
              </div>
              {!allAnswersSelected && (
                <span className="text-xs text-orange-600 dark:text-orange-400">
                  Answer all questions to submit
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="max-h-96 overflow-y-auto p-6">
          <div className="space-y-6">
            {shuffledMCQs.map((mcq, index) => (
              <div
                key={mcq.id}
                className="rounded-xl border border-gray-200 p-4 transition-all hover:border-blue-300 dark:border-gray-600 dark:hover:border-blue-500"
              >
                <div className="mb-4 flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                    {index + 1}
                  </div>
                  <p className="flex-1 font-medium text-gray-900 dark:text-white">
                    {mcq.question}
                  </p>
                  {userAnswers[mcq.id] !== undefined && (
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-500" />
                  )}
                </div>

                <div className="space-y-2">
                  {mcq.options.map((option: any, optIndex: any) => (
                    <label
                      key={optIndex}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-all ${
                        userAnswers[mcq.id] === optIndex
                          ? "border border-blue-200 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20"
                          : "border border-gray-200 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`mcq-${mcq.id}`}
                        checked={userAnswers[mcq.id] === optIndex}
                        onChange={() => onAnswerSelect(mcq.id, optIndex)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="flex-1 text-gray-700 dark:text-gray-300">
                        {option}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <AlertCircle className="h-4 w-4" />
              <span>You need 50% to pass this assessment</span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={submittingMCQ}
                className="rounded-lg border border-gray-300 px-6 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!allAnswersSelected || submittingMCQ}
                className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2 font-medium text-white transition-all hover:from-blue-700 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submittingMCQ ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Submitting...
                  </div>
                ) : (
                  "Submit Assessment"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MCQModal;
