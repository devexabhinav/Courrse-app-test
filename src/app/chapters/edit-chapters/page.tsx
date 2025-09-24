"use client";

import api from "@/lib/api";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InputGroup from "@/components/FormElements/InputGroup";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { toasterError, toasterSuccess } from "@/components/core/Toaster";
import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area";
import { PencilSquareIcon, CallIcon, EmailIcon } from "@/assets/icons";

const EditChapter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const chapterId = searchParams.get("id");


  const courseId = searchParams.get('course_id');

  const [courses, setCourses] = useState<any>([]);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    course_id: "",
    order: "",
    images: [] as string[],
    videos: [] as string[],
  });
  const [editImageFiles, setEditImageFiles] = useState<(File | null)[]>([]);
  const [uploadedEditImageUrls, setUploadedEditImageUrls] = useState<string[]>([]);

  const [editVideoFiles, setEditVideoFiles] = useState<(File | null)[]>([]);
  const [uploadedEditVideoUrls, setUploadedEditVideoUrls] = useState<string[]>([]);

  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [videoUploadLoading, setVideoUploadLoading] = useState(false);

  const [removedImageIndexes, setRemovedImageIndexes] = useState<number[]>([]);
  const [removedVideoIndexes, setRemovedVideoIndexes] = useState<number[]>([]);

  const isUploading = imageUploadLoading || videoUploadLoading;

  const fetchCourses = async () => {
    try {
      const res = await api.get("course/list?active=true");
      setCourses(res.data?.data?.courses || []);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
    }
  };

  const fetchChapter = async () => {
    if (!chapterId) return;
    try {
      const res = await api.get(`chapter/${chapterId}`);
      const chapter = res.data?.data?.chapter;
      if (chapter) {
        setFormData({
          title: chapter.title,
          content: chapter.content,
          course_id: String(chapter.course_id),
          order: String(chapter.order),
          images: chapter.images || [],
          videos: chapter.videos || [],
        });
        setUploadedEditImageUrls(chapter.images || []);
        setEditImageFiles(new Array(chapter.images?.length || 1).fill(null));

        setUploadedEditVideoUrls(chapter.videos || []);
        setEditVideoFiles(new Array(chapter.videos?.length || 1).fill(null));
      }
    } catch (error) {
      console.error("Failed to fetch chapter:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchChapter();
  }, [chapterId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleEditFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    type: "image" | "video"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const form = new FormData();
    form.append("file", file);

    try {
      if (type === "image") setImageUploadLoading(true);
      else setVideoUploadLoading(true);

      const res = await api.postFile("upload", form);
      if (res.success && res.data?.data?.fileUrl) {
        const fileUrl = res.data.data.fileUrl;
        if (type === "image") {
          // Update editImageFiles
          const newFiles = [...editImageFiles];
          if (index >= newFiles.length) {
            for (let i = newFiles.length; i <= index; i++) newFiles[i] = null;
          }
          newFiles[index] = file;
          setEditImageFiles(newFiles);

          // Update uploadedEditImageUrls
          const newUrls = [...uploadedEditImageUrls];

          if (index >= newUrls.length) {
            for (let i = newUrls.length; i <= index; i++) newUrls[i] = "";
          }
          newUrls[index] = fileUrl;
          setUploadedEditImageUrls(newUrls);
          setFormData((prev) => ({ ...prev, images: newUrls }));
        } else {
          // Update editVideoFiles
          const newFiles = [...editVideoFiles];
          if (index >= newFiles.length) {
            for (let i = newFiles.length; i <= index; i++) newFiles[i] = null;
          }
          newFiles[index] = file;
          setEditVideoFiles(newFiles);

          // Update uploadedEditVideoUrls
          const newUrls = [...uploadedEditVideoUrls];
          if (index >= newUrls.length) {
            for (let i = newUrls.length; i <= index; i++) newUrls[i] = "";
          }
          newUrls[index] = fileUrl;
          setUploadedEditVideoUrls(newUrls);
          setFormData((prev) => ({ ...prev, videos: newUrls }));
        }
      }
    } catch (err) {
      toasterError("Upload failed ❌");
    } finally {
      if (type === "image") setImageUploadLoading(false);
      else setVideoUploadLoading(false);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const { title, content, course_id, order } = formData;

    // ✅ Validation check
    if (!title.trim() || !content.trim() || !course_id || !order) {
      toasterError("Please fill in all required fields ❌");
      return;
    }

    // Filter out removed files
    const finalImages = uploadedEditImageUrls.filter((_, i) => !removedImageIndexes.includes(i));
    const finalVideos = uploadedEditVideoUrls.filter((_, i) => !removedVideoIndexes.includes(i));

    const payload = {
      title: title.trim(),
      content: content.trim(),
      course_id: Number(course_id),
      order: Number(order),
      images: finalImages,
      videos: finalVideos,
    };

    try {
      const res = await api.put(`chapter/${chapterId}`, payload);
      if (res.success) {
        toasterSuccess("Chapter updated successfully", 2000, "id");
        router.push(`/chapters?course_id=${courseId}`)
      } else {
        toasterError(res.error?.code || "Something went wrong ❌", 2000, "id");
      }
    } catch (error) {
      console.error("Chapter update failed", error);
      toasterError("Failed to update chapter ❌");
    }
  };



  return (
    <>
      <Breadcrumb pageName="Chapters" />
      <ShowcaseSection title="Edit Chapter" className="!p-7">
        <form onSubmit={handleSubmit}>
          <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
            <InputGroup
              className="w-full sm:w-1/2"
              type="text"
              name="title"
              label="Chapter Title"
              placeholder="Enter Chapter Title"
              value={formData.title}
              onChange={handleChange}
              icon={<CallIcon />}
              iconPosition="left"
              height="sm"
            />

            <InputGroup
              className="w-full sm:w-1/2"
              type="number"
              name="order"
              disabled
              label="Chapter Order"
              placeholder="Enter Order Number"
              value={formData.order}
              onChange={handleChange}
              icon={<EmailIcon />}
              iconPosition="left"
              height="sm"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-white">
              Select Course
            </label>
            <select
              name="course_id"
              value={formData.course_id}
              onChange={handleChange}
              disabled
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 text-sm outline-none dark:border-dark-3 dark:bg-boxdark"
            >
              <option value="">-- Select Course --</option>
              {courses.map((course: any) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          <TextAreaGroup
            className="mb-5.5 mt-4"
            label="Content"
            name="content"
            placeholder="Enter Chapter Content"
            icon={<PencilSquareIcon />}
            value={formData.content}
            onChange={handleChange}
          />
          <div className="mb-10">
            <label className="block text-lg font-semibold text-gray-800 dark:text-white mb-3">
              📷 Upload Chapter Images
            </label>
            <div className="space-y-5">
              {editImageFiles.map((file, index) => {
                if (removedImageIndexes.includes(index)) return null; // 💡 skip removed
                return (
                  <div key={index} className="flex items-center gap-5">
                    <label className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleEditFileChange(e, index, "image")}
                        className="hidden"
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {editImageFiles[index]?.name || "Click to upload image"}
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setRemovedImageIndexes((prev) => [...prev, index])}
                      className="text-red-500 hover:underline text-xs"
                    >
                      Remove
                    </button>

                    {uploadedEditImageUrls[index] ? (
                      <a href={uploadedEditImageUrls[index]} target="_blank" rel="noopener noreferrer">
                        <img
                          src={uploadedEditImageUrls[index]}
                          alt={`preview-${index}`}
                          className="w-20 h-20 object-cover rounded-lg shadow cursor-pointer"
                        />
                      </a>
                    ) : imageUploadLoading ? (
                      <div className="w-20 h-20 flex items-center justify-center rounded-lg bg-gray-100 border animate-pulse">
                        <div className="loader border-4 border-primary border-t-transparent rounded-full w-6 h-6 animate-spin" />
                      </div>
                    ) : null}

                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => {
                // Get last index that's NOT removed
                const lastValidIndex = editImageFiles.findLastIndex((_, i) => !removedImageIndexes.includes(i));

                // If there's at least one visible image and it is not uploaded yet
                if (lastValidIndex !== -1 && !uploadedEditImageUrls[lastValidIndex]) {
                  toasterError("Please upload the current image before adding another.", 2000, "id");
                  return;
                }

                setEditImageFiles((prev) => [...prev, null]);
                setUploadedEditImageUrls((prev) => [...prev, ""])
              }}
              className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg shadow transition"
            >
              ➕ Add Image
            </button>
          </div>

          {/* Video Uploads */}
          <div className="mb-10">
            <label className="block text-lg font-semibold text-gray-800 dark:text-white mb-3">
              🎥 Upload Chapter Videos
            </label>
            <div className="space-y-5">
              {editVideoFiles.map((file, index) => {
                if (removedVideoIndexes.includes(index)) return null; // 💡 skip removed
                return (
                  <div key={index} className="flex items-center gap-5">
                    <label className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => handleEditFileChange(e, index, "video")}
                        className="hidden"
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {editVideoFiles[index]?.name || "Click to upload video"}
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setRemovedVideoIndexes((prev) => [...prev, index])}
                      className="text-red-500 hover:underline text-xs"
                    >
                      Remove
                    </button>

                    {uploadedEditVideoUrls[index] ? (
                      <a
                        href={uploadedEditVideoUrls[index]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-28 h-20 block rounded-lg shadow border overflow-hidden"
                      >
                        <video className="w-full h-full object-cover cursor-pointer pointer-events-none">
                          <source src={uploadedEditVideoUrls[index]} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      </a>
                    ) : videoUploadLoading ? (
                      <div className="w-28 h-20 flex items-center justify-center rounded-lg bg-gray-100 border animate-pulse">
                        <div className="loader border-4 border-blue-600 border-t-transparent rounded-full w-6 h-6 animate-spin" />
                      </div>
                    ) : null}

                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => {
                const lastValidIndex = editVideoFiles.findLastIndex((_, i) => !removedVideoIndexes.includes(i));

                if (lastValidIndex !== -1 && !uploadedEditVideoUrls[lastValidIndex]) {
                  toasterError("Please upload the current video before adding another.", 2000, "id");
                  return;
                }

                setEditVideoFiles((prev) => [...prev, null]);
                setUploadedEditVideoUrls((prev) => [...prev, ""]);
              }}
              className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow transition"
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
              className="rounded-lg bg-primary px-6 py-[7px] font-medium text-gray-2 hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Edit Chapter"}
            </button>
          </div>
        </form>
      </ShowcaseSection>
    </>
  );
};

export default EditChapter;
