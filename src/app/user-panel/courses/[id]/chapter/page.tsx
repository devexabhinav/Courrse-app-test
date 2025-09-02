"use client";

import { cn } from "@/lib/utils";
import api from "@/lib/api";
import { useEffect, useState } from "react";
import { Pencil, SearchIcon, Trash2, ImageIcon, VideoIcon, ListOrdered } from "lucide-react";
import { toasterError, toasterSuccess } from "@/components/core/Toaster";
import { useRouter, useParams } from "next/navigation";

export default function Chapters({ className }: any) {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id; 
  
  const [search, setSearch] = useState("");
  const [chapters, setChapters] = useState<any[]>([]);
  const [showMediaModal, setShowMediaModal] = useState<any>(false);
  const [activeMedia, setActiveMedia] = useState<any>({ type: "image", items: [] });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(8); // Increased limit for better grid layout
  const [courseName, setCourseName] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchChapters = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams();
      query.append("page", String(page));
      query.append("limit", String(limit));
      if (search) query.append("search", search);
      
      if (courseId) {
        query.append("course_id", courseId.toString());
      }

      console.log("Fetching chapters with courseId:", courseId);
      const res = await api.get(`chapter/get-all-chapters?${query.toString()}`);

      if (res.success) {
        let filteredChapters = res.data?.data?.data || [];
        
        if (courseId) {
          filteredChapters = filteredChapters.filter(
            (chapter: any) => chapter.course_id?.toString() === courseId.toString()
          );
        }
        
        setChapters(filteredChapters);
        setTotalPages(res.data?.data?.pagination?.totalPages || 1);
        
        if (filteredChapters.length > 0 && filteredChapters[0].course) {
          setCourseName(filteredChapters[0].course.title);
        } else if (courseId) {
          fetchCourseName();
        }
      }
    } catch (err) {
      console.error("Failed to fetch chapters:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChapterClick = (chapterId: number) => {
  router.push(`/user-panel/chapters/${chapterId}`);
};


  const fetchCourseName = async () => {
    try {
      const res = await api.get(`course/${courseId}`);
      if (res.success) {
        setCourseName(res.data?.data?.title || "Unknown Course");
      }
    } catch (err) {
      console.error("Failed to fetch course name:", err);
    }
  };

  useEffect(() => {
    fetchChapters();
  }, [page, search, courseId]);



  if (loading) {
    return (
      <div className={cn("flex items-center justify-center h-64", className)}>
        <div className="text-lg">Loading chapters...</div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-[10px] bg-white px-6 pb-6 pt-6 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className
      )}
    >
      {/* Header Section */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {courseId ? "Course Chapters" : "All Chapters List"}
          </h2>
          {courseId && (
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {courseName 
                ? `Course: ${courseName}` 
                : `Course ID: ${courseId}`}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="search"
              placeholder="Search chapters..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 shadow-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
            />
          </div>

    
        </div>
      </div>

      {/* Media Modal */}
      {showMediaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 px-4">
          <div
            className={cn(
              "relative max-h-[90vh] overflow-y-auto rounded-lg bg-white p-6 dark:bg-gray-800",
              activeMedia.items.length === 1 ? "w-auto" : "w-[90vw]"
            )}
          >
            <button
              onClick={() => setShowMediaModal(false)}
              className="absolute right-4 top-4 text-xl font-bold text-red-500"
            >
              ✕
            </button>

            <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
              {activeMedia.type === "image" ? "Chapter Image" : "Chapter Video"}
            </h3>

            <div
              className={cn(
                "grid gap-4 mx-auto",
                activeMedia.items.length <= 1
                  ? "grid-cols-1"
                  : activeMedia.items.length === 2
                    ? "grid-cols-2"
                    : activeMedia.items.length === 3
                      ? "grid-cols-3"
                      : activeMedia.items.length === 4
                        ? "grid-cols-4"
                        : activeMedia.items.length === 5
                          ? "grid-cols-5"
                          : "grid-cols-6"
              )}
              style={{
                maxWidth: "fit-content",
              }}
            >
              {activeMedia.items.map((url: any, idx: any) => {
                if (!url) return null;

                return activeMedia.type === "image" ? (
                  <a
                    key={idx}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={url}
                      alt={`media-${idx}`}
                      className={cn(
                        "rounded border object-contain cursor-pointer",
                        activeMedia.items.length === 1
                          ? "h-auto max-h-[70vh] w-auto max-w-full"
                          : "h-32 w-48"
                      )}
                    />
                  </a>
                ) : (
                  <video
                    key={idx}
                    src={url}
                    controls
                    className={cn(
                      "rounded border object-contain",
                      activeMedia.items.length === 1
                        ? "h-auto max-h-[70vh] w-auto max-w-full"
                        : "h-32 w-48"
                    )}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Chapters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {chapters.length > 0 ? (
          chapters.map((chapter: any) => (
            <div
              key={chapter.id}
              onClick={() => handleChapterClick(chapter.id)}
              className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
            >
              {/* Chapter Content */}
              <div className="p-5">
                {/* Header with Order and Actions */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <ListOrdered className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Order: {chapter.order}
                    </span>
                  </div>
                  
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2">
                  {chapter.title}
                </h3>

                {/* Content Preview */}
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                  {chapter.content?.slice(0, 100)}...
                </p>

                {/* Course Name (if not filtered by course) */}
                {!courseId && chapter.course?.title && (
                  <div className="mb-4">
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      Course: {chapter.course.title}
                    </span>
                  </div>
                )}

                {/* Media Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => {
                      setActiveMedia({ type: "image", items: chapter.images });
                      setShowMediaModal(true);
                    }}
                    disabled={!chapter.images?.length}
                    className="flex items-center text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    <ImageIcon className="h-4 w-4 mr-1" />
                    {chapter.images?.length || 0} Images
                  </button>

                  <button
                    onClick={() => {
                      setActiveMedia({ type: "video", items: chapter.videos });
                      setShowMediaModal(true);
                    }}
                    disabled={!chapter.videos?.length}
                    className="flex items-center text-sm text-green-600 hover:text-green-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    <VideoIcon className="h-4 w-4 mr-1" />
                    {chapter.videos?.length || 0} Videos
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center">
            <div className="mx-auto max-w-md">
              <div className="mb-4 rounded-full bg-gray-100 p-4 dark:bg-gray-800">
                <SearchIcon className="mx-auto h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                No chapters found
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {search ? 'Try adjusting your search terms' : 'No chapters available for this course'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {chapters.length > 0 && (
        <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="text-sm text-gray-600 dark:text-gray-400">
           Total Chapters {chapters.length} 
           {/* of {totalPages * limit} chapters */}
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              className="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
            >
              Previous
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium ${
                      page === pageNum
                        ? 'bg-green-600 text-white'
                        : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              {totalPages > 5 && <span className="px-2 text-gray-500">...</span>}
            </div>
            
            <button
              disabled={page === totalPages}
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              className="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}





