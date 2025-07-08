"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { cn } from "@/lib/utils";

export default function UserDetailsPage({ className }: any) {
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");
  const router = useRouter();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    async function fetchDetails() {
      try {
        const res = await api.get(`user/details/${userId}`);
        setData(res.data.data);
      } catch (err) {
        console.error("Error fetching user details", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [userId]);

  if (loading) return <p className="text-center mt-8">Loading...</p>;
  if (!data) return <p className="text-center mt-8">No user found.</p>;

  return (
    <div className={cn("max-w-6xl mx-auto px-6 py-10 space-y-10", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">👤 User Details</h1>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-blue-600 hover:underline"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Profile Info</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
          <div><strong>Username:</strong> {data.username}</div>
          <div><strong>Email:</strong> {data.email}</div>
          <div><strong>Role:</strong> <span className="uppercase font-semibold">{data.role}</span></div>
          <div>
            <strong>Status:</strong>
            <span className={cn("ml-2 px-2 py-1 rounded text-sm font-semibold", data.verified ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600")}>
              {data.verified ? "Verified" : "Unverified"}
            </span>
          </div>
          <div><strong>Joined:</strong> {new Date(data.joinedAt).toLocaleDateString()}</div>
        </div>
      </div>

      {/* Enrolled Courses */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">📚 Enrolled Courses</h2>
        {data.courses.length === 0 ? (
          <p className="italic text-gray-500">No enrolled courses.</p>
        ) : (
          data.courses.map((course: any) => (
            <div key={course.course_id} className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow space-y-4">
              <div className="flex gap-4 items-center">
                <img src={course.image} alt={course.title} className="w-16 h-16 rounded object-cover" />
                <div>
                  <h3 className="text-lg font-bold">{course.title}</h3>
                  <p className="text-sm text-gray-500">Enrolled on {new Date(course.enrolledAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div>
                <div className="h-3 w-full bg-gray-300 rounded">
                  <div
                    className="h-3 bg-blue-600 rounded transition-all duration-500"
                    style={{ width: `${course.completion_percentage}%` }}
                  ></div>
                </div>
                <p className="text-right text-sm text-gray-600 mt-1">{course.completion_percentage}% complete</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300">Chapters</h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                  {course.chapters.map((chapter: any) => (
                    <li key={chapter.chapter_id} className={cn("px-3 py-2 rounded text-sm", chapter.completed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600")}>
                      {chapter.title}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Comments */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">💬 Comments</h2>
        {data.comments.length === 0 ? (
          <p className="italic text-gray-500">No comments available.</p>
        ) : (
          <ul className="space-y-4 mt-4">
            {data.comments.map((comment: any) => (
              <li key={comment.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded shadow">
                <p className="mb-1 text-sm text-gray-600 italic">On course: <strong>{comment.course?.title}</strong></p>
                <p className="text-gray-800 dark:text-gray-200">{comment.text}</p>
                <p className="text-xs text-gray-400 mt-2">Posted on {new Date(comment.createdAt).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Ratings */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">⭐ Ratings</h2>
        {data.ratings.length === 0 ? (
          <p className="italic text-gray-500">No ratings given.</p>
        ) : (
          <ul className="space-y-4 mt-4">
            {data.ratings.map((rating: any) => (
              <li key={rating.id} className="p-4 bg-white dark:bg-gray-800 rounded shadow">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{rating.course.title}</p>
                    <p className="text-sm text-gray-500">Rated on {new Date(rating.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className="text-yellow-500 font-bold text-2xl">{rating.score} ★</span>
                </div>
                {rating.review && <p className="mt-2 italic text-gray-700 dark:text-gray-300">{rating.review}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
