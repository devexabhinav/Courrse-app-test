"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ImageIcon, VideoIcon, Calendar, User, BookOpen, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import { toasterError } from "@/components/core/Toaster";

export default function ChapterDetail() {
  const params = useParams();
  const router = useRouter();
  const chapterId = params.id;

  const [chapter, setChapter] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeMedia, setActiveMedia] = useState<any>({ type: "image", items: [] });
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [chaptersList, setChaptersList] = useState<any[]>([]);
  const [currentChapterIndex, setCurrentChapterIndex] = useState<number>(-1);

  const [viewedImages, setViewedImages] = useState<Set<number>>(new Set()); 
  const [viewedVideos, setViewedVideos] = useState<Set<number>>(new Set());
  const [completedVideos, setCompletedVideos] = useState<Set<number>>(new Set());
  const [chapterCompleted, setChapterCompleted] = useState(false);

  const fetchChapterDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get(`chapter/${chapterId}`);

      if (res.success) {
        // Extract chapter data from the nested structure: res.data.data.chapter
        const chapterData = res.data?.data?.chapter;

        if (chapterData) {
          setChapter(chapterData);

          // If we have a course ID, fetch all chapters for navigation
          if (chapterData.course_id) {
            await fetchChaptersList(chapterData.course_id, chapterData._id);
          }
        } else {
          setError("Chapter data not found in response");
          toasterError("Chapter data format unexpected", 3000);
        }
      } else {
        setError(res.error?.message || "API returned unsuccessful");
        toasterError(res.error?.message || "Failed to load chapter", 3000);
      }
    } catch (err: any) {
      console.error("Failed to fetch chapter:", err);
      const errorMsg = err.response?.data?.error?.message ||
        err.message ||
        "Failed to load chapter";
      setError(errorMsg);
      toasterError(errorMsg, 3000);
    } finally {
      setLoading(false);
    }
  };

  const fetchChaptersList = async (courseId: string, currentChapterId: string) => {
    try {
      // Use your API structure to get all chapters
      const query = new URLSearchParams();
      query.append("page", "1");
      query.append("limit", "100"); // Set a high limit to get all chapters
      query.append("course_id", courseId.toString());

      const res = await api.get(`chapter/get-all-chapters?${query.toString()}`);

      if (res.success) {
        // Filter chapters for the current course
        let filteredChapters = res.data?.data?.data || [];

        if (courseId) {
          filteredChapters = filteredChapters.filter(
            (chapter: any) => chapter.course_id?.toString() === courseId.toString()
          );
        }

        // Sort chapters by order if available
        filteredChapters.sort((a: any, b: any) => {
          if (a.order !== undefined && b.order !== undefined) {
            return a.order - b.order;
          }
          return 0;
        });

        setChaptersList(filteredChapters);

        // Find the current chapter index
        const index = filteredChapters.findIndex((chap: any) => chap._id === currentChapterId);
        setCurrentChapterIndex(index);
      }
    } catch (err) {
      console.error("Failed to fetch chapters list:", err);
      // We can continue even if this fails - the user just won't have navigation
    }
  };

  useEffect(() => {
    if (chapterId) {
      fetchChapterDetail();
    }
  }, [chapterId]);





  const navigateToChapter = (direction: 'prev' | 'next') => {
    if (currentChapterIndex === -1) return;

    let targetIndex = currentChapterIndex;
    console.log('Current index:', currentChapterIndex);
    console.log('Chapters list length:', chaptersList.length);

    if (direction === 'prev' && currentChapterIndex > 0) {
      targetIndex = currentChapterIndex - 1;
      console.log('Going to previous, target index:', targetIndex);
    } else if (direction === 'next' && currentChapterIndex < chaptersList.length - 1) {
      targetIndex = currentChapterIndex + 1;
      console.log('Going to next, target index:', targetIndex);
    } else {
      console.log('No navigation possible in direction:', direction);
      return; // No navigation possible
    }

    console.log('Navigating to index:', targetIndex);

    // Update the current chapter index
    setCurrentChapterIndex(targetIndex);

    // Set the chapter data directly from the chapters list
    const targetChapter = chaptersList[targetIndex];
    setChapter(targetChapter);

    // Optionally update the URL without triggering a page reload
    const chapterId = targetChapter._id || targetChapter.id;
    if (chapterId) {
      window.history.pushState(null, '', `${chapterId}`);
    }
  };





  const formatDate = (dateString: string) => {
    if (!dateString) return "Unknown date";
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mr-3" />
        <div className="text-lg">Loading chapter details...</div>
      </div>
    );
  }

  // Render error state
  if (error || !chapter) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <button
            onClick={(courseId: number) => 
              router.back()
            //  router.push(`/user-panel/courses/${courseId}/chapter`)
            }
            className="flex items-center text-blue-600 hover:text-blue-800 mb-8"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Chapters
          </button>  


          





        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Unable to load chapter
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error || "Chapter not found or inaccessible"}
          </p>
          <button
            onClick={fetchChapterDetail}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
      </div >
    );
  }

  // Determine if we can navigate to previous or next chapter
  const hasPrevious = currentChapterIndex > 0;
  const hasNext = currentChapterIndex < chaptersList.length - 1;

  // Get the previous and next chapter info for display
  const previousChapter = hasPrevious ? chaptersList[currentChapterIndex - 1] : null;
  const nextChapter = hasNext ? chaptersList[currentChapterIndex + 1] : null;

  // Render chapter content
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          {/* <button
            onClick={() => router.back()}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Chapters
          </button> */}

          <button 
  onClick={() => router.push(`/user-panel/courses/${chapter.course_id}/chapter`)}
  className="flex items-center text-blue-600 hover:text-blue-800 mb-8"
