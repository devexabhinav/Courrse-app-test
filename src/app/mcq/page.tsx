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
import { Pencil, Trash2 } from "lucide-react";
import { toasterSuccess } from "@/components/core/Toaster";
import { useRouter } from "next/navigation";
import { ToggleRight } from "lucide-react";
import { ToggleLeft } from "lucide-react";

export default function Mcq({ className }: any) {
  const router = useRouter()
  const [mcq, setMcq] = useState<any>([]);

  const fetchMcq = async () => {
    try {
      const res = await api.get("mcq");
      setMcq(res.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
    }
  };

  useEffect(() => {
    fetchMcq();
  }, []);

  const handleEdit = async (id: number) => {
    try {
      if (id) {
        router.push(`/mcq/edit-mcq?id=${id}`);
      }
    } catch (err) {
      console.error("Failed to fetch course details", err);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = confirm("Are you sure you want to delete this MCQ?");
    if (!confirmDelete) return;

    try {
      const response = await api.delete(`mcq/${id}`);
      if (response.success) {
        toasterSuccess("MCQ Deleted Successfully", 2000, "id")
      }
      await fetchMcq();

    } catch (error) {
      console.error("Failed to delete course:", error);
    }
  };
  const handleToggleStatus = async (id: number, newStatus: boolean) => {
    try {
      const res = await api.put(`course/${id}/status`, { is_active: newStatus });
      if (res.success) {
        toasterSuccess("Status updated successfully", 2000, "status");
        fetchMcq();
      } else {
        console.error(res.error);
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };
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
        <button onClick={() => router.push("/mcq/add-mcq")} className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition" >
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
            <TableHead>Creator Name</TableHead>
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
                <TableCell className="!text-left">{course.course?.title}</TableCell>
                <TableCell>{course.question}</TableCell>
                <TableCell>{course.answer}</TableCell>
                <TableCell className="flex items-center justify-center gap-2">
                 
                  <button
                    onClick={() => handleToggleStatus(course.id, !course.is_active)}
                    className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                    title="Change Status"
                  >
                    {course.is_active ? (
                      <ToggleRight className="w-10 h-8 text-green-600 group-hover:text-primary" />
                    ) : (
                      <ToggleLeft className="w-10 h-8 text-red-600 group-hover:text-primary" />
                    )}
                  </button>

                  {/* Tooltip */}
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    Change Status
                  </div>
                  {/* </div> */}
                </TableCell>
                <TableCell>{course.creator}</TableCell>
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
                No courses found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
