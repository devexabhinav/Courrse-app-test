// components/course-learn/CourseTabs.tsx
import React from "react";
import { Course, CourseProgressData } from "@/types/course";
import OverviewTab from "./OverviewTab";

interface CourseTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

interface CourseTabsContentProps {
  activeTab: string;
  course: Course;
  courseProgress: CourseProgressData | null;
}

const tabs = [
  "Overview",
  "Notes",
  "Announcements",
  "Reviews",
  "Learning tools",
];

const CourseTabs: React.FC<CourseTabsProps> & {
  Content: React.FC<CourseTabsContentProps>;
} = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex flex-wrap justify-start gap-4 border-b border-gray-300 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-800">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`border-b-2 px-3 py-2 text-sm font-medium ${
            activeTab === tab
              ? "border-blue-500 text-blue-500"
              : "border-transparent text-gray-500 hover:border-blue-500 hover:text-blue-500"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

// Tab Content Component
const CourseTabsContent: React.FC<CourseTabsContentProps> = ({
  activeTab,
  course,
  courseProgress,
}) => {
  const renderTabContent = () => {
    switch (activeTab) {
      case "Overview":
        return <OverviewTab course={course} courseProgress={courseProgress} />;

      case "Notes":
        return (
          <div>
            <h2 className="mb-2 text-xl font-semibold">My Notes</h2>
            <p className="text-gray-700 dark:text-gray-300">
              You can add your personal notes here for quick revision later.
            </p>
          </div>
        );

      case "Announcements":
        return (
          <div>
            <h2 className="mb-2 text-xl font-semibold">Announcements</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Stay tuned for the latest updates and news about the course!
            </p>
          </div>
        );

      case "Reviews":
        return (
          <div>
            <h2 className="mb-2 text-xl font-semibold">Student Reviews</h2>
            <p className="text-gray-700 dark:text-gray-300">
              ⭐⭐⭐⭐☆ – "Very detailed and easy to understand course!"
            </p>
          </div>
        );

      case "Learning tools":
        return (
          <div>
            <h2 className="mb-2 text-xl font-semibold">Learning Tools</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Access additional resources, exercises, and code snippets here.
            </p>
          </div>
        );

      default:
        return <OverviewTab course={course} courseProgress={courseProgress} />;
    }
  };

  return <>{renderTabContent()}</>;
};

// Attach Content as a static property
CourseTabs.Content = CourseTabsContent;

export default CourseTabs;
