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
import { Pencil, Trash2, ToggleRight, ToggleLeft } from "lucide-react";
import { toasterSuccess } from "@/components/core/Toaster";
import { useRouter, useSearchParams } from "next/navigation";

export default function Mcq({ className }: any) {
  const router = useRouter();
  const [mcq, setMcq] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const searchParams = useSearchParams();
  const courseId = searchParams.get("course_id");
  const courseName = searchParams.get("name");

  const fetchMcq = async () => {
    try {
      const res = await api.get(`mcq?page=${page}&limit=${limit}`);

      const mcqs = res.data?.data?.data || [];
      const total = res.data?.data?.pagination?.total || 0;

      setMcq(mcqs);
      setTotal(total);
    } catch (err) {
      console.error("Failed to fetch MCQs:", err);
    }
  };

  useEffect(() => {
    fetchMcq();
  }, [page]);

  const handleEdit = (id: number) => {
    router.push(`/mcq/edit-mcq?id=${id}`);
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = confirm("Are you sure you want to delete this MCQ?");
    if (!confirmDelete) return;

    try {
      const response = await api.delete(`mcq/${id}`);
      if (response.success) {
        toasterSuccess("MCQ Deleted Successfully", 2000, "id");
        fetchMcq(); // Refresh after delete
      }
    } catch (error) {
      console.error("Failed to delete MCQ:", error);
    }
  };

  const handleToggleStatus = async (id: number, newStatus: boolean) => {
    try {
      const res = await api.put(`mcq/${id}/status`, { is_active: newStatus });
      if (res.success) {
        toasterSuccess("Status updated successfully", 2000, "status");
        fetchMcq();
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div
      className={cn(
        "grid rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className,
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
          All MCQs List
        </h2>

        <button
          onClick={() =>
            router.push(`/chapters?course=${name}&course_id=${courseId}`)
          }
          className="w-full rounded-full bg-gray-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-gray-700 sm:w-auto"
        >
          ← Back to {name} Chapters
        </button>
        <button
          onClick={() => router.push("/mcq/add-mcq")}
          className="rounded-xl bg-green-500 px-4 py-2 text-white transition hover:bg-green-600"
        >
          Add MCQ
        </button>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-none uppercase [&>th]:text-center">
            <TableHead className="!text-left">Course</TableHead>
            <TableHead>Question</TableHead>
            <TableHead>Correct Answer</TableHead>
            <TableHead>Status</TableHead>
            {/* <TableHead>Creator Name</TableHead> */}
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {mcq.length > 0 ? (
            mcq.map((course: any) => (
              <TableRow
                className="text-center text-base font-medium text-dark dark:text-white"
                key={course.id}
              >
                <TableCell className="!text-left">
                  {course.course?.title}
                </TableCell>
                <TableCell>{course.question}</TableCell>
                <TableCell>{course.answer}</TableCell>
                <TableCell className="flex items-center justify-center gap-2">
                  <button
                    onClick={() =>
                      handleToggleStatus(course.id, !course.is_active)
                    }
                    className="rounded-full p-1 transition hover:bg-gray-200 dark:hover:bg-gray-700"
                    title="Change Status"
                  >
                    {course.is_active ? (
                      <ToggleRight className="h-8 w-10 text-green-600" />
                    ) : (
                      <ToggleLeft className="h-8 w-10 text-red-600" />
                    )}
                  </button>
                </TableCell>
                {/* <TableCell>{course.creator}</TableCell> */}
                <TableCell>
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
                <TableCell>
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
              <TableCell colSpan={7} className="text-center">
                No MCQs found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      <div className="mt-4 flex items-center justify-end gap-3">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="cursor-pointer rounded-xl border px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm">
          Page {page} of {totalPages || 1}
        </span>
        <button
          onClick={() =>
            setPage((prev) => (page < totalPages ? prev + 1 : prev))
          }
          disabled={page >= totalPages}
          className="cursor-pointer rounded-xl border px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
