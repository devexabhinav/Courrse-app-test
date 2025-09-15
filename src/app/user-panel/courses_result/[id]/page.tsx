"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, BookOpen, CheckCircle, XCircle, Percent, BarChart3, Calendar } from "lucide-react";
import api from "@/lib/api";
import { toasterError } from "@/components/core/Toaster";
import Cookies from 'js-cookie';

interface ChapterResult {
  chapter_id: string;
  chapter_title: string;
  chapter_order: number;
  course_id: string;
  course_title: string;
  passed_at: string;
  score: number;
  total_questions: number;
  percentage: number;
  submission_id: string;
}

interface CourseResults {
  course_id: string;
  course_title: string;
  total_passed: number;
  total_mcqs: number;
  total_chapters: number;
  passed_chapters: ChapterResult[];
  progress_percentage: number;
  message: string;
}

export default function CourseResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get("course_id");
  const userId = Cookies.get('userId');

  const [results, setResults] = useState<CourseResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (courseId && userId) {
      fetchCourseResults();
    } else if (!courseId) {
      setError("Course ID is missing from URL parameters");
      setLoading(false);
    } else if (!userId) {
      setError("User not authenticated");
      setLoading(false);
    }
  }, [courseId, userId]);

// In your CourseResultsPage component, update the fetchCourseResults function:

const fetchCourseResults = async () => {
  try {
    setLoading(true);
    setError(null);

    // Updated API call to match your backend route
    const res = await api.get(`mcq/course/${courseId}/passed?user_id=${userId}`);

    if (res.success) {
      setResults(res.data?.data);
    } else {
      setError(res.error?.message || "Failed to load course results");
      toasterError(res.error?.message || "Failed to load course results", 3000);
    }
  } catch (err: any) {
    console.error("Failed to fetch course results:", err);
    const errorMsg = err.response?.data?.error?.message ||
      err.message ||
      "Failed to load course results";
    setError(errorMsg);
    toasterError(errorMsg, 3000);
  } finally {
    setLoading(false);
  }
};

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not available";
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading course results...</p>
        </div>
      </div>
    );
  }

  if (error || !results) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <button
            onClick={() => router.back()}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-8"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Go Back
          </button>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Unable to load course results
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error || "Results not available"}
            </p>
            <button
              onClick={fetchCourseResults}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Go Back
          </button>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {results.course_title}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Course Results and Progress Summary
                </p>
              </div>
              
              <div className="mt-4 md:mt-0">
                <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-lg text-center">
                  <div className="text-2xl font-bold">{results.progress_percentage}%</div>
                  <div className="text-sm">Overall Completion</div>
                </div>
              </div>
            </div>

            {/* Progress Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {results.total_passed}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Chapters Passed</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center">
                  <BookOpen className="h-6 w-6 text-blue-600 mr-2" />
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {results.total_chapters}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Chapters</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center">
                  <BarChart3 className="h-6 w-6 text-purple-600 mr-2" />
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {results.total_mcqs}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total MCQs</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300 mb-2">
                <span>Course Progress</span>
                <span>{results.total_passed}/{results.total_chapters} chapters completed</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${results.progress_percentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Chapter Results */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Chapter-wise Results
          </h2>

          {results.passed_chapters.length === 0 ? (
            <div className="text-center py-8">
              <XCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                No chapters completed yet. Start learning to see your progress here!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {results.passed_chapters.map((chapter, index) => (
                <div
                  key={chapter.chapter_id}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {index + 1}. {chapter.chapter_title}
                      </h3>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Passed on: {formatDate(chapter.passed_at)}
                        </div>
                        <div className="flex items-center">
                         
                          Score: {chapter.score}/{chapter.total_questions} ({chapter.percentage}%)
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 md:mt-0 md:ml-4">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        chapter.percentage >= 75
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                      }`}>
                        {chapter.percentage >= 75 ? 'Excellent' : 'Passed'}
                      </div>
                    </div>
                  </div>

                  {/* Individual chapter progress bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                      <span>Chapter Performance</span>
                      <span>{chapter.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          chapter.percentage >= 75
                            ? 'bg-green-500'
                            : 'bg-yellow-500'
                        }`}
                        style={{ width: `${chapter.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary Card */}
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Performance Summary
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                <strong>Course Completion:</strong> {results.progress_percentage}%
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                <strong>Chapters Passed:</strong> {results.total_passed} of {results.total_chapters}
              </p>
            </div>
            <div>
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                <strong>Average Score:</strong> {results.passed_chapters.length > 0 
                  ? Math.round(results.passed_chapters.reduce((sum, ch) => sum + ch.percentage, 0) / results.passed_chapters.length) 
                  : 0}%
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Total MCQs Attempted:</strong> {results.total_mcqs}
              </p>
            </div>
          </div>

          {results.progress_percentage === 100 && (
            <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span className="font-medium">Congratulations! You've completed this course.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}