"use client";

import React, { useEffect, useState } from "react";
import {
  Star,
  User,
  Mail,
  Calendar,
  BookOpen,
  RefreshCw,
  Eye,
  Info,
  EyeOff,
  Trash2,
  Check,
  X,
  Filter,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  getAllRatings,
  getRatingsByCourseId,
  getRatingById,
  selectRatings,
  selectRatingLoading,
  selectRatingError,
  selectCurrentRating,
  selectLastFetched,
  selectVisibleRatings,
  selectHiddenRatings,
  selectAverageRating,
} from "@/store/slices/adminslice/ratinguser";

import {
  hideRatingByAdmin,
  unhideRatingByAdmin,
} from "@/store/slices/adminslice/reviewhideadmin";

import {
  softDeleteRating,
  addRating,
} from "@/store/slices/adminslice/ratingsoftdelete"


import { useRouter } from "next/navigation";





export default function RatingsManagementPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(dateString));
  };

  // Redux selectors - get data from store
  const ratings = useAppSelector(selectRatings);
  const loading = useAppSelector(selectRatingLoading);
  const error = useAppSelector(selectRatingError);
  const currentRating = useAppSelector(selectCurrentRating);
  const lastFetched = useAppSelector(selectLastFetched);
  const visibleRatings = useAppSelector(selectVisibleRatings);
  const hiddenRatings = useAppSelector(selectHiddenRatings);
  const averageRating = useAppSelector(selectAverageRating);

  // Local state for filters and action loading
  const [courseFilter, setCourseFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [scoreFilter, setScoreFilter] = useState("all");
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  // Fetch ratings on component mount
  useEffect(() => {
    dispatch(getAllRatings());
  }, [dispatch]);



  const handleSoftDeleteRating = async (ratingId: number) => {
  setActionLoading(ratingId);
  try {
    await dispatch(softDeleteRating(ratingId)).unwrap();
    // Refresh the ratings list after successful deactivation
    await dispatch(getAllRatings());
    alert('Rating deactivated successfully');
  } catch (error) {
    console.error("Failed to deactivate rating:", error);
    alert('Failed to deactivate rating. Please try again.');
  } finally {
    setActionLoading(null);
  }
};


const handleAddRating = async (ratingId: number) => {
  setActionLoading(ratingId);
  try {
    await dispatch(addRating(ratingId)).unwrap();
    // Refresh the ratings list after successful activation
    await dispatch(getAllRatings());
    alert('Rating activated successfully');
  } catch (error) {
    console.error("Failed to activate rating:", error);
    alert('Failed to activate rating. Please try again.');
  } finally {
    setActionLoading(null);
  }
};

  // Handle refresh
  const handleRefresh = () => {
    if (courseFilter) {
      dispatch(getRatingsByCourseId(courseFilter));
    } else {
      dispatch(getAllRatings());
    }
  };

  // Handle course filter change
  const handleCourseFilter = (e: React.FormEvent) => {
    e.preventDefault();
    if (courseFilter.trim()) {
      dispatch(getRatingsByCourseId(courseFilter));
    } else {
      dispatch(getAllRatings());
    }
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setCourseFilter("");
    setStatusFilter("all");
    setScoreFilter("all");
    dispatch(getAllRatings());
  };

  // Handle hide rating
  const handleHideRating = async (ratingId: number) => {
    setActionLoading(ratingId);
    try {
      await dispatch(hideRatingByAdmin(ratingId)).unwrap();
      // Refresh the ratings list after successful hide
      await dispatch(getAllRatings());
      // Optional: Add success notification
      alert('Rating hidden successfully');
    } catch (error) {
      console.error("Failed to hide rating:", error);
      // Optional: Add error notification
      alert('Failed to hide rating. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  // Handle unhide rating
  const handleUnhideRating = async (ratingId: number) => {
    setActionLoading(ratingId);
    try {
      await dispatch(unhideRatingByAdmin(ratingId)).unwrap();
      // Refresh the ratings list after successful unhide
      await dispatch(getAllRatings());
      // Optional: Add success notification
      alert('Rating shown successfully');
    } catch (error) {
      console.error("Failed to unhide rating:", error);
      // Optional: Add error notification
      alert('Failed to show rating. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  // Filter ratings based on local filters
  const filteredRatings = ratings.filter((rating) => {
    const statusMatch = statusFilter === "all" || rating.status === statusFilter;
    const scoreMatch = scoreFilter === "all" || rating.score.toString() === scoreFilter;
    return statusMatch && scoreMatch;
  });

  // Calculate stats using selectors
  const totalRatings = filteredRatings.length;
  const formattedAverageRating = averageRating.toFixed(1);

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-col items-center justify-between gap-3 sm:flex-row sm:gap-0">
          <div>
            <h1 className="flex items-center text-2xl font-bold text-gray-900 dark:text-white">
              <Star className="mr-3 h-8 w-8 text-[#02517b] dark:text-[#43bf79]" />
              Ratings Management
            </h1>
            <p className="mt-2 text-gray-600 dark:text-white">
              View and manage all course ratings and reviews
            </p>
            {lastFetched && (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Last updated: {new Date(lastFetched).toLocaleString()}
              </p>
            )}
          </div>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center rounded-lg bg-[#02517b] px-4 py-2 text-white shadow-sm transition-colors hover:bg-[#02517b99] hover:bg-blue-700 dark:bg-[#43bf79]"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-4">
          {/* Total Ratings */}
          <div className="group rounded-xl border border-gray-200 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-700 dark:bg-gray-900/60">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-white">
                  Total Ratings
                </p>
                <p className="mt-1 text-3xl font-bold text-[#02517b] dark:text-[#43bf79]">
                  {ratings.length}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#02517b]/10 transition-transform duration-300 group-hover:scale-110 dark:bg-[#43bf79]/20">
                <Star className="h-6 w-6 text-[#02517b] dark:text-[#43bf79]" />
              </div>
            </div>
          </div>

          {/* Average Rating */}
          <div className="group rounded-xl border border-gray-200 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-700 dark:bg-gray-900/60">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-white">
                  Average Rating
                </p>
                <p className="mt-1 text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                  {formattedAverageRating}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 transition-transform duration-300 group-hover:scale-110 dark:bg-yellow-500/20">
                <Star className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>

          {/* Visible Ratings */}
          <div className="group rounded-xl border border-gray-200 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-700 dark:bg-gray-900/60">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-white">
                  Visible
                </p>
                <p className="mt-1 text-3xl font-bold text-green-600 dark:text-[#43bf79]">
                  {visibleRatings.length}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 transition-transform duration-300 group-hover:scale-110 dark:bg-[#43bf79]/20">
                <Eye className="h-6 w-6 text-green-600 dark:text-[#43bf79]" />
              </div>
            </div>
          </div>

          {/* Hidden Ratings */}
          <div className="group rounded-xl border border-gray-200 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-700 dark:bg-gray-900/60">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-white">
                  Hidden
                </p>
                <p className="mt-1 text-3xl font-bold text-gray-600 dark:text-gray-400">
                  {hiddenRatings.length}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 transition-transform duration-300 group-hover:scale-110 dark:bg-gray-500/20">
                <Eye className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-lg backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/50">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-6">


            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="showtoeveryone">Visible</option>
                <option value="hidebyadmin">Hidden by Admin</option>
                <option value="hidebysuperadmin">Hidden by Super Admin</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Score
              </label>
              <select
                value={scoreFilter}
                onChange={(e) => setScoreFilter(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Scores</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleClearFilters}
                className="rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/50">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    User Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Rating
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Review
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-transparent">
                {filteredRatings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <Star className="mx-auto mb-3 h-12 w-12 text-gray-300 dark:text-gray-600" />
                      <p className="font-medium text-gray-500 dark:text-white">
                        No ratings found
                      </p>
                      <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
                        {ratings.length === 0
                          ? "No ratings available yet"
                          : "No ratings match your filters"}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredRatings.map((rating) => (
                    <tr
                      key={rating.id}
                      className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/30"
                    >
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-12 w-12 flex-shrink-0">
                            {rating.user?.profileImage ? (
                              <img
                                className="h-12 w-12 rounded-full border-2 border-gray-200 object-cover dark:border-gray-600"
                                src={rating.user.profileImage}
                                alt={rating.user.username}
                              />
                            ) : (
                              <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-blue-300 bg-gradient-to-br from-blue-500 to-blue-700 dark:border-blue-400">
                                <User className="h-6 w-6 text-white" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900 dark:text-white">
                              {rating.user?.username || "Unknown User"}
                            </div>
                            <div className="mt-1 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                              <Mail className="h-3 w-3" />
                              <span className="truncate">
                                {rating.user?.email || "No email"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center text-sm text-gray-900 dark:text-gray-300">
                          <BookOpen className="mr-2 h-4 w-4 flex-shrink-0 text-gray-400 dark:text-white" />
                          <span>{rating.course.title}</span>
                        </div>
                        <div className="mt-2 flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < rating.score
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-gray-200 text-gray-200 dark:fill-gray-600 dark:text-gray-600"
                                }`}
                            />
                          ))}
                          <span className="ml-2 text-sm font-semibold text-gray-900 dark:text-white">
                            {rating.score}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <p className="text-sm text-gray-900 dark:text-gray-300">
                            {rating.review ? (
                              <span className="line-clamp-2">{rating.review}</span>
                            ) : (
                              <span className="italic text-gray-500 dark:text-gray-400">
                                No review
                              </span>
                            )}
                          </p>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {(() => {
                          switch (rating.status) {
                            case "showtoeveryone":
                              return (
                                <span className="inline-flex items-center rounded-full border border-green-200 bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-800 dark:border-green-500/30 dark:bg-green-500/20 dark:text-green-400">
                                  <Eye className="mr-1.5 h-4 w-4" />
                                  Visible
                                </span>
                              );
                            case "hidebyadmin":
                              return (
                                <span className="inline-flex items-center rounded-full border border-yellow-200 bg-yellow-100 px-3 py-1.5 text-xs font-semibold text-yellow-800 dark:border-yellow-500/30 dark:bg-yellow-500/20 dark:text-yellow-400">
                                  <EyeOff className="mr-1.5 h-4 w-4" />
                                  Hidden by Admin
                                </span>
                              );
                            case "hidebysuperadmin":
                              return (
                                <span className="inline-flex items-center rounded-full border border-red-200 bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-800 dark:border-red-500/30 dark:bg-red-500/20 dark:text-red-400">
                                  <EyeOff className="mr-1.5 h-4 w-4" />
                                  Hidden by Super Admin
                                </span>
                              );
                            default:
                              return (
                                <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-800 dark:border-gray-500/30 dark:bg-gray-500/20 dark:text-gray-400">
                                  <Info className="mr-1.5 h-4 w-4" />
                                  Unknown
                                </span>
                              );
                          }
                        })()}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-white">
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                          <span>{formatDate(rating.createdAt)}</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4  flex items-center gap-2  h-full ">
                        {rating.status === 'showtoeveryone' ? (
                          <button
                            onClick={() => handleHideRating(rating.id)}
                            disabled={actionLoading === rating.id}
                            className="inline-flex items-center rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <EyeOff className="mr-1 h-3.5 w-3.5" />
                            {actionLoading === rating.id ? 'Hiding...' : 'Hide'}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUnhideRating(rating.id)}
                            disabled={actionLoading === rating.id}
                            className="inline-flex items-center rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Eye className="mr-1 h-3.5 w-3.5" />
                            {actionLoading === rating.id ? 'Showing...' : 'Show'}
                          </button>
                        )}




                      
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Summary */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredRatings.length} of {ratings.length} total ratings
          </p>
        </div>
      </div>
    </div>
  );
}