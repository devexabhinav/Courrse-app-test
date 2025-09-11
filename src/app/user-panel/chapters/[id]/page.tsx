"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ImageIcon, VideoIcon, Calendar, User, BookOpen, Loader2, ChevronLeft, ChevronRight, Lock, Divide } from "lucide-react";
import api from "@/lib/api";

import { toasterError, toasterSuccess } from "@/components/core/Toaster";
import Cookies from 'js-cookie';


export default function ChapterDetail() {
  const params = useParams();
  const router = useRouter();
  const chapterId = params.id;

  const [chapter, setChapter] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeMedia, setActiveMedia] = useState<any>({ type: "image", items: [] });
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [currentChapterIndex, setCurrentChapterIndex] = useState<number>(-1);

  // Media completion tracking
  const [viewedImages, setViewedImages] = useState<Set<number>>(new Set());
  const [viewedVideos, setViewedVideos] = useState<Set<number>>(new Set());
  const [completedVideos, setCompletedVideos] = useState<Set<number>>(new Set());
  const [videoProgress, setVideoProgress] = useState<{ [key: number]: { watchTime: number, canComplete: boolean } }>({});
  const [chapterCompleted, setChapterCompleted] = useState(false);

  // MCQ state
  const [mcqs, setMcqs] = useState<any[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({});
  const [submittedMcqs, setSubmittedMcqs] = useState<Set<string>>(new Set());
  const [mcqResults, setMcqResults] = useState({});

  // Check if media is completed to unlock MCQs
  const [mediaCompleted, setMediaCompleted] = useState(false);
  const [submissionData, setSubmissionData] = useState<any>(null);

  const [previousSubmission, setPreviousSubmission] = useState<any>(null);
  const [showPreviousAttempts, setShowPreviousAttempts] = useState(false);
  const [hasPreviousAttempts, setHasPreviousAttempts] = useState(false);
  const [hisviousSubmission, sethisviousSubmission] = useState<any>(null);

  const [scorePercentage, setScorePercentage] = useState<number>(0);


  useEffect(() => {
  if (hisviousSubmission && hisviousSubmission.length > 0) {
    const totalQuestions = mcqs.length;
    const correctAnswers = hisviousSubmission.filter(answer => answer.is_correct).length;
    const scorePercentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    setScorePercentage(scorePercentage);
     console.log("1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111scorePercentage",scorePercentage)
    }
}, [hisviousSubmission]);


  console.log("hisviousSubmission", hisviousSubmission)
  const fetchChapterMcqsWithPrevious = async (chapterId: string) => {
    try {
      const userId = Cookies.get('userId');
      if (!userId) {
        console.error("User not authenticated");
        return;
      }

      const res = await api.get(`mcq/getStudentMcqsWithPrevious?user_id=${userId}&chapter_id=${chapterId}`);

      if (res.success) {
        console.log("--res-----12-23--3-1234-134-4-23-4-2", res)
        const { mcqs: mcqData, previousAnswers } = res.data?.data;
        setMcqs(mcqData);
        const privdata = res.data?.data?.previousAnswers;
        console.log("99999", privdata)

        sethisviousSubmission(res?.data?.data?.previousAnswers)

        // const previousAnswers = res.data.data.previousAnswers
        if (previousAnswers && previousAnswers.length > 0) {
          setHasPreviousAttempts(true);

          // Convert previous answers to the format expected by the component
          const previousSelectedAnswers = {};
          const previousResults = {};
          const previousSubmittedSet = new Set();

          previousAnswers.forEach(answer => {
            previousSelectedAnswers[answer.mcq_id] = answer.selected_option;
            previousResults[answer.mcq_id] = answer.is_correct;
            previousSubmittedSet.add(answer.mcq_id.toString());
          });

          // Store previous submission data
          setPreviousSubmission({
            selectedAnswers: previousSelectedAnswers,
            results: previousResults,
            submittedMcqs: previousSubmittedSet
          });

        } else {
          setHasPreviousAttempts(false);
          setPreviousSubmission(null);
        }
      } else {
        console.error("Failed to fetch MCQs with previous attempts:", res.error?.message);
        setMcqs([]);
      }
    } catch (err) {
      console.error("Failed to fetch chapter MCQs with previous attempts:", err);
      setMcqs([]);
    }
  };

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
            await fetchChapterMcqsWithPrevious(chapterId)
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

  const fetchChapterMcqs = async (chapterId: string) => {
    try {
      const res = await api.get(`mcq/student/chapter/${chapterId}`);

      if (res.success) {
        const mcqData = res.data?.data?.mcqs;
        setMcqs(mcqData);
        fetchChapterMcqsWithPrevious(chapterId);
      } else {
        console.error("Failed to fetch MCQs:", res.error?.message);
        setMcqs([]);
      }
    } catch (err) {
      console.error("Failed to fetch chapter MCQs:", err);
      setMcqs([]);
    }
  };
  const loadPreviousAttempts = () => {
    if (previousSubmission) {
      setSelectedAnswers(previousSubmission.selectedAnswers);
      setMcqResults(previousSubmission.results);
      setSubmittedMcqs(previousSubmission.submittedMcqs);
      setShowPreviousAttempts(true);
      toasterSuccess("Previous attempt loaded", 2000);
    }
  };

  useEffect(() => {
    if (previousSubmission) {
      setSelectedAnswers(previousSubmission.selectedAnswers);
      setMcqResults(previousSubmission.results);
      setSubmittedMcqs(previousSubmission.submittedMcqs);
      setShowPreviousAttempts(true);
      setHasPreviousAttempts(true);
      console.log("Previous attempt loaded automatically");
    }
  }, [previousSubmission]);

  // Add a function to start fresh attempt
  const startFreshAttempt = () => {
    setSelectedAnswers({});
    setMcqResults({});
    setSubmittedMcqs(new Set());
    setShowPreviousAttempts(false);
    setSubmissionData(null);
    toasterSuccess("Ready for fresh attempt", 2000);
  };

  // Function to check if media is completed
  const checkMediaCompletion = () => {
    const totalImages = chapter?.images?.length || 0;
    const totalVideos = chapter?.videos?.length || 0;
    

    const allImagesViewed = totalImages === 0 || viewedImages.size === totalImages || scorePercentage <= 75;
    const allVideosCompleted = totalVideos === 0 || completedVideos.size === totalVideos || scorePercentage <= 75;
 console.log("222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222scorePercentage",scorePercentage)
 
    const isMediaCompleted = allImagesViewed && allVideosCompleted;
    setMediaCompleted(isMediaCompleted);

    return isMediaCompleted;
  };

  // Function to check if chapter is completed
  const checkChapterCompletion = () => {
    const isMediaCompleted = checkMediaCompletion();
    const totalMcqs = mcqs.length || 0;
    const allMcqsCompleted = totalMcqs === 0 || submittedMcqs.size === totalMcqs;

    const isCompleted = isMediaCompleted && allMcqsCompleted;
    setChapterCompleted(isCompleted);

    return isCompleted;
  };

  // Handle MCQ answer selection
  const handleAnswerSelect = (mcqId: string, answer: string) => {
    // Only allow selection if not submitted yet
    if (!submittedMcqs.has(mcqId)) {
      setSelectedAnswers(prev => ({
        ...prev,
        [mcqId]: answer
      }));
    }
  };

  // Submit MCQ answer
  const submitMcqAnswer = async (mcqId: string) => {
    const selectedAnswer = selectedAnswers[mcqId];

    if (!selectedAnswer) {
      toasterError("Please select an answer", 2000);
      return;
    }

    try {
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
      const newAnswers = { ...prev };
      delete newAnswers[mcqId];
      return newAnswers;
    });

    setMcqResults(prev => {
      const newResults = { ...prev };
      delete newResults[mcqId];
      return newResults;
    });
  };

  // Function to handle image viewing
  const handleImageView = (index: number) => {
    const newViewedImages = new Set(viewedImages);
    newViewedImages.add(index);
    setViewedImages(newViewedImages);

    setTimeout(() => {
      checkMediaCompletion();
      checkChapterCompletion();
    }, 100);
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

    const conditions = {
      watchedMost: watchPercentage >= 60,
      watchedLongEnough: watchTimeSeconds >= 90,
      nearEnd: watchPercentage >= 80,
      fullCompletion: watchPercentage >= 95
    };

    const canComplete = Object.values(conditions).some(condition => condition);

    setVideoProgress(prev => ({
      ...prev,
      [index]: {
        watchTime: currentTime,
        canComplete
      }
    }));

    if (canComplete && !completedVideos.has(index)) {
      const newCompletedVideos = new Set(completedVideos);
      newCompletedVideos.add(index);
      setCompletedVideos(newCompletedVideos);
      setTimeout(() => {
        checkMediaCompletion();
        checkChapterCompletion();
      }, 100);
    }
  };

  // Manual video completion
  const handleManualVideoComplete = (index: number) => {
    const newCompletedVideos = new Set(completedVideos);
    newCompletedVideos.add(index);
    setCompletedVideos(newCompletedVideos);
    setTimeout(() => {
      checkMediaCompletion();
      checkChapterCompletion();
    }, 100);
  };

  useEffect(() => {
    if (chapterId) {
      fetchChapterDetail();
    }
    checkMediaCompletion()
    // loadPreviousAttempts()

  }, [chapterId]);



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
            <span className="text-sm font-medium">Media completed - Proceed to quiz</span>
          </div>
        </div>
      );
    }

    const completedCount = viewedImages.size + completedVideos.size;
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
        {mediaCompleted && !chapterCompleted && (
          <div className="flex items-center mt-2 text-green-800 dark:text-green-200">
            <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm font-medium">Media completed! Proceed to quiz section.</span>
          </div>
        )}
        {chapterCompleted && (
          <div className="flex items-center mt-2 text-green-800 dark:text-green-200">
            <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm font-medium">Chapter completed! Ready to proceed.</span>
          </div>
        )}
      </div>
    );
  };

  const renderResultsSection = () => {
    if (!submissionData) {
      return null;
    }

    return (
      <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          📊 Quiz Results
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {submissionData.score || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Score</div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {submissionData.total_questions || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Questions</div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <div className={`text-2xl font-bold ${parseFloat(submissionData.percentage || '0') >= (submissionData.passing_threshold || 70)
              ? 'text-green-600 dark:text-green-400'
              : 'text-red-600 dark:text-red-400'
              }`}>
              {submissionData.percentage || '0'}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Percentage</div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <div className={`text-lg font-bold ${submissionData.passed
              ? 'text-green-600 dark:text-green-400'
              : 'text-red-600 dark:text-red-400'
              }`}>
              {submissionData.passed ? '✅ PASSED' : '❌ FAILED'}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Required: {submissionData.passing_threshold || 70}%
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300 mb-2">
            <span>Your Score</span>
            <span>{submissionData.percentage || '0'}% / {submissionData.passing_threshold || 70}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${submissionData.passed
                ? 'bg-green-500'
                : 'bg-red-500'
                }`}
              style={{ width: `${Math.min(100, parseFloat(submissionData.percentage || '0'))}%` }}
            ></div>
          </div>
        </div>

        {/* Message */}
        {submissionData.message && (
          <div className={`p-4 rounded-lg ${submissionData.passed
            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
            }`}>
            <p className="font-medium">{submissionData.message}</p>
          </div>
        )}

        {/* Additional Data (if any) */}
        {Object.keys(submissionData).filter(key =>
          !['score', 'total_questions', 'percentage', 'passed', 'passing_threshold', 'message', 'results'].includes(key)
        ).length > 0 && (
            <details className="mt-4">
              <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300">
                View Additional Data
              </summary>
              <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                <pre>{JSON.stringify(submissionData, null, 2)}</pre>
              </div>
            </details>
          )}
      </div>
    );
  };





  // Render MCQs component - Only visible when media is completed
  const renderMcqs = () => {

    if (!mcqs.length) return null;

    if (!mediaCompleted) {
      return (
        <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col items-center justify-center text-center py-8">
            <div className="bg-yellow-100 dark:bg-yellow-900/30 p-4 rounded-full mb-4">
              <Lock className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Quiz Locked
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
              Complete all videos and images in this chapter to unlock the quiz questions.
            </p>
            <div className="flex items-center text-sm text-yellow-700 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 px-4 py-2 rounded-lg">
              <span className="mr-2">Progress:</span>
              <span>
                {viewedImages.size}/{chapter?.images?.length || 0} images viewed •
                {" "}{completedVideos.size}/{chapter?.videos?.length || 0} videos completed
              </span>
            </div>
          </div>
        </div>
      );
    }




    // Check if all questions are answered
    const allAnswered = mcqs.every(mcq => selectedAnswers[mcq._id || mcq.id]);
    const someSubmitted = submittedMcqs.size > 0;
    const allSubmitted = submittedMcqs.size === mcqs.length;


    if (!hisviousSubmission || hisviousSubmission.length === 0) return null;

    // Assuming hisviousSubmission is an array of previous attempts
    // Sort by date to get the most recent attempt (assuming there's a createdAt field)
    const sortedAttempts = [...hisviousSubmission].sort((a, b) =>
      new Date(b.createdAt || b.submitted_at) - new Date(a.createdAt || a.submitted_at)
    );

    const lastAttempt = sortedAttempts[0];

    // Calculate score for the last attempt
    const totalQuestions = mcqs.length;
    const correctAnswers = hisviousSubmission.filter(answer => answer.is_correct).length;
    const scorePercentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    console.log("type of scorePercentage", scorePercentage)

    return (
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Quiz Questions ({mcqs.length})
          </h3>
          <span className="text-sm bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 px-3 py-1 rounded-full">
            Unlocked ✓
          </span>
        </div>

        {/* Previous Attempts Section */}
        {hasPreviousAttempts && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <div className="flex  justify-between mb-3">
              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                  Previous Attempts Found
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  You have already attempted this quiz. Choose how you want to proceed.
                </p>





                <div className="mt-3 p-3 bg-white dark:bg-gray-700 rounded-lg border">
                  <h5 className="font-medium text-gray-900 dark:text-white mb-2">Last Attempt Result:</h5>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Score: <span className="font-semibold">{correctAnswers}/{totalQuestions}</span></div>
                    <div>Percentage: <span className="font-semibold">{scorePercentage}%</span></div>
                    <div className="col-span-2">
                      Status: <span className={scorePercentage >= 70 ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                        {scorePercentage >= 70 ? "PASSED" : "FAILED"}
                      </span>
                    </div>
                    {lastAttempt.createdAt && (
                      <div className="col-span-2 text-xs text-gray-500">
                        Attempted on: {new Date(lastAttempt.createdAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>



                </div>

              </div>


                <div className="flex flex-wrap gap-3">
              {scorePercentage <= 70 ? (
                <button
                  onClick={startFreshAttempt}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  Try Again
                </button>
              ) : (
                <button>Next</button>
              )}
            </div>
           
              
            </div>

          






          </div>
        )}





        <div className="space-y-6">
          {mcqs.map((mcq, index) => {
            const isSubmitted = submittedMcqs.has(mcq._id || mcq.id);
            // const isHissubmite = hisviousSubmission.has(mcq._id || mcq.id) 
            const isCorrect = mcqResults[mcq._id || mcq.id];

            return (
              <div
                key={mcq._id || mcq.id}
                className={`p-4 rounded-lg borderbg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700`}
              >
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {index + 1}. {mcq.question}
                  </h4>

                  {showPreviousAttempts && isSubmitted && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${isCorrect
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                      }`}>
                      Previous: {isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  {mcq.options && mcq.options.map((option: string, optIndex: number) => {
                    const optionLetter = String.fromCharCode(65 + optIndex);
                    const isSelected = selectedAnswers[mcq._id || mcq.id] === option;

                    // Find the result for this specific MCQ from submissionData
                    const result = submissionData?.results?.find(
                      (r: any) => r.mcq_id.toString() === (mcq.id || mcq._id).toString()
                    );

                    console.log("-1-1-1-1-1-1-1-1-1--1-1-1-1-1-", result)
                    const hisresult = hisviousSubmission.find(
                      (r: any) => r.mcq_id.toString() === (mcq.id || mcq._id).toString()
                    );
                    console.log("2-2-2--2-2-2--2-2-2-2-2-2-2-2-2-", hisresult)


                    // Check if this option is the correct answer based on submission data
                    const isCorrectAnswer = result ? option === result.correct_option : hisresult ? option === hisresult.correct_option : false;
                    // Check if this option was selected by the user
                    const isUserSelected = result ? option === result.selected_option : false;
                    const ishisSelected = hisresult ? option === hisresult.selected_option : false;

                    return (
                      <label
                        key={optIndex}
                        className={`flex items-center p-3 rounded-md cursor-pointer transition-colors ${!isSubmitted
                          ? isSelected
                            ? 'bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700'
                            : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                          : isUserSelected && isCorrectAnswer
                            ? 'bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700'
                            : isUserSelected && !isCorrectAnswer
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
                          disabled={isSubmitted || showPreviousAttempts}
                          className="mr-3"
                        />
                        <span className="font-medium mr-2">{optionLetter}.</span>
                        <span>{option}</span>

                        {/* Only show correct/incorrect for the user's selected option */}

                        {hasPreviousAttempts && ishisSelected && !isSubmitted && (
                          <span className={`ml-auto ${isCorrectAnswer ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {isCorrectAnswer ? '✓ Correct' : '✗ Incorrect'}
                          </span>
                        )}


                        {isSubmitted && isUserSelected && (
                          <span className={`ml-auto ${isCorrectAnswer ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {isCorrectAnswer ? '✓ Correct' : '✗ Incorrect'}
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Single Submit Button for All MCQs - Only show if not showing previous attempts */}


        {/* Show results section for both current and previous attempts */}
        {renderResultsSection()}

        <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex-1">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                Submit All Answers
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                {allSubmitted
                  ? "All questions submitted. You can reset to try again."
                  : !allAnswered
                    ? `Answer all ${mcqs.length - Object.keys(selectedAnswers).length} remaining questions to submit`
                    : "Ready to submit all answers"
                }
              </p>
            </div>

            <div className="flex gap-3">
             



              {scorePercentage <= 70 ? (
 <button
                onClick={submitAllMcqAnswers}
                disabled={!allAnswered}
                className={`px-6 py-3 rounded-lg transition-colors ${allAnswered
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 dark:bg-gray-600 dark:text-gray-400 cursor-not-allowed'
                  }`}
              >
                Submit All Answers
              </button>
) : (
  <button className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-3 rounded-lg transition-colors">Next Chapter</button>
)}
            </div>
          </div>

          {/* Progress indicator */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-blue-700 dark:text-blue-300 mb-2">
              <span>Progress: {Object.keys(selectedAnswers).length}/{mcqs.length} answered</span>
              <span>{submittedMcqs.size}/{mcqs.length} submitted</span>
            </div>
            <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
              <div
                className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(Object.keys(selectedAnswers).length / mcqs.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

      </div>
    );
  };

  // console.log("111111111111111111111",submissionData)
  const submitAllMcqAnswers = async () => {
    try {
      // Get user ID from cookies
      const userId = Cookies.get('userId');

      if (!userId) {
        toasterError("User not authenticated. Please login again.", 3000);
        return;
      }

      // console.log("mcqs",mcqs)
      // Prepare answers in the required format
      const answers = mcqs.map(mcq => ({
        mcq_id: mcq.id || mcq._id,
        selected_option: selectedAnswers[mcq._id || mcq.id]
      }));

      // console.log("Submitting answers:", answers);

      // Call your backend API to submit all answers
      const res = await api.post("mcq/submit-all", {
        user_id: parseInt(userId),
        chapter_id: parseInt(chapterId as string),
        answers
      });

      if (res.success) {
        // console.log(res,"=====res")
        // Mark all MCQs as submitted
        const dataallresl = res.data?.data?.data;

        // console.log("8989898989",dataallresl)
        setSubmissionData(res?.data?.data?.data);
        // console.log("111111111111111111111",submissionData)

        const allMcqIds = mcqs.map(mcq => mcq._id || mcq.id);
        setSubmittedMcqs(new Set(allMcqIds));



        // Extract and store is_correct values from the response
        const results = res.data.data.results || [];
        const newResults = {};

        // Create a new answers array with is_correct included
        const answersWithResults = answers.map(answer => {
          const result = results.find(r => r.mcq_id == answer.mcq_id);
          return {
            ...answer,
            is_correct: result ? result.is_correct : false
          };
        });



        // Store results for each MCQ
        results.forEach(result => {
          newResults[result.mcq_id] = result.is_correct;
        });

        setMcqResults(newResults);


        // Store the full response data if needed
        setSubmissionData(dataallresl);


        // Show success message with detailed results
        if (dataallresl.passed) {
          toasterSuccess(
            `Congratulation! You passed with ${dataallresl.score}/${dataallresl.total_questions} correct answers (${dataallresl.score})`,
            5000
          );
        } else {
          toasterError(
            `You scored ${dataallresl.score}/${dataallresl.total_questions} (${dataallresl.percentage}%) try again.`,
            5000
          );
        }



      } else {
        toasterError(res.error?.message || "Failed to submit answers", 3000);
      }
    } catch (err: any) {
      console.error("Failed to submit all MCQ answers:", err);
      toasterError(err.response?.data?.message || "Failed to submit answers", 3000);
    }
  };

  const resetAllMcqs = () => {
    setSelectedAnswers({});
    setSubmittedMcqs(new Set());
    setMcqResults({});
    toasterSuccess("All questions reset. You can try again.", 2000);
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
                className={`cursor-pointer transform transition-transform hover:scale-105 relative ${viewedImages.has(index) ? 'ring-2 ring-green-500' : ''
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
              <div key={index} className={`relative bg-black rounded-lg overflow-hidden ${isCompleted ? 'ring-2 ring-green-500' : ''
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

  // Render chapter content
  if (!mediaCompleted) {
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

          <ProgressIndicator />

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

          {/* MCQs Section - Now conditionally rendered based on media completion */}
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

        <ProgressIndicator />

        {/* Content Section */}

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

        {/* MCQs Section - Now conditionally rendered based on media completion */}
        {renderMcqs()}

        {/* Media Modal */}

      </div>


    </div>
  );
}