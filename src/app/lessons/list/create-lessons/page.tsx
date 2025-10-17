"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

interface Chapter {
  id: number;
  title: string;
  order: number;
  course: {
    id: number;
    title: string;
  };
}

export default function CreateLessonPage() {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    chapter_id: "",
    course_id: "",
    order: "",
    lesson_type: "text",
    duration: "",
    video_url: "",
    is_free: true,
    resources: "",
  });
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  useEffect(() => {
    setMounted(true);

    // Get URL parameters after component mounts on client
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const chapterId = searchParams.get("chapter_id") || "";
      const courseId = searchParams.get("course_id") || "";

      // Set chapter_id directly from URL params
      if (chapterId) {
        setFormData((prev) => ({
          ...prev,
          chapter_id: chapterId,
          course_id: courseId,
        }));
        fetchChapterDetails(chapterId);
      }
    }
  }, []);

  const fetchChapterDetails = async (chapterId: string) => {
    try {
      const response = await api.get(`chapter/${chapterId}`);

      if (response.success && response.data) {
        setChapter(response.data.data.chapter);
      }
    } catch (error) {
      console.error("Error fetching chapter details:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate chapter_id is present
    if (!formData.chapter_id) {
      setError("Chapter ID is required");
      setLoading(false);
      return;
    }

    try {
      // Parse resources if provided
      const resources = formData.resources
        ? JSON.parse(formData.resources)
        : [];

      const response = await api.post("lessons", {
        ...formData,
        chapter_id: parseInt(formData.chapter_id),
        order: parseInt(formData.order),
        duration: formData.duration ? parseInt(formData.duration) : null,
        resources,
      });

      if (response.success) {
        router.push(
          `/lessons/list?course_id=${formData.course_id}&chapter_id=${formData.chapter_id}`,
        );
      } else {
        setError(response.error || "Error creating lesson");
      }
    } catch (error) {
      setError("Error creating lesson");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Don't render until mounted on client
  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="flex items-center justify-center py-8">
              <div className="text-lg text-gray-600">Loading...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Create New Lesson
            </h1>
            {chapter && (
              <p className="mt-2 text-gray-600">
                For: {chapter?.course?.title} - Chapter {chapter?.order}:{" "}
                {chapter?.title}
              </p>
            )}
            {!chapter && formData?.chapter_id && (
              <p className="mt-2 text-gray-600">
                Chapter ID: {formData?.chapter_id}
              </p>
            )}
          </div>
          <button
            onClick={() => router.back()}
            className="rounded-lg bg-gray-500 px-4 py-2 text-white transition-colors hover:bg-gray-600"
          >
            Back
          </button>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-md">
          {error && (
            <div className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Chapter ID Display (Read-only) */}

              {/* Title */}
              <div className="md:col-span-2">
                <label
                  htmlFor="title"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Lesson Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter lesson title"
                />
              </div>

              {/* Order */}
              <div>
                <label
                  htmlFor="order"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Order *
                </label>
                <input
                  type="number"
                  id="order"
                  name="order"
                  value={formData.order}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Lesson order in chapter"
                />
              </div>

              {/* Lesson Type */}
              <div>
                <label
                  htmlFor="lesson_type"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Lesson Type *
                </label>
                <select
                  id="lesson_type"
                  name="lesson_type"
                  value={formData.lesson_type}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="text">Text</option>
                  <option value="video">Video</option>
                  <option value="quiz">Quiz</option>
                  <option value="assignment">Assignment</option>
                </select>
              </div>

              {/* Duration */}
              <div>
                <label
                  htmlFor="duration"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  min="1"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Estimated duration in minutes"
                />
              </div>

              {/* Free Status */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_free"
                  name="is_free"
                  checked={formData.is_free}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      is_free: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor="is_free"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Free Lesson
                </label>
              </div>
            </div>

            {/* Video URL (conditionally shown) */}
            {formData.lesson_type === "video" && (
              <div>
                <label
                  htmlFor="video_url"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Video URL *
                </label>
                <input
                  type="url"
                  id="video_url"
                  name="video_url"
                  value={formData.video_url}
                  onChange={handleChange}
                  required={formData.lesson_type === "video"}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/video.mp4"
                />
              </div>
            )}

            {/* Content */}
            <div>
              <label
                htmlFor="content"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Content *
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows={8}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter lesson content (HTML or Markdown supported)"
              />
            </div>

            {/* Resources */}
            <div>
              <label
                htmlFor="resources"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Resources (JSON format)
              </label>
              <textarea
                id="resources"
                name="resources"
                value={formData.resources}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder='[{"name": "PDF Guide", "url": "https://example.com/guide.pdf"}]'
              />
              <p className="mt-1 text-sm text-gray-500">
                Enter resources as JSON array of objects with "name" and "url"
                properties
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={() => router.back()}
                className="rounded-lg bg-gray-500 px-6 py-2 text-white transition-colors hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !formData.chapter_id}
                className="rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Lesson"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
