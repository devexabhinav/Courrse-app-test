"use client";

import { cn } from "@/lib/utils";
import api from "@/lib/api";
import { useEffect, useState } from "react";
import { Pencil, SearchIcon, Trash2, ImageIcon, VideoIcon, ListOrdered, ChevronRight, FileText, Clock, CheckCircle, ArrowLeft } from "lucide-react";
import { toasterError, toasterSuccess } from "@/components/core/Toaster";
import { useRouter, useParams } from "next/navigation";
import Cookies from 'js-cookie';
export default function Chapters({ className }: any) {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id; 
  const userId = Cookies.get("userId")


  const [search, setSearch] = useState("");
  const [chapters, setChaptersByid] = useState<any[]>([]);
  const [showMediaModal, setShowMediaModal] = useState<any>(false);
  const [activeMedia, setActiveMedia] = useState<any>({ type: "image", items: [] });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [courseName, setCourseName] = useState("");
  const [loading, setLoadingById] = useState(true);
  const [passedchapter, setpassedchapter] = useState<any>(null);




  const fetchChaptersWithStatus = async () => {
  if (!courseId || !userId) return;
  
  try {

    
    // Fetch both basic chapters and MCQ status in parallel
    const [chaptersRes, statusRes] = await Promise.all([
      api.get(`chapter?course_id=${courseId}`),
      api.get(`mcq/course-chapters-status?user_id=${userId}&course_id=${courseId}`)
    ]);

    // Store the complete responses
    const chaptersResponse = chaptersRes;
    const statusResponse = statusRes;


    setChaptersByid( chaptersResponse?.data?.data)
    setpassedchapter(statusResponse?.data?.data)

  } catch (err) {
    console.error("Error fetching chapters:", err)

  } finally {

  }
};

useEffect(() => {
  fetchChaptersWithStatus();
}, [courseId, userId]);

const fetchChaptersByCourseId = async () => {
    if (!courseId) return;
    
    try {
      setLoadingById(true);
      const res = await api.get(`chapter?course_id=${courseId}`);
      
      if (res.success) {
      
         const chaptersWithLockStatus = res?.data?.data;
        
        // setChaptersByid(chaptersWithLockStatus);
        
        // setChaptersByid(chaptersWithLockStatus);
      } else {
        console.error("Failed to fetch chapters by course ID:", res.message);
        toasterError("Failed to load chapters");
      }
    } catch (err) {
      console.error("Error fetching chapters by course ID:", err);
      toasterError("Error loading chapters");
    } finally {
   
       setLoadingById(false);
     

    }
  };


  const handleChapterClick = async (chapterId: number) => {
    try {
      const res = await api.get(`chapter/${chapterId}`);
      if (res.success) {
        router.push(`/user-panel/chapters/${chapterId}`);
      } else {
        console.error("Failed to fetch chapter:", res.message);
      }
    } catch (error) {
      console.error("Error fetching chapter:", error);
    }
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
    fetchChaptersByCourseId();
    fetchCourseName();
  }, []);

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

       <button
            onClick={() => router.back()}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-8"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Chapters
          </button>
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

      {/* Chapters List */}
      <div className="space-y-4">
        {
          chapters.map((chapter: any , index) =>{ 
            console.log(passedchapter)
             const chapterProgress = passedchapter.find(
            (progress: any) => progress.chapter_id === chapter.id
          );





           let isLocked = false;
          if (chapter.order > 1) {
            const prevChapter = chapters.find(c => c.order === chapter.order - 1);
            if (prevChapter) {
              const prevChapterProgress = passedchapter.find(
                (progress: any) => progress.chapter_id === prevChapter.id
              );
              isLocked = !prevChapterProgress?.passed;
            }
          }
          
          // Determine status text and icon
          let statusText = "Not started";
          let StatusIcon = Clock;
          let statusColor = "text-gray-500";
          
          if (chapterProgress) {
            if (chapterProgress.passed) {
              statusText = "Completed";
              StatusIcon = CheckCircle;
              statusColor = "text-green-600";
            } else if (chapterProgress.attempted) {
              statusText = "In progress";
              statusColor = "text-yellow-600";
            }
          }




           return <div
              key={index}
              className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="p-5">
                <div className="flex items-start justify-between">
                  {/* Left side - Chapter info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center mb-2">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-medium mr-3">
                        {index + 1}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                        {chapter.title}
                      </h3>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                      {chapter.content?.slice(0, 120)}...
                    </p>

                    {/* Media stats */}
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <ImageIcon className="h-3 w-3 mr-1" />
                        <span>{chapter.images?.length || 0} Images</span>
                      </div>
                      <div className="flex items-center">
                        <VideoIcon className="h-3 w-3 mr-1" />
                        <span>{chapter.videos?.length || 0} Videos</span>
                      </div>
                      <div className="flex items-center">
                        <FileText className="h-3 w-3 mr-1" />
                        <span>{Math.ceil((chapter.content?.length || 0) / 1000)}k words</span>
                      </div>
                    </div>
                  </div>

                  {/* Right side - Actions and status */}
                  <div className="flex flex-col items-end gap-2 ml-4">
                     <button
                      onClick={() => handleChapterClick(chapter.id, isLocked)}
                      disabled={isLocked}
                      className={`px-4 py-2 rounded-lg flex items-center ${
                        isLocked
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      {isLocked ? "Locked" : "Start Chapter"}
                      {!isLocked && <ChevronRight className="h-4 w-4 ml-1" />}
                    </button>
                    
                    {/* Status indicator */}
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>Not started</span>
                    </div>
                  </div>
                </div>

                {/* Progress bar (optional) */}
                {/* <div className="mt-3 w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                  <div className="bg-green-600 h-1.5 rounded-full" style={{ width: '0%' }}></div>
                </div> */}
              </div>
            </div>}
          )
        }
      </div>

      {/* Pagination */}
      
        <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {chapters.length} chapters
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
     
    </div>
  );
}