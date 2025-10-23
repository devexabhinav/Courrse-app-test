"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import InputGroup from "@/components/FormElements/InputGroup";
import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area";
import { toasterSuccess, toasterError } from "@/components/core/Toaster";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import api from "@/lib/api";

const AddMcq = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const chapterId = searchParams.get("chapter_id");
  const courseId = searchParams.get("course_id");

  const [courses, setCourses] = useState<any[]>([]);
  const [chapter, setChapter] = useState<any>(null);

  const [formData, setFormData] = useState({
    question: "",
    options: ["", "", "", ""],
    answer: "",
    course_id: courseId ?? "",
    chapter_id: chapterId ?? "",
  });

  const fetchCourses = async () => {
    try {
      const res = await api.get("course/list");
      setCourses(res.data?.data?.courses || []);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
      toasterError("Failed to load courses");
    }
  };

  const fetchChapter = async (chapterId: string) => {
    if (!chapterId) return;

    try {
      const res = await api.get(`chapter/${Number(chapterId)}`);
      setChapter(res.data?.data?.chapter || null);
    } catch (err) {
      console.error("Failed to fetch chapter:", err);
      toasterError("Failed to load chapter");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (chapterId) {
      fetchChapter(chapterId);
    }
  }, [chapterId]);

  const handleChange = (e: any, index?: number) => {
    const { name, value } = e.target;

    if (name === "options" && typeof index === "number") {
      const updatedOptions = [...formData.options];
      updatedOptions[index] = value;
      setFormData({ ...formData, options: updatedOptions });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const trimmedQuestion = formData.question.trim();
    const trimmedAnswer = formData.answer.trim();
    const trimmedOptions = formData.options.map((opt) => opt.trim());

    if (!trimmedQuestion) {
      toasterError("Question is required ❌");
      return;
    }

    if (trimmedOptions.some((opt) => !opt)) {
      toasterError("All 4 options must be filled ❌");
      return;
    }

    if (!trimmedAnswer) {
      toasterError("Correct answer is required ❌");
      return;
    }

    if (!formData.course_id) {
      toasterError("Please select a course ❌");
      return;
    }

    if (!formData.chapter_id) {
      toasterError("Please select a chapter ❌");
      return;
    }

    const uniqueOptions = new Set(trimmedOptions);
    if (uniqueOptions.size !== trimmedOptions.length) {
      toasterError("Options must be unique ❌");
      return;
    }

    if (!trimmedOptions.includes(trimmedAnswer)) {
      toasterError("Answer must match one of the options ❌");
      return;
    }

    try {
      const payload = {
        question: trimmedQuestion,
        options: trimmedOptions,
        answer: trimmedAnswer,
        course_id: parseInt(formData.course_id),
        chapter_id: parseInt(formData.chapter_id),
      };

      const res = await api.post("mcq/create-mcq", payload);
      if (res?.success) {
        toasterSuccess("MCQ created successfully!", 2000, "id");
        router.push(
          `/admin/mcq?chapter_id=${formData.chapter_id}&course_id=${formData.course_id}`,
        );
      } else {
        toasterError(res.error.code, 2000, "id");
      }
    } catch (err) {
      console.error("MCQ creation failed:", err);
      toasterError("Failed to create MCQ ❌");
    }
  };

  return (
    <>
      <Breadcrumb pageName="Create MCQ" />
      <ShowcaseSection title="Add MCQ">
        <form onSubmit={handleSubmit} className="space-y-5">
          <TextAreaGroup
            label="Question"
            name="question"
            placeholder="Enter the MCQ question"
            value={formData.question}
            onChange={handleChange}
            required
          />

          {formData.options.map((option, idx) => (
            <InputGroup
              key={idx}
              label={`Option ${idx + 1}`}
              name="options"
              value={option}
              placeholder={`Option ${idx + 1}`}
              onChange={(e) => handleChange(e, idx)}
              type="text"
              required
            />
          ))}

          <InputGroup
            label="Correct Answer"
            name="answer"
            value={formData.answer}
            placeholder="Paste the correct option"
            onChange={handleChange}
            type="text"
            required
          />

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-white">
              Select Course *
            </label>
            <select
              name="course_id"
              value={formData.course_id}
              onChange={handleChange}
              disabled
              className="dark:bg-boxdark w-full rounded-lg border border-stroke bg-transparent px-4 py-2 text-sm outline-none focus:border-primary disabled:cursor-not-allowed dark:border-dark-3"
              required
            >
              <option value="">-- Select Course --</option>
              {courses.map((course: any) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-white">
              Select Chapter *
            </label>
            <select
              name="chapter_id"
              value={formData.chapter_id}
              disabled
              onChange={handleChange}
              className="dark:bg-boxdark w-full rounded-lg border border-stroke bg-transparent px-4 py-2 text-sm outline-none focus:border-primary disabled:cursor-not-allowed dark:border-dark-3"
              required
            >
              <option value="">-- Select Chapter --</option>
              {chapter && <option value={chapter.id}>{chapter.title}</option>}
            </select>
          </div>

          <div className="flex justify-end gap-3">
            <button
              className="rounded-lg border border-stroke px-6 py-3 font-medium text-dark hover:shadow-1 dark:border-dark-3 dark:text-white"
              type="button"
              onClick={() => router.back()}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-primary px-6 py-3 font-medium text-white hover:bg-opacity-90"
            >
              Create MCQ
            </button>
          </div>
        </form>
      </ShowcaseSection>
    </>
  );
};

export default AddMcq;
