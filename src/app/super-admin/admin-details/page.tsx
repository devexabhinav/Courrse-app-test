'use client';

import React, { useEffect, useState } from 'react';
import { Book, User, Mail, Calendar, Eye, Search, Filter, RefreshCw, ChevronLeft, ChevronRight, Star, Clock, BarChart3 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  fetchUserCourses,
  fetchUserCourseStats,
  selectUserCourses,
  selectTotalCourses,
  selectCurrentPage,
  selectTotalPages,
  selectLoading,
  selectError,
  selectCourseStats,
} from '@/store/slices/adminslice/userCourseSlice';
import { useRouter, useSearchParams } from "next/navigation";

export default function UserCoursesPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  // Redux selectors - get data from store
  const courses = useAppSelector(selectUserCourses);
  const totalCourses = useAppSelector(selectTotalCourses);
  const currentPage = useAppSelector(selectCurrentPage);
  const totalPages = useAppSelector(selectTotalPages);
  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);
  const stats = useAppSelector(selectCourseStats);

  // Local state for filters
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: 'active'
  });
  const searchParams = useSearchParams();
  // Get userId from URL params or context (you might need to adjust this)
  const userId = searchParams.get("id"); // Replace with actual user ID from your context/params
  console.log("userID",userId)
  // Fetch courses on component mount and when filters change
  useEffect(() => {
    // dispatch(fetchUserCourses({ userId, page: 1, filters }));
    dispatch(fetchUserCourseStats(userId));
  }, [dispatch, userId]);



  // Handle filter changes


  // Handle apply filters
  const handleApplyFilters = () => {
    dispatch(fetchUserCourses({ userId, page: 1, filters }));
  };

  // Handle view course details
  const handleViewCourse = (courseId: any) => {
    router.push(`/super-admin/admin-details/course-details?id=${courseId}`);
  };

  // Handle refresh
  const handleRefresh = () => {
    dispatch(fetchUserCourses({ userId, page: currentPage, filters }));
    dispatch(fetchUserCourseStats(userId));
  };

  // Format date helper function
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Loading state
  if (loading && courses.length === 0) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="dark:text-gray-300 text-gray-600 font-medium">Loading courses...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-500/50 rounded-lg p-6 text-center">
            <Book className="h-12 w-12 text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-400 mb-2">Error Loading Courses</h3>
            <p className="text-red-700 dark:text-red-300 mb-4">{error}</p>
            <button
              onClick={handleRefresh}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <Book className="h-8 w-8 mr-3 text-blue-600 dark:text-blue-500" />
              User Courses Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              View and manage all courses created by this user
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
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Total Courses</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats?.data?.courses.length || 0}
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
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Active Courses</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-500 mt-1">
                  {stats?.data?.filters?.totalActive || 0}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Inactive Courses</p>
                <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-500 mt-1">
                  {stats?.data?.filters?.totalInactive|| 0}
                </p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 dark:bg-yellow-500/20 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Average Rating</p>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-500 mt-1">
                  {stats?.averageRating || '0.0'}
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-100 dark:bg-purple-500/20 rounded-full flex items-center justify-center">
                <Star className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        

        {/* Rest of your component remains the same... */}
        {/* (Courses Table, Pagination, etc.) */}



        {/* Courses Table */}
<div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
  {/* Table Header */}
  <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
      Courses ({stats?.data?.courses?.length || 0})
    </h2>
  </div>

  {/* Table */}
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead className="bg-gray-50 dark:bg-gray-700/50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Course Details
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Category
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Status
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Created Date
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Rating
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
        {!stats?.data?.courses || stats.data.courses.length === 0 ? (
          <tr>
            <td colSpan={6} className="px-6 py-8 text-center">
              <Book className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400 font-medium">No courses found</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                {filters.search || filters.category || filters.status !== 'active' 
                  ? 'Try adjusting your filters' 
                  : 'This user has not created any courses yet'}
              </p>
            </td>
          </tr>
        ) : (
          stats.data.courses.map((course, index) => (
            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
              {/* Course Details */}
              <td className="px-6 py-4">
                <div className="flex items-start space-x-3">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="h-12 w-16 object-cover rounded-lg flex-shrink-0"
                    />
                  ) : (
                    <div className="h-12 w-16 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Book className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                      {course.description || 'No description available'}
                    </p>
                    <div className="flex items-center mt-1 text-xs text-gray-400 dark:text-gray-500">
                      <User className="h-3 w-3 mr-1" />
                      <span>{course.instructorName || 'Unknown Instructor'}</span>
                    </div>
                  </div>
                </div>
              </td>

              {/* Category */}
              <td className="px-6 py-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300">
                  {course.category || 'Uncategorized'}
                </span>
              </td>

              {/* Status */}
              <td className="px-6 py-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  course.status === 'active' 
                    ? 'bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-300'
                    : 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-800 dark:text-yellow-300'
                }`}>
                  {course.is_active ? 'Active' : 'Inactive'}
                </span>
              </td>

              {/* Created Date */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDate(course.createdAt)}
                </div>
              </td>

              {/* Rating */}
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {course.rating?.toFixed(1) || '0.0'}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                    ({course.totalReviews || 0})
                  </span>
                </div>
              </td>

              {/* Actions */}
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => handleViewCourse(course.id)}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/20 hover:bg-blue-100 dark:hover:bg-blue-500/30 transition-colors"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>

  {/* Loading State for Table */}
  {loading && stats?.data?.courses && stats.data.courses.length > 0 && (
    <div className="absolute inset-0 bg-white dark:bg-gray-800 bg-opacity-50 dark:bg-opacity-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
        <p className="text-sm text-gray-600 dark:text-gray-400">Updating...</p>
      </div>
    </div>
  )}
</div>

{/* Note: Since all courses are in stats.data.courses, pagination might not be needed */}
{/* But if you want to implement client-side pagination, you can add it here */}
{stats?.data?.courses && stats.data.courses.length > 10 && (
  <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4">
    <div className="text-center text-sm text-gray-500 dark:text-gray-400">
      Showing all {stats.data.courses.length} courses
      {/* You can implement client-side pagination here if needed */}
    </div>
  </div>
)}












      </div>
    </div>
  );
}