// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getDecryptedItem } from "@/utils/storageHelper";

export default function RootPage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuthAndRedirect = () => {
      try {
        const token = getDecryptedItem("token");
        const userRole = getDecryptedItem("role");

        console.log("🔍 Root page auth check:", {
          hasToken: !!token,
          userRole: userRole,
        });

        if (!token) {
          // No token - go to public home page
          console.log("🚀 Redirecting to home page (no token)");
          router.replace("/home");
        } else {
          // Has token - go to role-specific dashboard
          let redirectPath = "/dashboard"; // default for regular users

          if (userRole === "super-admin" || userRole === "Super-Admin") {
            redirectPath = "/super-admin/dashboard";
          } else if (userRole === "admin") {
            redirectPath = "/admin/dashboard";
          }

          console.log(`🚀 Redirecting to ${redirectPath} (role: ${userRole})`);
          router.replace(redirectPath);
        }
      } catch (error) {
        console.error("Error during auth check:", error);
        // Fallback: redirect to home page
        router.replace("/home");
      } finally {
        setIsChecking(false);
      }
    };

    checkAuthAndRedirect();
  }, [router]);

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return null;
}
