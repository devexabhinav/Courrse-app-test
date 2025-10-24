'use client';

import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { Book, Calendar, Star, User, Clock, DollarSign, Tag, Activity, RefreshCw } from 'lucide-react';
import { 
  fetchCourseById, 
  selectCourse, 
  selectCourseLoading, 
  selectCourseError,
  clearCourse 
} from '@/store/slices/adminslice/getinfoaboutcourse';
import type { AppDispatch } from '@/store';

export default function CoursePage() {
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams();
  const courseId = searchParams.get('id');
  
  const course = useSelector(selectCourse);
  const loading = useSelector(selectCourseLoading);
  const error = useSelector(selectCourseError);
console.log("object",course?.data)
  useEffect(() => {
    if (courseId) {
      dispatch(fetchCourseById(courseId));
    }

    return () => {
      dispatch(clearCourse());
    };
  }, [courseId, dispatch]);

  const handleRefresh = () => {
    if (courseId) {
      dispatch(fetchCourseById(courseId));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Loading course...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-900">
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-3">Error</h2>
          <p className="text-red-600 dark:text-red-300">{error}</p>
          <button
            onClick={handleRefresh}
            className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </button>
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
              Course Details
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              View complete information about this course
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Course ID</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
               {course?.data?.id}
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center">
                <Book className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Price</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-500 mt-1">
                  {course.price_type === 'free' ? 'FREE' : `$${course?.data?.price}`}
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
                  course.status === 'active' ? 'text-green-600 dark:text-green-500' :
                  course.status === 'draft' ? 'text-yellow-600 dark:text-yellow-500' :
                  'text-gray-600 dark:text-gray-500'
                }`}>
                  {course?.data?.status}
                </p>
              </div>
              <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                course.status === 'active' ? 'bg-green-100 dark:bg-green-500/20' :
                course.status === 'draft' ? 'bg-yellow-100 dark:bg-yellow-500/20' :
                'bg-gray-100 dark:bg-gray-500/20'
              }`}>
                <Activity className={`h-6 w-6 ${
                  course.status === 'active' ? 'text-green-600 dark:text-green-400' :
                  course.status === 'draft' ? 'text-yellow-600 dark:text-yellow-400' :
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
                  {course?.data?.ratings ?course?.data?.ratings.toFixed(1) : '0.0'}
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-100 dark:bg-purple-500/20 rounded-full flex items-center justify-center">
                <Star className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Course Image */}
        {course.image && (
          <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
            <img 
              src={course?.data?.image} 
              alt={course?.data?.title}
              className="w-full h-96 object-cover"
            />
          </div>
        )}

        {/* Course Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Basic Information */}
          <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <Book className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
              Basic Information
            </h2>
            <div className="space-y-4">
              <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Title</p>
                <p className="text-base font-semibold text-gray-900 dark:text-white">{course?.data?.title}</p>
              </div>
              <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Description</p>
                <p className="text-base text-gray-900 dark:text-white">{course?.data?.description}</p>
              </div>
              <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Category</p>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300">
                  <Tag className="h-4 w-4 mr-1" />
                  {course?.data?.category}
                </span>
              </div>
              <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Creator</p>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                  <p className="text-base font-medium text-gray-900 dark:text-white">{course?.data?.creator}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Duration</p>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                  <p className="text-base text-gray-900 dark:text-white">{course?.data?.duration || 'Not specified'}</p>
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
                  course?.data?.status === 'active' ? 'bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-300' :
                 course?.data?.status === 'draft' ? 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-800 dark:text-yellow-300' :
                  'bg-gray-100 dark:bg-gray-500/20 text-gray-800 dark:text-gray-300'
                }`}>
                  {course?.data?.status}
                </span>
              </div>
              <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Active Status</p>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  course?.data?.is_active 
                    ? 'bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-300'
                    : 'bg-red-100 dark:bg-red-500/20 text-red-800 dark:text-red-300'
                }`}>
                  {course?.data?.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Price Type</p>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  course?.data?.price_type === 'free' 
                    ? 'bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-300'
                    : 'bg-purple-100 dark:bg-purple-500/20 text-purple-800 dark:text-purple-300'
                }`}>
                  <DollarSign className="h-4 w-4 mr-1" />
                  {course?.data?.price_type}
                </span>
              </div>
              <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Price</p>
                <p className="text-base font-bold text-gray-900 dark:text-white">
                  {course?.data?.price_type === 'free' ? 'Free' : `$${course?.data?.price}`}
                </p>
              </div>
              <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Rating</p>
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 mr-1" />
                  <span className="text-base font-bold text-gray-900 dark:text-white mr-1">
                    {course?.data?.ratings ? course?.data?.ratings.toFixed(1) : '0.0'}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">/ 5.0</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">User ID</p>
                <p className="text-base font-medium text-gray-900 dark:text-white">{course?.data?.userId}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Media Information */}
        <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Media Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Course Image</p>
              {course.image ? (
                <a 
                  href={course?.data?.image} 
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
              {course.intro_video ? (
                <a 
                  href={course?.data?.intro_video} 
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
                  {formatDate(course?.data?.createdAt)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {new Date(course?.data?.createdAt).toLocaleTimeString()}
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
                  {formatDate(course?.data?.updatedAt)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {new Date(course?.data?.updatedAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}