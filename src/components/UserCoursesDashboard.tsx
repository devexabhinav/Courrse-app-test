"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import {
  Pencil,
  SearchIcon,
  Trash2,
  Calendar,
  User,
  Tag,
  Play,
  Clock,
  Star,
  Users,
  BookOpen,
  Award,
  Target,
  BarChart3,
  Filter,
  Eye,
} from "lucide-react";
import { toasterSuccess } from "@/components/core/Toaster";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getDecryptedItem } from "@/utils/storageHelper";
import { useApiClient } from "@/lib/api";

export default function Courses({ className }: any) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [role, setRole] = useState<any>();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCourses, setTotalCourses] = useState(0);
  const [limit] = useState(6);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState({
    totalEnrolled: 0,
    completedCourses: 0,
    learningTime: 0,
    currentStreak: 0,
  });
  const api = useApiClient();

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams();
      query.append("page", String(page));
      query.append("limit", String(limit));
      if (search) query.append("search", search);
      if (categoryFilter !== "all") query.append("category", categoryFilter);

      // Add sorting
      if (sortBy === "newest") query.append("sort", "-createdAt");
      if (sortBy === "oldest") query.append("sort", "createdAt");
      if (sortBy === "popular") query.append("sort", "-enrollmentCount");

      const userRole = getDecryptedItem("role");
      let apiEndpoint = "";

      if (userRole === "user") {
        apiEndpoint = `course/courses/active?${query.toString()}`;

        // Fetch user-specific data
        await fetchUserData();
      } else {
        if (statusFilter === "active") query.append("active", "true");
        if (statusFilter === "inactive") query.append("active", "false");
        apiEndpoint = `course/courses?${query.toString()}`;
      }

      const res = await api.get(apiEndpoint);
      if (res.success) {
        setCourses(res?.data?.data?.courses || []);
        setTotalPages(res.data?.data?.totalPages || 1);
        setTotalCourses(res.data?.data?.total || 0);
      }
    } catch (err) {
      console.error("Failed to fetch courses:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async () => {
    try {
      // Fetch user enrolled courses
      const enrolledRes = await api.get("user/enrolled-courses");
      if (enrolledRes.success) {
        setEnrolledCourses(enrolledRes.data?.data || []);
      }

      // Fetch user statistics
      const statsRes = await api.get("user/learning-stats");
      if (statsRes.success) {
        setUserStats(statsRes.data?.data || userStats);
      }

      // Fetch categories
      const categoriesRes = await api.get("course/categories");
      if (categoriesRes.success) {
        setCategories(categoriesRes.data?.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch user data:", err);
    }
  };

  useEffect(() => {
    fetchCourses();
    setRole(getDecryptedItem("role"));
  }, [search, statusFilter, categoryFilter, sortBy, page]);

  const handleEdit = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    try {
      if (id) {
        router.push(`/admin/courses/edit-course?id=${id}`);
      }
    } catch (err) {
      console.error("Failed to fetch course details", err);
    }
  };

  const handleCourseClick = (id: number) => {
    if (isUser) {
      // Check if user is enrolled in this course
      const isEnrolled = enrolledCourses.some(
        (course: any) => course.courseId === id,
      );
      if (isEnrolled) {
        router.push(`/user-panel/courses/learn/${id}`);
      } else {
        router.push(`/user-panel/courses/CourseEnrollment/${id}`);
      }
    } else {
      router.push(`/admin/courses/${id}`);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    const confirmDelete = confirm(
      "Are you sure you want to delete this course?",
    );
    if (!confirmDelete) return;

    try {
      const response = await api.delete(`course/${id}`);
      if (response.success) {
        toasterSuccess("Course Deleted Successfully", 2000, "id");
      }
      await fetchCourses();
    } catch (error) {
      console.error("Failed to delete course:", error);
    }
  };

  const handleToggleStatus = async (
    e: React.MouseEvent,
    id: number,
    newStatus: boolean,
  ) => {
    e.stopPropagation();
    try {
      const res = await api.put(`course/${id}/status`, {
        is_active: newStatus,
      });
      if (res.success) {
        toasterSuccess("Status updated successfully", 2000, "status");
        fetchCourses();
      } else {
        console.error(res.error);
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const getCourseProgress = (courseId: number) => {
    const enrolledCourse: any = enrolledCourses.find(
      (course: any) => course.courseId === courseId,
    );
    return enrolledCourse ? enrolledCourse.progress || 0 : 0;
  };

  const isUser = role === "user";
  const isAdmin = role === "admin";

  // Generate pagination buttons
  const generatePaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => setPage(i)}
          className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
            page === i
              ? "bg-blue-600 text-white shadow-sm"
              : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
          }`}
        >
          {i}
        </button>,
      );
    }

    return buttons;
  };

  // Quick stats for admin
  const adminStats = [
    {
      title: "Total Courses",
      value: totalCourses,
      icon: BookOpen,
      color: "blue",
    },
    {
      title: "Active Courses",
      value: courses.filter((course: any) => course.is_active).length,
      icon: Target,
      color: "green",
    },
    {
      title: "Categories",
      value: categories.length,
      icon: Tag,
      color: "purple",
    },
  ];

  if (loading) {
    return (
      <div
        className={cn(
          "rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark",
          className,
        )}
      >
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <p className="mt-3 text-gray-600 dark:text-gray-400">
              Loading courses...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-[10px] bg-white px-6 pb-6 pt-6 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className,
      )}
    >
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isUser ? "Explore Courses" : "Course Management"}
            </h2>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              {isUser
                ? "Discover new skills and continue your learning journey"
                : "Manage and monitor all courses in the platform"}
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={() => router.push("/admin/courses/create-course")}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              <Pencil className="h-4 w-4" />
              Create Course
            </button>
          )}
        </div>

        {/* User Stats Section */}
        {isUser && enrolledCourses.length > 0 && (
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-800">
                  <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {userStats.totalEnrolled}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Enrolled
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-green-100 p-2 dark:bg-green-800">
                  <Award className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {userStats.completedCourses}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Completed
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-purple-100 p-2 dark:bg-purple-800">
                  <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {Math.floor(userStats.learningTime / 60)}h
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Learning
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-lg bg-orange-50 p-4 dark:bg-orange-900/20">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-orange-100 p-2 dark:bg-orange-800">
                  <Target className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {userStats.currentStreak}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Day Streak
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Admin Stats Section */}
        {isAdmin && (
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
            {adminStats.map((stat, index) => (
              <div
                key={index}
                className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`rounded-full bg-${stat.color}-100 p-2 dark:bg-${stat.color}-800`}
                  >
                    <stat.icon
                      className={`h-5 w-5 text-${stat.color}-600 dark:text-${stat.color}-400`}
                    />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {stat.title}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Filters and Controls */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
            />
          </div>

          {/* Category Filter */}
          {categories.length > 0 && (
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            >
              <option value="all">All Categories</option>
              {categories.map((category: any) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          )}

          {/* Status Filter for Admin */}
          {isAdmin && (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          )}

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`rounded-lg p-2 ${
              viewMode === "grid"
                ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400"
                : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            }`}
          >
            <div className="grid h-4 w-4 grid-cols-2 gap-0.5">
              <div className="rounded-sm bg-current"></div>
              <div className="rounded-sm bg-current"></div>
              <div className="rounded-sm bg-current"></div>
              <div className="rounded-sm bg-current"></div>
            </div>
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`rounded-lg p-2 ${
              viewMode === "list"
                ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400"
                : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            }`}
          >
            <div className="flex h-4 w-4 flex-col gap-0.5">
              <div className="h-1 rounded-sm bg-current"></div>
              <div className="h-1 rounded-sm bg-current"></div>
              <div className="h-1 rounded-sm bg-current"></div>
            </div>
          </button>
        </div>
      </div>

      {/* Courses Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.length > 0 ? (
            courses
              .filter((course: any) => course.totalChapters > 0)
              .map((course: any) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  isUser={isUser}
                  isEnrolled={enrolledCourses.some(
                    (ec: any) => ec.courseId === course.id,
                  )}
                  progress={getCourseProgress(course.id)}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onClick={handleCourseClick}
                  formatDate={formatDate}
                  truncateText={truncateText}
                />
              ))
          ) : (
            <EmptyState search={search} isUser={isUser} />
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {courses.length > 0 ? (
            courses
              .filter((course: any) => course.totalChapters > 0)
              .map((course: any) => (
                <CourseListItem
                  key={course.id}
                  course={course}
                  isUser={isUser}
                  isEnrolled={enrolledCourses.some(
                    (ec: any) => ec.courseId === course.id,
                  )}
                  progress={getCourseProgress(course.id)}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onClick={handleCourseClick}
                  formatDate={formatDate}
                  truncateText={truncateText}
                />
              ))
          ) : (
            <EmptyState search={search} isUser={isUser} />
          )}
        </div>
      )}

      {/* Pagination */}
      {courses.length > 0 && (
        <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {courses.length} of {totalCourses} courses
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={page == 1}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              className="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
            >
              Previous
            </button>
            <div className="flex items-center gap-1">
              {generatePaginationButtons()}
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
      )}
    </div>
  );
}

// Enhanced Course Card Component
const CourseCard = ({
  course,
  isUser,
  isEnrolled,
  progress,
  onEdit,
  onDelete,
  onClick,
  formatDate,
  truncateText,
}: any) => (
  <div
    className="group relative cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
    onClick={() => onClick(course.id)}
  >
    {/* Course Image */}
    <div className="relative h-48 w-full overflow-hidden">
      {course.image ? (
        <Image
          src={course.image}
          alt={course.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-gray-700">
          <BookOpen className="h-12 w-12 text-gray-400" />
        </div>
      )}

      {/* Progress Bar for enrolled users */}
      {isUser && isEnrolled && (
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-200 dark:bg-gray-700">
          <div
            className="h-full bg-green-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Status Badges */}
      <div className="absolute left-3 top-3 flex flex-col gap-2">
        {!course.is_active && (
          <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-200">
            Inactive
          </span>
        )}
        {isEnrolled && (
          <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            Enrolled
          </span>
        )}
      </div>

      {/* Action Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-0 transition-all duration-300 group-hover:bg-opacity-20" />
    </div>

    {/* Course Content */}
    <div className="p-5">
      {/* Category and Rating */}
      <div className="mb-2 flex items-center justify-between">
        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          <Tag className="mr-1 h-3 w-3" />
          {course.category}
        </span>
        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          <span>4.5</span>
        </div>
      </div>

      {/* Title */}
      <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-gray-900 dark:text-white">
        {course.title}
      </h3>

      {/* Description */}
      <p className="mb-4 line-clamp-3 text-sm text-gray-600 dark:text-gray-300">
        {truncateText(
          course.description?.replace(/✅/g, "") || "No description available",
          100,
        )}
      </p>

      {/* Meta Information */}
      <div className="mb-4 space-y-2 text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center">
          <User className="mr-2 h-4 w-4" />
          <span>{course.creator}</span>
        </div>
        <div className="flex items-center">
          <Calendar className="mr-2 h-4 w-4" />
          <span>{formatDate(course.createdAt)}</span>
        </div>
        {course.duration && (
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            <span>{course.duration}</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        {isUser ? (
          <button
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              isEnrolled
                ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isEnrolled ? (
              <>
                <Play className="h-4 w-4" />
                Continue
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                View Details
              </>
            )}
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => onEdit(e, course.id)}
              className="flex items-center rounded-lg bg-blue-100 px-3 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800"
            >
              <Pencil className="mr-1 h-4 w-4" />
              Edit
            </button>
            <button
              onClick={(e) => onDelete(e, course.id)}
              className="flex items-center rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800"
            >
              <Trash2 className="mr-1 h-4 w-4" />
              Delete
            </button>
          </div>
        )}

        {isUser && isEnrolled && (
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {progress}%
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Complete
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

// Course List Item Component
const CourseListItem = ({
  course,
  isUser,
  isEnrolled,
  progress,
  onEdit,
  onDelete,
  onClick,
  formatDate,
  truncateText,
}: any) => (
  <div
    className="group flex cursor-pointer items-start gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
    onClick={() => onClick(course.id)}
  >
    {/* Course Image */}
    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg">
      {course.image ? (
        <Image
          src={course.image}
          alt={course.title}
          fill
          className="object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-gray-700">
          <BookOpen className="h-8 w-8 text-gray-400" />
        </div>
      )}
    </div>

    {/* Course Content */}
    <div className="min-w-0 flex-1">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-3">
            <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {course.category}
            </span>
            {!course.is_active && (
              <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-200">
                Inactive
              </span>
            )}
            {isEnrolled && (
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                Enrolled
              </span>
            )}
          </div>

          <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
            {course.title}
          </h3>

          <p className="mb-3 text-sm text-gray-600 dark:text-gray-300">
            {truncateText(
              course.description?.replace(/✅/g, "") ||
                "No description available",
              150,
            )}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{course.creator}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(course.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>4.5</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {isUser ? (
            <button
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                isEnrolled
                  ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {isEnrolled ? (
                <>
                  <Play className="h-4 w-4" />
                  Continue
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  View
                </>
              )}
            </button>
          ) : (
            <>
              <button
                onClick={(e) => onEdit(e, course.id)}
                className="rounded-lg bg-blue-100 p-2 text-blue-700 transition-colors hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={(e) => onDelete(e, course.id)}
                className="rounded-lg bg-red-100 p-2 text-red-700 transition-colors hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Progress Bar for enrolled users */}
      {isUser && isEnrolled && (
        <div className="mt-3">
          <div className="mb-1 flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Progress</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {progress}%
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-2 rounded-full bg-green-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  </div>
);

// Empty State Component
const EmptyState = ({ search, isUser }: any) => (
  <div className="col-span-full py-12 text-center">
    <div className="mx-auto max-w-md">
      <div className="mb-4 rounded-full bg-gray-100 p-4 dark:bg-gray-800">
        <SearchIcon className="mx-auto h-12 w-12 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
        {search ? "No courses found" : "No courses available"}
      </h3>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        {search
          ? "Try adjusting your search terms or filters"
          : isUser
            ? "Check back later for new courses"
            : "Create your first course to get started"}
      </p>
    </div>
  </div>
);
