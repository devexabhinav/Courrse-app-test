// app/user-panel/courses/learn/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronDown, ChevronUp, PlayCircle, Lock } from "lucide-react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

import { useApiClient } from "@/lib/api";
import { getDecryptedItem } from "@/utils/storageHelper";

// Types based on your actual API response
interface Lesson {
  id: string;
  title: string;
  content: string;
  video_url: string;
  duration: number;
  order: number;
  is_preview: boolean;
  type: "lesson";
  completed?: boolean;
}

interface MCQ {
  id: string;
  question: string;
  options: string[];
  type: "mcq";
  attempted?: boolean;
  passed?: boolean;
  correctAnswer?: number;
}

interface Chapter {
  id: string;
  title: string;
  order: number;
  description: string;
  duration: number;
  user_progress: any;
  lessons: Lesson[];
  mcqs: MCQ[];
  completed?: boolean;
  locked?: boolean;
}

interface Course {
  id: string;
  title: string;
  subtitle: string | null;
  description: string;
  category: string;
  image: string;
  creator: string;
  price: string;
  price_type: string;
  duration: string | null;
  status: string;
  features: any[];
  is_active: boolean;
  ratings: number;
  enrollment_count: number;
  createdAt: string;
  updatedAt: string;
  statistics: {
    total_chapters: number;
    total_lessons: number;
    total_mcqs: number;
    total_duration: number;
    has_content: boolean;
    total_enrolled: number;
  };
  user_data: any;
  chapters: Chapter[];
}

interface CourseProgress {
  courseId: string;
  currentChapter: string;
  completedChapters: string[];
  completedLessons: string[];
  passedMCQs: string[];
}

