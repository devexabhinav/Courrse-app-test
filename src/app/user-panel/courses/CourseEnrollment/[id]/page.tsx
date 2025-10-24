"use client";

import { useState, useEffect, use } from "react";
import {
  Clock,
  BookOpen,
  Award,
  ChevronDown,
  Search,
  BarChart3,
  FileText,
  Calendar,
  Users,
  Star,
  CheckCircle,
  PlayCircle,
  Video,
  FileQuestion,
  UserPlus,
} from "lucide-react";
import { useParams } from "next/navigation";
import { getDecryptedItem } from "@/utils/storageHelper";
import { useApiClient } from "@/lib/api";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollmentStatus, setEnrollmentStatus] = useState<any>(null);
  const [user, setUser] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const api = useApiClient();

  const params = useParams();
  const courseId = params.id;
  const userId: any = getDecryptedItem("userId");

  useEffect(() => {
    const fetchEnrollmentStatus = async () => {
      if (!userId || !courseId) return;

      try {
        const response = await api.get(
          `enroll/course/status?user_id=${userId}&course_id=${courseId}`,
        );

        if (response.data?.data?.enrolled) {
          setIsEnrolled(true);
          // Optionally store progress if you want:
          // setProgress(response.data.progress);
        } else {
          setIsEnrolled(false);
        }
      } catch (err) {
        console.error("Failed to fetch enrollment status:", err);
      }
    };

    fetchEnrollmentStatus();
  }, []); // ✅ Empty dependency array

  useEffect(() => {
    // Fetch user data from localStorage or your auth context
    const userData = userId;
    if (userData) {
      setUser(JSON.parse(userData));
    }

    const fetchCourseData = async () => {
      try {
        setLoading(true);
        const res = await api.get(`course/${courseId}`);

        if (res.success) {
          setCourse(res.data?.data);
        } else {
          // setError("Failed to fetch course data");
        }
      } catch (err) {
        console.error("Failed to load course data:", err);
        // setError("Error loading course data");
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);

  const handleEnroll = async () => {
    if (!user) {
      // setEnrollmentStatus("Please log in to enroll in this course");
      return;
    }

    setEnrolling(true);
    setEnrollmentStatus(null);

    try {
      const response = await api.post("enroll", {
        user_id: user,
        course_id: courseId,
      });

      if (response.success) {
        setEnrollmentStatus("success");
        // Update course data to reflect enrollment
        // setCourse(prev => ({...prev, isEnrolled: true}));
      } else {
        setEnrollmentStatus(response || "Enrolled");
      }
    } catch (err) {
      console.error("Enrollment error:", err);
      setEnrollmentStatus("An error occurred during enrollment");
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6 dark:bg-gray-800">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Loading course data...
          </p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6 dark:bg-gray-800">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300">
            {error || "Course not found"}
          </p>
        </div>
      </div>
    );
  }

  const formattedCourse = {
    id: course.id,
    title: course.title,
    description: course.description || "Complete course",
    duration: course.duration || "10 hours",
    chapters: course.chapters_count || 0,
    videos: course.videos_count || 0,
    assessments: course.assessments_count || 0,
    certificate: course.certificate_available || false,
    price: course.price || "Free",
    progress: course.progress || 8,
    stepsCompleted: course.completed_steps || 2,
    totalSteps: course.total_steps || 24,
    enrollment: course.enrollment_count || 1250,
    rating: course.rating || 4.8,
    reviews: course.reviews_count || 124,
    instructor: {
      name: course.instructor?.name || "John Doe",
      role: course.instructor?.role || "Senior Developer",
    },
    roadmap: {
      title: course.roadmap_title || `Roadmap for ${course.title}`,
      progress: course.roadmap_progress || 8.25,
      technologies: course.technologies || ["Node", "Express", "MongoDB"],
    },
    isEnrolled: course.isEnrolled || false,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-800">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600 dark:text-gray-300">11:48</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            26°C Bain
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            03/02/2023
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <input
              type="text"
              placeholder="Quick search"
              className="rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      <div className="mb-2 text-sm text-gray-600 dark:text-gray-300">
        Course App
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column - Course Info */}
        <div className="lg:col-span-2">
          {/* Roadmap Section */}
          <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
              {formattedCourse.roadmap.title}
            </h2>

            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                    style={{ width: `${formattedCourse.roadmap.progress}%` }}
                  ></div>
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {formattedCourse.roadmap.progress}%
                </span>
              </div>
              <button className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                Reset
              </button>
            </div>

            <div className="mb-4 grid grid-cols-3 gap-4">
              {formattedCourse.roadmap.technologies.map(
                (tech: any, index: number) => (
                  <div
                    key={index}
                    className="rounded-lg border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-3 dark:border-blue-800/30 dark:from-blue-900/30 dark:to-indigo-900/30"
                  >
                    <h3 className="font-medium text-blue-800 dark:text-blue-200">
                      {tech}
                    </h3>
                  </div>
                ),
              )}
            </div>

            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Users className="mr-1 h-4 w-4" />
              <span>{formattedCourse.enrollment} enrolled</span>
              <span className="mx-2">•</span>
              <span>All Levels</span>
            </div>
          </div>

          {/* Course Stats Cards */}
          <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="flex items-center rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-900">
              <div className="mr-4 rounded-full bg-blue-100 p-3 dark:bg-blue-900/30">
                <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Duration
                </div>
                <div className="text-lg font-bold text-gray-800 dark:text-white">
                  {formattedCourse.duration}
                </div>
              </div>
            </div>

            <div className="flex items-center rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-900">
              <div className="mr-4 rounded-full bg-green-100 p-3 dark:bg-green-900/30">
                <Video className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Videos
                </div>
                <div className="text-lg font-bold text-gray-800 dark:text-white">
                  {formattedCourse.videos}
                </div>
              </div>
            </div>

            <div className="flex items-center rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-900">
              <div className="mr-4 rounded-full bg-purple-100 p-3 dark:bg-purple-900/30">
                <FileQuestion className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Assessments
                </div>
                <div className="text-lg font-bold text-gray-800 dark:text-white">
                  {formattedCourse.assessments}
                </div>
              </div>
            </div>

            <div className="flex items-center rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-900">
              <div className="mr-4 rounded-full bg-orange-100 p-3 dark:bg-orange-900/30">
                <UserPlus className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Enrollment
                </div>
                <div className="text-lg font-bold text-gray-800 dark:text-white">
                  {formattedCourse.enrollment}
                </div>
              </div>
            </div>
          </div>

          {/* Enroll Now Button - Moved to top right */}
          <div className="mb-6 flex justify-end">
            <div className="flex items-center rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <div className="mr-4 text-right">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formattedCourse.price}
                </div>
                {enrollmentStatus === "success" && (
                  <div className="mt-1 text-sm text-green-600 dark:text-green-400">
                    Enrolled successfully!
                  </div>
                )}
                {enrollmentStatus && enrollmentStatus !== "success" && (
                  <div className="mt-1 text-sm text-green-600">
                    {enrollmentStatus}
                  </div>
                )}
              </div>

              {isEnrolled ? (
                <button
                  // onClick={handleEnroll}
                  // disabled={enrolling || formattedCourse.isEnrolled}
                  className={`transform rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2 text-sm font-medium text-white transition-all hover:scale-105 hover:from-blue-700 hover:to-purple-700 ${
                    enrolling || formattedCourse.isEnrolled
                      ? "cursor-not-allowed opacity-50"
                      : ""
                  }`}
                >
                  Enrolled
                </button>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={enrolling || formattedCourse.isEnrolled}
                  className={`transform rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2 text-sm font-medium text-white transition-all hover:scale-105 hover:from-blue-700 hover:to-purple-700 ${
                    enrolling || formattedCourse.isEnrolled
                      ? "cursor-not-allowed opacity-50"
                      : ""
                  }`}
                >
                  {enrolling
                    ? "Enrolling..."
                    : formattedCourse.isEnrolled
                      ? "Enrolled"
                      : "Enroll Now"}
                </button>
              )}
            </div>
          </div>

          {/* Course Details */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <div className="mb-6">
              <h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                {formattedCourse.title}
              </h2>
              <div className="mb-3 flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Clock className="mr-1 h-4 w-4" />
                <span>{formattedCourse.duration}</span>
                <span className="mx-2">•</span>
                <BookOpen className="mr-1 h-4 w-4" />
                <span>{formattedCourse.chapters} chapters</span>
                <span className="mx-2">•</span>
                <Award className="mr-1 h-4 w-4" />
                <span>
                  {formattedCourse.certificate
                    ? "Certificate"
                    : "No Certificate"}
                </span>
              </div>
              {/* Display the course description */}
              <p className="mb-4 rounded-r border-l-4 border-blue-500 bg-blue-50 py-2 pl-4 text-gray-700 dark:border-blue-400 dark:bg-blue-900/20 dark:text-gray-300">
                {formattedCourse.description}
              </p>
            </div>

            {/* Tabs */}
            <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
              <nav className="-mb-px flex">
                {["overview", "curriculum", "instructor", "reviews"].map(
                  (tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`mr-8 border-b-2 px-1 py-3 text-center text-sm font-medium ${
                        activeTab === tab
                          ? "border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                          : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-300"
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ),
                )}
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === "overview" && (
              <div>
                <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
                  About this course
                </h3>

                <div className="mb-6 grid grid-cols-2 gap-4">
                  <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
                    <BarChart3 className="mr-3 h-5 w-5 text-blue-500" />
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Level
                      </div>
                      <div className="font-medium text-gray-800 dark:text-white">
                        All Levels
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
                    <FileText className="mr-3 h-5 w-5 text-blue-500" />
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Resources
                      </div>
                      <div className="font-medium text-gray-800 dark:text-white">
                        5 downloadable resources
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
                    <Clock className="mr-3 h-5 w-5 text-blue-500" />
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Duration
                      </div>
                      <div className="font-medium text-gray-800 dark:text-white">
                        {formattedCourse.duration}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
                    <Award className="mr-3 h-5 w-5 text-blue-500" />
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Certificate
                      </div>
                      <div className="font-medium text-gray-800 dark:text-white">
                        {formattedCourse.certificate ? "Yes" : "No"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
                    <BookOpen className="mr-3 h-5 w-5 text-blue-500" />
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Chapters
                      </div>
                      <div className="font-medium text-gray-800 dark:text-white">
                        {formattedCourse.chapters} chapters
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
                    <Calendar className="mr-3 h-5 w-5 text-blue-500" />
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Access
                      </div>
                      <div className="font-medium text-gray-800 dark:text-white">
                        Lifetime access
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "curriculum" && (
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Curriculum
                  </h3>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {formattedCourse.chapters} chapters •{" "}
                    {formattedCourse.duration} total length
                  </div>
                </div>

                <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between bg-gray-50 p-4 dark:bg-gray-800">
                    <div className="flex items-center">
                      <ChevronDown className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          Introduction to {formattedCourse.title}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          0 lessons • 30 min
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Enroll to access
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "instructor" && (
              <div>
                <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
                  About the Instructor
                </h3>
                <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                  <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 font-bold text-white">
                    {formattedCourse.instructor.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-800 dark:text-white">
                      {formattedCourse.instructor.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {formattedCourse.instructor.role}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div>
                <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
                  Reviews
                </h3>
                <div className="mb-4 flex items-center">
                  <div className="mr-2 flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="h-5 w-5 fill-current text-yellow-400"
                      />
                    ))}
                  </div>
                  <span className="text-lg font-bold text-gray-800 dark:text-white">
                    {formattedCourse.rating}
                  </span>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">
                    ({formattedCourse.reviews} reviews)
                  </span>
                </div>
                <div className="text-gray-700 dark:text-gray-300">
                  No reviews yet. Be the first to review this course!
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Stats */}
        <div className="space-y-6">
          {/* Progress Stats */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <h3 className="mb-4 font-medium text-gray-900 dark:text-white">
              Course Progress
            </h3>
            <div className="mb-4 flex justify-center">
              <div className="relative h-32 w-32">
                <svg className="h-full w-full" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#eee"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="3"
                    strokeDasharray={`${formattedCourse.progress}, 100`}
                  />
                  <defs>
                    <linearGradient
                      id="gradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formattedCourse.progress}%
                  </span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    Completed
                  </span>
                </div>
              </div>
            </div>
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              {formattedCourse.stepsCompleted} of {formattedCourse.totalSteps}{" "}
              steps completed
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <h3 className="mb-4 font-medium text-gray-900 dark:text-white">
              Recent Activity
            </h3>
            <div className="space-y-3">
              <div className="flex items-start rounded-lg border border-blue-100 bg-blue-50 p-3 dark:border-blue-800/30 dark:bg-blue-900/20">
                <div className="mr-3 rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
                  <PlayCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-800 dark:text-white">
                    Started new chapter
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Introduction to Node.js
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500">
                    2 hours ago
                  </div>
                </div>
              </div>
              <div className="flex items-start rounded-lg border border-green-100 bg-green-50 p-3 dark:border-green-800/30 dark:bg-green-900/20">
                <div className="mr-3 rounded-full bg-green-100 p-2 dark:bg-green-900/30">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-800 dark:text-white">
                    Completed quiz
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    JavaScript Basics
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500">
                    1 day ago
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Course Rating */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <h3 className="mb-4 font-medium text-gray-900 dark:text-white">
              Course Rating
            </h3>
            <div className="mb-2 flex items-center justify-center">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="h-5 w-5 fill-current text-yellow-400"
                  />
                ))}
              </div>
              <span className="ml-2 text-lg font-bold text-gray-800 dark:text-white">
                {formattedCourse.rating}
              </span>
            </div>
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              Based on {formattedCourse.reviews} reviews
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
