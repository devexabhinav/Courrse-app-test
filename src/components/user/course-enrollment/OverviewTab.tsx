import {
  BookOpen,
  Video,
  FileQuestion,
  Clock,
  Award,
  FileText,
  Trophy,
} from "lucide-react";

interface OverviewTabProps {
  statistics: any;
  userData: any;
  isEnrolled: boolean;
  courseData: any;
}

export default function OverviewTab({
  statistics,
  userData,
  isEnrolled,
  courseData,
}: OverviewTabProps) {
  const formatDuration = (minutes: number) => {
    if (!minutes) return "Not specified";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const totalDuration = statistics.total_duration || 0;

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
        About This Course
      </h3>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="flex items-center rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <BookOpen className="mr-3 h-5 w-5 text-blue-500" />
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Chapters
            </div>
            <div className="font-medium text-gray-900 dark:text-white">
              {statistics.total_chapters || 0}
            </div>
          </div>
        </div>

        <div className="flex items-center rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <Video className="mr-3 h-5 w-5 text-green-500" />
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Lessons
            </div>
            <div className="font-medium text-gray-900 dark:text-white">
              {statistics.total_lessons || 0}
            </div>
          </div>
        </div>

        <div className="flex items-center rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <FileQuestion className="mr-3 h-5 w-5 text-purple-500" />
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400">MCQs</div>
            <div className="font-medium text-gray-900 dark:text-white">
              {statistics.total_mcqs || 0}
            </div>
          </div>
        </div>

        <div className="flex items-center rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <Clock className="mr-3 h-5 w-5 text-orange-500" />
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Duration
            </div>
            <div className="font-medium text-gray-900 dark:text-white">
              {formatDuration(totalDuration)}
            </div>
          </div>
        </div>

        <div className="flex items-center rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <Award className="mr-3 h-5 w-5 text-yellow-500" />
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Level
            </div>
            <div className="font-medium text-gray-900 dark:text-white">
              All Levels
            </div>
          </div>
        </div>

        <div className="flex items-center rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <FileText className="mr-3 h-5 w-5 text-red-500" />
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Price
            </div>
            <div className="font-medium text-gray-900 dark:text-white">
              {courseData.price_type === "free"
                ? "Free"
                : `$${courseData.price}`}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced User Progress for Enrolled Users */}
      {isEnrolled && userData.progress && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-6 dark:border-green-800 dark:bg-green-900/20">
          <h4 className="mb-4 flex items-center gap-2 text-lg font-semibold text-green-900 dark:text-green-100">
            <Trophy className="h-5 w-5" />
            Your Learning Journey
          </h4>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                {userData.progress.chapters_completed}
              </div>
              <div className="text-sm text-green-600 dark:text-green-400">
                Chapters Done
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                {userData.progress.lessons_completed}
              </div>
              <div className="text-sm text-green-600 dark:text-green-400">
                Lessons Completed
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                {Math.round(userData.progress.overall_progress)}%
              </div>
              <div className="text-sm text-green-600 dark:text-green-400">
                Overall Progress
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                {formatDuration(totalDuration)}
              </div>
              <div className="text-sm text-green-600 dark:text-green-400">
                Total Duration
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
