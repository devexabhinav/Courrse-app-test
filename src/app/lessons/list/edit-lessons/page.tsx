"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";

export default function EditLessonPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lessonId = searchParams.get("lesson_id");
  const courseId = searchParams.get("course_id");
  const chapterId = searchParams.get("chapter_id");

  const [lesson, setLesson] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [duration, setDuration] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  useEffect(() => {
    if (lessonId) fetchLesson();
  }, [lessonId]);

  const fetchLesson = async () => {
    try {
      const res = await api.get(`lessons/${lessonId}`);
      if (res.success) {
        const data = res.data.data.lesson; // ✅ FIXED: Access the 'lesson' key
        setLesson(data);
        setTitle(data.title);
        setContent(data.content);
        setDuration(data.duration || "");
        setVideoUrl(data.video_url || "");
      } else {
        console.error("❌ Unexpected API format:", res);
      }
    } catch (err) {
      console.error("❌ Failed to load lesson:", err);
    }
  };

  const handleUpdate = async () => {
    try {
      const res = await api.put(`lessons/${lessonId}`, {
        title,
        content,
        duration,
        video_url: videoUrl,
      });

      if (res.success) {
        alert("✅ Lesson updated successfully!");
        router.push(
          `/lessons/list?chapter_id=${chapterId}&course_id=${courseId}`,
        );
      } else {
        alert("❌ Failed to update lesson");
      }
    } catch (err) {
      console.error("❌ Update failed:", err);
    }
  };

  if (!lesson) {
    return <div className="p-10 text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-3xl rounded-lg bg-white p-8 shadow dark:bg-gray-800">
      <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        Edit Lesson: {lesson.title}
      </h2>

      <div className="flex flex-col gap-4">
        <label className="font-medium text-gray-700 dark:text-gray-200">
          Title
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-900"
          />
        </label>

        <label className="font-medium text-gray-700 dark:text-gray-200">
          Content
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className="mt-1 w-full rounded border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-900"
          />
        </label>

        <label className="font-medium text-gray-700 dark:text-gray-200">
          Duration (minutes)
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="mt-1 w-full rounded border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-900"
          />
        </label>

        <label className="font-medium text-gray-700 dark:text-gray-200">
          Video URL
          <input
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="mt-1 w-full rounded border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-900"
          />
        </label>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() =>
              router.push(
                `/lessons/list?chapter_id=${chapterId}&course_id=${courseId}`,
              )
            }
            className="rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
          >
            Cancel
          </button>

          <button
            onClick={handleUpdate}
            className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
