"use client";

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Save, X, Plus, Trash2 } from "lucide-react";

interface Chapter {
  title: string
  content: string
  order: number
  images?: string[]
  videos?: string[]
}

interface Course {
  id: number
  title: string
  is_active: boolean
}

export default function AddModulePage() {
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    course_id: '',
    order: ''
  })

  const [chapters, setChapters] = useState<Chapter[]>([
    { title: '', content: '', order: 1, images: [], videos: [] }
  ])

const fetchCourses = async () => {
  try {
    setIsLoading(true)
    const query = new URLSearchParams();
    query.append("active", "true");
    query.append("limit", "100");

    console.log("Fetching courses from:", `http://localhost:5000/course/list?${query.toString()}`);
    
    const response = await fetch(`http://localhost:5000/course/list?${query.toString()}`);
    const result = await response.json();
    
    console.log("Full API response:", result);
    
    if (result.success) {
      const coursesData = result.data?.data?.courses || result.data?.courses || result.courses || [];
      console.log("Courses data to set:", coursesData);
      setCourses(coursesData);
    } else {
      console.error("API returned success: false", result);
    }
  } catch (err) {
    console.error("Failed to fetch courses:", err);
  } finally {
    setIsLoading(false)
  }
};
  useEffect(() => {
    fetchCourses();
  }, []);

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleChapterChange = (index: number, field: string, value: string) => {
    const updatedChapters = [...chapters]
    if (field === 'order') {
      updatedChapters[index][field] = parseInt(value) || 1
    } else {
      updatedChapters[index][field] = value
    }
    setChapters(updatedChapters)
  }

  const addChapter = () => {
    setChapters(prev => [
      ...prev,
      { title: '', content: '', order: prev.length + 1, images: [], videos: [] }
    ])
  }

  const removeChapter = (index: number) => {
    if (chapters.length > 1) {
      setChapters(prev => prev.filter((_, i) => i !== index))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validation
      if (!formData.title || !formData.course_id || !formData.order) {
        alert('Please fill all required fields')
        return
      }

      for (const chapter of chapters) {
        if (!chapter.title || !chapter.content) {
          alert('All chapters must have title and content')
          return
        }
      }

      const moduleData = {
        ...formData,
        course_id: parseInt(formData.course_id),
        order: parseInt(formData.order),
        chapters: chapters
      }

      const response = await fetch('/chapter/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(moduleData)
      })

      const result = await response.json()

      if (result.success) {
        alert('Module created successfully!')
        router.push('/modules') // Redirect to modules list page
      } else {
        alert(result.message || 'Failed to create module')
      }
    } catch (error) {
      console.error('Error creating module:', error)
      alert('Error creating module. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Add New Module
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Create a new module with chapters
            </p>
          </div>
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <X size={20} />
            Cancel
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          {/* Module Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Module Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleFormChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                placeholder="Enter module title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Order *
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.order}
                onChange={(e) => handleFormChange('order', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                placeholder="Enter order number"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                placeholder="Enter module description"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Course *
              </label>
              {isLoading ? (
                <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700">
                  <div className="animate-pulse text-gray-500 dark:text-gray-400">Loading courses...</div>
                </div>
              ) : courses.length === 0 ? (
                <div className="w-full px-3 py-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <div className="text-gray-500 dark:text-gray-400 text-center">
                    No active courses available. Please create a course first.
                  </div>
                </div>
              ) : (
                <select
                  required
                  value={formData.course_id}
                  onChange={(e) => handleFormChange('course_id', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                >
                  <option value="">Select a course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Chapters Section */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Chapters</h3>
              <button
                type="button"
                onClick={addChapter}
                className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium transition-colors"
              >
                <Plus size={16} />
                Add Chapter
              </button>
            </div>

            <div className="space-y-4">
              {chapters.map((chapter, index) => (
                <div 
                  key={index} 
                  className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-700 transition-colors"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">Chapter {index + 1}</h4>
                    {chapters.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeChapter(index)}
                        className="p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-3">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Chapter Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={chapter.title}
                        onChange={(e) => handleChapterChange(index, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                        placeholder="Enter chapter title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Order *
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={chapter.order}
                        onChange={(e) => handleChapterChange(index, 'order', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-600 text-gray-900 dark:text-white transition-colors"
                      />
                    </div>

                    <div className="md:col-span-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Content *
                      </label>
                      <textarea
                        required
                        value={chapter.content}
                        onChange={(e) => handleChapterChange(index, 'content', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                        placeholder="Enter chapter content"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || courses.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              <Save size={16} />
              {isSubmitting ? 'Creating...' : 'Create Module'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}