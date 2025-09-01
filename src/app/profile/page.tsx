"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { CameraIcon } from "./_components/icons";
import { SocialAccounts } from "./_components/social-accounts";
import api from "@/lib/api";
import { toasterSuccess } from "@/components/core/Toaster";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [about, setAbout] = useState("");
  const [links, setLinks] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<string | undefined>();

  const [data, setData] = useState({
    name: "",
    position:"",
    profilePhoto: "/images/user/user-03.png",
    coverPhoto: "/images/cover/cover-01.png",
  });

  useEffect(() => {
    // Load data from cookies
    setName(Cookies.get("name") || "");
    setPosition(Cookies.get("position") || "");
    setAbout(Cookies.get("about") || "");
    const storedLinks = Cookies.get("links");
    setLinks(storedLinks ? JSON.parse(storedLinks) : []);
    setRole(Cookies.get("role"));
    fetchUserProfileImage();
  }, []);

  const handleChange = async (e: any) => {
    const file = e.target.files[0];
    const fieldName = e.target.name;
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    const userId = Cookies.get("userId");
    formData.append("userId", userId || "");

    setLoading(true);

    try {
      const res = await api.postFile("upload/update-profile-image", formData);
      const profileImageUrl = res?.data?.data?.profileImage;
      if (res?.data?.success && profileImageUrl) {
        setData((prev) => ({
          ...prev,
          [fieldName]: profileImageUrl,
        }));
        toasterSuccess(res?.data?.data?.message, 2000, "id");
        window.dispatchEvent(new CustomEvent("profile-image-updated", { detail: { profileImageUrl } }));
        fetchUserProfileImage();
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfileImage = async () => {
    const userId = Cookies.get("userId");
    if (!userId) return;

    try {
      const res = await api.get(`upload/${userId}`);
      if (res?.data?.success) {
        const { name, profileImage } = res.data.data;
        setData((prev) => ({
          ...prev,
          name: name || prev.name,
          profilePhoto: profileImage || prev.profilePhoto,
        }));
      }
    } catch (err) {
      console.error("Failed to load profile image:", err);
    }
  };

  const isUser = role === 'user';

  return (
    <div className="mx-auto w-full max-w-[970px]">
      <Breadcrumb pageName="Profile" />
      <div className="overflow-hidden rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
        {/* Cover Photo */}
        <div className="relative z-20 h-35 md:h-65">
          <Image
            src={data.coverPhoto}
            alt="profile cover"
            className="h-full w-full rounded-tl-[10px] rounded-tr-[10px] object-cover object-center"
            width={970}
            height={260}
          />
          <div className="absolute bottom-1 right-1 z-10 xsm:bottom-4 xsm:right-4">
            <label
              htmlFor="coverPhoto"
              className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-[15px] py-[5px] text-body-sm font-medium text-white hover:bg-opacity-90"
              onClick={() => router.push("/edit-profile")}
            >
              <input
                className="sr-only"
              />
              <CameraIcon />
              <span>Edit</span>
            </label>
          </div>
        </div>

        {/* Profile Info */}
        <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5 relative">
          {/* Profile Photo */}
          <div className="relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-[176px] sm:p-3">
            <div className="relative drop-shadow-2 w-full h-full rounded-[50%]">
              {data.profilePhoto && (
                <>
                  <Image
                    src={data.profilePhoto}
                    width={100}
                    height={100}
                    className="absolute top-0 left-0 w-full h-full rounded-[50%] object-cover"
                    alt="profile"
                  />
                  {loading && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-full bg-white/80">
                      <div className="animate-spin rounded-full h-6 w-6 border-4 border-primary border-t-transparent"></div>
                    </div>
                  )}
                  <label
                    htmlFor="profilePhoto"
                    className="absolute bottom-0 right-0 flex size-8.5 cursor-pointer items-center justify-center rounded-full bg-primary text-white hover:bg-opacity-90 sm:bottom-2 sm:right-2 z-20"

                  >
                    <CameraIcon />
                    <input
                      type="file"
                      name="profilePhoto"
                      id="profilePhoto"
                      className="sr-only"
                      onChange={handleChange}
                      accept="image/png, image/jpg, image/jpeg"
                    />
                  </label>
                </>
              )}
            </div>
          </div>

        
          {/* Name and Position */}
          <div className="mt-4">
            <h3 className="mb-1 text-heading-6 font-bold text-dark dark:text-white">
              {name  || data.name}
            </h3>
            
            {/* Show "Trainee" for users, otherwise show position */}
            {isUser ? (
              <p className="font-medium">Trainee</p>
            ) : (
              <p className="font-medium">{position || data.position}</p>
            )}

            {/* About */}
            <div className="mx-auto max-w-[720px] mt-6">
              <h4 className="font-medium text-dark dark:text-white">About Me</h4>
              <p className="mt-4">{about || "No bio added yet."}</p>
            </div>

            {/* Social Links */}
            {isUser ? (
              <p></p>
            ) : (
              links.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium text-dark dark:text-white">My Links</h4>
                <ul className="mt-2">
                  {links.map((link, idx) => (
                    <li key={idx}>
                      <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )
            )}

            <SocialAccounts />
          </div>
        </div>
      </div>
    </div>
  );
}