"use client";

import api from "@/lib/api";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InputGroup from "@/components/FormElements/InputGroup";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { toasterError, toasterSuccess } from "@/components/core/Toaster";
import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area";
import { PencilSquareIcon, UserIcon } from "@/assets/icons";

import {
  DollarSign,
  ListIcon,
  TicketsPlaneIcon,
  TypeIcon,
  Plus,
  Trash2,
} from "lucide-react";

import Cookies from "js-cookie";

const AddCourse = () => {
  const router = useRouter();
  const name = Cookies.get("name");
  const [formData, setFormData] = useState<any>({
    title: "",
    description: "",
    category: "",
    creator: name,
    price: "",
    image: null as File | null,
  });
  const [courseFeatures, setCourseFeatures] = useState<string[]>([]);
  const [currentFeature, setCurrentFeature] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;

    if (name === "image" && files && files[0]) {
      const selectedFile = files[0];
      if (!selectedFile.type.startsWith("image/")) {
        toasterError("Only image files are allowed ❌");
        return;
      }
      try {
        setIsUploading(true);
        const imageForm = new FormData();
        imageForm.append("file", selectedFile);

        const imageUploadRes = await api.postFile("upload", imageForm);
        const imageUrl = imageUploadRes.data?.data?.fileUrl;

        if (imageUrl) {
          setFormData((prev: any) => ({ ...prev, image: imageUrl }));
          toasterSuccess("Image uploaded successfully", 2000, "id");
        } else {
          toasterError("Upload failed ❌");
        } 
      } catch (err) {
        console.error("Upload failed", err);
        toasterError("Upload failed ❌");
      } finally {
        setIsUploading(false);
      }
    } else {
      setFormData((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const addFeature = () => {
    if (
      currentFeature.trim() &&
      !courseFeatures.includes(currentFeature.trim())
    ) {
      setCourseFeatures([...courseFeatures, currentFeature.trim()]);
      setCurrentFeature("");
    }
  };

  const removeFeature = (index: number) => {
    const updatedFeatures = [...courseFeatures];
    updatedFeatures.splice(index, 1);
    setCourseFeatures(updatedFeatures);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { title, description, category, creator, price } = formData;

    if (!title || !description || !category || !creator || !price) {
      toasterError("Please fill all the required fields ❌", 2000, "id");
      return;
    }

    if (courseFeatures.length === 0) {
      toasterError("Please add at least one course feature ❌", 2000, "id");
      return;
    }

    try {
      const payload = {
        title,
        description,
        category,
        creator,
        price: Number(price),
        features: courseFeatures,
        image: formData.image || "",
      };

      const data = await api.post("course/create-course", payload);
      if (data.success) {
        toasterSuccess("Course created successfully", 2000, "id");
        router.push("/admin/courses");
      } else {
        toasterError(data.error?.code || "Failed to create course", 2000, "id");
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
              disabled
              onChange={handleChange}
              icon={<UserIcon />}
              iconPosition="left"
              height="sm"
              required
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
              required
            />
          </div>

          <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
            <InputGroup
              className="w-full sm:w-1/2"
              type="text"
              name="category"
              label="Category Type"
              placeholder="Add Category Here"
              value={formData.category}
              onChange={handleChange}
              icon={<TypeIcon />}
              iconPosition="left"
              height="sm"
              required
            />

            <InputGroup
              className="w-full sm:w-1/2"
              type="number"
              name="price"
              label="Price ($)"
              placeholder="0.00"
              value={formData.price}
              onChange={handleChange}
              icon={<DollarSign />}
              iconPosition="left"
              height="sm"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="mb-5.5">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-white">
              Course Features/Highlights
            </label>
            <div className="mb-3 flex gap-2">
              <InputGroup
                type="text"
                placeholder="Add a feature (e.g., 'Certificate included', 'Lifetime access')"
                value={currentFeature}
                onChange={(e) => setCurrentFeature(e.target.value)}
                icon={<ListIcon />}
                iconPosition="left"
                height="sm"
                label="Course Feature"
              />
              <button
                type="button"
                onClick={addFeature}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                Add
              </button>
            </div>

            {courseFeatures.length > 0 && (
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Added Features:
                </h4>
                <div className="space-y-2">
                  {courseFeatures.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg bg-white p-3 dark:bg-gray-700"
                    >
                      <span className="text-gray-700 dark:text-gray-300">
                        • {feature}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="p-1 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <InputGroup
            type="file"
            name="image"
            fileStyleVariant="style1"
            label="Upload Image"
            placeholder="Upload Image"
            accept="image/*"
            onChange={handleChange}
            onClick={() => {
              console.log("File input clicked!");
            }}
            required
          />
          {typeof formData.image === "string" && (
            <div className="relative mb-5.5 mt-2 w-max">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-white">
                Image Preview:
              </label>

              <button
                type="button"
                onClick={() =>
                  setFormData((prev: any) => ({ ...prev, image: null }))
                }
                className="absolute right-2 top-2 z-10 rounded-full border bg-white p-1 text-black transition hover:bg-red-500 hover:text-white dark:bg-dark-3 dark:text-white"
                title="Remove image"
              >
                ×
              </button>

              <img
                src={formData.image}
                alt="Course"
                className="h-32 w-48 rounded border object-cover"
              />
            </div>
          )}

          <TextAreaGroup
            className="mb-5.5"
            label="Description"
            name="description"
            placeholder="Write detailed description about the course..."
            icon={<PencilSquareIcon />}
            value={formData.description}
            onChange={handleChange}
            rows={4}
            required
          />

          <div className="flex justify-end gap-3">
            <button
              className="rounded-lg border border-stroke px-6 py-[7px] font-medium text-dark hover:shadow-1 dark:border-dark-3 dark:text-white"
              type="button"
              onClick={() => router.back()}
            >
              BACK
            </button>

            <button
              className="rounded-lg bg-primary px-6 py-[7px] font-medium text-gray-2 hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              type="submit"
              disabled={isUploading || courseFeatures.length === 0}
            >
              {isUploading ? "Uploading..." : "ADD COURSE"}
            </button>
          </div>
        </form>
      </ShowcaseSection>
    </>
  );
};

export default AddCourse;
