"use client";

import { useState, useEffect } from "react";
import {
  Clock,
  BookOpen,
  Award,
  ChevronDown,
  ChevronUp,
  Users,
  Star,
  CheckCircle,
  PlayCircle,
  Video,
  FileQuestion,
  User,
  Calendar,
  BarChart3,
  FileText,
  Lock,
  ArrowLeft,
  Share2,
  Heart,
  Eye,
  CheckSquare,
  FileVideo,
  Bookmark,
  Target,
  Trophy,
  Clock3,
  Zap,
  Shield,
  Globe,
  Download,
  MessageCircle,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { getDecryptedItem } from "@/utils/storageHelper";
import { useApiClient } from "@/lib/api";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function CourseDetailsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollmentStatus, setEnrollmentStatus] = useState<any>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [expandedChapters, setExpandedChapters] = useState<number[]>([]);
  const api = useApiClient();

  const params = useParams();
  const courseId = params.id;
  const userId: any = getDecryptedItem("userId");

  // Fetch enrollment status
  useEffect(() => {
    const fetchEnrollmentStatus = async () => {
      if (!userId || !courseId) return;

      try {
        const response = await api.get(
          `enroll/course/status?user_id=${userId}&course_id=${courseId}`,
        );
        if (response.data?.data?.enrolled) {
          setIsEnrolled(true);
        }
      } catch (err) {
        console.error("Failed to fetch enrollment status:", err);
      }
    };

    fetchEnrollmentStatus();
  }, [userId, courseId]);

  // Fetch course data using the new API
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        const queryParams = userId ? `?user_id=${userId}` : "";
        const res = await api.get(
          `course/${courseId}/full-details${queryParams}`,
        );

        if (res.success) {
          setCourse(res.data?.data?.course);
        }
      } catch (err) {
        console.error("Failed to load course data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourseData();
    }
  }, [courseId, userId]);

  const handleEnroll = async () => {
    if (!userId) {
      setEnrollmentStatus("Please log in to enroll in this course");
      return;
    }

    setEnrolling(true);
    setEnrollmentStatus(null);

    try {
      const response = await api.post("enroll", {
        user_id: userId,
        course_id: courseId,
      });

      if (response.success) {
        setEnrollmentStatus("success");
        setIsEnrolled(true);
        // Refresh course data to get updated enrollment status
        const queryParams = userId ? `?user_id=${userId}` : "";
        const res = await api.get(
          `course/${courseId}/full-details${queryParams}`,
        );
        if (res.success) {
          setCourse(res.data?.data?.course);
        }
      } else {
        setEnrollmentStatus(response.error || "Enrollment failed");
      }
    } catch (err) {
      console.error("Enrollment error:", err);
      setEnrollmentStatus("An error occurred during enrollment");
    } finally {
      setEnrolling(false);
    }
  };

  const toggleChapter = (chapterId: number) => {
    setExpandedChapters((prev) =>
      prev.includes(chapterId)
        ? prev.filter((id) => id !== chapterId)
        : [...prev, chapterId],
    );
  };

  const formatDuration = (minutes: number) => {
    if (!minutes) return "Not specified";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case "lesson":
        return <FileVideo className="h-4 w-4 text-blue-500" />;
      case "mcq":
        return <CheckSquare className="h-4 w-4 text-green-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getContentTypeColor = (type: string) => {
    switch (type) {
      case "lesson":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "mcq":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  // Progress calculation functions
  const calculateChapterProgress = (chapter: any) => {
    const totalItems =
      (chapter.lessons?.length || 0) + (chapter.mcqs?.length || 0);
    if (totalItems === 0) return 0;

    // This would need actual progress data from your API
    return chapter.user_progress?.completed ? 100 : 0;
  };

  const getProgressColor = (progress: number) => {
    if (progress === 0) return "bg-gray-200";
    if (progress < 50) return "bg-yellow-500";
    if (progress < 100) return "bg-blue-500";
    return "bg-green-500";
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6 dark:bg-gray-900">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Loading course details...
          </p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300">Course not found</p>
          <button
            onClick={() => router.back()}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const courseData = course;
  const statistics = courseData.statistics || {};
  const userData = courseData.user_data || {};
  const chapters = courseData.chapters || [];
  const totalDuration = statistics.total_duration || 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Courses</span>
            </button>

            <div className="flex items-center gap-4">
              {isEnrolled && (
                <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-1 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Enrolled</span>
                </div>
              )}
              <button className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">
                <Heart className="h-4 w-4" />
                Save
              </button>
              <button className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">
                <Share2 className="h-4 w-4" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column - Course Content */}
          <div className="lg:col-span-2">
            {/* Course Header */}
            <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800">
              <div className="mb-4 flex items-start gap-6">
                {courseData.image && (
                  <div className="relative h-32 w-48 flex-shrink-0 overflow-hidden rounded-xl">
                    <Image
                      src={courseData.image}
                      alt={courseData.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {courseData.category}
                    </span>
                    {isEnrolled && (
                      <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                        Enrolled
                      </span>
                    )}
                    {!courseData.is_active && (
                      <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                        Coming Soon
                      </span>
                    )}
                  </div>

                  <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
                    {courseData.title}
                  </h1>

                  {courseData.subtitle && (
                    <p className="mb-4 text-lg text-gray-600 dark:text-gray-300">
                      {courseData.subtitle}
                    </p>
                  )}

                  {/* Progress Bar for Enrolled Users */}
                  {isEnrolled && userData.progress && (
                    <div className="mb-4">
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          Your Progress
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {Math.round(userData.progress.overall_progress)}%
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                        <div
                          className="h-full rounded-full bg-green-500 transition-all duration-300"
                          style={{
                            width: `${userData.progress.overall_progress}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>By {courseData.creator}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(courseData.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{courseData.enrollment_count || 0} enrolled</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{courseData.ratings || 0}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Course Description */}
              {courseData.description && (
                <div className="prose dark:prose-invert max-w-none">
                  <div
                    className="text-gray-700 dark:text-gray-300"
                    dangerouslySetInnerHTML={{
                      __html: courseData.description,
                    }}
                  />
                </div>
              )}
            </div>

            {/* Navigation Tabs */}
            <div className="mb-6">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-8">
                  {[
                    { id: "overview", label: "Overview" },
                    { id: "curriculum", label: "Curriculum" },
                    { id: "features", label: "What You'll Learn" },
                    ...(isEnrolled
                      ? [{ id: "progress", label: "My Progress" }]
                      : []),
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium",
                        activeTab === tab.id
                          ? "border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                          : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-300",
                      )}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Tab Content */}
            <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800">
              {activeTab === "overview" && (
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
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          MCQs
                        </div>
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
              )}

              {activeTab === "curriculum" && (
                <div>
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Course Curriculum
                    </h3>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {statistics.total_chapters} chapters •{" "}
                      {statistics.total_lessons} lessons •{" "}
                      {statistics.total_mcqs} MCQs
                    </div>
                  </div>

                  <div className="space-y-3">
                    {chapters.map((chapter: any, index: number) => {
                      const chapterProgress = calculateChapterProgress(chapter);
                      const isChapterLocked = !isEnrolled && index > 0; // Lock chapters for non-enrolled users

                      return (
                        <div
                          key={chapter.id}
                          className={cn(
                            "overflow-hidden rounded-lg border transition-all",
                            isChapterLocked
                              ? "border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-700/50"
                              : "border-gray-200 dark:border-gray-700",
                          )}
                        >
                          <button
                            onClick={() =>
                              !isChapterLocked && toggleChapter(chapter.id)
                            }
                            disabled={isChapterLocked}
                            className={cn(
                              "flex w-full items-center justify-between p-4 transition-colors",
                              isChapterLocked
                                ? "cursor-not-allowed bg-gray-50 text-gray-400 dark:bg-gray-700/50 dark:text-gray-500"
                                : "bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600",
                            )}
                          >
                            <div className="flex items-center gap-4">
                              <div
                                className={cn(
                                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium",
                                  isChapterLocked
                                    ? "bg-gray-300 text-gray-500 dark:bg-gray-600 dark:text-gray-400"
                                    : "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200",
                                )}
                              >
                                {isChapterLocked ? (
                                  <Lock className="h-4 w-4" />
                                ) : (
                                  index + 1
                                )}
                              </div>
                              <div className="text-left">
                                <div className="font-medium text-gray-900 dark:text-white">
                                  {chapter.title}
                                  {isChapterLocked && (
                                    <span className="ml-2 text-sm text-gray-500">
                                      (Locked)
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                  <span>
                                    {chapter.lessons?.length || 0} lessons
                                  </span>
                                  <span>{chapter.mcqs?.length || 0} MCQs</span>
                                  {chapter.duration > 0 && (
                                    <span>
                                      {formatDuration(chapter.duration)}
                                    </span>
                                  )}
                                  {isEnrolled && chapterProgress > 0 && (
                                    <span className="font-medium text-green-600">
                                      {chapterProgress}% complete
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              {isEnrolled && chapterProgress > 0 && (
                                <div className="h-2 w-20 rounded-full bg-gray-200 dark:bg-gray-700">
                                  <div
                                    className={cn(
                                      "h-full rounded-full transition-all",
                                      getProgressColor(chapterProgress),
                                    )}
                                    style={{ width: `${chapterProgress}%` }}
                                  />
                                </div>
                              )}
                              {!isChapterLocked &&
                                (expandedChapters.includes(chapter.id) ? (
                                  <ChevronUp className="h-5 w-5 text-gray-500" />
                                ) : (
                                  <ChevronDown className="h-5 w-5 text-gray-500" />
                                ))}
                            </div>
                          </button>

                          {!isChapterLocked &&
                            expandedChapters.includes(chapter.id) && (
                              <div className="border-t border-gray-200 bg-white p-4 dark:border-gray-600 dark:bg-gray-800">
                                {chapter.description && (
                                  <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                                    {chapter.description}
                                  </p>
                                )}

                                {/* Enhanced User Progress for Chapter */}
                                {isEnrolled && chapter.user_progress && (
                                  <div className="mb-4 rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                                    <div className="flex items-center justify-between text-sm">
                                      <div className="flex items-center gap-2">
                                        <span
                                          className={cn(
                                            "font-medium",
                                            chapter.user_progress.completed
                                              ? "text-green-700 dark:text-green-300"
                                              : "text-blue-700 dark:text-blue-300",
                                          )}
                                        >
                                          {chapter.user_progress.completed
                                            ? "Completed"
                                            : "In Progress"}
                                        </span>
                                        {chapter.user_progress.mcq_passed && (
                                          <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700 dark:bg-green-900/30 dark:text-green-300">
                                            MCQ Passed
                                          </span>
                                        )}
                                      </div>
                                      {!chapter.user_progress.completed && (
                                        <button
                                          onClick={() =>
                                            router.push(
                                              `/user-panel/courses/learn/${courseId}?chapter=${chapter.id}`,
                                            )
                                          }
                                          className="flex items-center gap-1 text-blue-600 hover:text-blue-700 dark:text-blue-400"
                                        >
                                          <PlayCircle className="h-4 w-4" />
                                          Continue
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* Lessons and MCQs */}
                                <div className="space-y-2">
                                  {[
                                    ...(chapter.lessons || []),
                                    ...(chapter.mcqs || []),
                                  ]
                                    .sort((a, b) => a.order - b.order)
                                    .map(
                                      (content: any, contentIndex: number) => {
                                        const isContentLocked =
                                          !isEnrolled && contentIndex > 0;
                                        return (
                                          <div
                                            key={content.id}
                                            className={cn(
                                              "flex items-center justify-between rounded-lg border p-3 transition-colors",
                                              isContentLocked
                                                ? "border-gray-300 bg-gray-50 text-gray-400 dark:border-gray-600 dark:bg-gray-700/50"
                                                : getContentTypeColor(
                                                    content.type,
                                                  ),
                                            )}
                                          >
                                            <div className="flex items-center gap-3">
                                              {isContentLocked ? (
                                                <Lock className="h-4 w-4 text-gray-400" />
                                              ) : (
                                                getContentTypeIcon(content.type)
                                              )}
                                              <span
                                                className={cn(
                                                  "text-sm font-medium",
                                                  isContentLocked &&
                                                    "text-gray-400",
                                                )}
                                              >
                                                {content.title}
                                                {isContentLocked &&
                                                  " (Preview)"}
                                              </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs">
                                              {content.duration > 0 && (
                                                <span>
                                                  {formatDuration(
                                                    content.duration,
                                                  )}
                                                </span>
                                              )}
                                              {!isContentLocked &&
                                                content.type === "mcq" &&
                                                content.points && (
                                                  <span className="rounded-full bg-green-100 px-2 py-1 text-green-700">
                                                    {content.points} pts
                                                  </span>
                                                )}
                                              {!isContentLocked &&
                                                content.type === "lesson" &&
                                                content.is_preview && (
                                                  <span className="rounded-full bg-blue-100 px-2 py-1 text-blue-700">
                                                    Preview
                                                  </span>
                                                )}
                                              {isEnrolled &&
                                                content.completed && (
                                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                                )}
                                            </div>
                                          </div>
                                        );
                                      },
                                    )}
                                </div>

                                {chapter.lessons?.length === 0 &&
                                  chapter.mcqs?.length === 0 && (
                                    <div className="flex items-center gap-2 text-sm text-yellow-600 dark:text-yellow-400">
                                      <Clock3 className="h-4 w-4" />
                                      Content will be available soon
                                    </div>
                                  )}

                                {/* Start Chapter Button for Enrolled Users */}
                                {isEnrolled &&
                                  (chapter.lessons?.length > 0 ||
                                    chapter.mcqs?.length > 0) && (
                                    <div className="mt-4 flex justify-end">
                                      <button
                                        onClick={() =>
                                          router.push(
                                            `/user-panel/courses/learn/${courseId}?chapter=${chapter.id}`,
                                          )
                                        }
                                        className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                                      >
                                        <PlayCircle className="h-4 w-4" />
                                        {chapter.user_progress?.completed
                                          ? "Review Chapter"
                                          : "Start Chapter"}
                                      </button>
                                    </div>
                                  )}
                              </div>
                            )}
                        </div>
                      );
                    })}
                  </div>

                  {chapters.length === 0 && (
                    <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                      <BookOpen className="mx-auto mb-3 h-12 w-12 opacity-50" />
                      <p>No chapters available yet.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "features" && (
                <div>
                  <h3 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
                    What You'll Learn
                  </h3>

                  {courseData.features && courseData.features.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      {courseData.features.map(
                        (feature: string, index: number) => (
                          <div key={index} className="flex items-center gap-3">
                            <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-500" />
                            <span className="text-gray-700 dark:text-gray-300">
                              {feature.replace(/<[^>]*>/g, "")}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 dark:text-gray-400">
                      <FileText className="mx-auto mb-3 h-12 w-12 opacity-50" />
                      <p>
                        No specific learning objectives listed for this course.
                      </p>
                    </div>
                  )}

                  {/* Benefits Section */}
                  <div className="mt-8 rounded-lg border border-gray-200 p-6 dark:border-gray-700">
                    <h4 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                      Course Benefits
                    </h4>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="flex items-start gap-3">
                        <Trophy className="h-5 w-5 flex-shrink-0 text-yellow-500" />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            Certificate
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Get certified upon completion
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Globe className="h-5 w-5 flex-shrink-0 text-blue-500" />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            Lifetime Access
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Access course content forever
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Download className="h-5 w-5 flex-shrink-0 text-green-500" />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            Resources
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Downloadable materials included
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <MessageCircle className="h-5 w-5 flex-shrink-0 text-purple-500" />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            Support
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Community and instructor support
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "progress" && isEnrolled && (
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
              )}
            </div>
          </div>

          {/* Right Column - Enrollment & Info */}
          <div className="space-y-6">
            {/* Enrollment Card */}
            <div className="sticky top-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              {isEnrolled ? (
                <>
                  <div className="mb-4 text-center">
                    <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                      <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      You're Enrolled!
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Continue your learning journey
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      router.push(`/user-panel/courses/learn?id=${courseId}`)
                    }
                    className="mb-3 w-full rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
                  >
                    Continue Learning
                  </button>

                  <button
                    onClick={() => setActiveTab("progress")}
                    className="w-full rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    View Progress
                  </button>
                </>
              ) : (
                <>
                  <div className="mb-4 text-center">
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">
                      {courseData.price_type === "free"
                        ? "Free"
                        : `$${courseData.price}`}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {courseData.price_type === "free"
                        ? "Free forever"
                        : "One-time payment"}
                    </div>
                  </div>

                  {enrollmentStatus === "success" && (
                    <div className="mb-4 rounded-lg bg-green-50 p-3 text-center text-green-700 dark:bg-green-900/20 dark:text-green-400">
                      Successfully enrolled!
                    </div>
                  )}

                  {enrollmentStatus && enrollmentStatus !== "success" && (
                    <div className="mb-4 rounded-lg bg-yellow-50 p-3 text-center text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400">
                      {enrollmentStatus}
                    </div>
                  )}

                  {!courseData.is_active ? (
                    <button
                      disabled
                      className="w-full cursor-not-allowed rounded-lg bg-gray-300 px-6 py-3 font-medium text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                    >
                      Coming Soon
                    </button>
                  ) : (
                    <button
                      onClick={handleEnroll}
                      disabled={enrolling || !statistics.has_content}
                      className={cn(
                        "w-full rounded-lg px-6 py-3 font-medium text-white transition-colors",
                        enrolling || !statistics.has_content
                          ? "cursor-not-allowed bg-gray-400 dark:bg-gray-600"
                          : "bg-blue-600 hover:bg-blue-700",
                      )}
                    >
                      {enrolling
                        ? "Enrolling..."
                        : !statistics.has_content
                          ? "Content Preparing"
                          : "Enroll Now"}
                    </button>
                  )}
                </>
              )}

              <div className="mt-6 space-y-3 border-t border-gray-200 pt-6 dark:border-gray-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Chapters
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {statistics.total_chapters || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Lessons
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {statistics.total_lessons || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">MCQs</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {statistics.total_mcqs || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Duration
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatDuration(totalDuration)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Level
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    All Levels
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Access
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    Lifetime
                  </span>
                </div>
              </div>

              {/* Quick Actions for Enrolled Users */}
              {isEnrolled && (
                <div className="mt-6 border-t border-gray-200 pt-6 dark:border-gray-700">
                  <h4 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">
                    Quick Actions
                  </h4>
                  <div className="space-y-2">
                    <button
                      onClick={() =>
                        router.push(`/user-panel/courses/learn/${courseId}`)
                      }
                      className="flex w-full items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      <PlayCircle className="h-4 w-4" />
                      Resume Learning
                    </button>
                    <button
                      onClick={() => setActiveTab("progress")}
                      className="flex w-full items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      <BarChart3 className="h-4 w-4" />
                      View Progress
                    </button>
                    <button className="flex w-full items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                      <Download className="h-4 w-4" />
                      Download Resources
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Instructor Info */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h3 className="mb-4 font-medium text-gray-900 dark:text-white">
                Instructor
              </h3>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 font-bold text-white">
                  {courseData.creator?.charAt(0) || "I"}
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {courseData.creator}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Course Instructor
                  </div>
                </div>
              </div>
              {isEnrolled && (
                <button className="mt-4 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                  Message Instructor
                </button>
              )}
            </div>

            {/* Course Stats */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h3 className="mb-4 font-medium text-gray-900 dark:text-white">
                Course Stats
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Enrolled
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {courseData.enrollment_count || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Rating
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      {courseData.ratings || 0}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Last Updated
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {new Date(courseData.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                {isEnrolled && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Your Progress
                    </span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      {Math.round(userData.progress.overall_progress)}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
