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
import { toasterError, toasterSuccess } from "@/components/core/Toaster";
import { useRouter } from "next/navigation";

export default function Chapters({ className }: any) {
  const router = useRouter();
  const [chapters, setChapters] = useState<any[]>([]);

  const fetchChapters = async () => {
    try {
      const res = await api.get("chapter/get-all-chapters");
      if(res.success){

        setChapters(res.data?.data || []);
      }
      else{
        
      }
    } catch (err) {
      console.error("Failed to fetch chapters:", err);
    }
  };

  useEffect(() => {
    fetchChapters();
  }, []);

  const handleEdit = (id: number) => {
    router.push(`/chapters/edit?id=${id}`);
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = confirm("Are you sure you want to delete this chapter?");
    if (!confirmDelete) return;

    try {
      const response = await api.delete(`chapter/${id}`);
      if (response.success) {
        toasterSuccess("Chapter Deleted Successfully", 3000, "id");
        await fetchChapters();
      }
      else{
        toasterError(response.error.code,3000,"id")
      }
    } catch (error) {
      console.error("Failed to delete chapter:", error);
    }
  };

  return (
    <div
      className={cn(
        "grid rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
          All Chapters List
        </h2>
        <button
          onClick={() => router.push("/chapters/add-chapter")}
          className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition"
        >
          Add Chapter
        </button>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-none uppercase [&>th]:text-center">
            <TableHead className="!text-left">Title</TableHead>
            <TableHead>Content</TableHead>
            <TableHead>Course ID</TableHead>
            <TableHead>Order</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {chapters.length > 0 ? (
            chapters.map((chapter: any) => (
              <TableRow
                className="text-center text-base font-medium text-dark dark:text-white"
                key={chapter.id}
              >
                <TableCell className="!text-left">{chapter.title}</TableCell>
                <TableCell>{chapter.content?.slice(0, 50)}...</TableCell>
                <TableCell>{chapter.course_id}</TableCell>
                <TableCell>{chapter.order}</TableCell>
                <TableCell>
                  {new Intl.DateTimeFormat("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                  }).format(new Date(chapter.createdAt))}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => handleEdit(chapter.id)}
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDelete(chapter.id)}
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
              <TableCell colSpan={6} className="text-center">
                No chapters found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
