"use client";

import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";

export default function EditProfile() {
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [position, setPosition] = useState<string>("");
  const [about, setAbout] = useState<string>("");
  const [links, setLinks] = useState<string[]>([""]);
  const [role, setRole] = useState<string | undefined>();

  // ✅ Load data from cookies when component mounts
  useEffect(() => {
   const savedName = Cookies.get("name");
    const savedPosition = Cookies.get("position");
    const savedAbout = Cookies.get("about");
    const savedLinks = Cookies.get("links");
    const userRole = Cookies.get("role"); // Get role from cookies
    
    if (savedName) setName(savedName);
    if (savedPosition) setPosition(savedPosition);
    if (savedAbout) setAbout(savedAbout);
    if (savedLinks) setLinks(JSON.parse(savedLinks));
    if (userRole) setRole(userRole); // Set role state
  }, []);

  const handleLinkChange = (index: number, value: string) => {
    const updatedLinks = [...links];
    updatedLinks[index] = value;
    setLinks(updatedLinks);
  };

  const addLink = () => {
    setLinks([...links, ""]);
  };

  const removeLink = (index: number) => {
    const updatedLinks = links.filter((_, i) => i !== index);
    setLinks(updatedLinks);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    Cookies.set("name", name);
    Cookies.set("position", position);
    Cookies.set("about", about);
    Cookies.set("links", JSON.stringify(links));
    alert("Profile updated successfully! ✅");
    
  };


   const isUser = role === 'user';


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Teacher Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block font-medium">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border px-3 py-2 rounded w-full"
          />
        </div>

        {/* Position */}
          {!isUser && (
          <div>
            <label className="block font-medium">Position</label>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="border px-3 py-2 rounded w-full"
            >
              <option value="">Select Position</option>
              <option value="Full Stack Developer">Full Stack Developer</option>
              <option value="React Developer">React Developer</option>
              <option value="PHP Developer">PHP Developer</option>
              <option value="Backend Developer">Backend Developer</option>
              <option value="Python Developer">Python Developer</option>
            </select>
          </div>
        )}

        {/* About */}
        <div>
          <label className="block font-medium">About</label>
          <textarea
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            className="border px-3 py-2 rounded w-full"
            rows={3}
          />
        </div>

        {/* Links */}
   

         {!isUser && (
          <div>
          <label className="block font-medium">Paste Links</label>
          {links.map((link, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="url"
                value={link}
                onChange={(e) => handleLinkChange(index, e.target.value)}
                className="border px-3 py-2 rounded flex-1"
              />
              {links.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeLink(index)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  ✖
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addLink}
            className="text-blue-500 hover:underline"
          >
            + Add another link
          </button>
        </div>
        )}


        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => router.push("/profile")}
        >
          Save Profile
        </button>
      </form>
    </div>
  );
}
