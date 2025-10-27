'use client';

import React, { useEffect } from 'react';
import { 
  Book, 
  User, 
  Users, 
  BarChart3, 
  CheckCircle, 
  XCircle, 
  Clock,
  FileText,
  RefreshCw,
  Eye
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  fetchDashboardStats,
  selectDashboardStats,
  selectDashboardStatsLoading,
  selectDashboardStatsError,
  selectTotalUsers,
  selectTotalAdmins,
  selectTotalCourses,
  selectActiveCourses,
  selectTotalChapters,
  selectVerifiedUsers,
  selectUnverifiedUsers,
  selectApprovedAdmins,
  selectRejectedAdmins,
  selectPendingAdmins,
  selectDraftCourses,
  clearError,
} from '@/store/slices/adminslice/dashboardStatsSlice';
import { useRouter } from "next/navigation";

export default function DashboardStatsPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  // Redux selectors
  const stats = useAppSelector(selectDashboardStats);
  const loading = useAppSelector(selectDashboardStatsLoading);
  const error = useAppSelector(selectDashboardStatsError);
  
  // Summary stats
  const totalUsers = useAppSelector(selectTotalUsers);
  const totalAdmins = useAppSelector(selectTotalAdmins);
  const totalCourses = useAppSelector(selectTotalCourses);
  const activeCourses = useAppSelector(selectActiveCourses);
  const totalChapters = useAppSelector(selectTotalChapters);
  // Detailed stats
  const verifiedUsers = useAppSelector(selectVerifiedUsers);
  const unverifiedUsers = useAppSelector(selectUnverifiedUsers);
  const approvedAdmins = useAppSelector(selectApprovedAdmins);
  const rejectedAdmins = useAppSelector(selectRejectedAdmins);
  const pendingAdmins = useAppSelector(selectPendingAdmins);
  const draftCourses = useAppSelector(selectDraftCourses);


  console.log("object",stats?.data)
  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleRefresh = () => {
    dispatch(fetchDashboardStats());
  };

  // Loading state
  if (loading && !stats) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="dark:text-gray-300 text-gray-600 font-medium">Loading dashboard statistics...</p>
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
            <BarChart3 className="h-12 w-12 text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-400 mb-2">
              Error Loading Statistics
            </h3>
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
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                <BarChart3 className="h-8 w-8 mr-3 text-blue-600 dark:text-blue-500" />
                Dashboard Overview
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Comprehensive statistics and insights about your platform
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors shadow-sm mt-4 sm:mt-0"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Refreshing...' : 'Refresh Stats'}
            </button>
          </div>
        </div>

        {/* Summary Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {stats?.data?.summary?.totalUsers}
                </p>
                <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <Users className="h-3 w-3 mr-1" />
                  <span>{stats?.data?.users?.adminStatus?.approved} admins</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          {/* Total Courses Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Courses</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {stats?.data?.summary?.totalCourses}

                </p>
                <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                  <span>                  {stats?.data?.summary?.activeCourses} active</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center">
                <Book className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          {/* Total Chapters Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Chapters</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {stats?.data?.summary?.totalChapters} 
                </p>
                <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <FileText className="h-3 w-3 mr-1" />
                  <span>Across all courses</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-purple-100 dark:bg-purple-500/20 rounded-full flex items-center justify-center">
                <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          {/* User Verification Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Verified Users</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                 {stats?.data?.users?.userVerification?.verified} 
                </p>
                <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                  <span>{stats?.data?.users?.userVerification?.unverified}  pending</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-orange-100 dark:bg-orange-500/20 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Statistics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Statistics */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Users className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                User Statistics
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {/* User Roles */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {stats?.data?.summary?.totalAdmins || 0}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Admin Users</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-500/10 rounded-lg">
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {stats?.data?.users?.byRole?.user || 0}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Regular Users</p>
                  </div>
                </div>

                {/* User Verification */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    User Verification Status
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-500/10 rounded-lg">
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mr-2" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Verified</span>
                      </div>
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        {stats?.data?.users?.userVerification?.verified || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-500/10 rounded-lg">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mr-2" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Unverified</span>
                      </div>
                      <span className="font-semibold text-yellow-600 dark:text-yellow-400">
                        {stats?.data?.users?.userVerification?.unverified || 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Admin Status */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Admin Status
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-500/10 rounded-lg">
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mr-2" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Approved</span>
                      </div>
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        {stats?.data?.users?.adminStatus?.approved || 0} 
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-500/10 rounded-lg">
                      <div className="flex items-center">
                        <XCircle className="h-4 w-4 text-red-600 dark:text-red-400 mr-2" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Rejected</span>
                      </div>
                      <span className="font-semibold text-red-600 dark:text-red-400">
                        {stats?.data?.users?.adminStatus?.rejected || 0} 
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-500/10 rounded-lg">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mr-2" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Pending</span>
                      </div>
                      <span className="font-semibold text-yellow-600 dark:text-yellow-400">
                        {stats?.data?.users?.adminStatus?.pending || 0} 
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Course & Chapter Statistics */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Book className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
                Course & Chapter Statistics
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {/* Course Status */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Course Status
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-500/10 rounded-lg">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-3" />
                        <div>
                          <p className="font-semibold text-green-600 dark:text-green-400">Active Courses</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Published and available</p>
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {stats?.data?.courses?.active || 0} 
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-500/10 rounded-lg">
                      <div className="flex items-center">
                        <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-3" />
                        <div>
                          <p className="font-semibold text-red-600 dark:text-red-400">Inactive Courses</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Not available to users</p>
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                         {stats?.data?.courses?.inactive || 0} 
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" />
                        <div>
                          <p className="font-semibold text-blue-600 dark:text-blue-400">Draft Courses</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">In progress</p>
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {stats?.data?.courses?.draft || 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Chapter Statistics */}
                <div className="bg-purple-50 dark:bg-purple-500/10 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="h-8 w-8 text-purple-600 dark:text-purple-400 mr-3" />
                      <div>
                        <p className="font-semibold text-purple-600 dark:text-purple-400">Total Chapters</p>
                        <p className="text-sm text-purple-500 dark:text-purple-300">
                          Across all courses
                        </p>
                      </div>
                    </div>
                    <span className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                      {stats?.data?.courses?.total || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
             onClick={() => router.push("/super-admin/all-user")}
            className="flex items-center justify-center p-4 bg-blue-50 dark:bg-blue-500/10 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
              <span className="text-blue-600 dark:text-blue-400 font-medium">Manage Users</span>
            </button>
            <button
             onClick={() => router.push("/super-admin/courses")}
            className="flex items-center justify-center p-4 bg-green-50 dark:bg-green-500/10 rounded-lg hover:bg-green-100 dark:hover:bg-green-500/20 transition-colors">
              <Book className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
              <span className="text-green-600 dark:text-green-400 font-medium">View Courses</span>
            </button>
            <button
             onClick={() => router.push("/super-admin/courses")}
            className="flex items-center justify-center p-4 bg-purple-50 dark:bg-purple-500/10 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-500/20 transition-colors">
              <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
              <span className="text-purple-600 dark:text-purple-400 font-medium">Manage Content</span>
            </button>
            <button 
             onClick={() => router.push("/super-admin/courses")}
            className="flex items-center justify-center p-4 bg-orange-50 dark:bg-orange-500/10 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-500/20 transition-colors">
              <Eye className="h-5 w-5 text-orange-600 dark:text-orange-400 mr-2" />
              <span className="text-orange-600 dark:text-orange-400 font-medium">View Reports</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}