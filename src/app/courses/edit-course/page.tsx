"use client";

import api from "@/lib/api";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InputGroup from "@/components/FormElements/InputGroup";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { toasterError, toasterSuccess } from "@/components/core/Toaster";
import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area";
import { CallIcon, EmailIcon, PencilSquareIcon, UserIcon } from "@/assets/icons";

const EditCourse = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get("id");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    creator: "",
    image: null as File | string | null,
  });

  // 🔁 Fetch course details on mount
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
        toasterError("Failed to load course");
      }
    };

    fetchCourse();
  }, [courseId]);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (name === "image" && files && files[0]) {
      const selectedFile = files[0];
      try {
        const imageForm = new FormData();
        imageForm.append("file", selectedFile);

        const imageUploadRes = await api.postFile("upload", imageForm);
        const imageUrl = imageUploadRes.data?.data?.fileUrl;
        if (imageUrl) {
          setFormData((prev) => ({ ...prev, image: imageUrl }));
          toasterSuccess("Image uploaded successfully", 2000, "id");
        } else {
          toasterError("Upload failed ❌");
        }
      } catch (err) {
        console.error("Upload failed", err);
        toasterError("Upload failed ❌");
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        creator: formData.creator,
        image: formData.image || "",
      };

      const res = await api.put(`course/${courseId}`, payload);
      if (res.success) {
        toasterSuccess("Course updated successfully", 2000, "id");
        router.push("/courses");
      }
    } catch (error) {
      console.error("Course update failed", error);
      toasterError("Failed to update course ❌");
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
          {typeof formData.image === "string" && (
            <div className="mb-5.5">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-white mt-4">
                Current Image Preview
              </label>
              <img
                src={formData.image}
                alt="Course"
                className="h-32 w-48 object-cover rounded border"
              />
            </div>
          )}
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
              className="rounded-lg bg-primary px-6 py-[7px] font-medium text-gray-2 hover:bg-opacity-90"
              type="submit"
            >
              Save
            </button>
          </div>
        </form>
      </ShowcaseSection>
    </>
  );
};

export default EditCourse;
