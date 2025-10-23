"use client";

import { cn } from "@/lib/utils";
import api from "@/lib/api";
import { useEffect, useState } from "react";
import { Pencil, SearchIcon, Trash2, Calendar, User, Tag } from "lucide-react";
import { toasterSuccess } from "@/components/core/Toaster";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Image from "next/image";

export default function Courses({ className }: any) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [courses, setCourses] = useState([]);
  const [role, setRole] = useState<string | undefined>();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCourses, setTotalCourses] = useState(0);
  const [limit] = useState(3); // Changed from 8 to 3 courses per page

  const fetchCourses = async () => {
    try {
      const query = new URLSearchParams();
      query.append("page", String(page));
      query.append("limit", String(limit));
      if (search) query.append("search", search);

      // Check user role and call appropriate API
      const userRole = Cookies.get("role");
      let apiEndpoint = "";

      if (userRole === "user") {
        // For users, only fetch active courses
        apiEndpoint = `course/courses/active?${query.toString()}`;
      } else {
        // For admins, use the existing endpoint with status filter
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
    }
  };

  useEffect(() => {
    fetchCourses();
    setRole(Cookies.get("role"));
  }, [search, statusFilter, page]);

  const handleEdit = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); // Prevent triggering the card click
    try {
      if (id) {
        router.push(`/admin/courses/edit-course?id=${id}`);
      }
    } catch (err) {
      console.error("Failed to fetch course details", err);
    }
  };

  const handleCourseClick = (id: number) => {
    router.push(`/user-panel/courses/CourseEnrollment/${id}`);
  };

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); // Prevent triggering the card click
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
    e.stopPropagation(); // Prevent triggering the card click
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
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const isUser = role === "user";

  // Generate pagination buttons
  const generatePaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => setPage(i)}
          className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium ${
            page === i
              ? "bg-blue-600 text-white"
              : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
          }`}
        >
          {i}
        </button>,
      );
    }

    return buttons;
  };

  return (
    <div
      className={cn(
        "rounded-[10px] bg-white px-6 pb-6 pt-6 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className,
      )}
    >
      {/* Header Section */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            All Courses
          </h2>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Discover and manage your learning journey
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
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
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.length > 0 ? (
          courses
            .filter((course: any) => course.totalChapters > 0)
            .map((course: any) => (
              <div
                key={course.id}
                className="group relative cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
                onClick={() => handleCourseClick(course.id)}
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
                      <Tag className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Course Content */}
                <div className="p-5">
                  {/* Category */}
                  <div className="mb-2">
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      <Tag className="mr-1 h-3 w-3" />
                      {course.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-gray-900 dark:text-white">
                    {course.title}
                  </h3>

                  {/* Description */}
                  <p className="mb-4 line-clamp-3 text-sm text-gray-600 dark:text-gray-300">
                    {truncateText(course.description.replace(/✅/g, ""), 100)}
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
                  </div>

                  {/* Action Buttons */}
                  {!isUser && (
                    <div className="flex items-center justify-between">
                      <button
                        onClick={(e) => handleEdit(e, course.id)}
                        className="flex items-center rounded-lg bg-blue-100 px-3 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800"
                      >
                        <Pencil className="mr-1 h-4 w-4" />
                        Edit
                      </button>
                      <button
                        onClick={(e) => handleDelete(e, course.id)}
                        className="flex items-center rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800"
                      >
                        <Trash2 className="mr-1 h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
        ) : (
          <div className="col-span-full py-12 text-center">
            <div className="mx-auto max-w-md">
              <div className="mb-4 rounded-full bg-gray-100 p-4 dark:bg-gray-800">
                <SearchIcon className="mx-auto h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                No courses found
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {search
                  ? "Try adjusting your search terms"
                  : "No courses available at the moment"}
              </p>
            </div>
          </div>
        )}
      </div>

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