export default function CourseLearnPage() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get("id");
  const api = useApiClient();

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openSections, setOpenSections] = useState<boolean[]>([]);
  const [activeTab, setActiveTab] = useState("Overview");
  const [currentVideo, setCurrentVideo] = useState<any>("");
  const [showMCQModal, setShowMCQModal] = useState(false);
  const [currentMCQChapter, setCurrentMCQChapter] = useState<Chapter | null>(
    null,
  );
  const [currentMCQIndex, setCurrentMCQIndex] = useState(0);
  const [courseProgress, setCourseProgress] = useState<CourseProgress | null>(
    null,
  );

  // Get user ID from storage
  const getUserId = () => {
    const userData: any = getDecryptedItem("userData");
    return userData ? userData.id : null;
  };

  // Load course data and progress
  useEffect(() => {
    if (courseId) {
      loadCourseData();
    } else {
      setError("Course ID is missing");
      setLoading(false);
    }
  }, [courseId]);

  const loadCourseData = async () => {
    try {
      setLoading(true);
      const userId = getUserId();

      // Fetch course data with full details using your API client
      const courseResponse = await api.get(
        `course/${courseId}/full-details${userId ? `?user_id=${userId}` : ""}`,
      );

      console.log("API Response:", courseResponse);

      if (!courseResponse.success || !courseResponse.data?.data?.course) {
        throw new Error(courseResponse?.error?.message || "Course not found");
      }

      const courseData: Course = courseResponse.data.data.course;

      // Initialize empty progress data since user_data is null in response
      const progressData: CourseProgress = {
        courseId: courseData.id.toString(),
        currentChapter: "1",
        completedChapters: [],
        completedLessons: [],
        passedMCQs: [],
      };

      // Update chapters with completion and locking status
      const updatedChapters = courseData.chapters.map((chapter, index) => {
        const isFirstChapter = index === 0;
        const prevChapter = index > 0 ? courseData.chapters[index - 1] : null;

        // Chapter is locked if it's not the first chapter and previous chapter isn't completed
        const locked = !isFirstChapter && !prevChapter?.completed;

        // Chapter is completed if user_progress exists and is completed
        const completed = chapter.user_progress?.completed || false;

        return {
          ...chapter,
          locked,
          completed,
          lessons: chapter.lessons.map((lesson) => ({
            ...lesson,
            completed: false, // Initialize as not completed
            name: lesson.title, // Map title to name for frontend compatibility
            videoUrl: lesson.video_url, // Map video_url to videoUrl
            duration: `${lesson.duration || 0} min`, // Format duration
          })),
          mcqs: chapter.mcqs.map((mcq) => ({
            ...mcq,
            attempted: false,
            passed: false,
            correctAnswer: 0, // You'll need to get this from backend or calculate it
          })),
        };
      });

      // Sort chapters by order to ensure proper sequence
      const sortedChapters = updatedChapters.sort((a, b) => a.order - b.order);

      const processedCourse: any = {
        ...courseData,
        chapters: sortedChapters,
        rating: courseData.ratings || 0,
        students: courseData.enrollment_count || 0,
        totalDuration: `${courseData.statistics.total_duration || 0} min`,
      };

      setCourse(processedCourse);
      setCourseProgress(progressData);
      setOpenSections(sortedChapters.map(() => true));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load course");
      console.error("Error loading course:", err);
    } finally {
      setLoading(false);
    }
  };

  // Update progress in database
  const updateProgress = async (progress: CourseProgress) => {
    try {
      await api.put(`progress/${courseId}`, progress);
    } catch (error) {
      console.error("Failed to update progress:", error);
    }
  };

  // Update chapter completion and locking status
  const updateChaptersStatus = () => {
    if (!course || !courseProgress) return;

    const updatedChapters = course.chapters.map((chapter, index) => {
      // Check if all lessons are completed (if there are lessons)
      const allLessonsCompleted =
        chapter.lessons.length > 0
          ? chapter.lessons.every((lesson) =>
              courseProgress.completedLessons.includes(lesson.id),
            )
          : true; // If no lessons, consider them "completed"

      // Check if all MCQs are passed (if there are MCQs)
      const allMCQsPassed =
        chapter.mcqs.length > 0
          ? chapter.mcqs.every((mcq) =>
              courseProgress.passedMCQs.includes(mcq.id),
            )
          : true; // If no MCQs, consider them "passed"

      // Chapter is completed if both conditions are met
      const completed = allLessonsCompleted && allMCQsPassed;

      // Chapter is locked if it's not the first chapter and previous chapter isn't completed
      let locked = false;
      if (chapter.order > 1) {
        const prevChapter = course.chapters.find(
          (ch) => ch.order === chapter.order - 1,
        );
        locked = !prevChapter?.completed;
      }

      return { ...chapter, completed, locked };
    });

    setCourse((prev) => (prev ? { ...prev, chapters: updatedChapters } : null));
  };

  // Save progress whenever it changes
  useEffect(() => {
    if (courseProgress) {
      updateProgress(courseProgress);
      updateChaptersStatus();
    }
  }, [courseProgress]);

  const toggleSection = (index: number) => {
    const newOpenSections = [...openSections];
    newOpenSections[index] = !newOpenSections[index];
    setOpenSections(newOpenSections);
  };

  const handleLessonClick = async (chapter: Chapter, lesson: any) => {
    if (chapter.locked || !courseProgress) return;

    setCurrentVideo(lesson.videoUrl || "");

    // Mark lesson as completed
    if (!courseProgress.completedLessons.includes(lesson.id)) {
      try {
        // API call to mark lesson as completed using your API client
        await api.post(
          `progress/${courseId}/lessons/${lesson.id}/complete`,
          {},
        );

        const updatedProgress = {
          ...courseProgress,
          completedLessons: [...courseProgress.completedLessons, lesson.id],
        };

        setCourseProgress(updatedProgress);
      } catch (error) {
        console.error("Failed to mark lesson as completed:", error);
      }
    }
  };

  const handleChapterComplete = (chapter: Chapter) => {
    if (!courseProgress) return;

    // Check if all lessons are completed (if there are lessons)
    const allLessonsCompleted =
      chapter.lessons.length > 0
        ? chapter.lessons.every((lesson) =>
            courseProgress.completedLessons.includes(lesson.id),
          )
        : true;

    if (allLessonsCompleted && !chapter.completed) {
      setCurrentMCQChapter(chapter);
      setCurrentMCQIndex(0);
      setShowMCQModal(true);
    }
  };

  const handleMCQAnswer = async (selectedOption: number) => {
    if (!currentMCQChapter || !courseProgress) return;

    const currentMCQ = currentMCQChapter.mcqs[currentMCQIndex];

    try {
      // For now, we'll assume the first option is correct since we don't have correctAnswer from backend
      // You'll need to update this when your backend provides correct answers
      const isCorrect = selectedOption === 0; // Temporary - always assumes first option is correct

      // Update progress based on answer
      if (isCorrect && !courseProgress.passedMCQs.includes(currentMCQ.id)) {
        const updatedProgress = {
          ...courseProgress,
          passedMCQs: [...courseProgress.passedMCQs, currentMCQ.id],
        };

        setCourseProgress(updatedProgress);
      }

      // Move to next MCQ or close modal
      if (currentMCQIndex < currentMCQChapter.mcqs.length - 1) {
        setCurrentMCQIndex((prev) => prev + 1);
      } else {
        // Check if all MCQs are passed for this chapter
        const allMCQsPassed = currentMCQChapter.mcqs.every(
          (mcq) =>
            courseProgress.passedMCQs.includes(mcq.id) ||
            mcq.id === currentMCQ.id,
        );

        if (
          allMCQsPassed &&
          !courseProgress.completedChapters.includes(currentMCQChapter.id)
        ) {
          const finalProgress = {
            ...courseProgress,
            completedChapters: [
              ...courseProgress.completedChapters,
              currentMCQChapter.id,
            ],
            currentChapter: `chapter${currentMCQChapter.order + 1}`,
          };
          setCourseProgress(finalProgress);
        }

        setShowMCQModal(false);
        setCurrentMCQChapter(null);
        setCurrentMCQIndex(0);
      }
    } catch (error) {
      console.error("Failed to submit MCQ answer:", error);
    }
  };

  const tabs = [
    "Overview",
    "Notes",
    "Announcements",
    "Reviews",
    "Learning tools",
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading course...</div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg text-red-500">
          {error || "Course not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between bg-black px-4 py-3 text-white">
        <h1 className="text-lg font-semibold">{course.title}</h1>
        <div className="flex items-center gap-4 text-sm">
          <button className="hover:text-gray-300">Share</button>
          <button className="hover:text-gray-300">Leave a rating</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex w-full flex-1 flex-col lg:flex-row">
        {/* Left: Video + Tabs + Content */}
        <div className="w-full flex-1 overflow-y-auto">
          {/* Video */}
          <div className="aspect-video w-full bg-black">
            {currentVideo ? (
              <video
                className="h-full w-full object-cover"
                controls
                poster="https://placehold.co/1200x700?text=Course+Video"
                src={currentVideo}
              >
                Your browser does not support HTML video.
              </video>
            ) : (
              <div className="flex h-full items-center justify-center text-white">
                <div className="text-center">
                  <PlayCircle size={64} className="mx-auto mb-4 opacity-50" />
                  <p>Select a lesson to start watching</p>
                </div>
              </div>
            )}
          </div>

          {/* Tabs */}
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

          {/* Tab Content */}
          <div className="bg-white p-6 dark:bg-gray-900">
            {activeTab === "Overview" && (
              <div>
                <h1 className="mb-2 text-2xl font-semibold">{course.title}</h1>
                {course.subtitle && (
                  <h2 className="mb-4 text-xl text-gray-600 dark:text-gray-400">
                    {course.subtitle}
                  </h2>
                )}
                <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    ⭐ {course.rating || "No ratings"}
                  </span>
                  <span>{course.students} Students</span>
                  <span>{course.totalDuration} Total</span>
                  {course.user_data?.progress && (
                    <span className="text-green-500">
                      {Math.round(course.user_data.progress.overall_progress)}%
                      Completed
                    </span>
                  )}
                </div>
                <p className="max-w-3xl whitespace-pre-line text-gray-700 dark:text-gray-300">
                  {course.description}
                </p>

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
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      MCQs
                    </div>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                    <div className="text-2xl font-bold">{course.students}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Enrolled
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Other tabs remain the same */}
            {activeTab === "Notes" && (
              <div>
                <h2 className="mb-2 text-xl font-semibold">My Notes</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  You can add your personal notes here for quick revision later.
                </p>
              </div>
            )}
            {activeTab === "Announcements" && (
              <div>
                <h2 className="mb-2 text-xl font-semibold">Announcements</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  Stay tuned for the latest updates and news about the course!
                </p>
              </div>
            )}
            {activeTab === "Reviews" && (
              <div>
                <h2 className="mb-2 text-xl font-semibold">Student Reviews</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  ⭐⭐⭐⭐☆ – "Very detailed and easy to understand course!"
                </p>
              </div>
            )}
            {activeTab === "Learning tools" && (
              <div>
                <h2 className="mb-2 text-xl font-semibold">Learning Tools</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  Access additional resources, exercises, and code snippets
                  here.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <footer className="bg-gray-900 py-12 text-white">
            <div className="container mx-auto grid grid-cols-1 gap-8 px-4 md:grid-cols-4">
              {/* Logo & Description */}
              <div>
                <h2 className="mb-2 text-2xl font-bold">YourLogo</h2>
                <p className="text-gray-400">
                  We provide the best services and solutions to help your
                  business grow.
                </p>
                <div className="mt-4 flex space-x-4">
                  <a href="#" className="hover:text-blue-500">
                    <FaFacebookF />
                  </a>
                  <a href="#" className="hover:text-blue-400">
                    <FaTwitter />
                  </a>
                  <a href="#" className="hover:text-pink-500">
                    <FaInstagram />
                  </a>
                  <a href="#" className="hover:text-blue-600">
                    <FaLinkedinIn />
                  </a>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="mb-4 text-xl font-semibold">Quick Links</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <a href="#" className="hover:text-white">
                      Home
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Services
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>

              {/* Contact Info */}
              <div>
                <h3 className="mb-4 text-xl font-semibold">Contact Us</h3>
                <p className="text-gray-400">123 Main Street, City, Country</p>
                <p className="mt-2 text-gray-400">Email: info@example.com</p>
                <p className="mt-2 text-gray-400">Phone: +123 456 7890</p>
              </div>

              {/* Newsletter */}
              <div>
                <h3 className="mb-4 text-xl font-semibold">Subscribe</h3>
                <p className="mb-4 text-gray-400">
                  Get our latest updates and offers.
                </p>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full rounded-l-md px-4 py-2 text-gray-900 focus:outline-none"
                  />
                  <button className="rounded-r-md bg-orange-500 px-4 py-2 transition hover:bg-orange-600">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-8 border-t border-gray-700 pt-4 text-center text-sm text-gray-500">
              © {new Date().getFullYear()} YourLogo. All rights reserved.
            </div>
          </footer>
        </div>

        {/* Right: Accordion */}
        <div className="mt-6 w-full lg:mt-0 lg:h-[calc(100vh-72px)] lg:w-1/3 lg:pl-4">
          <div className="fixed top-[12%] h-full overflow-y-auto border-l border-gray-300 bg-transparent p-4 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-3 text-lg font-semibold">Course Content</h2>
            {course.chapters.map((chapter: Chapter, index: number) => (
              <div
                key={chapter.id}
                className="mb-2 border-b border-gray-300 dark:border-gray-700"
              >
                <button
                  onClick={() => toggleSection(index)}
                  className="flex w-full items-center justify-between py-2 text-left font-medium transition hover:text-blue-500"
                >
                  <div className="flex items-center gap-2">
                    {chapter.locked && <Lock size={16} />}
                    <span>
                      Chapter {chapter.order}: {chapter.title}
                    </span>
                    {chapter.completed && (
                      <span className="text-xs text-green-500">
                        ✓ Completed
                      </span>
                    )}
                  </div>
                  {openSections[index] ? (
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} />
                  )}
                </button>
                {openSections[index] && (
                  <div className="space-y-1 pb-2 pl-4">
                    {/* Lessons */}
                    {chapter.lessons.length > 0 ? (
                      chapter.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          onClick={() =>
                            !chapter.locked &&
                            handleLessonClick(chapter, lesson)
                          }
                          className={`flex cursor-pointer items-center justify-between text-sm ${
                            chapter.locked
                              ? "cursor-not-allowed text-gray-400"
                              : courseProgress?.completedLessons.includes(
                                    lesson.id,
                                  )
                                ? "text-green-500 hover:text-green-600"
                                : "text-gray-700 hover:text-blue-500 dark:text-gray-300"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <PlayCircle size={14} />
                            <span>{lesson.name}</span>
                            {courseProgress?.completedLessons.includes(
                              lesson.id,
                            ) && <span className="text-xs">✓</span>}
                          </div>
                          <span>{lesson.duration}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm italic text-gray-500">
                        No lessons available
                      </div>
                    )}

                    {/* MCQ Section */}
                    <div className="mt-2 border-t border-gray-200 pt-2 dark:border-gray-600">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          Chapter MCQs
                        </span>
                        {chapter.locked ? (
                          <span className="text-xs text-gray-400">Locked</span>
                        ) : chapter.lessons.length === 0 ||
                          chapter.lessons.every((lesson) =>
                            courseProgress?.completedLessons.includes(
                              lesson.id,
                            ),
                          ) ? (
                          <button
                            onClick={() => handleChapterComplete(chapter)}
                            className="rounded bg-blue-500 px-2 py-1 text-xs text-white hover:bg-blue-600"
                          >
                            Attempt MCQs
                          </button>
                        ) : (
                          <span className="text-xs text-gray-500">
                            Complete lessons first
                          </span>
                        )}
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        {
                          chapter.mcqs.filter((mcq) =>
                            courseProgress?.passedMCQs.includes(mcq.id),
                          ).length
                        }{" "}
                        of {chapter.mcqs.length} passed
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MCQ Modal */}
      {showMCQModal && currentMCQChapter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-semibold">
              MCQ {currentMCQIndex + 1} of {currentMCQChapter.mcqs.length}
            </h3>
            <p className="mb-4">
              {currentMCQChapter.mcqs[currentMCQIndex].question}
            </p>
            <div className="space-y-2">
              {currentMCQChapter.mcqs[currentMCQIndex].options.map(
                (option, index) => (
                  <button
                    key={index}
                    onClick={() => handleMCQAnswer(index)}
                    className="w-full rounded border border-gray-300 p-3 text-left transition hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
                  >
                    {option}
                  </button>
                ),
              )}
            </div>
            <div className="mt-4 text-sm text-gray-500">
              Progress: {currentMCQIndex + 1} / {currentMCQChapter.mcqs.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
