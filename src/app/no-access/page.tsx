"use client"
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export default function NoAccessPage() {
  const router = useRouter();

  return (
    <div className="flex h-screen items-center justify-center bg-white">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          🚫 You do not have access to the Admin Panel.
        </h1>
        <button
          onClick={() => {
            Cookies.remove('token');
            Cookies.remove("refreshToken");
            Cookies.remove('role');
            Cookies.remove('name');
            Cookies.remove('email');
            Cookies.remove('userId');
            router.replace('/auth/login');
          }}
          className="mt-4 rounded bg-indigo-600 px-6 py-3 text-white font-semibold hover:bg-indigo-700"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}
