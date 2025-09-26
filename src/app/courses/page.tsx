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
import api from "@/lib/api";
import { useEffect, useState } from "react";
import { Pencil, SearchIcon, Trash2 } from "lucide-react";
import { toasterSuccess } from "@/components/core/Toaster";
import { useRouter } from "next/navigation";
import { ToggleRight } from "lucide-react";
import { ToggleLeft } from "lucide-react";

export default function Courses({ className }: any) {
  const router = useRouter()
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [courses, setCourses] = useState([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(5);

  const fetchCourses = async () => {
    try {
      const query = new URLSearchParams();
      query.append("page", String(page));
      query.append("limit", String(limit));
      if (search) query.append("search", search);
      if (statusFilter === "active") query.append("active", "true");
      if (statusFilter === "inactive") query.append("active", "false");

      const res = await api.get(`course/list?${query.toString()}`);
      if (res.success) {
        setCourses(res?.data?.data?.courses || []);
        setTotalPages(res.data?.data?.totalPages || 1);
      }
    } catch (err) {
      console.error("Failed to fetch courses:", err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [search, statusFilter, page]);

  const handleEdit = async (id: number) => {
    try {
      if (id) {
        router.push(`/courses/edit-course?id=${id}`);
      }
    } catch (err) {
      console.error("Failed to fetch course details", err);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = confirm("Are you sure you want to delete this course?");
    if (!confirmDelete) return;

    try {
      const response = await api.delete(`course/${id}`);
      if (response.success) {
        toasterSuccess("Course Deleted Successfully", 2000, "id")
      }
      await fetchCourses();

    } catch (error) {
      console.log("Failed to delete course:", error);
    }
  };
  const handleToggleStatus = async (id: number, newStatus: boolean) => {
    try {
      const res = await api.put(`course/${id}/status`, { is_active: newStatus });
      if (res.success) {
        toasterSuccess("Status updated successfully", 2000, "status");
        fetchCourses();
      } else {
        console.log(res);
         toasterSuccess("Add chapter then you can active this course", 2000, "status");
      }
    } catch (err) {
      console.log("Failed to update status", err);
    }
  };
  return (
    <div
      className={cn(
        "grid rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className,
      )}
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Heading */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          All Courses List
        </h2>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
          {/* Status Filter Dropdown */}
          <div className="relative w-full sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "inactive")}
              className="w-full appearance-none rounded-full border border-gray-300 bg-gray-50 py-2 px-4 text-sm text-gray-700 shadow-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            >
              <option value="all">All Courses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              ▼
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-[300px]">
            <input
              type="search"
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full border border-gray-300 bg-gray-50 py-2.5 pl-12 pr-4 text-sm text-gray-900 shadow-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
            />
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
          </div>

          {/* Add Course Button */}
          <button
            onClick={() => router.push("/courses/add-courses")}
            className="w-full sm:w-auto rounded-full bg-green-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-green-700"
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
                className="text-center text-base font-medium text-dark dark:text-white"
                key={course.id}
              >
                {/* Title */}
                <TableCell className="!text-left align-top py-6">
                  <span className="font-semibold">{course.title}</span>
                </TableCell>

                {/* Description with clean multi-line formatting */}
                <TableCell className="text-left align-top py-6 whitespace-pre-line">
                  <div className="text-sm leading-6 text-gray-700 dark:text-gray-300">
                    {course.description.split('\n').map((line: any, idx: any) => (
                      <div key={idx} className="flex items-start gap-2">
                        {line.trim().startsWith("✅") && (
                          <span className="text-green-500">✅</span>
                        )}
                        <span>{line.replace(/^✅\s*/, "")}</span>
                      </div>
                    ))}
                  </div>
                </TableCell>

                {/* Category */}
                <TableCell className="align-top py-6">{course.category}</TableCell>

                {/* Status Toggle */}
                <TableCell className="align-top py-6">
                  <div className="flex items-center justify-center">
                    <button
                      onClick={() => handleToggleStatus(course.id, !course.is_active)}
                      className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                      title="Change Status"
                    >
                      {course.is_active ? (
                        <ToggleRight className="w-10 h-8 text-green-600" />
                      ) : (
                        <ToggleLeft className="w-10 h-8 text-red-600" />
                      )}
                    </button>
                  </div>
                </TableCell>

                {/* Creator */}
                <TableCell className="align-top py-6">{course.creator}</TableCell>
                <TableCell className="align-top py-6">
                  {course.image ? (
                    <img
                      src={course.image}
                      alt={course.title}
                      className="h-16 w-24 object-cover rounded-md border"
                    />
                  ) : (
                    <span className="text-gray-500">---</span>
                  )}
                </TableCell>

                {/* Created At */}
                <TableCell className="align-top py-6">
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

                {/* Actions */}
                <TableCell className="align-top py-6">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => handleEdit(course.id)}
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDelete(course.id)}
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
              <TableCell colSpan={7} className="text-center py-8">
                No courses found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>

      </Table>

      {courses.length > 0 && (

        <div className="mt-6 flex justify-end items-center gap-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            className="cursor-pointer px-4 py-2 bg-gray-200 disabled:cursor-not-allowed rounded-xl disabled:opacity-50 dark:bg-gray-700 dark:text-white"
          >
            Previous
          </button>
          <span className="text-sm text-gray-800 dark:text-white">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            className="cursor-pointer px-4 py-2 disabled:cursor-not-allowed  bg-gray-200 rounded-xl disabled:opacity-50 dark:bg-gray-700 dark:text-white"
          >
            Next
          </button>
        </div>)}
    </div>
  );
}
