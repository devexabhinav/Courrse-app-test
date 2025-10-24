'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Book, 
  Calendar, 
  Clock, 
  DollarSign, 
  Lock, 
  Play, 
  RefreshCw, 
  ListOrdered, 
  Video,
  CheckCircle,
  XCircle,
  Star, 
  User, 
  Tag, 
  Activity,
   FileText, Download 
} from 'lucide-react';
import { 
  fetchChaptersByCourseId, 
  clearChapters,
  clearError 
} from '@/store/slices/adminslice/chaptersSlice';
import { 
  fetchCourseById, 
  selectCourse, 
  selectCourseLoading, 
  selectCourseError,
  clearCourse 
} from '@/store/slices/adminslice/getinfoaboutcourse';
import type { AppDispatch, RootState } from '@/store';

export default function CourseDetailsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams();
  const courseId = searchParams.get('id');
  const [activeTab, setActiveTab] = useState<'details' | 'chapters'>('details');

  // Course state
  const course = useSelector(selectCourse);
  const courseLoading = useSelector(selectCourseLoading);
  const courseError = useSelector(selectCourseError);

  // Chapters state
  const { chapters, loading: chaptersLoading, error: chaptersError, count } = useSelector((state: RootState) => state.chapters);
console.log("object",chapters)
  useEffect(() => {
    if (courseId) {
      dispatch(fetchCourseById(courseId));
      dispatch(fetchChaptersByCourseId(courseId));
    }

    return () => {
      dispatch(clearCourse());
      dispatch(clearChapters());
    };
  }, [courseId, dispatch]);

  const handleRefresh = () => {
    if (courseId) {
      dispatch(fetchCourseById(courseId));
      dispatch(fetchChaptersByCourseId(courseId));
    }
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Loading state
  if (courseLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Loading course details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (courseError || chaptersError) {
    const error = courseError || chaptersError;
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-900">
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-3">Error</h2>
          <p className="text-red-600 dark:text-red-300">{error}</p>
          <div className="mt-4 flex gap-3 justify-center">
            <button
              onClick={handleRefresh}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </button>
            <button
              onClick={handleClearError}
              className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Dismiss
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!course) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <Book className="h-8 w-8 mr-3 text-blue-600 dark:text-blue-500" />
              {course.data?.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Complete course information and chapter management
            </p>
          </div>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>

        {/* Course Image */}
        {course.data?.image && (
          <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
            <img 
              src={course.data.image} 
              alt={course.data.title}
              className="w-full h-64 object-cover"
            />
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Total Chapters</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {count}
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center">
                <ListOrdered className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Price</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-500 mt-1">
                  {course.data?.price_type === 'free' ? 'FREE' : `$${course.data?.price}`}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Status</p>
                <p className={`text-3xl font-bold mt-1 ${
                  course.data?.status === 'active' ? 'text-green-600 dark:text-green-500' :
                  course.data?.status === 'draft' ? 'text-yellow-600 dark:text-yellow-500' :
                  'text-gray-600 dark:text-gray-500'
                }`}>
                  {course.data?.status}
                </p>
              </div>
              <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                course.data?.status === 'active' ? 'bg-green-100 dark:bg-green-500/20' :
                course.data?.status === 'draft' ? 'bg-yellow-100 dark:bg-yellow-500/20' :
                'bg-gray-100 dark:bg-gray-500/20'
              }`}>
                <Activity className={`h-6 w-6 ${
                  course.data?.status === 'active' ? 'text-green-600 dark:text-green-400' :
                  course.data?.status === 'draft' ? 'text-yellow-600 dark:text-yellow-400' :
                  'text-gray-600 dark:text-gray-400'
                }`} />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Rating</p>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-500 mt-1">
                  {course.data?.ratings ? course.data?.ratings.toFixed(1) : '0.0'}
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-100 dark:bg-purple-500/20 rounded-full flex items-center justify-center">
                <Star className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-1 mb-6">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('details')}
              className={`flex-1 py-3 px-4 text-center rounded-md transition-colors ${
                activeTab === 'details'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Book className="h-5 w-5 inline-block mr-2" />
              Course Details
            </button>
            <button
              onClick={() => setActiveTab('chapters')}
              className={`flex-1 py-3 px-4 text-center rounded-md transition-colors ${
                activeTab === 'chapters'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <ListOrdered className="h-5 w-5 inline-block mr-2" />
              Chapters ({count})
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'details' ? (
          /* Course Details Tab */
          <div className="space-y-6">
            {/* Course Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Book className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                  Basic Information
                </h2>
                <div className="space-y-4">
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Title</p>
                    <p className="text-base font-semibold text-gray-900 dark:text-white">{course.data?.title}</p>
                  </div>
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Description</p>
                    <p className="text-base text-gray-900 dark:text-white">{course.data?.description}</p>
                  </div>
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Category</p>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300">
                      <Tag className="h-4 w-4 mr-1" />
                      {course.data?.category}
                    </span>
                  </div>
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Creator</p>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                      <p className="text-base font-medium text-gray-900 dark:text-white">{course.data?.creator}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Duration</p>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                      <p className="text-base text-gray-900 dark:text-white">{course.data?.duration || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status & Details */}
              <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                  Status & Details
                </h2>
                <div className="space-y-4">
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Course Status</p>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      course.data?.status === 'active' ? 'bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-300' :
                      course.data?.status === 'draft' ? 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-800 dark:text-yellow-300' :
                      'bg-gray-100 dark:bg-gray-500/20 text-gray-800 dark:text-gray-300'
                    }`}>
                      {course.data?.status}
                    </span>
                  </div>
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Active Status</p>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      course.data?.is_active 
                        ? 'bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-300'
                        : 'bg-red-100 dark:bg-red-500/20 text-red-800 dark:text-red-300'
                    }`}>
                      {course.data?.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Price Type</p>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      course.data?.price_type === 'free' 
                        ? 'bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-300'
                        : 'bg-purple-100 dark:bg-purple-500/20 text-purple-800 dark:text-purple-300'
                    }`}>
                      <DollarSign className="h-4 w-4 mr-1" />
                      {course.data?.price_type}
                    </span>
                  </div>
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Price</p>
                    <p className="text-base font-bold text-gray-900 dark:text-white">
                      {course.data?.price_type === 'free' ? 'Free' : `$${course.data?.price}`}
                    </p>
                  </div>
                  <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Rating</p>
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-400 mr-1" />
                      <span className="text-base font-bold text-gray-900 dark:text-white mr-1">
                        {course.data?.ratings ? course.data?.ratings.toFixed(1) : '0.0'}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">/ 5.0</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">User ID</p>
                    <p className="text-base font-medium text-gray-900 dark:text-white">{course.data?.userId}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Media Information */}
            <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Media Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Course Image</p>
                  {course.data?.image ? (
                    <a 
                      href={course.data.image} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline text-sm break-all"
                    >
                      View Image
                    </a>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-sm">No image available</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Intro Video</p>
                  {course.data?.intro_video ? (
                    <a 
                      href={course.data.intro_video} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline text-sm break-all"
                    >
                      View Video
                    </a>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-sm">No video available</p>
                  )}
                </div>
              </div>
            </div>

            {/* Timestamps */}
            <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                Timeline
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3">
                  <div className="h-10 w-10 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Created At</p>
                    <p className="text-base font-semibold text-gray-900 dark:text-white mt-1">
                      {formatDate(course.data?.createdAt)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(course.data?.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="h-10 w-10 bg-purple-100 dark:bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Last Updated</p>
                    <p className="text-base font-semibold text-gray-900 dark:text-white mt-1">
                      {formatDate(course.data?.updatedAt)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(course.data?.updatedAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Chapters Tab */
          <div className="space-y-6">
            {/* Chapters Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Free Chapters</p>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-500 mt-1">
                      {chapters.filter(chapter => chapter.is_free).length}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center">
                    <Play className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Premium Chapters</p>
                    <p className="text-3xl font-bold text-purple-600 dark:text-purple-500 mt-1">
                      {chapters.filter(chapter => !chapter.is_free).length}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-purple-100 dark:bg-purple-500/20 rounded-full flex items-center justify-center">
                    <Lock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">With Video</p>
                    <p className="text-3xl font-bold text-orange-600 dark:text-orange-500 mt-1">
                      {chapters.filter(chapter => chapter.video_url).length}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-orange-100 dark:bg-orange-500/20 rounded-full flex items-center justify-center">
                    <Video className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Chapters List */}
            {chaptersLoading ? (
              <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Loading chapters...</p>
              </div>
            ) : chapters.length === 0 ? (
              <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
                <Book className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No Chapters Found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  There are no chapters available for this course yet.
                </p>
                <button
                  onClick={handleRefresh}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Check Again
                </button>
              </div>
            ) : (
              <div className="space-y-4">
              {chapters.map((chapter) => (
  <div
    key={chapter.id}
    className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-200"
  >
    <div className="flex items-start justify-between">
      <div className="flex items-start space-x-4 flex-1">
        {/* Chapter Number */}
        <div className="flex-shrink-0">
          <div className="h-12 w-12 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center">
            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {chapter.order}
            </span>
          </div>
        </div>

        {/* Chapter Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate">
              {chapter.title}
            </h3>
            {chapter.is_free ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-300">
                <Play className="h-3 w-3 mr-1" />
                Free
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-500/20 text-purple-800 dark:text-purple-300">
                <Lock className="h-3 w-3 mr-1" />
                Premium
              </span>
            )}
          </div>

          {chapter.description && (
            <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
              {chapter.description}
            </p>
          )}

          <div className="flex items-center gap-4 flex-wrap">
            {chapter.duration && (
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Clock className="h-4 w-4 mr-1" />
                {chapter.duration}
              </div>
            )}
            
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <ListOrdered className="h-4 w-4 mr-1" />
              Order: {chapter.order}
            </div>

            {chapter.video_url && (
              <div className="flex items-center text-sm text-blue-500 dark:text-blue-400">
                <Video className="h-4 w-4 mr-1" />
                Video Available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Button */}
      {/* <div className="flex-shrink-0 ml-4">
        {chapter.is_free ? (
          <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm">
            <Play className="h-4 w-4 mr-2" />
            Watch
          </button>
        ) : (
          <button className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm">
            <Lock className="h-4 w-4 mr-2" />
            Unlock
          </button>
        )}
      </div> */}
    </div>

    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
      Chapter ID: {chapter.id}
    </p>

    {/* Lessons Section */}
    {chapter.lessons && chapter.lessons.length > 0 && (
      <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
          <ListOrdered className="h-5 w-5 mr-2" />
          Lessons ({chapter.lessons.length})
        </h4>
        
        <div className="space-y-3">
          {chapter.lessons.map((lesson) => (
            <div
              key={lesson.id}
              className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  {/* Lesson Order */}
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-green-600 dark:text-green-400">
                        {lesson.order}
                      </span>
                    </div>
                  </div>

                  {/* Lesson Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="font-medium text-gray-900 dark:text-white truncate">
                        {lesson.title}
                      </h5>
                      {lesson.is_free ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-300">
                          Free
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 dark:bg-purple-500/20 text-purple-800 dark:text-purple-300">
                          <Lock className="h-3 w-3 mr-1" />
                          Premium
                        </span>
                      )}
                    </div>

                    {lesson.content && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                        {lesson.content}
                      </p>
                    )}

                    <div className="flex items-center gap-4 flex-wrap text-xs text-gray-500 dark:text-gray-400">
                      {/* Lesson Type */}
                      <div className="flex items-center">
                        <FileText className="h-3 w-3 mr-1" />
                        {lesson.lesson_type}
                      </div>

                      {/* Duration */}
                      {lesson.duration && (
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {lesson.duration} min
                        </div>
                      )}

                      {/* Video Available */}
                      {lesson.video_url && (
                        <div className="flex items-center text-blue-500 dark:text-blue-400">
                          <Video className="h-3 w-3 mr-1" />
                          Video
                        </div>
                      )}

                      {/* Resources Count */}
                      {lesson.resources && lesson.resources.length > 0 && (
                        <div className="flex items-center text-orange-500 dark:text-orange-400">
                          <Download className="h-3 w-3 mr-1" />
                          {lesson.resources.length} resources
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Lesson Action Button */}
                {/* <div className="flex-shrink-0 ml-3">
                  {lesson.is_free ? (
                    <button className="inline-flex items-center px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm shadow-sm">
                      <Play className="h-3 w-3 mr-1" />
                      Start
                    </button>
                  ) : (
                    <button className="inline-flex items-center px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm shadow-sm">
                      <Lock className="h-3 w-3 mr-1" />
                      Unlock
                    </button>
                  )}
                </div> */}
              </div>

              {/* Lesson Timestamps */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <Calendar className="h-3 w-3 mr-1" />
                  Created: {formatDate(lesson.createdAt)}
                </div>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Updated: {formatDate(lesson.updatedAt)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* No Lessons Message */}
    {(!chapter.lessons || chapter.lessons.length === 0) && (
      <div className="mt-4 text-center py-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          No lessons available for this chapter yet.
        </p>
      </div>
    )}

    {/* Chapter Timestamps */}
    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
        <Calendar className="h-4 w-4 mr-1" />
        Created: {formatDate(chapter.createdAt)} at {formatTime(chapter.createdAt)}
      </div>
      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
        <RefreshCw className="h-4 w-4 mr-1" />
        Updated: {formatDate(chapter.updatedAt)} at {formatTime(chapter.updatedAt)}
      </div>
    </div>
  </div>
))}
              </div>
            )}

            {/* Chapters Summary */}
            {chapters.length > 0 && (
              <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-600 dark:text-green-500" />
                  Chapters Summary
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{count}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Chapters</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-500/10 rounded-lg">
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {chapters.filter(ch => ch.is_free).length}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Free Access</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-500/10 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {chapters.filter(ch => !ch.is_free).length}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Premium</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 dark:bg-orange-500/10 rounded-lg">
                    <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {chapters.filter(ch => ch.video_url).length}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">With Video</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}