>
  <ArrowLeft className="h-5 w-5 mr-2" />
  Back to Chapters
</button>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {chapter.title || "Untitled Chapter"}
              </h1>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Order: {chapter.order || "N/A"}
              </span>
            </div>

            {/* Course Info */}
            {chapter.course_id && (
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Course Information
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  <BookOpen className="inline h-4 w-4 mr-2" />
                  Course ID: {chapter.course_id}
                </p>
              </div>
            )}

            {/* Meta Information */}
            <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-600 dark:text-gray-400">
              {chapter.createdAt && (
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Created: {formatDate(chapter.createdAt)}
                </div>
              )}
              {chapter.updatedAt && (
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Updated: {formatDate(chapter.updatedAt)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mb-8">
          <button
            onClick={() => navigateToChapter('prev')}
            disabled={!hasPrevious}
            className={cn(
              "flex flex-col items-start px-4 py-3 rounded-lg transition-colors w-48 text-left",
              hasPrevious
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed"
            )}
          >
            <div className="flex items-center mb-1">
              <ChevronLeft className="h-4 w-4 mr-2" />
              <span className="text-sm">Previous Chapter</span>
            </div>
            {hasPrevious && (
              <span className="text-xs font-light truncate w-full">
                {previousChapter?.title || `Chapter ${previousChapter?.order}`}
              </span>
            )}
          </button>

          <button
            onClick={() => navigateToChapter('next')}
            disabled={!hasNext}
            className={cn(
              "flex flex-col items-end px-4 py-3 rounded-lg transition-colors w-48 text-right",
              hasNext
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed"
            )}
          >
            <div className="flex items-center mb-1">
              <span className="text-sm">Next Chapter</span>
              <ChevronRight className="h-4 w-4 ml-2" />
            </div>
            {hasNext && (
              <span className="text-xs font-light truncate w-full">
                {nextChapter?.title || `Chapter ${nextChapter?.order}`}
              </span>
            )}
          </button>
        </div>

        {/* Content Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Chapter Content
          </h2>
          <div className="prose prose-lg max-w-none dark:prose-invert">
            {chapter.content ? (
              <div
                className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line"
              >
                {chapter.content}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 italic">
                No content available for this chapter.
              </p>
            )}
          </div>
        </div>

        {/* Media Section */}
        {(chapter.images?.length > 0 || chapter.videos?.length > 0) ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Media Files
            </h2>

            {/* Images */}
            {chapter.images?.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <ImageIcon className="h-5 w-5 mr-2" />
                  Images ({chapter.images.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {chapter.images.map((url: string, index: number) => (
                    <div
                      key={index}
                      className="cursor-pointer transform transition-transform hover:scale-105"
                      onClick={() => {
                        setActiveMedia({ type: "image", items: [url] });
                        setShowMediaModal(true);
                      }}
                    >
                      <img
                        src={url}
                        alt={`Chapter image ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Videos */}
            {chapter.videos?.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <VideoIcon className="h-5 w-5 mr-2" />
                  Videos ({chapter.videos.length})
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {chapter.videos.map((url: string, index: number) => (
                    <div key={index} className="bg-black rounded-lg overflow-hidden">
                      <video
                        controls
                        className="w-full h-auto max-h-96"
                        poster={chapter.images?.[0] || undefined}
                      >
                        <source src={url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No media files available for this chapter
            </p>
          </div>
        )}

        {/* Media Modal */}
        {showMediaModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 px-4">
            <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <button
                onClick={() => setShowMediaModal(false)}
                className="absolute top-4 right-4 z-10 text-white bg-red-600 rounded-full p-2 hover:bg-red-700"
              >
                ✕
              </button>

              {activeMedia.type === "image" ? (
                <img
                  src={activeMedia.items[0]}
                  alt="Chapter media"
                  className="w-full h-auto max-h-[85vh] object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                  }}
                />
              ) : (
                <video
                  controls
                  autoPlay
                  className="w-full h-auto max-h-[85vh]"
                >
                  <source src={activeMedia.items[0]} type="video/mp4" />
                </video>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}