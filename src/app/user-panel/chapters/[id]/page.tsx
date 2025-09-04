"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ImageIcon, VideoIcon, Calendar, User, BookOpen, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import { toasterError, toasterSuccess } from "@/components/core/Toaster";

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

  // Media completion tracking
  const [viewedImages, setViewedImages] = useState<Set<number>>(new Set());
  const [viewedVideos, setViewedVideos] = useState<Set<number>>(new Set());
  const [completedVideos, setCompletedVideos] = useState<Set<number>>(new Set());
  const [videoProgress, setVideoProgress] = useState<{[key: number]: {watchTime: number, canComplete: boolean}}>({}); 
  const [chapterCompleted, setChapterCompleted] = useState(false);

  // MCQ state
  const [mcqs, setMcqs] = useState<any[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: string]: string}>({});
  const [submittedMcqs, setSubmittedMcqs] = useState<Set<string>>(new Set());
  const [mcqResults, setMcqResults] = useState<{[key: string]: boolean}>({});

  const fetchChapterDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get(`chapter/${chapterId}`);

      if (res.success) {
        const chapterData = res.data?.data?.chapter;

        if (chapterData) {
          setChapter(chapterData);

          if (chapterData.course_id) {
            await fetchChaptersList(chapterData.course_id, chapterData._id);
            await fetchChapterMcqs(chapterData._id); // Fetch MCQs for this chapter
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
      const query = new URLSearchParams();
      query.append("page", "1");
      query.append("limit", "100");
      query.append("course_id", courseId.toString());

      const res = await api.get(`chapter/get-all-chapters?${query.toString()}`);

      if (res.success) {
        let filteredChapters = res.data?.data?.data || [];

        if (courseId) {
          filteredChapters = filteredChapters.filter(
            (chapter: any) => chapter.course_id?.toString() === courseId.toString()
          );
        }

        filteredChapters.sort((a: any, b: any) => {
          if (a.order !== undefined && b.order !== undefined) {
            return a.order - b.order;
          }
          return 0;
        });

        setChaptersList(filteredChapters);

        const index = filteredChapters.findIndex((chap: any) => chap._id === currentChapterId);
        setCurrentChapterIndex(index);
      }
    } catch (err) {
      console.error("Failed to fetch chapters list:", err);
    }
  };

  // Fetch MCQs for this chapter
  const fetchChapterMcqs = async (chapterId: string) => {
    try {
      const res = await api.get(`mcq?chapter_id=${chapterId}&limit=100`);
      
      if (res.success) {
        const mcqData = res.data?.data?.data || [];
        setMcqs(mcqData);
        
      }
    } catch (err) {
      console.error("Failed to fetch chapter MCQs:", err);
    }
  };

  

  // Function to check if chapter is completed
  const checkChapterCompletion = () => {
    const totalImages = chapter?.images?.length || 0;
    const totalVideos = chapter?.videos?.length || 0;
    // const totalMcqs = mcqs.length || 0;
    
    const allImagesViewed = totalImages === 0 || viewedImages.size === totalImages;
    const allVideosCompleted = totalVideos === 0 || completedVideos.size === totalVideos;
    // const allMcqsCompleted = totalMcqs === 0 || submittedMcqs.size === totalMcqs
    
    const isCompleted = allImagesViewed && allVideosCompleted ;
    setChapterCompleted(isCompleted);
    
    return isCompleted;
  };

  // Handle MCQ answer selection
  const handleAnswerSelect = (mcqId: string, answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [mcqId]: answer
    }));
  };

  // Submit MCQ answer
  const submitMcqAnswer = async (mcqId: string) => {
    const selectedAnswer = selectedAnswers[mcqId];
    
    if (!selectedAnswer) {
      toasterError("Please select an answer", 2000);
      return;
    }

    try {
      // In a real implementation, you would send this to your API
      // For now, we'll just check against the correct answer locally
      const mcq = mcqs.find(m => m._id === mcqId || m.id === mcqId);
      const isCorrect = mcq && mcq.answer === selectedAnswer;
      
      setMcqResults(prev => ({
        ...prev,
        [mcqId]: isCorrect
      }));
      
      const newSubmittedMcqs = new Set(submittedMcqs);
      newSubmittedMcqs.add(mcqId);
      setSubmittedMcqs(newSubmittedMcqs);
      
      if (isCorrect) {
        toasterSuccess("Correct answer!", 2000);
      } else {
        toasterError("Incorrect answer. Please try again.", 2000);
      }
      
      setTimeout(checkChapterCompletion, 100);
    } catch (err) {
      console.error("Failed to submit MCQ answer:", err);
      toasterError("Failed to submit answer", 2000);
    }
  };

  // Reset MCQ for retry
  const resetMcq = (mcqId: string) => {
    const newSubmittedMcqs = new Set(submittedMcqs);
    newSubmittedMcqs.delete(mcqId);
    setSubmittedMcqs(newSubmittedMcqs);
    
    setSelectedAnswers(prev => {
      const newAnswers = {...prev};
      delete newAnswers[mcqId];
      return newAnswers;
    });
    
    setMcqResults(prev => {
      const newResults = {...prev};
      delete newResults[mcqId];
      return newResults;
    });
  };

  // Updated navigateToChapter function with completion check
  const navigateToChapter = (direction: 'prev' | 'next') => {
    if (currentChapterIndex === -1) return;

    // For next navigation, check if current chapter is completed
    if (direction === 'next' && !chapterCompleted) {
      toasterError("Please complete all media and MCQs in this chapter before proceeding to the next one.", 4000);
      return;
    }

    let targetIndex = currentChapterIndex;

    if (direction === 'prev' && currentChapterIndex > 0) {
      targetIndex = currentChapterIndex - 1;
    } else if (direction === 'next' && currentChapterIndex < chaptersList.length - 1) {
      targetIndex = currentChapterIndex + 1;
      console.log('Going to next, target index:', targetIndex);
    } else {
      console.log('No navigation possible in direction:', direction);
      return;
    }

    console.log('Navigating to index:', targetIndex);

    // Reset completion tracking for new chapter
    setViewedImages(new Set());
    setViewedVideos(new Set());
    setCompletedVideos(new Set());
    setVideoProgress({});
    setChapterCompleted(false);
    setSelectedAnswers({});
    setSubmittedMcqs(new Set());
    setMcqResults({});

    setCurrentChapterIndex(targetIndex);
    const targetChapter = chaptersList[targetIndex];
    setChapter(targetChapter);

    const chapterId = targetChapter._id || targetChapter.id;
    if (chapterId) {
      window.history.pushState(null, '', `${chapterId}`);
    }
  };

  // Function to handle image viewing
  const handleImageView = (index: number) => {
    const newViewedImages = new Set(viewedImages);
    newViewedImages.add(index);
    setViewedImages(newViewedImages);
    
    setTimeout(checkChapterCompletion, 100);
  };

  // Function to handle video play
  const handleVideoPlay = (index: number) => {
    const newViewedVideos = new Set(viewedVideos);
    newViewedVideos.add(index);
    setViewedVideos(newViewedVideos);
  };

  // Smart video completion logic
  const handleVideoTimeUpdate = (index: number, currentTime: number, duration: number) => {
    if (!duration || duration === 0) return;
    
    const watchPercentage = (currentTime / duration) * 100;
    const watchTimeSeconds = currentTime;
    
    // Allow completion if ANY of these conditions are met:
    const conditions = {
      watchedMost: watchPercentage >= 60,        // Watched 60% of video
      watchedLongEnough: watchTimeSeconds >= 90, // Watched for 90+ seconds  
      nearEnd: watchPercentage >= 80,           // Close to end
      fullCompletion: watchPercentage >= 95     // Nearly finished
    };
    
    const canComplete = Object.values(conditions).some(condition => condition);
    
    setVideoProgress(prev => ({
      ...prev,
      [index]: {
        watchTime: currentTime,
        canComplete
      }
    }));
    
    // Auto-complete if conditions are met and not already completed
    if (canComplete && !completedVideos.has(index)) {
      const newCompletedVideos = new Set(completedVideos);
      newCompletedVideos.add(index);
      setCompletedVideos(newCompletedVideos);
      setTimeout(checkChapterCompletion, 100);
    }
  };

  // Manual video completion
  const handleManualVideoComplete = (index: number) => {
    const newCompletedVideos = new Set(completedVideos);
    newCompletedVideos.add(index);
    setCompletedVideos(newCompletedVideos);
    setTimeout(checkChapterCompletion, 100);
  };

  useEffect(() => {
    if (chapterId) {
      fetchChapterDetail();
    }
  }, [chapterId]);

  // Reset completion tracking when chapter changes
  useEffect(() => {
    if (chapter) {
      setViewedImages(new Set());
      setViewedVideos(new Set());
      setCompletedVideos(new Set());
      setVideoProgress({});
      setChapterCompleted(false);
      setSelectedAnswers({});
      setSubmittedMcqs(new Set());
      setMcqResults({});
      
      setTimeout(checkChapterCompletion, 100);
    }
  }, [chapter]);
  

  // Progress indicator component
  const ProgressIndicator = () => {
    const totalImages = chapter?.images?.length || 0;
    const totalVideos = chapter?.videos?.length || 0;
    const totalMedia = totalImages + totalVideos;
    
    if (totalMedia === 0) {
      return (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center text-green-800 dark:text-green-200">
            <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm font-medium">Chapter completed - No media or MCQs to complete</span>
          </div>
        </div>
      );
    }
    
    const completedCount = viewedImages.size + completedVideos.size ;
    const progressPercentage = (completedCount / totalMedia) * 100;
    
    return (
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
            Chapter Progress
          </span>
          <span className="text-sm text-blue-600 dark:text-blue-300">
            {completedCount}/{totalMedia} completed
          </span>
        </div>
        <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
          <div 
            className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className="mt-2 text-xs text-blue-600 dark:text-blue-300">
          Images: {viewedImages.size}/{totalImages} • Videos: {completedVideos.size}/{totalVideos} 
        </div>
        {chapterCompleted && (
          <div className="flex items-center mt-2 text-green-800 dark:text-green-200">
            <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm font-medium">Ready to proceed to next chapter!</span>
          </div>
        )}
      </div>
    );
  };

  // Render MCQs component
  const renderMcqs = () => {



   const filteredMcqs = mcqs.filter(mcq => {
        // Log each MCQ's chapter_id for debugging
        console.log("MCQ chapter_id:", mcq.chapter_id, "Route ID:", chapterId);
        
        // Handle both string and number comparisons
        const mcqChapterId = mcq.chapter_id;
        
        // Compare as strings to avoid type issues
        return mcqChapterId.toString() === chapterId.toString();
    });
    console.log("filtered mcq", filteredMcqs)
    

    if (!mcqs.length) return null;
    
    return (
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quiz Questions ({filteredMcqs.length}) - {submittedMcqs.size} completed
        </h3>
        
        <div className="space-y-6">
          {filteredMcqs.map((mcq, index) => {
            const isSubmitted = submittedMcqs.has(mcq._id || mcq.id);
            const isCorrect = mcqResults[mcq._id || mcq.id];
            
            return (
              <div 
                key={mcq._id || mcq.id} 
                className={`p-4 rounded-lg border ${
                  isSubmitted 
                    ? isCorrect 
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                      : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                    : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                }`}
              >
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                  {index + 1}. {mcq.question}
                </h4>
                
                <div className="space-y-2">
                  {mcq.options && mcq.options.map((option: string, optIndex: number) => {
                    const optionLetter = String.fromCharCode(65 + optIndex); // A, B, C, D
                    const isSelected = selectedAnswers[mcq._id || mcq.id] === option;
                    const isCorrectAnswer = option === mcq.answer;
                    
                    return (
                      <label 
                        key={optIndex}
                        className={`flex items-center p-3 rounded-md cursor-pointer transition-colors ${
                          !isSubmitted
                            ? isSelected
                              ? 'bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700'
                              : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                            : isCorrectAnswer
                              ? 'bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700'
                              : isSelected && !isCorrectAnswer
                                ? 'bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700'
                                : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`mcq-${mcq._id || mcq.id}`}
                          value={option}
                          checked={isSelected}
                          onChange={() => handleAnswerSelect(mcq._id || mcq.id, option)}
                          disabled={isSubmitted}
                          className="mr-3"
                        />
                        <span className="font-medium mr-2">{optionLetter}.</span>
                        <span>{option}</span>
                        
                        {isSubmitted && isCorrectAnswer && (
                          <span className="ml-auto text-green-600 dark:text-green-400">
                            ✓ Correct
                          </span>
                        )}
                        
                        {isSubmitted && isSelected && !isCorrectAnswer && (
                          <span className="ml-auto text-red-600 dark:text-red-400">
                            ✗ Incorrect
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
                
                <div className="mt-4 flex justify-end">
                  {!isSubmitted ? (
                    <button
                      onClick={() => submitMcqAnswer(mcq._id || mcq.id)}
                      disabled={!selectedAnswers[mcq._id || mcq.id]}
                      className={`px-4 py-2 rounded-lg ${
                        selectedAnswers[mcq._id || mcq.id]
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-300 text-gray-500 dark:bg-gray-600 dark:text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Submit Answer
                    </button>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span className={`font-medium ${
                        isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {isCorrect ? 'Correct!' : 'Incorrect!'}
                      </span>
                      <button
                        onClick={() => resetMcq(mcq._id || mcq.id)}
                        className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500"
                      >
                        Try Again
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };


  // Updated image rendering with tracking
  const renderImages = () => {
    if (!chapter.images?.length) return null;
    
    return (
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <ImageIcon className="h-5 w-5 mr-2" />
          Images ({chapter.images.length}) - {viewedImages.size} viewed
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {chapter.images.map((url: string, index: number) => (
            <div key={index} className="relative">
              <div
                className={`cursor-pointer transform transition-transform hover:scale-105 relative ${
                  viewedImages.has(index) ? 'ring-2 ring-green-500' : ''
                }`}
                onClick={() => {
                  handleImageView(index);
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
                {viewedImages.has(index) && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Updated video rendering with smart completion
  const renderVideos = () => {
    if (!chapter.videos?.length) return null;
    
    return (
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <VideoIcon className="h-5 w-5 mr-2" />
          Videos ({chapter.videos.length}) - {completedVideos.size} completed
        </h3>
        <div className="grid grid-cols-1 gap-6">
          {chapter.videos.map((url: string, index: number) => {
            const progress = videoProgress[index];
            const isCompleted = completedVideos.has(index);
            const canComplete = progress?.canComplete || false;
            
            return (
              <div key={index} className={`relative bg-black rounded-lg overflow-hidden ${
                isCompleted ? 'ring-2 ring-green-500' : ''
              }`}>
                <video
                  controls
                  className="w-full h-auto max-h-96"
                  poster={chapter.images?.[0] || undefined}
                  onPlay={() => handleVideoPlay(index)}
                  onTimeUpdate={(e) => handleVideoTimeUpdate(
                    index, 
                    e.target.currentTime, 
                    e.target.duration
                  )}
                  onEnded={() => {
                    // Auto-complete on natural end
                    handleManualVideoComplete(index);
                  }}
                >
                  <source src={url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                
                {/* Completion indicator */}
                {isCompleted && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1 z-10">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                
                {/* Smart completion button */}
                {canComplete && !isCompleted && (
                  <div className="absolute bottom-4 right-4 z-10">
                    <button
                      onClick={() => handleManualVideoComplete(index)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm shadow-lg transition-colors"
                    >
                      ✓ Mark Complete
                    </button>
                  </div>
                )}
                
                {/* Status indicator */}
                <div className="absolute bottom-2 left-2 text-white text-xs bg-black bg-opacity-60 px-2 py-1 rounded z-10">
                  {isCompleted ? 'Completed' : 
                   canComplete ? 'Ready to Complete' :
                   viewedVideos.has(index) ? 'In Progress' : 
                   'Not Started'
                  }
                </div>
                
                {/* Progress bar for incomplete videos */}
                {!isCompleted && progress && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gray-200 h-1 z-10">
                    <div 
                      className="bg-blue-500 h-1 transition-all duration-300"
                      style={{ width: `${Math.min(100, (progress.watchTime / (progress.watchTime > 0 ? Math.max(progress.watchTime * 2, 300) : 300)) * 100)}%` }}
                    ></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Helpful message */}
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-800 dark:text-blue-200">
          <p>💡 <strong>Tip:</strong> Videos are automatically marked complete when you watch 60% of the content, watch for 90+ seconds, or reach near the end. You can also use the "Mark Complete" button when it appears.</p>
        </div>
      </div>
    );
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
            onClick={() => router.back()}
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
      </div>
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

        {/* Progress Indicator */}
        <ProgressIndicator />

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
            disabled={!hasNext || !chapterCompleted}
            className={cn(
              "flex flex-col items-end px-4 py-3 rounded-lg transition-colors w-48 text-right relative",
              hasNext
                ? chapterCompleted 
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-400 text-gray-600 dark:bg-gray-600 dark:text-gray-300 cursor-not-allowed"
                : "bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed"
            )}
            title={!chapterCompleted && hasNext ? "Complete all media and MCQs in this chapter first" : ""}
          >
            <div className="flex items-center mb-1">
              <span className="text-sm">Next Chapter</span>
              <ChevronRight className="h-4 w-4 ml-2" />
              {!chapterCompleted && hasNext && (
                <div className="ml-1">🔒</div>
              )}
            </div>
            {hasNext && (
              <span className="text-xs font-light truncate w-full">
                {nextChapter?.title || `Chapter ${nextChapter?.order}`}
              </span>
            )}
            {!chapterCompleted && hasNext && (
              <span className="text-xs text-red-300 mt-1">
                Complete all content first
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

            {/* Images with tracking */}
            {renderImages()}

            {/* Videos with smart completion */}
            {renderVideos()}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No media files available for this chapter
            </p>
          </div>
        )}

        {/* MCQs Section */}
        {renderMcqs()}

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