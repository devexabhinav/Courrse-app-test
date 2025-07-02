"use client";

import api from "@/lib/api";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InputGroup from "@/components/FormElements/InputGroup";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { toasterError, toasterSuccess } from "@/components/core/Toaster";
import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area";
import { CallIcon, EmailIcon, PencilSquareIcon, UserIcon } from "@/assets/icons";
import { CableIcon, Heading1Icon, TicketsPlaneIcon, TypeIcon } from "lucide-react";

const AddCourse = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    creator: "",
    image: null as File | null,
  });
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

      const data = await api.post("course/create-course", payload);
      if (data.success) {
        toasterSuccess("Course created successfully", 2000, "id");
        router.push("/courses");

      }
      else {
        toasterError(data.error.code, 2000, "id")
      }
    } catch (error) {
      console.error("Course creation failed", error);
      toasterError("Failed to create course ❌");
    }
  };


  return (
    <>
      <Breadcrumb pageName="Courses" />
      <ShowcaseSection title="Create Course" className="!p-7">
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
              icon={<TicketsPlaneIcon />}
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
            icon={<TypeIcon />}
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
            onClick={() => {
              console.log("File input clicked!");
            }}
          />
          {typeof formData.image === "string" && (
            <div className="mb-5.5 mt-2">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-white">
                Image Preview:
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

export default AddCourse;
