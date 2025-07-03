"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import InputGroup from "@/components/FormElements/InputGroup";
import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area";
import { toasterSuccess, toasterError } from "@/components/core/Toaster";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import api from "@/lib/api";

const AddMcq = () => {
    const router = useRouter();
    const [courses, setCourses] = useState<any>([])
    const [formData, setFormData] = useState({
        question: "",
        options: ["", "", "", ""],
        answer: "",
        course_id: "",
        chapter_id: ""
    });
    const [chapters, setChapters] = useState<any[]>([]);

    const fetchCourses = async () => {
        try {
            const res = await api.get("course/list?active=true");
            setCourses(res.data?.data?.courses || []);
        } catch (err) {
            console.error("Failed to fetch courses:", err);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    useEffect(() => {
        if (formData.course_id) {
            fetchChapters(formData.course_id);
        } else {
            setChapters([]);
        }
    }, [formData.course_id]);

    const fetchChapters = async (courseId: string) => {
        try {
            const res = await api.get(`chapter?course_id=${courseId}`);
            setChapters(res.data?.data || []);
        } catch (err) {
            console.error("Failed to fetch chapters:", err);
            setChapters([]);
        }
    };

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

  // Basic Required Field Validation
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

  // ✅ Check for duplicate options
  const uniqueOptions = new Set(trimmedOptions);
  if (uniqueOptions.size !== trimmedOptions.length) {
    toasterError("Options must be unique ❌");
    return;
  }

  // ✅ Check if answer exists in the options
  if (!trimmedOptions.includes(trimmedAnswer)) {
    toasterError("Answer must match one of the options ❌");
    return;
  }

  // All validations passed, proceed with API call
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
      router.push("/mcq");
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
                        />
                    ))}

                    <InputGroup
                        label="Correct Answer"
                        name="answer"
                        value={formData.answer}
                        placeholder="Paste the correct option"
                        onChange={handleChange}
                        type="text"
                    />

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

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-white">
                            Select Chapter
                        </label>
                        <select
                            name="chapter_id"
                            value={formData.chapter_id}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 text-sm outline-none dark:border-dark-3 dark:bg-boxdark"
                        >
                            <option value="">-- Select Chapter --</option>
                            {chapters.map((chapter: any) => (
                                <option key={chapter.id} value={chapter.id}>
                                    {chapter.title}
                                </option>
                            ))}
                        </select>
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
                            type="submit"
                            className="rounded-lg bg-primary px-6 py-2 font-medium text-white"
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
