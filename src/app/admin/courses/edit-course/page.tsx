"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InputGroup from "@/components/FormElements/InputGroup";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { toasterError, toasterSuccess } from "@/components/core/Toaster";
import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area";
import {
  CallIcon,
  EmailIcon,
  PencilSquareIcon,
  UserIcon,
} from "@/assets/icons";
import { useApiClient } from "@/lib/api";

const EditCourse = () => {
  const api = useApiClient();

  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get("id");
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    creator: "",
    image: null as File | string | null,
  });

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) return;

      try {
        const res = await api.get(`course/${courseId}`);
        const course = res.data?.data;
        if (course) {
          setFormData({
            title: course.title,
            description: course.description,
            category: course.category,
            creator: course.creator,
            image: course.image || null,
          });
        }
      } catch (err) {
        console.error("Failed to fetch course", err);
        toasterError("Failed to load course", 2000, "id");
      }
    };

    fetchCourse();
  }, [courseId]);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (name === "image" && files && files[0]) {
      const selectedFile = files[0];
      try {
        setIsUploading(true); // start loader
        const imageForm = new FormData();
        imageForm.append("file", selectedFile);

        const imageUploadRes = await api.postFile("upload", imageForm);
        const imageUrl = imageUploadRes.data?.data?.fileUrl;
        if (imageUrl) {
          setFormData((prev) => ({ ...prev, image: imageUrl }));
          toasterSuccess("Image uploaded successfully", 2000, "id");
        } else {
          toasterError("Upload failed ❌", 2000, "id");
        }
      } catch (err) {
        console.error("Upload failed", err);
        toasterError("Upload failed ❌", 2000, "id");
      } finally {
        setIsUploading(false);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const { title, description, category, creator } = formData;
    if (!title || !description || !category || !creator) {
      toasterError("Please fill in all required fields ❌", 2000, "id");
      return;
    }

    try {
      const payload = {
        title,
        description,
        category,
        creator,
        image: formData.image || "",
      };

      const res = await api.put(`course/${courseId}`, payload);
      if (res.success) {
        toasterSuccess("Course updated successfully", 2000, "id");
        router.push("/admin/courses");
      }
    } catch (error) {
      console.error("Course update failed", error);
      toasterError("Failed to update course ❌", 2000, "id");
    }
  };

  return (
    <>
      <Breadcrumb pageName="Edit Course" />
      <ShowcaseSection title="Edit Course" className="!p-7">
        <form onSubmit={handleSubmit}>
          <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
            <InputGroup
              className="w-full sm:w-1/2"
              type="text"
              name="creator"
              disabled
              label="Creator Name"
              placeholder="Add Your Name Here"
              value={formData.creator}
              onChange={handleChange}
              icon={<UserIcon />}
              iconPosition="left"
              height="sm"
            />

            <InputGroup
              className="w-full sm:w-1/2"
              type="text"
              name="title"
              label="Title"
              placeholder="Add Title Here"
              value={formData.title}
              onChange={handleChange}
              icon={<CallIcon />}
              iconPosition="left"
              height="sm"
            />
          </div>

          <InputGroup
            className="mb-5.5"
            type="text"
            name="category"
            label="Category Type"
            placeholder="Add Category Here"
            value={formData.category}
            onChange={handleChange}
            icon={<EmailIcon />}
            iconPosition="left"
            height="sm"
          />

          <InputGroup
            type="file"
            name="image"
            fileStyleVariant="style1"
            label="Upload Image"
            placeholder="Upload Image"
            onChange={handleChange}
          />
          {isUploading || typeof formData.image === "string" ? (
            <div className="relative mb-5.5 mt-2 w-max">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-white">
                Current Image Preview
              </label>

              <div className="relative flex h-32 w-48 items-center justify-center rounded border bg-gray-50 dark:bg-gray-800">
                {isUploading ? (
                  <div className="flex flex-col items-center justify-center gap-2 text-blue-600">
                    <svg
                      className="h-6 w-6 animate-spin text-blue-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 00-8 8z"
                      ></path>
                    </svg>
                    <span className="text-sm">Uploading...</span>
                  </div>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, image: null }))
                      }
                      className="absolute right-2 top-2 z-10 rounded-full border bg-white p-1 text-black transition hover:bg-red-500 hover:text-white dark:bg-dark-3 dark:text-white"
                      title="Remove image"
                    >
                      ×
                    </button>

                    <img
                      src={formData.image as string}
                      alt="Course"
                      className="h-full w-full rounded object-cover"
                    />
                  </>
                )}
              </div>
            </div>
          ) : null}

          <TextAreaGroup
            className="mb-5.5"
            label="Description"
            name="description"
            placeholder="Write Description Here"
            icon={<PencilSquareIcon />}
            value={formData.description}
            onChange={handleChange}
          />

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
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Edit Course"}
            </button>
          </div>
        </form>
      </ShowcaseSection>
    </>
  );
};

export default EditCourse;
