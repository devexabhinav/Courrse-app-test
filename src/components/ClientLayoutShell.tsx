"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import NextTopLoader from "nextjs-toploader";

import { Sidebar } from "@/components/Layouts/sidebar";
import { Header } from "@/components/Layouts/header";
import ToastProvider from "@/components/core/ToasterProvider";
import UserCoursesDashboard from "@/components/UserCoursesDashboard";

import type { PropsWithChildren } from "react";
import { getDecryptedItem } from "@/utils/storageHelper";

export default function ClientLayoutShell({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const [token, setToken] = useState<any>();
  const [role, setRole] = useState<any>();
  const isAuthPage = pathname.startsWith("/auth");
  const isHomePage = pathname === "/" || pathname === "/home";
  const isPublicPage = isHomePage;

  useEffect(() => {
    const t = getDecryptedItem("token");
    const r = getDecryptedItem("role");
    setToken(t);
    setRole(r);
  }, [pathname]); // Add pathname to dependency to update on route change

  // 🚨 FIX: Allow public pages (home) even without token
  if (!token && !isAuthPage && !isPublicPage) return null;

  const isAdmin = role === "admin";
  const isUser = role === "user";
  const isSuperAdmin = role === "Super-Admin" || role === "super-admin"; // Fixed typo
  const isAuthenticated = !isAuthPage && (isAdmin || isUser || isSuperAdmin);

  const showUserDashboard =
    isUser && (pathname === "/" || pathname === "/user-dashboard");

  return (
    <>
      {!isAuthPage && <NextTopLoader color="#5750F1" showSpinner={false} />}

      <div className="flex min-h-screen">
        {/* Only show sidebar for authenticated users on protected pages */}
        {isAuthenticated && !isPublicPage && <Sidebar />}

        <div className="w-full bg-gray-2 dark:bg-[#020d1a]">
          {/* Only show header for authenticated users on protected pages */}
          {isAuthenticated && !isPublicPage && <Header />}

          <main className="isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-4 md:p-6 2xl:p-10">
            {showUserDashboard ? <UserCoursesDashboard /> : children}
          </main>
        </div>
      </div>

      <ToastProvider />
    </>
  );
}
