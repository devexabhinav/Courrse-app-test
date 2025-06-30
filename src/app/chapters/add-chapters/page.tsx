"use client";

import api from "@/lib/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InputGroup from "@/components/FormElements/InputGroup";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { toasterError, toasterSuccess } from "@/components/core/Toaster";
import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area";
import { PencilSquareIcon, CallIcon, EmailIcon } from "@/assets/icons";

const AddChapter = () => {
  const router = useRouter();
  const [courses, setCourses] = useState<any>([])

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    course_id: "",
    order: "",
  });
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

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const payload = {
      title: formData.title,
      content: formData.content,
      course_id: Number(formData.course_id),
      order: Number(formData.order),
    };

    try {
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

export default AddChapter;
