"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Pencil, SearchIcon, Trash2 } from "lucide-react";
import { toasterError, toasterSuccess } from "@/components/core/Toaster";
import { useRouter } from "next/navigation";
import { ToggleRight } from "lucide-react";
import { ToggleLeft } from "lucide-react";
import { useApiClient } from "@/lib/api";

export default function Courses({ className }: any) {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [courses, setCourses] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(5);
  const api = useApiClient();
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  useEffect(() => {
    fetchCourses();
  }, [page, search, statusFilter]);

  const fetchCourses = async () => {
    try {
      const query = new URLSearchParams();

      if (search) query.append("search", search);
      if (statusFilter === "active") query.append("active", "true");
      if (statusFilter === "inactive") query.append("active", "false");
      query.append("page", page.toString());
      query.append("limit", limit.toString());
      const url = `course/list?${query.toString()}`;
      const res = await api.get(url);
      if (res.success) {
        setCourses(res.data?.data?.courses || []);
        setTotalPages(res.data?.data?.totalPages || 1);
      }
    } catch (err) {
      console.error("Failed to fetch courses:", err);
    }
  };

  const handleEdit = async (id: number) => {
    try {
      if (id) {
        router.push(`/admin/courses/edit-course?id=${id}`);
      }
    } catch (err) {
      console.error("Failed to fetch course details", err);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this course?",
    );
    if (!confirmDelete) return;

    try {
      const response = await api.delete(`course/${id}`);
      if (response.success) {
        toasterSuccess("Course Deleted Successfully", 2000, "id");

        if (courses.length === 1 && page > 1) {
          setPage((prev) => prev - 1);
        } else {
          fetchCourses();
        }
      }
    } catch (error) {
      console.log("Failed to delete course:", error);
      toasterError("Failed to delete course");
    }
  };

  const handleToggleStatus = async (id: number, newStatus: boolean) => {
    try {
      const res = await api.put(`course/${id}/status`, {
        is_active: newStatus,
      });

      if (res.success) {
        toasterSuccess("Status updated successfully", 2000, "id");
        fetchCourses();
      } else {
        toasterError(
          "Add chapter then you can active this course",
          3000,
          "status",
        );
      }
    } catch (err) {
      console.log("🚨 Failed to update status", err);
      toasterError("Failed to update status");
    }
  };

  return (
    <div
      className={cn(
        "grid overflow-auto rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className,
      )}
    >
      <div className="mobile-buttons mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Heading */}
        <h2 className="list text-center text-xl font-bold text-gray-900 dark:text-white">
          All Courses List
        </h2>

        {/* Controls Section */}
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-nowrap sm:items-center">
          {/* Filter Dropdown */}
          <div className="relative w-full sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as "all" | "active" | "inactive")
              }
              className="active-btn w-full appearance-none rounded-full border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-700 shadow-sm outline-none focus:border-[#02517b] focus:ring-1 focus:ring-[#02517b] dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            >
              <option value="all">All Courses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              ▼
            </div>
          </div>

          {/* Search Input */}
          <div className="relative">
            <input
              type="search"
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full border border-gray-300 bg-gray-50 py-2.5 pl-12 pr-4 text-sm text-gray-900 shadow-sm outline-none focus:border-[#02517b] focus:ring-1 focus:ring-[#02517b] dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
            />
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
          </div>

          {/* Add Course Button */}
          <button
            onClick={() => router.push("/admin/courses/add-courses")}
            className="w-full rounded-full bg-[#02517b] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#013d5b] sm:w-auto"
          >
            + Add Course
          </button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-none uppercase [&>th]:text-center">
            <TableHead className="!text-left">Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Creator Name</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {courses.length > 0 ? (
            courses.map((course: any) => (
              <TableRow
                onClick={() =>
                  router.push(
                    `/admin/chapters?course=${course.title}&course_id=${course.id}`,
                  )
                }
                className="cursor-pointer text-center text-base font-medium text-dark dark:text-white"
                key={course.id}
              >
                {/* Title */}
                <TableCell className="py-6 !text-left">
                  <span className="font-medium">{course.title}</span>
                </TableCell>

                <TableCell className="whitespace-pre-line py-2 text-left">
                  <div className="text-center text-sm leading-6 text-gray-700 dark:text-gray-300">
                    {course.description.length > 50
                      ? course.description.slice(0, 100) + "..."
                      : course.description}
                  </div>
                </TableCell>

                <TableCell className="py-2">{course.category}</TableCell>

                <TableCell className="py-2">
                  <div className="flex items-center justify-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleStatus(course.id, !course.is_active);
                      }}
                      className="rounded-full p-1 transition dark:hover:bg-gray-700"
                      title="Change Status"
                    >
                      {course.is_active ? (
                        <ToggleRight className="h-8 w-10 text-[#02517b]" />
                      ) : (
                        <ToggleLeft className="h-8 w-10 text-red-600" />
                      )}
                    </button>
                  </div>
                </TableCell>

                {/* Creator */}
                <TableCell className="py-2">{course.creator}</TableCell>
                <TableCell className="py-2">
                  {course.image ? (
                    <img
                      src={course.image}
                      alt={course.title}
                      className="h-16 w-24 rounded-md border object-contain"
                    />
                  ) : (
                    <span className="text-gray-500">---</span>
                  )}
                </TableCell>

                <TableCell className="py-2">
                  {new Intl.DateTimeFormat("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                  }).format(new Date(course.createdAt))}
                </TableCell>

                <TableCell className="py-2">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(course.id);
                      }}
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(course.id);
                      }}
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="py-8 text-center">
                No courses found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {courses.length > 0 && (
        <div className="mt-6 flex items-center justify-end gap-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            className="cursor-pointer rounded-xl bg-gray-200 px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:text-white"
          >
            Previous
          </button>
          <span className="text-sm text-gray-800 dark:text-white">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            className="cursor-pointer rounded-xl bg-gray-200 px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:text-white"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
