"use client";

import { useState, useEffect } from "react";
import {
  Clock,
  BookOpen,
  Award,
  ChevronDown,
  Search,
  BarChart3,
  FileText,
  Calendar,
  Users,
  Star,
  CheckCircle,
  PlayCircle,
  Video,
  FileQuestion,
  UserPlus
} from "lucide-react";
import api from "@/lib/api";
import { useParams } from "next/navigation";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollmentStatus, setEnrollmentStatus] = useState(null);


  const params = useParams();
  const courseId = params.id;

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        const res = await api.get(`course/${courseId}`);

        if (res.success) {
          setCourse(res.data?.data);
        } else {
          setError("Failed to fetch course data");
        }
      } catch (err) {
        console.error("Failed to load course data:", err);
        setError("Error loading course data");
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-800 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading course data...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-800 p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300">{error || "Course not found"}</p>
        </div>
      </div>
    );
  }


  const handleEnroll = async () => {
    // If you want to redirect to enrollment page instead
    // router.push(`/user-panel/courses/CourseEnrollment/${courseId}`);
    // return;
    
    setEnrolling(true);
    setEnrollmentStatus(null);

    try {
      // Get user ID from your authentication system
      // This will depend on how you handle authentication
      const userId = session?.user?.id || localStorage.getItem('userId');
      
      if (!userId) {
        setEnrollmentStatus({ 
          type: 'error', 
          message: 'Please log in to enroll in this course' 
        });
        setEnrolling(false);
        return;
      }

      // Make API call to enroll user
      const response = await api.post('/enrollments', {
        user_id: userId,
        course_id: courseId,
        enrolled_at: new Date().toISOString(),
        status: 'active'
      });

      if (response.success) {
        setEnrollmentStatus({ 
          type: 'success', 
          message: 'Successfully enrolled in course!' 
        });
        
        // Optionally redirect after successful enrollment
        // setTimeout(() => {
        //   router.push(`/user-panel/courses/CourseEnrollment/${courseId}`);
        // }, 1500);
      } else {
        setEnrollmentStatus({ 
          type: 'error', 
          message: response.message || 'Failed to enroll in course' 
        });
      }
    } catch (error) {
      console.error('Enrollment error:', error);
      setEnrollmentStatus({ 
        type: 'error', 
        message: 'Failed to enroll. Please try again.' 
      });
    } finally {
      setEnrolling(false);
    }
  };



  


  const formattedCourse = {
    id: course.id,
    title: course.title,
    description: course.description || "Complete course",
    duration: course.duration || "10 hours",
    chapters: course.chapters_count || 0,
    videos: course.videos_count || 0,
    assessments: course.assessments_count || 0,
    certificate: course.certificate_available || false,
    price: course.price || "Free",
    progress: course.progress || 8,
    stepsCompleted: course.completed_steps || 2,
    totalSteps: course.total_steps || 24,
    enrollment: course.enrollment_count || 1250,
    rating: course.rating || 4.8,
    reviews: course.reviews_count || 124,
    instructor: {
      name: course.instructor?.name || "John Doe",
      role: course.instructor?.role || "Senior Developer"
    },
    roadmap: {
      title: course.roadmap_title || `Roadmap for ${course.title}`,
      progress: course.roadmap_progress || 8.25,
      technologies: course.technologies || ["Node", "Express", "MongoDB"]
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600 dark:text-gray-300">11:48</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">26°C Bain</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">03/02/2023</div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Quick search"
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">Course App</div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Course Info */}
        <div className="lg:col-span-2">
          {/* Roadmap Section */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{formattedCourse.roadmap.title}</h2>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                    style={{ width: `${formattedCourse.roadmap.progress}%` }}
                  ></div>
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">{formattedCourse.roadmap.progress}%</span>
              </div>
              <button className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:text-blue-800 dark:hover:text-blue-300 transition-colors">Reset</button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              {formattedCourse.roadmap.technologies.map((tech, index) => (
                <div key={index} className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 p-3 rounded-lg border border-blue-100 dark:border-blue-800/30">
                  <h3 className="font-medium text-blue-800 dark:text-blue-200">{tech}</h3>
                </div>
              ))}
            </div>

            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Users className="h-4 w-4 mr-1" />
              <span>{formattedCourse.enrollment} enrolled</span>
              <span className="mx-2">•</span>
              <span>All Levels</span>
            </div>
          </div>

          {/* Course Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 flex items-center hover:shadow-md transition-shadow">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full mr-4">
                <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Duration</div>
                <div className="font-bold text-lg text-gray-800 dark:text-white">{formattedCourse.duration}</div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 flex items-center hover:shadow-md transition-shadow">
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full mr-4">
                <Video className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Videos</div>
                <div className="font-bold text-lg text-gray-800 dark:text-white">{formattedCourse.videos}</div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 flex items-center hover:shadow-md transition-shadow">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full mr-4">
                <FileQuestion className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Assessments</div>
                <div className="font-bold text-lg text-gray-800 dark:text-white">{formattedCourse.assessments}</div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 flex items-center hover:shadow-md transition-shadow">
              <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-full mr-4">
                <UserPlus className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Enrollment</div>
                <div className="font-bold text-lg text-gray-800 dark:text-white">{formattedCourse.enrollment}</div>
              </div>
            </div>
          </div>

          {/* Enroll Now Button - Moved to top right */}
          <div className="flex justify-end mb-6">
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 flex items-center">
              <div className="text-right mr-4">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{formattedCourse.price}</div>
              </div>
              {/* <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 px-6 rounded-lg text-sm transition-all transform hover:scale-105">
                Enroll Now
              </button> */}

              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 px-6 rounded-lg text-sm transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {enrolling ? 'Enrolling...' : 'Enroll Now'}
              </button>
            </div>
          </div>

          {/* Course Details */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{formattedCourse.title}</h2>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
                <Clock className="h-4 w-4 mr-1" />
                <span>{formattedCourse.duration}</span>
                <span className="mx-2">•</span>
                <BookOpen className="h-4 w-4 mr-1" />
                <span>{formattedCourse.chapters} chapters</span>
                <span className="mx-2">•</span>
                <Award className="h-4 w-4 mr-1" />
                <span>{formattedCourse.certificate ? "Certificate" : "No Certificate"}</span>
              </div>
              {/* Display the course description */}
              <p className="text-gray-700 dark:text-gray-300 mb-4 border-l-4 border-blue-500 dark:border-blue-400 pl-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-r">
                {formattedCourse.description}
              </p>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
              <nav className="flex -mb-px">
                {["overview", "curriculum", "instructor", "reviews"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`mr-8 py-3 px-1 text-center font-medium text-sm border-b-2 ${activeTab === tab
                        ? "border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400"
                        : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === "overview" && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">About this course</h3>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <BarChart3 className="h-5 w-5 text-blue-500 mr-3" />
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Level</div>
                      <div className="font-medium text-gray-800 dark:text-white">All Levels</div>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <FileText className="h-5 w-5 text-blue-500 mr-3" />
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Resources</div>
                      <div className="font-medium text-gray-800 dark:text-white">5 downloadable resources</div>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <Clock className="h-5 w-5 text-blue-500 mr-3" />
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Duration</div>
                      <div className="font-medium text-gray-800 dark:text-white">{formattedCourse.duration}</div>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <Award className="h-5 w-5 text-blue-500 mr-3" />
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Certificate</div>
                      <div className="font-medium text-gray-800 dark:text-white">{formattedCourse.certificate ? "Yes" : "No"}</div>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <BookOpen className="h-5 w-5 text-blue-500 mr-3" />
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Chapters</div>
                      <div className="font-medium text-gray-800 dark:text-white">{formattedCourse.chapters} chapters</div>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <Calendar className="h-5 w-5 text-blue-500 mr-3" />
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Access</div>
                      <div className="font-medium text-gray-800 dark:text-white">Lifetime access</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "curriculum" && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Curriculum</h3>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{formattedCourse.chapters} chapters • {formattedCourse.duration} total length</div>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 flex justify-between items-center">
                    <div className="flex items-center">
                      <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">Introduction to {formattedCourse.title}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">0 lessons • 30 min</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Enroll to access</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "instructor" && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">About the Instructor</h3>
                <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mr-4 flex items-center justify-center text-white font-bold">
                    {formattedCourse.instructor.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-800 dark:text-white">{formattedCourse.instructor.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{formattedCourse.instructor.role}</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Reviews</h3>
                <div className="flex items-center mb-4">
                  <div className="flex mr-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="h-5 w-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <span className="text-lg font-bold text-gray-800 dark:text-white">{formattedCourse.rating}</span>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">({formattedCourse.reviews} reviews)</span>
                </div>
                <div className="text-gray-700 dark:text-gray-300">No reviews yet. Be the first to review this course!</div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Stats */}
        <div className="space-y-6">
          {/* Progress Stats */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <h3 className="font-medium text-gray-900 dark:text-white mb-4">Course Progress</h3>
            <div className="flex justify-center mb-4">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#eee"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="3"
                    strokeDasharray={`${formattedCourse.progress}, 100`}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">{formattedCourse.progress}%</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Completed</span>
                </div>
              </div>
            </div>
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">{formattedCourse.stepsCompleted} of {formattedCourse.totalSteps} steps completed</div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <h3 className="font-medium text-gray-900 dark:text-white mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-start p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/30">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-3">
                  <PlayCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-800 dark:text-white">Started new chapter</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Introduction to Node.js</div>
                  <div className="text-xs text-gray-400 dark:text-gray-500">2 hours ago</div>
                </div>
              </div>
              <div className="flex items-start p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800/30">
                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full mr-3">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-800 dark:text-white">Completed quiz</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">JavaScript Basics</div>
                  <div className="text-xs text-gray-400 dark:text-gray-500">1 day ago</div>
                </div>
              </div>
            </div>
          </div>

          {/* Course Rating */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <h3 className="font-medium text-gray-900 dark:text-white mb-4">Course Rating</h3>
            <div className="flex items-center justify-center mb-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="h-5 w-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <span className="ml-2 text-lg font-bold text-gray-800 dark:text-white">{formattedCourse.rating}</span>
            </div>
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">Based on {formattedCourse.reviews} reviews</div>
          </div>
        </div>
      </div>
    </div>
  );
}