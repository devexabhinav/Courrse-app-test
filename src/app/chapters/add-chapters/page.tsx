"use client";

import api from "@/lib/api";
import { useEffect, useState } from "react";
import { useRouter , useSearchParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InputGroup from "@/components/FormElements/InputGroup";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { toasterError, toasterSuccess } from "@/components/core/Toaster";
import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area";
import { PencilSquareIcon } from "@/assets/icons";
import { BookOpen, ListOrdered } from "lucide-react";

const AddChapter = () => {
  const router = useRouter();
  const [courses, setCourses] = useState<any>([])
  const searchParams = useSearchParams();
  const courseId = searchParams.get('course_id');

  const [formData, setFormData] = useState({
    title: "",
    content: "",
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

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDynamicFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    type: "image" | "video"
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
        router.push("/chapters");
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
      <Breadcrumb pageName="Chapters" />
      <ShowcaseSection title="Add Chapter" className="!p-7">
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
              Select Course
            </label>
            <select
              name="course_id"
              value={formData.course_id}
              onChange={handleChange}
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
            className="mb-5.5 mt-5"
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
              {imageFiles.map((file, index) => (
                <div key={index} className="flex items-center gap-5">
                  <label className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleDynamicFileChange(e, index, "image")}
                      className="hidden"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {imageFiles[index]?.name || "Click to upload image"}
                    </span>
                  </label>

                  {imageUploadLoading && index === uploadedImageUrls.length ? (
                    <div className="w-20 h-20 flex items-center justify-center rounded-lg bg-gray-100 border animate-pulse">
                      <div className="loader border-4 border-primary border-t-transparent rounded-full w-6 h-6 animate-spin" />
                    </div>
                  ) : uploadedImageUrls[index] && (
                    <a
                      href={uploadedImageUrls[index]}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={uploadedImageUrls[index]}
                        alt={`preview-${index}`}
                        className="w-20 h-20 object-cover rounded-lg shadow cursor-pointer"
                      />
                    </a>
                  )}

                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                const lastIndex = imageFiles.length - 1;
                if (!uploadedImageUrls[lastIndex]) {
                  toasterError("Please upload the current image before adding another.", 2000, "id");
                  return;
                }
                setImageFiles([...imageFiles, null]);
              }}
              className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg shadow transition"
            >
              ➕ Add Image
            </button>
          </div>

          <div className="mb-10">
            <label className="block text-lg font-semibold text-gray-800 dark:text-white mb-3">
              🎥 Upload Chapter Videos
            </label>
            <div className="space-y-5">
              {videoFiles.map((file, index) => (
                <div key={index} className="flex items-center gap-5">
                  <label className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => handleDynamicFileChange(e, index, "video")}
                      className="hidden"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {videoFiles[index]?.name || "Click to upload video"}
                    </span>
                  </label>

                  {videoUploadLoading && index === uploadedVideoUrls.length ? (
                    <div className="w-28 h-20 flex items-center justify-center rounded-lg bg-gray-100 border animate-pulse">
                      <div className="loader border-4 border-blue-600 border-t-transparent rounded-full w-6 h-6 animate-spin" />
                    </div>
                  ) : uploadedVideoUrls[index] && (
                    <a
                      href={uploadedVideoUrls[index]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-28 h-20 block rounded-lg shadow border overflow-hidden"
                    >
                      <video
                        className="w-full h-full object-cover cursor-pointer pointer-events-none"
                      >
                        <source src={uploadedVideoUrls[index]} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </a>
                  )}

                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                const lastIndex = videoFiles.length - 1;
                if (!uploadedVideoUrls[lastIndex]) {
                  toasterError("Please upload the current video before adding another.", 2000, "id");
                  return;
                }
                setVideoFiles([...videoFiles, null]);
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
              className="rounded-lg bg-primary px-6 py-[7px] font-medium text-gray-2 hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              type="submit"
              disabled={imageUploadLoading || videoUploadLoading}
            >
              {imageUploadLoading || videoUploadLoading ? "Uploading..." : "Create Chapter"}
            </button>
          </div>
        </form>
      </ShowcaseSection>
    </>
  );
};

export default AddChapter;
