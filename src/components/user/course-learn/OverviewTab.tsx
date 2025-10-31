// components/course-learn/OverviewTab.tsx
import React from "react";

interface OverviewTabProps {
  course: any;
  courseProgress: any | null;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  course,
  courseProgress,
}) => {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold">{course.title}</h1>
      {course.subtitle && (
        <h2 className="mb-4 text-xl text-gray-600 dark:text-gray-400">
          {course.subtitle}
        </h2>
      )}
      <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
        <span className="flex items-center gap-1">
          ⭐ {course.ratings || "No ratings"}
        </span>
        <span>{course.enrollment_count} Students</span>
        <span>{course.duration} Total</span>
        {courseProgress && (
          <span className="text-green-500">
            {courseProgress.overall_progress}% Completed
          </span>
        )}
      </div>
      <div
        className="max-w-3xl whitespace-pre-line text-gray-700 dark:text-gray-300"
        dangerouslySetInnerHTML={{ __html: course.description }}
      />

      {/* Course Statistics */}
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
          <div className="text-2xl font-bold">
            {course.statistics.total_chapters}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Chapters
          </div>
        </div>
        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
          <div className="text-2xl font-bold">
            {course.statistics.total_lessons}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Lessons
          </div>
        </div>
        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
          <div className="text-2xl font-bold">
            {course.statistics.total_mcqs}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">MCQs</div>
        </div>
        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
          <div className="text-2xl font-bold">{course.enrollment_count}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Enrolled
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
