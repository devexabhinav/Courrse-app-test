// app/user-panel/wishlist/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useWishlist, WishlistItem } from "@/hooks/useWishlist";
import {
  Heart,
  Trash2,
  Clock,
  Users,
  Star,
  Loader2,
  BookOpen,
  Play,
  Eye,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const Wishlist = () => {
  const { wishlist, loading, error, removeFromWishlist, fetchWishlist } =
    useWishlist();
  const [removingCourseId, setRemovingCourseId] = useState<number | null>(null);

  useEffect(() => {
    fetchWishlist();
  }, []); // Empty dependency array since fetchWishlist is now stable

  const handleRemoveFromWishlist = async (courseId: number) => {
    setRemovingCourseId(courseId);
    try {
      await removeFromWishlist(courseId);
    } finally {
      setRemovingCourseId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading && wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900">
        <div className="mx-auto max-w-6xl">
          <div className="flex h-64 items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <div className="text-lg text-gray-600 dark:text-gray-400">
                Loading your wishlist...
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              <div>
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-300">
                  Error loading wishlist
                </h3>
                <p className="mt-1 text-red-700 dark:text-red-400">{error}</p>
              </div>
            </div>
            <button
              onClick={() => fetchWishlist()}
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
                My Wishlist
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {wishlist.length} {wishlist.length === 1 ? "course" : "courses"}{" "}
                saved for later
              </p>
            </div>
            {wishlist.length > 0 && (
              <Link
                href="/user-panel/courses"
                className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
              >
                Browse More Courses
              </Link>
            )}
          </div>
        </div>

        {/* Wishlist Items */}
        {wishlist.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mx-auto max-w-md">
              <div className="mb-6 flex justify-center">
                <div className="rounded-full bg-gray-100 p-6 dark:bg-gray-800">
                  <Heart size={64} className="text-gray-400" />
                </div>
              </div>
              <h3 className="mb-3 text-2xl font-semibold text-gray-900 dark:text-white">
                Your wishlist is empty
              </h3>
              <p className="mb-8 text-gray-600 dark:text-gray-400">
                Start exploring courses and add them to your wishlist to save
                them for later!
              </p>
              <Link
                href="/user-panel/courses"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
              >
                <BookOpen className="h-5 w-5" />
                Browse Courses
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {wishlist.map((item: WishlistItem) => (
              <div
                key={item.id}
                className="overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:shadow-md dark:bg-gray-800"
              >
                {/* Course Image */}
                <div className="relative h-48 w-full">
                  {item.course.image ? (
                    <Image
                      src={item.course.image}
                      alt={item.course.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-gray-700">
                      <BookOpen className="h-12 w-12 text-gray-400" />
                    </div>
                  )}

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveFromWishlist(item.course.id)}
                    disabled={removingCourseId === item.course.id}
                    className="absolute right-3 top-3 rounded-full bg-white/90 p-2 shadow-md transition-all hover:bg-white hover:text-red-500 disabled:opacity-50 dark:bg-gray-800/90 dark:hover:bg-gray-700"
                    title="Remove from wishlist"
                  >
                    {removingCourseId === item.course.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>

                  {/* Course Status Badge */}
                  <div className="absolute left-3 top-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        item.course.status === "active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                      }`}
                    >
                      {item.course.status === "active"
                        ? "Available"
                        : "Coming Soon"}
                    </span>
                  </div>

                  {/* Price Badge */}
                  <div className="absolute left-3 top-10">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        item.course.price_type === "free"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      }`}
                    >
                      {item.course.price_type === "free"
                        ? "FREE"
                        : `$${item.course.price}`}
                    </span>
                  </div>
                </div>

                {/* Course Info */}
                <div className="p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {item.course.category || "Uncategorized"}
                    </span>
                    <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{item.course.ratings || "0.0"}</span>
                    </div>
                  </div>

                  <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-gray-900 dark:text-white">
                    {item.course.title}
                  </h3>

                  <p className="mb-4 line-clamp-3 text-sm text-gray-600 dark:text-gray-300">
                    {item.course.description || "No description available"}
                  </p>

                  {/* Course Meta */}
                  <div className="mb-4 space-y-2 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <Users className="mr-2 h-4 w-4" />
                      <span>By {item.course.creator}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      <span>{item.course.duration || "Self-paced"}</span>
                    </div>
                  </div>

                  {/* Course Stats */}
                  {item.course.has_chapters && (
                    <div className="mb-4 grid grid-cols-3 gap-2 text-xs text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        <span>{item.course.totalChapters || 0} chapters</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Play className="h-3 w-3" />
                        <span>{item.course.totalLessons || 0} lessons</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>
                          {item.course.enrollment_count || 0} enrolled
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Added {formatDate(item.createdAt)}
                    </div>

                    {item.course.status === "active" &&
                    item.course.has_chapters ? (
                      <Link
                        href={`/user-panel/courses/CourseEnrollment/${item.course.id}`}
                        className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                      >
                        <Eye className="h-4 w-4" />
                        View Details
                      </Link>
                    ) : (
                      <button
                        disabled
                        className="flex items-center gap-2 rounded-lg bg-gray-300 px-4 py-2 text-sm font-medium text-gray-500 dark:bg-gray-600 dark:text-gray-400"
                      >
                        <AlertCircle className="h-4 w-4" />
                        {!item.course.has_chapters
                          ? "Preparing"
                          : "Coming Soon"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
