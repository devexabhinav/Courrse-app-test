"use client";

import api from "@/lib/api";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InputGroup from "@/components/FormElements/InputGroup";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { toasterError, toasterSuccess } from "@/components/core/Toaster";
import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area";
import { PencilSquareIcon } from "@/assets/icons";
import { BookOpen, ListOrdered } from "lucide-react";

const CreateLessons = () => {
  const router = useRouter();
  const [courses, setCourses] = useState<any>([]);
  const searchParams = useSearchParams();
  const chapterId = searchParams.get("chapter_id");
  const courseId = searchParams.get("course_id");

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    chapter_id: chapterId ?? "",
    course_id: courseId ?? "",
    order: "",
  });

  const [imageFiles, setImageFiles] = useState<(File | null)[]>([null]);
  const [videoFiles, setVideoFiles] = useState<(File | null)[]>([null]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const [uploadedVideoUrls, setUploadedVideoUrls] = useState<string[]>([]);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [videoUploadLoading, setVideoUploadLoading] = useState(false);

  const fetchCourses = async () => {
    try {
      const res = await api.get("course/list");
      setCourses(res.data?.data?.courses || []);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
    }
  };

  const getChaptersbyCourseId = async () => {
    try {
      const res = await api.get(`chapter/courses/course_id=${courseId}`);
      console.log(res.data.data, "redj");
      // setCourses(res.data?.data?.courses || []);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
    }
  };

  useEffect(() => {
    fetchCourses();
    getChaptersbyCourseId();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDynamicFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    type: "image" | "video",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const form = new FormData();
    form.append("file", file);
    if (type === "image") {
      setImageUploadLoading(true);
    } else {
      setVideoUploadLoading(true);
    }

    try {
      const res = await api.postFile("upload", form);

      if (res.success && res.data?.data?.fileUrl) {
        const fileUrl = res.data.data?.fileUrl;

        if (type === "image") {
          const updatedFiles = [...imageFiles];
          updatedFiles[index] = file;
          setImageFiles(updatedFiles);

          const updatedUrls = [...uploadedImageUrls];
          updatedUrls[index] = fileUrl;
          setUploadedImageUrls(updatedUrls);
        } else {
          const updatedFiles = [...videoFiles];
          updatedFiles[index] = file;
          setVideoFiles(updatedFiles);

          const updatedUrls = [...uploadedVideoUrls];
          updatedUrls[index] = fileUrl;
          setUploadedVideoUrls(updatedUrls);
        }
      } else {
        toasterError("Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
      toasterError("Upload failed");
    } finally {
      if (type === "image") {
        setImageUploadLoading(false);
      } else {
        setVideoUploadLoading(false);
      }
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // ✅ Simple validation (only required fields)
    const { title, content, course_id, order } = formData;

    if (!title.trim() || !content.trim() || !course_id || !order) {
      toasterError("Please fill in all required fields ❌");
      return;
    }

    try {
      const payload = {
        title: title.trim(),
        content: content.trim(),
        course_id: Number(course_id),
        order: Number(order),
        images: uploadedImageUrls,
        videos: uploadedVideoUrls,
      };

      const res = await api.post("chapter", payload);

      if (res.success) {
        toasterSuccess("Chapter created successfully", 2000, "id");
        // router.push("/chapters");
        router.push(`/chapters?course_id=${courseId}`);
      } else {
        toasterError(res.error?.code || "Something went wrong ❌", 2000, "id");
      }
    } catch (error) {
      console.error("Chapter creation failed", error);
      toasterError("Failed to create chapter ❌");
    }
  };

  return (
    <>
      <Breadcrumb pageName="Lessons" />
      <ShowcaseSection title="Add lesson" className="!p-7">
        <form onSubmit={handleSubmit}>
          <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
            <InputGroup
              className="w-full sm:w-1/2"
              type="text"
              name="title"
              label="Lesson Title"
              placeholder="Enter Lesson Title"
              value={formData.title}
              onChange={handleChange}
              icon={<BookOpen />}
              iconPosition="left"
              height="sm"
            />

            <InputGroup
              className="w-full sm:w-1/2"
              type="number"
              name="order"
              label="Chapter Order"
              placeholder="Enter Order Number"
              value={formData.order}
              onChange={handleChange}
              icon={<ListOrdered />}
              iconPosition="left"
              height="sm"
              min={1}
              step={1}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-white">
              Course Name
            </label>
            <select
              name="course_id"
              value={formData.course_id}
              disabled
              onChange={handleChange}
              className="dark:bg-boxdark w-full rounded-lg border border-stroke bg-transparent px-4 py-2 text-sm outline-none disabled:cursor-not-allowed dark:border-dark-3"
            >
              <option value="">-- Select Chapter --</option>
              {courses.map((course: any) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-white">
              Chapter Name
            </label>
            <select
              name="chapter_id"
              value={formData.chapter_id}
              disabled
              onChange={handleChange}
              className="dark:bg-boxdark w-full rounded-lg border border-stroke bg-transparent px-4 py-2 text-sm outline-none disabled:cursor-not-allowed dark:border-dark-3"
            >
              <option value="">-- Select Chapter --</option>
              {courses.map((course: any) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>
          <TextAreaGroup
            className="mb-5.5 mt-5"
            label="Content"
            name="content"
            placeholder="Enter Lesson Content"
            icon={<PencilSquareIcon />}
            value={formData.content}
            onChange={handleChange}
          />
          <div className="mb-10">
            <label className="mb-3 block text-lg font-semibold text-gray-800 dark:text-white">
              📷 Upload Chapter Images
            </label>
            <div className="space-y-5">
              {imageFiles.map((file, index) => (
                <div key={index} className="flex items-center gap-5">
                  <label className="w-full cursor-pointer rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4 text-center transition hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleDynamicFileChange(e, index, "image")
                      }
                      className="hidden"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {imageFiles[index]?.name || "Click to upload image"}
                    </span>
                  </label>

                  {imageUploadLoading && index === uploadedImageUrls.length ? (
                    <div className="flex h-20 w-20 animate-pulse items-center justify-center rounded-lg border bg-gray-100">
                      <div className="loader h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    </div>
                  ) : (
                    uploadedImageUrls[index] && (
                      <a
                        href={uploadedImageUrls[index]}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={uploadedImageUrls[index]}
                          alt={`preview-${index}`}
                          className="h-20 w-20 cursor-pointer rounded-lg object-cover shadow"
                        />
                      </a>
                    )
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                const lastIndex = imageFiles.length - 1;
                if (!uploadedImageUrls[lastIndex]) {
                  toasterError(
                    "Please upload the current image before adding another.",
                    2000,
                    "id",
                  );
                  return;
                }
                setImageFiles([...imageFiles, null]);
              }}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white shadow transition hover:bg-green-700"
            >
              ➕ Add Image
            </button>
          </div>

          <div className="mb-10">
            <label className="mb-3 block text-lg font-semibold text-gray-800 dark:text-white">
              🎥 Upload Chapter Videos
            </label>
            <div className="space-y-5">
              {videoFiles.map((file, index) => (
                <div key={index} className="flex items-center gap-5">
                  <label className="w-full cursor-pointer rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4 text-center transition hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) =>
                        handleDynamicFileChange(e, index, "video")
                      }
                      className="hidden"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {videoFiles[index]?.name || "Click to upload video"}
                    </span>
                  </label>

                  {videoUploadLoading && index === uploadedVideoUrls.length ? (
                    <div className="flex h-20 w-28 animate-pulse items-center justify-center rounded-lg border bg-gray-100">
                      <div className="loader h-6 w-6 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
                    </div>
                  ) : (
                    uploadedVideoUrls[index] && (
                      <a
                        href={uploadedVideoUrls[index]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block h-20 w-28 overflow-hidden rounded-lg border shadow"
                      >
                        <video className="pointer-events-none h-full w-full cursor-pointer object-cover">
                          <source
                            src={uploadedVideoUrls[index]}
                            type="video/mp4"
                          />
                          Your browser does not support the video tag.
                        </video>
                      </a>
                    )
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                const lastIndex = videoFiles.length - 1;
                if (!uploadedVideoUrls[lastIndex]) {
                  toasterError(
                    "Please upload the current video before adding another.",
                    2000,
                    "id",
                  );
                  return;
                }
                setVideoFiles([...videoFiles, null]);
              }}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow transition hover:bg-blue-700"
            >
              ➕ Add Video
            </button>
          </div>

          <div className="flex justify-end gap-3">
            <button
              className="rounded-lg border border-stroke px-6 py-[7px] font-medium text-dark hover:shadow-1 dark:border-dark-3 dark:text-white"
              type="button"
              onClick={() => router.back()}
            >
              Cancel
            </button>

            <button
              className="rounded-lg bg-primary px-6 py-[7px] font-medium text-gray-2 hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              type="submit"
              disabled={imageUploadLoading || videoUploadLoading}
            >
              {imageUploadLoading || videoUploadLoading
                ? "Uploading..."
                : "Create Lesson"}
            </button>
          </div>
        </form>
      </ShowcaseSection>
    </>
  );
};

export default CreateLessons;

// ("use client");

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import api from "@/lib/api";

// interface Chapter {
//   id: number;
//   title: string;
//   order: number;
//   course: {
//     id: number;
//     title: string;
//   };
// }

// export default function CreateLessonPage() {
//   const [formData, setFormData] = useState({
//     title: "",
//     content: "",
//     chapter_id: "",
//     course_id: "",
//     order: "",
//     lesson_type: "text",
//     duration: "",
//     video_url: "",
//     is_free: true,
//     resources: "",
//   });
//   const [chapter, setChapter] = useState<Chapter | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [mounted, setMounted] = useState(false);
//   const router = useRouter();
//   useEffect(() => {
//     setMounted(true);

//     // Get URL parameters after component mounts on client
//     if (typeof window !== "undefined") {
//       const searchParams = new URLSearchParams(window.location.search);
//       const chapterId = searchParams.get("chapter_id") || "";
//       const courseId = searchParams.get("course_id") || "";

//       // Set chapter_id directly from URL params
//       if (chapterId) {
//         setFormData((prev) => ({
//           ...prev,
//           chapter_id: chapterId,
//           course_id: courseId,
//         }));
//         fetchChapterDetails(chapterId);
//       }
//     }
//   }, []);

//   const fetchChapterDetails = async (chapterId: string) => {
//     try {
//       const response = await api.get(`chapter/${chapterId}`);

//       if (response.success && response.data) {
//         setChapter(response.data.data.chapter);
//       }
//     } catch (error) {
//       console.error("Error fetching chapter details:", error);
//     }
//   };

//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
//     >,
//   ) => {
//     const { name, value, type } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]:
//         type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     // Validate chapter_id is present
//     if (!formData.chapter_id) {
//       setError("Chapter ID is required");
//       setLoading(false);
//       return;
//     }

//     try {
//       // Parse resources if provided
//       const resources = formData.resources
//         ? JSON.parse(formData.resources)
//         : [];

//       const response = await api.post("lessons", {
//         ...formData,
//         chapter_id: parseInt(formData.chapter_id),
//         order: parseInt(formData.order),
//         duration: formData.duration ? parseInt(formData.duration) : null,
//         resources,
//       });

//       if (response.success) {
//         router.push(
//           `/lessons/list?course_id=${formData.course_id}&chapter_id=${formData.chapter_id}`,
//         );
//       } else {
//         setError(response.error || "Error creating lesson");
//       }
//     } catch (error) {
//       setError("Error creating lesson");
//       console.error("Error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Don't render until mounted on client
//   if (!mounted) {
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <div className="mx-auto max-w-4xl">
//           <div className="rounded-lg bg-white p-6 shadow-md">
//             <div className="flex items-center justify-center py-8">
//               <div className="text-lg text-gray-600">Loading...</div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="mx-auto max-w-4xl">
//         <div className="mb-6 flex items-center justify-between">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">
//               Create New Lesson
//             </h1>
//             {chapter && (
//               <p className="mt-2 text-gray-600">
//                 For: {chapter?.course?.title} - Chapter {chapter?.order}:{" "}
//                 {chapter?.title}
//               </p>
//             )}
//             {!chapter && formData?.chapter_id && (
//               <p className="mt-2 text-gray-600">
//                 Chapter ID: {formData?.chapter_id}
//               </p>
//             )}
//           </div>
//           <button
//             onClick={() => router.back()}
//             className="rounded-lg bg-gray-500 px-4 py-2 text-white transition-colors hover:bg-gray-600"
//           >
//             Back
//           </button>
//         </div>

//         <div className="rounded-lg bg-white p-6 shadow-md">
//           {error && (
//             <div className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
//               {error}
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//               {/* Chapter ID Display (Read-only) */}

//               {/* Title */}
//               <div className="md:col-span-2">
//                 <label
//                   htmlFor="title"
//                   className="mb-1 block text-sm font-medium text-gray-700"
//                 >
//                   Lesson Title *
//                 </label>
//                 <input
//                   type="text"
//                   id="title"
//                   name="title"
//                   value={formData.title}
//                   onChange={handleChange}
//                   required
//                   className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder="Enter lesson title"
//                 />
//               </div>

//               {/* Order */}
//               <div>
//                 <label
//                   htmlFor="order"
//                   className="mb-1 block text-sm font-medium text-gray-700"
//                 >
//                   Order *
//                 </label>
//                 <input
//                   type="number"
//                   id="order"
//                   name="order"
//                   value={formData.order}
//                   onChange={handleChange}
//                   required
//                   min="1"
//                   className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder="Lesson order in chapter"
//                 />
//               </div>

//               {/* Lesson Type */}
//               <div>
//                 <label
//                   htmlFor="lesson_type"
//                   className="mb-1 block text-sm font-medium text-gray-700"
//                 >
//                   Lesson Type *
//                 </label>
//                 <select
//                   id="lesson_type"
//                   name="lesson_type"
//                   value={formData.lesson_type}
//                   onChange={handleChange}
//                   required
//                   className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="text">Text</option>
//                   <option value="video">Video</option>
//                   <option value="quiz">Quiz</option>
//                   <option value="assignment">Assignment</option>
//                 </select>
//               </div>

//               {/* Duration */}
//               <div>
//                 <label
//                   htmlFor="duration"
//                   className="mb-1 block text-sm font-medium text-gray-700"
//                 >
//                   Duration (minutes)
//                 </label>
//                 <input
//                   type="number"
//                   id="duration"
//                   name="duration"
//                   value={formData.duration}
//                   onChange={handleChange}
//                   min="1"
//                   className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder="Estimated duration in minutes"
//                 />
//               </div>

//               {/* Free Status */}
//               <div className="flex items-center">
//                 <input
//                   type="checkbox"
//                   id="is_free"
//                   name="is_free"
//                   checked={formData.is_free}
//                   onChange={(e) =>
//                     setFormData((prev) => ({
//                       ...prev,
//                       is_free: e.target.checked,
//                     }))
//                   }
//                   className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                 />
//                 <label
//                   htmlFor="is_free"
//                   className="ml-2 block text-sm text-gray-900"
//                 >
//                   Free Lesson
//                 </label>
//               </div>
//             </div>

//             {/* Video URL (conditionally shown) */}
//             {formData.lesson_type === "video" && (
//               <div>
//                 <label
//                   htmlFor="video_url"
//                   className="mb-1 block text-sm font-medium text-gray-700"
//                 >
//                   Video URL *
//                 </label>
//                 <input
//                   type="url"
//                   id="video_url"
//                   name="video_url"
//                   value={formData.video_url}
//                   onChange={handleChange}
//                   required={formData.lesson_type === "video"}
//                   className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder="https://example.com/video.mp4"
//                 />
//               </div>
//             )}

//             {/* Content */}
//             <div>
//               <label
//                 htmlFor="content"
//                 className="mb-1 block text-sm font-medium text-gray-700"
//               >
//                 Content *
//               </label>
//               <textarea
//                 id="content"
//                 name="content"
//                 value={formData.content}
//                 onChange={handleChange}
//                 required
//                 rows={8}
//                 className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Enter lesson content (HTML or Markdown supported)"
//               />
//             </div>

//             {/* Resources */}
//             <div>
//               <label
//                 htmlFor="resources"
//                 className="mb-1 block text-sm font-medium text-gray-700"
//               >
//                 Resources (JSON format)
//               </label>
//               <textarea
//                 id="resources"
//                 name="resources"
//                 value={formData.resources}
//                 onChange={handleChange}
//                 rows={4}
//                 className="w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder='[{"name": "PDF Guide", "url": "https://example.com/guide.pdf"}]'
//               />
//               <p className="mt-1 text-sm text-gray-500">
//                 Enter resources as JSON array of objects with "name" and "url"
//                 properties
//               </p>
//             </div>

//             {/* Submit Button */}
//             <div className="flex justify-end space-x-4 pt-6">
//               <button
//                 type="button"
//                 onClick={() => router.back()}
//                 className="rounded-lg bg-gray-500 px-6 py-2 text-white transition-colors hover:bg-gray-600"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={loading || !formData.chapter_id}
//                 className="rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
//               >
//                 {loading ? "Creating..." : "Create Lesson"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }
