// components/course-learn/MCQSection.tsx
import React from "react";
import { Chapter, ChapterProgress } from "@/types/course";
import { CheckCircle2, PlayCircle, Lock } from "lucide-react";

interface MCQSectionProps {
  chapter: Chapter;
  chapterProgress: ChapterProgress | null;
  onStartMCQ: (chapter: Chapter) => void;
}

const MCQSection: React.FC<MCQSectionProps> = ({
  chapter,
  chapterProgress,
  onStartMCQ,
}) => {
  const hasMCQs = chapter.mcqs && chapter.mcqs.length > 0;
  const isLocked = chapter.locked;
  const isCompleted = chapter.completed;
  const mcqPassed = chapter.mcq_passed;

  // ✅ FIXED: Show MCQs if chapter is unlocked, regardless of lesson completion
  const canAttemptMCQ = !isLocked && hasMCQs && !mcqPassed;
  const allLessonsCompleted = chapterProgress?.all_lessons_completed || false;

  if (!hasMCQs) return null;

  return (
    <div className="mt-4">
      <h4 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
        Chapter Assessment
      </h4>

      <div
        className={`rounded-lg border p-4 ${
          isLocked
            ? "border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-700/50"
            : mcqPassed
              ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
              : "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20"
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div
              className={`mt-1 flex h-6 w-6 items-center justify-center rounded-full ${
                isLocked
                  ? "bg-gray-300 text-gray-600 dark:bg-gray-600 dark:text-gray-400"
                  : mcqPassed
                    ? "bg-green-500 text-white"
                    : "bg-blue-500 text-white"
              }`}
            >
              {isLocked ? (
                <Lock className="h-3 w-3" />
              ) : mcqPassed ? (
                <CheckCircle2 className="h-3 w-3" />
              ) : (
                <PlayCircle className="h-3 w-3" />
              )}
            </div>

            <div>
              <h5 className="font-medium text-gray-900 dark:text-white">
                Chapter MCQ Test
              </h5>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {chapter.mcqs.length} questions • Test your knowledge
              </p>

              {/* Show lesson completion status */}
              {!allLessonsCompleted && canAttemptMCQ && (
                <p className="mt-1 text-xs text-orange-600 dark:text-orange-400">
                  Note: Complete all lessons for best results
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-3">
          {isLocked ? (
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Lock className="h-4 w-4" />
              <span>Complete previous chapter to unlock</span>
            </div>
          ) : mcqPassed ? (
            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4" />
              <span>MCQ passed successfully!</span>
            </div>
          ) : canAttemptMCQ ? (
            <button
              onClick={() => onStartMCQ(chapter)}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              <PlayCircle className="h-4 w-4" />
              {allLessonsCompleted ? "Start MCQ Test" : "Attempt MCQ Test"}
            </button>
          ) : (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Complete lessons to attempt MCQ
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MCQSection;
