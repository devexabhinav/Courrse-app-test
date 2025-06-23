"use client"
import React, { useState } from "react";
import Link from "next/link";

interface AuthFormProps {
    type: "login" | "register" | "forgot-password" | "reset-password";
}

const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        name: "",
        newPassword: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Submitted", type, formData);
    };

    const renderTitle = () => {
        switch (type) {
            case "login":
                return "Sign In";
            case "register":
                return "Sign Up";
            case "forgot-password":
                return "Forgot Password";
            case "reset-password":
                return "Reset Password";
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
            <h2 className="text-2xl font-bold text-center mb-6">{renderTitle()}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {(type === "register") && (
                    <input
                        name="name"
                        type="text"
                        placeholder="Full Name"
                        onChange={handleChange}
                        className="w-full border px-4 py-2 rounded"
                        required
                    />
                )}

                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    onChange={handleChange}
                    className="w-full border px-4 py-2 rounded"
                    required
                />

                {(type === "login" || type === "register" || type === "reset-password") && (
                    <input
                        name={type === "reset-password" ? "newPassword" : "password"}
                        type="password"
                        placeholder="Password"
                        onChange={handleChange}
                        className="w-full border px-4 py-2 rounded"
                        required
                    />
                )}

                {type === "register" && (
                    <input
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm Password"
                        onChange={handleChange}
                        className="w-full border px-4 py-2 rounded"
                        required
                    />
                )}

                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                    {renderTitle()}
                </button>
            </form>

            <div className="mt-4 text-center text-sm text-gray-600">
                {type === "login" && (
                    <>
                        Don't have an account?{" "}
                        <Link href="/auth/register" className="text-blue-600">Register</Link> <br />
                        <Link href="/auth/forgot-password" className="text-blue-600">Forgot Password?</Link>
                    </>
                )}
                {type === "register" && (
                    <>
                        Already have an account?{" "}
                        <Link href="/auth/login" className="text-blue-600">Login</Link>
                    </>
                )}
                {type === "forgot-password" && (
                    <>
                        Remember your password?{" "}
                        <Link href="/login" className="text-blue-600">Login</Link>
                    </>
                )}
                {type === "reset-password" && (
                    <>
                        Go back to{" "}
                        <Link href="/login" className="text-blue-600">Login</Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default AuthForm;