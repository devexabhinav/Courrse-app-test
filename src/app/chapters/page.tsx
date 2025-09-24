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
import { toasterError, toasterSuccess } from "@/components/core/Toaster";
import { useRouter, useSearchParams } from "next/navigation";

export default function Chapters({ className }: any) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [chapters, setChapters] = useState<any[]>([]);
  const [showMediaModal, setShowMediaModal] = useState<any>(false);
  const [activeMedia, setActiveMedia] = useState<any>({ type: "image", items: [] });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(5);



  const searchParams = useSearchParams();
  const courseId = searchParams.get("course_id");

  console.log("dwsdqwedrfewrf", courseId)

  const fetchChapters = async (course_id: string) => {
    try {
      const query = new URLSearchParams();
      query.append("courseId", String(page));
      query.append("page", String(page));
      query.append("limit", String(limit));
      if (search) query.append("search", search);



      const res = await api.get(`chapter/course/?course_id=${course_id}`);

      console.log("📥 API Response:", res.data?.data?.data?.chapters);

      if (res.success) {
        setChapters(res.data?.data?.data?.chapters);
        setTotalPages(res.data?.data?.pagination?.totalPages || 1);
      }
    } catch (err) {
      console.error("❌ Failed to fetch chapters:", err);
    }
  };



  useEffect(() => {
    if (courseId) {

      fetchChapters(courseId);
    }
  }, [page, search, courseId]);

  const handleEdit = (id: number) => {
    router.push(`/chapters/edit-chapters?id=${id}`);
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = confirm("Are you sure you want to delete this chapter?");
    if (!confirmDelete) return;

    try {
      const response = await api.delete(`chapter/${id}`);
      if (response.success) {
        toasterSuccess("Chapter Deleted Successfully", 3000, "id");
        if (courseId) {
          await fetchChapters(courseId);
        }
      }
      else {
        toasterError(response.error.code, 3000, "id")
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
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">


          {/* Search Bar */}
          <div className="relative w-full sm:w-[300px]">
            <input
              type="search"
              placeholder="Search Chapters ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full border border-gray-300 bg-gray-50 py-2.5 pl-12 pr-4 text-sm text-gray-900 shadow-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
            />
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
          </div>

          {/* Add Course Button */}
          <button
            onClick={() => router.push(`/chapters/add-chapters?course_id=${courseId}`)}
            className="w-full sm:w-auto rounded-full bg-green-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-green-700"
          >
            + Add Chapter
          </button>
        </div>
      </div>
      {showMediaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 px-4">
          <div
            className={cn(
              "relative max-h-[90vh] overflow-y-auto rounded-lg bg-white p-6 dark:bg-gray-800",
              activeMedia.items.length === 1 ? "w-auto" : "w-[90vw]"
            )}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowMediaModal(false)}
              className="absolute right-4 top-4 text-xl font-bold text-red-500"
            >
              ✕
            </button>

            <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">
              {activeMedia.type === "image" ? "Chapter Image" : "Chapter Video"}
            </h3>

            <div
              className={cn(
                "grid gap-4 mx-auto", // center and space items
                activeMedia.items.length <= 1
                  ? "grid-cols-1"
                  : activeMedia.items.length === 2
                    ? "grid-cols-2"
                    : activeMedia.items.length === 3
                      ? "grid-cols-3"
                      : activeMedia.items.length === 4
                        ? "grid-cols-4"
                        : activeMedia.items.length === 5
                          ? "grid-cols-5"
                          : "grid-cols-6"
              )}
              style={{
                maxWidth: "fit-content",
              }}
            >
              {activeMedia.items.map((url: any, idx: any) => {
                if (!url) return null;

                return activeMedia.type === "image" ? (
                  <a
                    key={idx}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={url}
                      alt={`media-${idx}`}
                      className={cn(
                        "rounded border object-contain cursor-pointer",
                        activeMedia.items.length === 1
                          ? "h-auto max-h-[70vh] w-auto max-w-full"
                          : "h-32 w-48"
                      )}
                    />
                  </a>
                ) : (
                  <video
                    key={idx}
                    src={url}
                    controls
                    className={cn(
                      "rounded border object-contain",
                      activeMedia.items.length === 1
                        ? "h-auto max-h-[70vh] w-auto max-w-full"
                        : "h-32 w-48"
                    )}
                  />
                );
              })}

            </div>
          </div>
        </div>
      )}


      <Table>
        <TableHeader>
          <TableRow className="border-none uppercase [&>th]:text-center">
            <TableHead className="!text-left">Title</TableHead>
            <TableHead>Content</TableHead>
            <TableHead>Course Name</TableHead>
            <TableHead>Order</TableHead>
            <TableHead>Images</TableHead>
            <TableHead>Videos</TableHead>
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
                <TableCell>{chapter.title}</TableCell>
                <TableCell>{chapter.order}</TableCell>

                <TableCell className="text-center">
                  {chapter.images?.length > 0 ? (
                    <button
                      className="text-blue-600 underline"
                      onClick={() => {
                        setActiveMedia({ type: "image", items: chapter.images });
                        setShowMediaModal(true);
                      }}
                    >
                      View Images
                    </button>
                  ) : (
                    <span>---</span>
                  )}
                </TableCell>

                <TableCell className="text-center">
                  {chapter.videos?.length > 0 ? (
                    <button
                      className="text-green-600 underline"
                      onClick={() => {
                        setActiveMedia({ type: "video", items: chapter.videos })
                        setShowMediaModal(true);
                      }
                      }
                    >
                      View Videos
                    </button>
                  ) : (
                    <span>---</span>
                  )}
                </TableCell>
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
              <TableCell colSpan={8} className="text-center">
                No chapters found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {

        chapters.length > 0 && (
          <>
            <div className="mt-6 flex justify-end items-center gap-4">
              <button
                disabled={page === 1}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                className="cursor-pointer px-4 py-2 bg-gray-200 rounded-xl disabled:opacity-50 dark:bg-gray-700 dark:text-white"
              >
                Previous
              </button>
              <span className="text-sm text-gray-800 dark:text-white">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                className="cursor-pointer px-4 py-2 bg-gray-200 rounded-xl disabled:opacity-50 dark:bg-gray-700 dark:text-white"
              >
                Next
              </button>
            </div>
          </>
        )
      }

    </div>
  );
}
