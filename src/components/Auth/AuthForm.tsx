"use client";
import React, { useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { toasterError, toasterSuccess } from "../core/Toaster";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface AuthFormProps {
  type: "login" | "register" | "forgot-password" | "reset-password";
}

const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    newPassword: "",
  });
  const [isRegistered, setIsRegistered] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (type === "register") {
      const { password, confirmPassword } = formData;

      if (password.length < 6) {
        toasterError("Password must be at least 6 characters.", 2000, "weak-password");
        return;
      }

      if (password !== confirmPassword) {
        toasterError("Password and Confirm Password must match.", 2000, "password-mismatch");
        return;
      }

      const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
      if (!strongPasswordRegex.test(password)) {
        toasterError("Password must include uppercase, lowercase, and a number.", 2000, "strong-password");
        return;
      }
    }

    let endpoint = "";
    let payload: any = {};

    switch (type) {
      case "register":
        endpoint = "user/signup";
        payload = {
          username: formData.name,
          email: formData.email,
          password: formData.password,
        };
        break;

      case "login":
        endpoint = "user/login";
        payload = {
          email: formData.email,
          password: formData.password,
        };
        break;

      case "forgot-password":
        endpoint = "user/forgot-password";
        payload = {
          email: formData.email,
        };
        break;

      case "reset-password":
        endpoint = "user/reset-password";
        payload = {
          email: formData.email,
          newPassword: formData.newPassword,
        };
        break;
    }

    const response = await api.post(endpoint, payload);

    if (response.success) {
      if (type === "register") {
        toasterSuccess("Please check your email to verify your account!");
        setIsRegistered(true);

      } else if (type === "login") {
        const token = response.data?.data?.accessToken;
        const refreshToken = response.data?.data?.refreshToken;
        const name = response.data?.data?.user?.username;
        const email = response.data?.data?.user?.email;
        const userId = response.data?.data?.user?.id;
        const role = response.data?.data?.user?.role;

        if (token) {
          Cookies.set("token", token, { expires: 1 });
          Cookies.set("refreshToken", refreshToken, { expires: 7 });
          Cookies.set("name", name, { expires: 7 });
          Cookies.set("email", email, { expires: 7 });
          Cookies.set("userId", userId, { expires: 7 });
          Cookies.set("role", role, { expires: 7 });
        }

        window.location.href = '/';
      }
    } else {
      const messageMap: Record<string, string> = {
        ERR_AUTH_USERNAME_OR_EMAIL_ALREADY_EXIST: "Email Already Exists.",
        ERR_INVALID_CREDENTIALS: "Invalid email or password.",
        ERR_USER_NOT_FOUND: "User not found.",
        ERR_AUTH_TOKEN_EXPIRED: "Reset link expired. Please try again.",
        "Password Not Matched": "Password Not Matched",
        "Email Not Found": "Email Not Found",
        "Please verify your email before logging in.": "Please verify your email before logging in."
      };

      const apiErrorCode = response?.error?.code || "";
      const errorMessage =
        messageMap[apiErrorCode] || "Something went wrong. Please try again.";

      toasterError(errorMessage, 5000, "id");
    }
  };

  const renderTitle = () => {
    switch (type) {
      case "login":
        return "Login";
      case "register":
        return "Create Your Account";
      case "forgot-password":
        return "Recover Password";
      case "reset-password":
        return "Set New Password";
    }
  };

  return (
    <>
      {isRegistered ? (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-green-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 px-4 sm:px-8">
          <div className="relative bg-white/80 dark:bg-white/10 backdrop-blur-md border border-green-200 dark:border-green-700 rounded-3xl shadow-2xl px-6 py-12 sm:px-12 sm:py-16 w-full text-center space-y-8">

            <div className="relative mx-auto w-28 h-28 rounded-full bg-green-100 dark:bg-green-900 shadow-inner flex items-center justify-center">
              <div className="absolute -inset-1 bg-green-400 opacity-20 blur-xl rounded-full animate-ping"></div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-green-600 dark:text-green-400 z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2l4-4M12 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10z" />
              </svg>
            </div>

            <h1 className="text-4xl font-extrabold text-green-800 dark:text-green-300 tracking-tight">Registration Successful</h1>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed w-full sm:w-3/4 md:w-2/3 lg:w-1/2 mx-auto">
              You are almost ready to get started! Please check your inbox and confirm your email address to activate your account.
              Be sure to look in your spam or promotions folders if you don’t see it.
            </p>

            <Link href="/auth/login">
              <button className="mt-2 inline-flex items-center justify-center px-8 py-3 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 hover:scale-105 transition-all duration-300 shadow-md">
                Go to Login
              </button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 px-4">
          <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-extrabold text-center text-gray-800 dark:text-white mb-6">
              {renderTitle()}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5 animate-fadeIn">
              {type === "register" && (
                <div>
                  <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                  <input
                    name="name"
                    type="text"
                    placeholder="Enter your name"
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                <input
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {(type === "login" || type === "register" || type === "reset-password") && (
                <div>
                  <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Password</label>
                  <input
                    name={type === "reset-password" ? "newPassword" : "password"}
                    type="password"
                    placeholder="Enter your password"
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              )}

              {type === "register" && (
                <div>
                  <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Confirm Password</label>
                  <input
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition duration-300"
              >
                {renderTitle()}
              </button>
            </form>

            {/* Links */}
            <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
              {type === "login" && (
                <>
                  Don&apos;t have an account?{" "}
                  <Link href="/auth/register" className="text-blue-600 hover:underline">Register</Link><br />
                  <Link href="/auth/forgot-password" className="text-blue-600 hover:underline">Forgot Password?</Link>
                </>
              )}
              {type === "register" && (
                <>
                  Already have an account?{" "}
                  <Link href="/auth/login" className="text-blue-600 hover:underline">Login</Link>
                </>
              )}
              {type === "forgot-password" && (
                <>
                  Remember your password?{" "}
                  <Link href="/auth/login" className="text-blue-600 hover:underline">Login</Link>
                </>
              )}
              {type === "reset-password" && (
                <>
                  Go back to{" "}
                  <Link href="/auth/login" className="text-blue-600 hover:underline">Login</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>

  );


};

export default AuthForm;
