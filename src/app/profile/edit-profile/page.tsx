"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import { getDecryptedItem, setEncryptedItem } from "@/utils/storageHelper";

export default function EditProfile() {
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [position, setPosition] = useState<string>("");
  const [about, setAbout] = useState<string>("");
  const [links, setLinks] = useState<string[]>([""]);
  const [role, setRole] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedName: any = getDecryptedItem("name");
    const savedPosition: any = getDecryptedItem("position");
    const savedAbout: any = getDecryptedItem("about");
    const userRole: any = getDecryptedItem("role");

    if (savedName) setName(savedName);
    if (savedPosition) setPosition(savedPosition);
    if (savedAbout) setAbout(savedAbout);
    if (userRole) setRole(userRole);
  }, []);

  const addLink = () => {
    setLinks([...links, ""]);
  };

  const updateLink = (index: number, value: string) => {
    const updatedLinks = links.map((link, i) => (i === index ? value : link));
    setLinks(updatedLinks);
  };

  const removeLink = (index: number) => {
    const updatedLinks = links.filter((_, i) => i !== index);
    setLinks(updatedLinks);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setEncryptedItem("name", name);
    setEncryptedItem("position", position);
    setEncryptedItem("about", about);
    setEncryptedItem("links", JSON.stringify(links));

    setIsLoading(false);
    toast.success("Profile updated successfully! ✅", {
      style: {
        background: "#1f2937",
        color: "#fff",
        border: "1px solid #374151",
      },
    });

    // Navigate after a short delay to show the toast
    setTimeout(() => router.push("/profile"), 1000);
  };

  const isUser = role === "user";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4 py-8">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1f2937",
            color: "#fff",
            border: "1px solid #374151",
          },
        }}
      />

      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-white">Edit Profile</h1>
          <p className="text-gray-400">
            Update your personal information and preferences
          </p>
        </div>

        {/* Profile Card */}
        <div className="overflow-hidden rounded-2xl border border-gray-700 bg-gray-800 shadow-2xl">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">
              Personal Information
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            {/* Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-200">
                Full Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  const regex = /^[A-Za-z\s]*$/;
                  if (regex.test(e.target.value)) {
                    setName(e.target.value);
                  }
                }}
                placeholder="Enter your full name"
                className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-3 text-white placeholder-gray-400 outline-none transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                required
              />
              <p className="text-xs text-gray-400">
                Only letters and spaces allowed
              </p>
            </div>

            {/* Position */}
            {!isUser && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-200">
                  Professional Position <span className="text-red-400">*</span>
                </label>
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  required
                  className="w-full appearance-none rounded-lg border border-gray-600 bg-gray-700 px-4 py-3 text-white outline-none transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                >
                  <option value="" className="bg-gray-700">
                    Select your position
                  </option>
                  <option value="Full Stack Developer" className="bg-gray-700">
                    Full Stack Developer
                  </option>
                  <option value="React Developer" className="bg-gray-700">
                    React Developer
                  </option>
                  <option value="PHP Developer" className="bg-gray-700">
                    PHP Developer
                  </option>
                  <option value="Backend Developer" className="bg-gray-700">
                    Backend Developer
                  </option>
                  <option value="Python Developer" className="bg-gray-700">
                    Python Developer
                  </option>
                </select>
              </div>
            )}

            {/* About */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-200">
                About Me
              </label>
              <textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder="Tell us about yourself, your skills, and interests..."
                className="w-full resize-none rounded-lg border border-gray-600 bg-gray-700 px-4 py-3 text-white placeholder-gray-400 outline-none transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                rows={4}
                maxLength={500}
              />
              <p className="text-xs text-gray-400">
                {about.length}/500 characters
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 rounded-lg border border-gray-600 px-6 py-3 font-medium text-gray-300 transition-colors duration-200 hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 font-medium text-white transition-all duration-200 hover:from-purple-700 hover:to-blue-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Saving...
                  </>
                ) : (
                  <>
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Save Profile
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Quick Tips */}
        <div className="mt-6 rounded-xl border border-gray-700 bg-gray-800 p-4">
          <h3 className="mb-2 flex items-center gap-2 font-medium text-purple-400">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Profile Tips
          </h3>
          <ul className="space-y-1 text-sm text-gray-300">
            <li>• Use your real name for better recognition</li>
            <li>• Choose a position that matches your expertise</li>
            <li>• Write a compelling about section to stand out</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
