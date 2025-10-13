"use client";

import React, { useState, useEffect } from 'react'
import { Pencil, SearchIcon, Trash2, ToggleRight, ToggleLeft, Plus, ChevronDown, ChevronUp, X, Save } from "lucide-react";
import { useRouter } from 'next/navigation'


interface Chapter {
  id?: number
  title: string
  content: string
  order: number
  images?: string[]
  videos?: string[]
}

interface Module {
  id?: number
  title: string
  description: string
  course_id: number
  order: number
  chapters: Chapter[]
  is_active: boolean
}

interface Course {
  id: number
  title: string
}

export default function ModuleManagementPage() {


     const router = useRouter()
  const [modules, setModules] = useState<Module[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [openDialog, setOpenDialog] = useState(false)
  const [editingModule, setEditingModule] = useState<Module | null>(null)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', type: 'success' as 'success' | 'error' })
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedModule, setExpandedModule] = useState<number | null>(null)

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

  // Fetch modules and courses
  useEffect(() => {
    fetchModules()
    fetchCourses()
  }, [])

  const fetchModules = async () => {
    try {
      const response = await fetch('/api/modules')
      const result = await response.json()
      if (result.success) {
        setModules(result.data)
      }
    } catch (error) {
      showSnackbar('Error fetching modules', 'error')
    }
  }

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses')
      const result = await response.json()
      if (result.success) {
        setCourses(result.data)
      }
    } catch (error) {
      showSnackbar('Error fetching courses', 'error')
    }
  }

  const showSnackbar = (message: string, type: 'success' | 'error') => {
    setSnackbar({ open: true, message, type })
    setTimeout(() => setSnackbar({ ...snackbar, open: false }), 3000)
  }

  

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingModule(null)
  }

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }







  const handleSubmit = async () => {
    try {
      // Validation
      if (!formData.title || !formData.course_id || !formData.order) {
        showSnackbar('Please fill all required fields', 'error')
        return
      }

      for (const chapter of chapters) {
        if (!chapter.title || !chapter.content) {
          showSnackbar('All chapters must have title and content', 'error')
          return
        }
      }

      const moduleData = {
        ...formData,
        course_id: parseInt(formData.course_id),
        order: parseInt(formData.order),
        chapters: chapters
      }

      const url = editingModule ? `/api/modules/${editingModule.id}` : '/api/modules'
      const method = editingModule ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(moduleData)
      })

      const result = await response.json()

      if (result.success) {
        showSnackbar(
          editingModule ? 'Module updated successfully' : 'Module created successfully', 
          'success'
        )
        fetchModules()
        handleCloseDialog()
      } else {
        showSnackbar(result.message || 'Operation failed', 'error')
      }
    } catch (error) {
      showSnackbar('Error saving module', 'error')
    }
  }

  const handleDeleteModule = async (moduleId: number) => {
    if (!confirm('Are you sure you want to delete this module?')) return

    try {
      const response = await fetch(`/api/modules/${moduleId}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (result.success) {
        showSnackbar('Module deleted successfully', 'success')
        fetchModules()
      } else {
        showSnackbar(result.message || 'Delete failed', 'error')
      }
    } catch (error) {
      showSnackbar('Error deleting module', 'error')
    }
  }

  const toggleExpandModule = (moduleId: number) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId)
  }

  const toggleModuleStatus = async (moduleId: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/modules/${moduleId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_active: !currentStatus })
      })

      const result = await response.json()

      if (result.success) {
        showSnackbar('Module status updated successfully', 'success')
        fetchModules()
      } else {
        showSnackbar(result.message || 'Update failed', 'error')
      }
    } catch (error) {
      showSnackbar('Error updating module status', 'error')
    }
  }

  const filteredModules = modules.filter(module =>
    module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    module.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-colors">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors">
              Module Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1 transition-colors">
              Manage your course modules and chapters
            </p>
          </div>
          <button
            onClick={() =>  router.push(`/admin-panel/add-modules`)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={20} />
            Add Module
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6 transition-colors">
          <div className="relative max-w-md">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Search modules..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
            />
          </div>
        </div>

        {/* Modules Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 transition-colors">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider transition-colors">
                    Module
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider transition-colors">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider transition-colors">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider transition-colors">
                    Chapters
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider transition-colors">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider transition-colors">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 transition-colors">
                {filteredModules.map((module) => (
                  <React.Fragment key={module.id}>
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => toggleExpandModule(module.id!)}
                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                          >
                            {expandedModule === module.id ? (
                              <ChevronUp size={16} className="text-gray-600 dark:text-gray-400" />
                            ) : (
                              <ChevronDown size={16} className="text-gray-600 dark:text-gray-400" />
                            )}
                          </button>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white transition-colors">
                              {module.title}
                            </div>
                            {module.description && (
                              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1 transition-colors">
                                {module.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white transition-colors">
                        {courses.find(c => c.id === module.course_id)?.title || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white transition-colors">
                        {module.order}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 transition-colors">
                          {module.chapters?.length || 0} chapters
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleModuleStatus(module.id!, module.is_active)}
                          className="flex items-center gap-2 text-sm font-medium"
                        >
                          {module.is_active ? (
                            <>
                              <ToggleRight className="text-green-600 dark:text-green-400" size={20} />
                              <span className="text-green-600 dark:text-green-400 transition-colors">Active</span>
                            </>
                          ) : (
                            <>
                              <ToggleLeft className="text-gray-400 dark:text-gray-500" size={20} />
                              <span className="text-gray-500 dark:text-gray-400 transition-colors">Inactive</span>
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenDialog(module)}
                            className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            title="Edit module"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteModule(module.id!)}
                            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Delete module"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    
                    {/* Expanded Chapter Details */}
                    {expandedModule === module.id && (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 bg-gray-50 dark:bg-gray-700 transition-colors">
                          <div className="pl-8">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 transition-colors">
                              Chapters in this Module
                            </h4>
                            {module.chapters && module.chapters.length > 0 ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {module.chapters.map((chapter, index) => (
                                  <div 
                                    key={index} 
                                    className="bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-lg p-4 transition-colors"
                                  >
                                    <div className="flex justify-between items-start mb-2">
                                      <h5 className="font-medium text-gray-900 dark:text-white transition-colors">
                                        {chapter.title} (Order: {chapter.order})
                                      </h5>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2 transition-colors">
                                      {chapter.content}
                                    </p>
                                    <div className="flex gap-2">
                                      {chapter.images && chapter.images.length > 0 && (
                                        <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 transition-colors">
                                          {chapter.images.length} images
                                        </span>
                                      )}
                                      {chapter.videos && chapter.videos.length > 0 && (
                                        <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 transition-colors">
                                          {chapter.videos.length} videos
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-500 dark:text-gray-400 text-sm transition-colors">
                                No chapters in this module
                              </p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {filteredModules.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-500 mb-2 transition-colors">
                No modules found
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm transition-colors">
                {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first module'}
              </p>
            </div>
          )}
        </div>

        {/* Add/Edit Module Dialog */}
    
        

        {/* Snackbar */}
        {snackbar.open && (
          <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transition-colors ${
            snackbar.type === 'success' 
              ? 'bg-green-500 dark:bg-green-600 text-white' 
              : 'bg-red-500 dark:bg-red-600 text-white'
          }`}>
            {snackbar.message}
          </div>
        )}
      </div>
    </div>
  )
}