"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";

function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Token not found in URL.");
      return;
    }

    const verifyAccount = async () => {
      try {
        const response = await api.post("user/verify", { token });

        if (!response?.success) {
          throw new Error(response?.error?.code || "Verification failed");
        }

        setStatus("success");
        setMessage(response?.data?.message || "Account verified successfully!");

        const timer = setTimeout(() => router.push("/auth/login"), 3000);
        return () => clearTimeout(timer);
      } catch (err: any) {
        console.error("Verification error:", err);
        setStatus("error");
        setMessage(
          err?.response?.data?.error?.code ||
          err?.response?.data?.message ||
          "Something went wrong."
        );
      }
    };

    verifyAccount();
  }, [token, router]);

  if (status === "verifying") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-green-50 via-white to-green-100">
        <div className="bg-white border border-gray-200 rounded-3xl shadow-xl p-10 w-full max-w-xl text-center space-y-6">
          <div className="text-green-500 text-4xl animate-pulse">🔄</div>
          <h2 className="text-xl font-semibold text-gray-700">Verifying your account...</h2>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-green-50 via-white to-green-100">
        <div className="bg-white border border-gray-200 rounded-3xl shadow-xl p-10 w-full max-w-xl text-center space-y-6">
          <div className="text-green-600 text-5xl">✅</div>
          <h2 className="text-2xl font-bold text-green-800">Verification Successful</h2>
          <p className="text-gray-600">{message}</p>
          <Link href="/auth/login">
            <button className="mt-4 px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition">
              Go to Login
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-green-50 via-white to-green-100">
      <div className="bg-white border border-gray-200 rounded-3xl shadow-xl p-10 w-full max-w-xl text-center space-y-6">
        <div className="text-red-600 text-5xl">❌</div>
        <h2 className="text-2xl font-bold text-red-700">Verification Failed</h2>
        <p className="text-gray-600">{message}</p>
        <Link href="/auth/register">
          <button className="mt-4 px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition">
            Register Again
          </button>
        </Link>
      </div>
    </div>
  );
}

export default function Page() {

  return <Suspense>
    <VerifyEmailPage />
  </Suspense>
}