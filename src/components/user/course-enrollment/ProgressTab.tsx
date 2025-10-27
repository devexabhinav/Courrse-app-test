import { CheckCircle, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressTabProps {
  userData: any;
  chapters: any[];
  statistics: any;
}

export default function ProgressTab({
  userData,
  chapters,
  statistics,
}: ProgressTabProps) {
  const formatDuration = (minutes: number) => {
    if (!minutes) return "Not specified";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const totalDuration = statistics.total_duration || 0;

  const calculateChapterProgress = (chapter: any) => {
    const totalItems =
      (chapter.lessons?.length || 0) + (chapter.mcqs?.length || 0);
    if (totalItems === 0) return 0;
    return chapter.user_progress?.completed ? 100 : 0;
  };

  const getProgressColor = (progress: number) => {
    if (progress === 0) return "bg-gray-200";
    if (progress < 50) return "bg-yellow-500";
    if (progress < 100) return "bg-blue-500";
    return "bg-green-500";
  };

  return (
    <div>
      <h3 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        My Learning Progress
      </h3>

      {/* Overall Progress */}
      <div className="mb-8 rounded-lg border border-gray-200 p-6 dark:border-gray-700">
        <h4 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Overall Progress
        </h4>
        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Course Completion
            </span>
            <span className="font-medium text-gray-900 dark:text-white">
              {Math.round(userData.progress.overall_progress)}%
            </span>
          </div>
          <div className="h-4 w-full rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-full rounded-full bg-green-500 transition-all duration-300"
              style={{
                width: `${userData.progress.overall_progress}%`,
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {userData.progress.chapters_completed}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Chapters Completed
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {userData.progress.lessons_completed}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Lessons Finished
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {userData.progress.total_chapters -
                userData.progress.chapters_completed}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Chapters Remaining
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {formatDuration(totalDuration)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Time Invested
            </div>
          </div>
        </div>
      </div>

      {/* Chapter-wise Progress */}
      <div>
        <h4 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Chapter Progress
        </h4>
        <div className="space-y-4">
          {chapters.map((chapter: any, index: number) => {
            const progress = calculateChapterProgress(chapter);
            return (
              <div
                key={chapter.id}
                className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      Chapter {index + 1}: {chapter.title}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {chapter.lessons?.length || 0} lessons •{" "}
                      {chapter.mcqs?.length || 0} MCQs
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {progress}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Complete
                    </div>
                  </div>
                </div>
                <div className="mt-3 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-300",
                      getProgressColor(progress),
                    )}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                {progress === 100 && (
                  <div className="mt-2 flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                    <CheckCircle className="h-4 w-4" />
                    Chapter Completed
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
