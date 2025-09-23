"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import api from "@/lib/api";

interface Chapter {
  id: string;
  title: string;
  content: string;
  order: number;
  course?: {
    title: string;
    id:any;
  };
  images?: any[];
  videos?: any[];
  createdAt?: string;
  updatedAt?: string;
}

export default function Chapters() {
  const router = useRouter();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const params = useParams();
  const courseId: string = params.id as string;
  // Try converting both to string for comparison



  const fetchChapters = async () => {
    try {
      setLoading(true);
      const res = await api.get(`chapter/allchapters`);

      if (res.success) {
        setChapters(res.data?.data?.data);
        const chpt = res.data?.data?.data;

      } else {
        setError("Failed to fetch chapters");
      }
    } catch (err) {
      console.error("Failed to fetch chapters:", err);
      setError("Failed to load chapters. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChapters();
  }, []);

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(dateString));
  };




  if (loading) {
    return (
      <div className={cn(
        "rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",

      )}>
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          Loading chapters...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn(
        "rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",

      )}>
        <div className="text-center py-12 text-red-500 dark:text-red-400">
          {error}
          <button
            onClick={fetchChapters}
            className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="
        rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card"
    >
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
          All Chapters
        </h2>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Total: {chapters.filter((chapter: any) => chapter.course_id == courseId).length} chapter{chapters.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Chapters Grid */}
      {chapters.length > 0  ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chapters.filter((chapter: any) => chapter.course_id == courseId).map((chapter: Chapter) => (
            <div
              key={chapter.id}
              className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => router.push(`/mcq/add-mcq?chapter=${encodeURIComponent(chapter?.id)}&course=${encodeURIComponent(chapter?.course?.id)}`)}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-lg text-dark dark:text-white line-clamp-1">
                  {chapter.title}
                </h3>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                  Order: {chapter.order}
                </span>
              </div>

              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                {chapter.content}
              </p>

              <div className="mb-4">
                <p className="text-xs text-gray-500 dark:text-gray-400">Course:</p>
                <p className="text-sm font-medium text-dark dark:text-white">
                  {chapter.course?.title || "No course assigned"}
                </p>
              </div>

              {/* Media counts */}
              <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400 mb-2">
                {chapter.images && chapter.images.length > 0 && (
                  <span className="flex items-center">
                    <span className="mr-1">📷</span> {chapter.images.length} image{chapter.images.length !== 1 ? 's' : ''}
                  </span>
                )}
                {chapter.videos && chapter.videos.length > 0 && (
                  <span className="flex items-center">
                    <span className="mr-1">🎥</span> {chapter.videos.length} video{chapter.videos.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {/* Dates */}
              {chapter.createdAt && (
                <div className="text-xs text-gray-400 dark:text-gray-500">
                  Created: {formatDate(chapter.createdAt)}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          No chapters found. Create your first chapter to get started.
        </div>
      )}
    </div>
  );
}