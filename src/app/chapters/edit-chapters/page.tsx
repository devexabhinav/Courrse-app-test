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

  const [courses, setCourses] = useState<any>([]);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    course_id: "",
    order: "",
    images: [] as string[],
    videos: [] as string[],
  });

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
  const handleMediaUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "image" | "video"
  ) => {
    const files = e.target.files;
    if (!files) return;

    const uploadedUrls: string[] = [];

    for (const file of Array.from(files)) {
      const form = new FormData();
      form.append("file", file);
      try {
        const res = await api.postFile("upload", form);
        if (res.success && res.data?.data?.fileUrl) {
          uploadedUrls.push(res.data.data.fileUrl);
        }
      } catch (err) {
        console.error("Upload failed", err);
        toasterError("Upload failed ❌");
      }
    }

    setFormData((prev) => ({
      ...prev,
      [type === "image" ? "images" : "videos"]: [
        ...prev[type === "image" ? "images" : "videos"],
        ...uploadedUrls,
      ],
    }));

    toasterSuccess(`${type === "image" ? "Images" : "Videos"} uploaded ✅`, 2000, "id");
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const payload = {
      title: formData.title,
      content: formData.content,
      course_id: Number(formData.course_id),
      order: Number(formData.order),
      images: formData.images,
      videos: formData.videos,
    };

    try {
      const res = await api.put(`chapter/${chapterId}`, payload);

      if (res.success) {
        toasterSuccess("Chapter updated successfully", 2000, "id");
        router.push("/chapters");
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
            className="mb-5.5"
            label="Content"
            name="content"
            placeholder="Enter Chapter Content"
            icon={<PencilSquareIcon />}
            value={formData.content}
            onChange={handleChange}
          />
          <div className="mb-5.5">
            <label className="block font-medium mb-2">Upload Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleMediaUpload(e, "image")}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
            <div className="flex flex-wrap mt-2 gap-2">
              {formData.images.map((url, idx) => (
                <img key={idx} src={url} alt="uploaded" className="h-20 w-28 rounded object-cover border" />
              ))}
            </div>
          </div>

          <div className="mb-5.5">
            <label className="block font-medium mb-2">Upload Videos</label>
            <input
              type="file"
              accept="video/*"
              multiple
              onChange={(e) => handleMediaUpload(e, "video")}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
            <div className="flex flex-wrap mt-2 gap-2">
              {formData.videos.map((url, idx) => (
                <video key={idx} src={url} controls className="h-20 w-28 rounded border object-cover" />
              ))}
            </div>
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
              className="rounded-lg bg-primary px-6 py-[7px] font-medium text-gray-2 hover:bg-opacity-90"
              type="submit"
            >
              Update
            </button>
          </div>
        </form>
      </ShowcaseSection>
    </>
  );
};

export default EditChapter;
