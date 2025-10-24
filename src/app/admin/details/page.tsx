"use client";
import React, { useState } from "react";
import { ChevronDown, ChevronUp, PlayCircle } from "lucide-react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

export default function Page() {
  const [openSections, setOpenSections] = useState([
    true,
    true,
    true,
    true,
    true,
  ]);
  const [activeTab, setActiveTab] = useState("Overview");

  const toggleSection = (index: number) => {
    const newOpenSections = [...openSections];
    newOpenSections[index] = !newOpenSections[index];
    setOpenSections(newOpenSections);
  };

  const courseSections = [
    {
      title: "Section 1: Understanding ReactJS",
      lessons: [
        { name: "Introduction", duration: "12 min" },
        { name: "Why React?", duration: "21 min" },
      ],
    },
    {
      title: "Section 2: ReactJs As A Service",
      lessons: [{ name: "React in Action", duration: "3 min" }],
    },
    {
      title: "Section 3: React Hooks And Context API",
      lessons: [{ name: "Using Hooks", duration: "1 min" }],
    },
    {
      title: "Section 4: React Fibre Deep Dive",
      lessons: [{ name: "Coming Soon", duration: "3 min" }],
    },
    {
      title: "Section 5: 2 Industrial Projects",
      lessons: [{ name: "Final Project Overview", duration: "1 min" }],
    },
  ];

  const tabs = [
    "Overview",
    "Notes",
    "Announcements",
    "Reviews",
    "Learning tools",
  ];

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between bg-black px-4 py-3 text-white">
        <h1 className="text-lg font-semibold">
          React Masterclass: From Zero to Hero
        </h1>
        <div className="flex items-center gap-4 text-sm">
          <button className="hover:text-gray-300">Share</button>
          <button className="hover:text-gray-300">Leave a rating</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex w-full flex-1 flex-col lg:flex-row">
        {/* Left: Video + Tabs + Content */}
        <div className="w-full flex-1 overflow-y-auto">
          {/* Video */}
          <div className="aspect-video w-full bg-black">
            <video
              className="h-full w-full object-cover"
              controls
              poster="https://placehold.co/1200x700?text=Course+Video"
            >
              <source src="your-video.mp4" type="video/mp4" />
              Your browser does not support HTML video.
            </video>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap justify-start gap-4 border-b border-gray-300 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-800">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`border-b-2 px-3 py-2 text-sm font-medium ${
                  activeTab === tab
                    ? "border-blue-500 text-blue-500"
                    : "border-transparent text-gray-500 hover:border-blue-500 hover:text-blue-500"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-white p-6 dark:bg-gray-900">
            {activeTab === "Overview" && (
              <div>
                <h1 className="mb-2 text-2xl font-semibold">
                  React ka Asli Raaz: Zero se Hero tak ka Safar Hinglish mein!
                </h1>
                <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-1">⭐ 2.5</span>
                  <span>418 Students</span>
                  <span>39 mins Total</span>
                </div>
                <p className="max-w-3xl text-gray-700 dark:text-gray-300">
                  Learn ReactJS from scratch to advanced level in Hinglish! This
                  course covers the entire journey — from understanding
                  components and hooks to building industrial-grade projects.
                </p>
              </div>
            )}
            {activeTab === "Notes" && (
              <div>
                <h2 className="mb-2 text-xl font-semibold">My Notes</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  You can add your personal notes here for quick revision later.
                </p>
              </div>
            )}
            {activeTab === "Announcements" && (
              <div>
                <h2 className="mb-2 text-xl font-semibold">Announcements</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  Stay tuned for the latest updates and news about the course!
                </p>
              </div>
            )}
            {activeTab === "Reviews" && (
              <div>
                <h2 className="mb-2 text-xl font-semibold">Student Reviews</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  ⭐⭐⭐⭐☆ – “Very detailed and easy to understand course!”
                </p>
              </div>
            )}
            {activeTab === "Learning tools" && (
              <div>
                <h2 className="mb-2 text-xl font-semibold">Learning Tools</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  Access additional resources, exercises, and code snippets
                  here.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <footer className="bg-gray-900 py-12 text-white">
            <div className="container mx-auto grid grid-cols-1 gap-8 px-4 md:grid-cols-4">
              {/* Logo & Description */}
              <div>
                <h2 className="mb-2 text-2xl font-bold">YourLogo</h2>
                <p className="text-gray-400">
                  We provide the best services and solutions to help your
                  business grow.
                </p>
                <div className="mt-4 flex space-x-4">
                  <a href="#" className="hover:text-blue-500">
                    <FaFacebookF />
                  </a>
                  <a href="#" className="hover:text-blue-400">
                    <FaTwitter />
                  </a>
                  <a href="#" className="hover:text-pink-500">
                    <FaInstagram />
                  </a>
                  <a href="#" className="hover:text-blue-600">
                    <FaLinkedinIn />
                  </a>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="mb-4 text-xl font-semibold">Quick Links</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <a href="#" className="hover:text-white">
                      Home
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Services
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>

              {/* Contact Info */}
              <div>
                <h3 className="mb-4 text-xl font-semibold">Contact Us</h3>
                <p className="text-gray-400">123 Main Street, City, Country</p>
                <p className="mt-2 text-gray-400">Email: info@example.com</p>
                <p className="mt-2 text-gray-400">Phone: +123 456 7890</p>
              </div>

              {/* Newsletter */}
              <div>
                <h3 className="mb-4 text-xl font-semibold">Subscribe</h3>
                <p className="mb-4 text-gray-400">
                  Get our latest updates and offers.
                </p>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full rounded-l-md px-4 py-2 text-gray-900 focus:outline-none"
                  />
                  <button className="rounded-r-md bg-orange-500 px-4 py-2 transition hover:bg-orange-600">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-8 border-t border-gray-700 pt-4 text-center text-sm text-gray-500">
              © {new Date().getFullYear()} YourLogo. All rights reserved.
            </div>
          </footer>
        </div>
        {/* Right: Accordion */}
        <div className="mt-6 w-full lg:mt-0 lg:h-[calc(100vh-72px)] lg:w-1/3 lg:pl-4">
          <div className="fixed top-[12%] h-full overflow-y-auto border-l border-gray-300 bg-transparent p-4 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-3 text-lg font-semibold">Course Content</h2>
            {courseSections.map((section, index) => (
              <div
                key={index}
                className="mb-2 border-b border-gray-300 dark:border-gray-700"
              >
                <button
                  onClick={() => toggleSection(index)}
                  className="flex w-full items-center justify-between py-2 text-left font-medium transition hover:text-blue-500"
                >
                  <span>{section.title}</span>
                  {openSections[index] ? (
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} />
                  )}
                </button>
                {openSections[index] && (
                  <div className="space-y-1 pb-2 pl-4">
                    {section.lessons.map((lesson, i) => (
                      <div
                        key={i}
                        className="flex cursor-pointer items-center justify-between text-sm text-gray-700 hover:text-blue-500 dark:text-gray-300"
                      >
                        <div className="flex items-center gap-2">
                          <PlayCircle size={14} />
                          <span>{lesson.name}</span>
                        </div>
                        <span>{lesson.duration}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
